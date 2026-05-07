import dotenv from 'dotenv';
import crypto from 'node:crypto';
import { Pool, neonConfig, type PoolClient } from '@neondatabase/serverless';
import ws from 'ws';

dotenv.config();
neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required to initialize the database client.');
}

type Queryable = Pool | PoolClient;

function createFacade(db: Queryable) {
  return {
    contactMessage: {
      create: async ({ data }: { data: any }) => {
        const result = await db.query(
          `
            INSERT INTO "ContactMessage" ("id", "name", "email", "service", "budget", "message", "updatedAt")
            VALUES ($1, $2, $3, $4, $5, $6, NOW())
            RETURNING *
          `,
          [
            crypto.randomUUID(),
            data.name,
            data.email,
            data.service,
            data.budget,
            data.message,
          ],
        );

        return result.rows[0];
      },
      delete: async ({ where }: { where: { id: string } }) => {
        await db.query(`DELETE FROM "ContactMessage" WHERE "id" = $1`, [where.id]);
      },
      findMany: async (_args?: unknown) => {
        const result = await db.query(
          `SELECT * FROM "ContactMessage" ORDER BY "createdAt" DESC`,
        );
        return result.rows;
      },
      update: async ({
        where,
        data,
      }: {
        where: { id: string };
        data: { read: boolean };
      }) => {
        const result = await db.query(
          `
            UPDATE "ContactMessage"
            SET "read" = $2, "updatedAt" = NOW()
            WHERE "id" = $1
            RETURNING *
          `,
          [where.id, data.read],
        );

        return result.rows[0];
      },
    },
    serviceItem: {
      create: async ({ data }: { data: any }) => {
        const result = await db.query(
          `
            INSERT INTO "ServiceItem" ("num", "title", "desc", "icon", "capabilities", "photoKeywords", "photoSig", "order")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
          `,
          [
            data.num,
            data.title,
            data.desc,
            data.icon,
            data.capabilities,
            data.photoKeywords,
            data.photoSig,
            data.order,
          ],
        );

        return result.rows[0];
      },
      deleteMany: async () => {
        await db.query(`DELETE FROM "ServiceItem"`);
      },
      findMany: async (_args?: unknown) => {
        const result = await db.query(
          `SELECT * FROM "ServiceItem" ORDER BY "order" ASC`,
        );
        return result.rows;
      },
    },
    siteConfig: {
      findMany: async ({ where }: { where: { key: { in: string[] } } }) => {
        const result = await db.query(
          `SELECT * FROM "SiteConfig" WHERE "key" = ANY($1::text[])`,
          [where.key.in],
        );
        return result.rows;
      },
      findUnique: async ({ where }: { where: { key: string } }) => {
        const result = await db.query(
          `SELECT * FROM "SiteConfig" WHERE "key" = $1 LIMIT 1`,
          [where.key],
        );
        return result.rows[0] ?? null;
      },
      upsert: async ({
        where,
        update,
        create,
      }: {
        where: { key: string };
        update: { value: unknown };
        create: { key: string; value: unknown };
      }) => {
        const key = where.key || create.key;
        const value =
          update.value === undefined ? JSON.stringify(create.value) : JSON.stringify(update.value);

        await db.query(
          `
            INSERT INTO "SiteConfig" ("key", "value")
            VALUES ($1, $2::jsonb)
            ON CONFLICT ("key")
            DO UPDATE SET "value" = EXCLUDED."value"
          `,
          [key, value],
        );
      },
    },
    teamMember: {
      create: async ({ data }: { data: any }) => {
        const result = await db.query(
          `
            INSERT INTO "TeamMember" ("initial", "name", "role", "dept", "color", "skills", "bio", "quote", "linkedin", "twitter", "photoKeywords", "photoSig", "order")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            RETURNING *
          `,
          [
            data.initial,
            data.name,
            data.role,
            data.dept,
            data.color,
            data.skills,
            data.bio,
            data.quote,
            data.linkedin,
            data.twitter,
            data.photoKeywords,
            data.photoSig,
            data.order,
          ],
        );

        return result.rows[0];
      },
      deleteMany: async () => {
        await db.query(`DELETE FROM "TeamMember"`);
      },
      findMany: async (_args?: unknown) => {
        const result = await db.query(
          `SELECT * FROM "TeamMember" ORDER BY "order" ASC`,
        );
        return result.rows;
      },
    },
    workProject: {
      create: async ({ data }: { data: any }) => {
        const result = await db.query(
          `
            INSERT INTO "WorkProject" ("title", "category", "tags", "year", "desc", "color", "size", "challenge", "outcome", "link", "photoKeywords", "photoSig", "order")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            RETURNING *
          `,
          [
            data.title,
            data.category,
            data.tags,
            data.year,
            data.desc,
            data.color,
            data.size,
            data.challenge,
            data.outcome,
            data.link,
            data.photoKeywords,
            data.photoSig,
            data.order,
          ],
        );

        return result.rows[0];
      },
      deleteMany: async () => {
        await db.query(`DELETE FROM "WorkProject"`);
      },
      findMany: async (_args?: unknown) => {
        const result = await db.query(
          `SELECT * FROM "WorkProject" ORDER BY "order" ASC`,
        );
        return result.rows;
      },
    },
  };
}

const pool = new Pool({ connectionString });
const rootFacade = createFacade(pool);

export const prisma = {
  ...rootFacade,
  $connect: async () => {
    await pool.query('SELECT 1');
  },
  $disconnect: async () => {
    await pool.end();
  },
  $transaction: async <T>(callback: (tx: typeof rootFacade) => Promise<T>) => {
    const client = await pool.connect();
    const txFacade = createFacade(client);

    try {
      await client.query('BEGIN');
      const result = await callback(txFacade);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },
};
