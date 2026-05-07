import crypto from 'node:crypto';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { prisma } from './lib/prisma';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_COOKIE_NAME = 'cmr_admin_session';
const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
const ADMIN_SESSION_VERSION_KEY = 'adminSessionVersion';
const BOOTSTRAP_CONFIG_KEYS = [
  'home',
  'imageOverrides',
  'pricingOverrides',
  'programContent',
  'settings',
] as const;
const PUBLIC_CONFIG_KEYS = new Set(BOOTSTRAP_CONFIG_KEYS);

if (process.env.NODE_ENV !== 'production') {
  app.use(
    cors({
      origin: ['http://localhost:5173', 'http://192.168.1.69:5173'],
      credentials: true,
    }),
  );
}
app.use(express.json({ limit: '10mb' }));

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || 'admin';
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || getAdminPassword();
}

function signValue(value: string) {
  return crypto
    .createHmac('sha256', getSessionSecret())
    .update(value)
    .digest('hex');
}

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

async function getAdminSessionVersion() {
  const config = await prisma.siteConfig.findUnique({
    where: { key: ADMIN_SESSION_VERSION_KEY },
  });

  if (typeof config?.value === 'string' && config.value) {
    return config.value;
  }

  const nextVersion = crypto.randomUUID();
  await prisma.siteConfig.upsert({
    where: { key: ADMIN_SESSION_VERSION_KEY },
    update: { value: nextVersion },
    create: { key: ADMIN_SESSION_VERSION_KEY, value: nextVersion },
  });
  return nextVersion;
}

async function rotateAdminSessionVersion() {
  const nextVersion = crypto.randomUUID();
  await prisma.siteConfig.upsert({
    where: { key: ADMIN_SESSION_VERSION_KEY },
    update: { value: nextVersion },
    create: { key: ADMIN_SESSION_VERSION_KEY, value: nextVersion },
  });
  return nextVersion;
}

async function createSessionToken() {
  const sessionVersion = await getAdminSessionVersion();
  const expiresAt = String(Date.now() + ADMIN_SESSION_TTL_SECONDS * 1000);
  const payload = `${expiresAt}.${sessionVersion}`;
  return `${payload}.${signValue(payload)}`;
}

function parseCookies(header?: string) {
  const cookies: Record<string, string> = {};

  if (!header) {
    return cookies;
  }

  for (const cookie of header.split(';')) {
    const [rawName, ...rawValue] = cookie.trim().split('=');
    if (!rawName) continue;
    cookies[rawName] = decodeURIComponent(rawValue.join('='));
  }

  return cookies;
}

async function isValidSessionToken(token?: string) {
  if (!token) return false;

  const [expiresAt, sessionVersion, signature] = token.split('.');
  if (!expiresAt || !sessionVersion || !signature) return false;

  const payload = `${expiresAt}.${sessionVersion}`;
  if (!safeCompare(signValue(payload), signature)) return false;

  const currentVersion = await getAdminSessionVersion();
  if (!safeCompare(currentVersion, sessionVersion)) return false;

  return Number(expiresAt) > Date.now();
}

function setAdminCookie(res: express.Response, token: string) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `${ADMIN_COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; Path=/; Max-Age=${ADMIN_SESSION_TTL_SECONDS}; SameSite=Lax${secure}`,
  );
}

function clearAdminCookie(res: express.Response) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `${ADMIN_COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${secure}`,
  );
}

async function isAuthenticated(req: express.Request) {
  const cookies = parseCookies(req.headers.cookie);
  return isValidSessionToken(cookies[ADMIN_COOKIE_NAME]);
}

function requireAdminAuth(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  isAuthenticated(req)
    .then((authenticated) => {
      if (!authenticated) {
        clearAdminCookie(res);
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      next();
    })
    .catch((error) => {
      console.error(error);
      clearAdminCookie(res);
      res.status(500).json({ error: 'Failed to validate session' });
    });
}

async function readConfigMap(keys: readonly string[]) {
  const configs = await prisma.siteConfig.findMany({
    where: { key: { in: [...keys] } },
  });

  return configs.reduce<Record<string, unknown>>((acc, item) => {
    acc[item.key] = item.value;
    return acc;
  }, {});
}

app.post('/api/admin/login', async (req, res) => {
  const password = String(req.body?.password || '');

  if (!safeCompare(password, getAdminPassword())) {
    clearAdminCookie(res);
    res.status(401).json({ error: 'Invalid password' });
    return;
  }

  setAdminCookie(res, await createSessionToken());
  res.json({ authenticated: true });
});

app.post('/api/admin/logout', async (_req, res) => {
  await rotateAdminSessionVersion();
  clearAdminCookie(res);
  res.json({ authenticated: false });
});

app.get('/api/admin/session', async (req, res) => {
  if (!(await isAuthenticated(req))) {
    clearAdminCookie(res);
    res.json({ authenticated: false });
    return;
  }

  res.json({ authenticated: true });
});

app.get('/api/bootstrap', async (_req, res) => {
  try {
    const [team, work, services, configMap] = await Promise.all([
      prisma.teamMember.findMany({ orderBy: { order: 'asc' } }),
      prisma.workProject.findMany({ orderBy: { order: 'asc' } }),
      prisma.serviceItem.findMany({ orderBy: { order: 'asc' } }),
      readConfigMap(BOOTSTRAP_CONFIG_KEYS),
    ]);

    res.json({
      home: configMap.home ?? null,
      imageOverrides: configMap.imageOverrides ?? null,
      pricingOverrides: configMap.pricingOverrides ?? null,
      programContent: configMap.programContent ?? null,
      services,
      settings: configMap.settings ?? null,
      team,
      work,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch bootstrap data' });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/messages', requireAdminAuth, async (_req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const { name, email, service, budget, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const createdMessage = await prisma.contactMessage.create({
      data: {
        budget: budget || null,
        email,
        message,
        name,
        service: service || 'General Inquiry',
      },
    });

    res.status(201).json(createdMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create message' });
  }
});

app.patch('/api/messages/:id/read', requireAdminAuth, async (req, res) => {
  try {
    const updatedMessage = await prisma.contactMessage.update({
      where: { id: req.params.id },
      data: { read: true },
    });

    res.json(updatedMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update message' });
  }
});

app.delete('/api/messages/:id', requireAdminAuth, async (req, res) => {
  try {
    await prisma.contactMessage.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

app.get('/api/team', async (_req, res) => {
  try {
    const team = await prisma.teamMember.findMany({ orderBy: { order: 'asc' } });
    res.json(team);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch team' });
  }
});

app.put('/api/team', requireAdminAuth, async (req, res) => {
  try {
    const members = req.body as any[];

    await prisma.$transaction(async (tx) => {
      await tx.teamMember.deleteMany();

      for (let index = 0; index < members.length; index += 1) {
        const member = members[index];

        await tx.teamMember.create({
          data: {
            bio: member.bio,
            color: member.color,
            dept: member.dept,
            initial: member.initial,
            linkedin: member.linkedin ?? null,
            name: member.name,
            order: index,
            photoKeywords: member.photo.keywords,
            photoSig: member.photo.sig,
            quote: member.quote,
            role: member.role,
            skills: member.skills,
            twitter: member.twitter ?? null,
          },
        });
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save team' });
  }
});

app.get('/api/work', async (_req, res) => {
  try {
    const work = await prisma.workProject.findMany({ orderBy: { order: 'asc' } });
    res.json(work);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch work' });
  }
});

app.put('/api/work', requireAdminAuth, async (req, res) => {
  try {
    const projects = req.body as any[];

    await prisma.$transaction(async (tx) => {
      await tx.workProject.deleteMany();

      for (let index = 0; index < projects.length; index += 1) {
        const project = projects[index];

        await tx.workProject.create({
          data: {
            category: project.category,
            challenge: project.challenge,
            color: project.color,
            desc: project.desc,
            link: project.link ?? null,
            order: index,
            outcome: project.outcome,
            photoKeywords: project.photo.keywords,
            photoSig: project.photo.sig,
            size: project.size,
            tags: project.tags,
            title: project.title,
            year: project.year,
          },
        });
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save work' });
  }
});

app.get('/api/services', async (_req, res) => {
  try {
    const services = await prisma.serviceItem.findMany({ orderBy: { order: 'asc' } });
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

app.put('/api/services', requireAdminAuth, async (req, res) => {
  try {
    const services = req.body as any[];

    await prisma.$transaction(async (tx) => {
      await tx.serviceItem.deleteMany();

      for (let index = 0; index < services.length; index += 1) {
        const service = services[index];

        await tx.serviceItem.create({
          data: {
            capabilities: service.capabilities,
            desc: service.desc,
            icon: service.icon,
            num: service.num,
            order: index,
            photoKeywords: service.photo.keywords,
            photoSig: service.photo.sig,
            title: service.title,
          },
        });
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save services' });
  }
});

app.get('/api/config/:key', async (req, res) => {
  try {
    if (!PUBLIC_CONFIG_KEYS.has(req.params.key as (typeof BOOTSTRAP_CONFIG_KEYS)[number])) {
      res.status(404).json({ error: 'Config not found' });
      return;
    }

    const config = await prisma.siteConfig.findUnique({
      where: { key: req.params.key },
    });

    res.json(config ? config.value : null);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch config' });
  }
});

app.put('/api/config/:key', requireAdminAuth, async (req, res) => {
  try {
    if (!PUBLIC_CONFIG_KEYS.has(req.params.key as (typeof BOOTSTRAP_CONFIG_KEYS)[number])) {
      res.status(404).json({ error: 'Config not found' });
      return;
    }

    await prisma.siteConfig.upsert({
      where: { key: req.params.key },
      update: { value: req.body },
      create: { key: req.params.key, value: req.body },
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save config' });
  }
});

export default app;

if (process.env.NODE_ENV !== 'production') {
  const startServer = async () => {
    try {
      await prisma.$connect();
      console.log('Database connected');
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  };

  process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
  });

  startServer();
}
