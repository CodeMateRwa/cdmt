import { useEffect, useMemo, useState, type ChangeEvent, type ElementType, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Check,
  CircleHelp,
  GraduationCap,
  Home,
  Layers,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  RefreshCw,
  Search,
  Settings,
  Trash2,
  Upload,
  Users,
  Wrench,
} from 'lucide-react';
import { uploadImageToCloudinary } from '../lib/cloudinary';
import { imageMap, unsplash, writeImageOverrides } from '../lib/images';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { apiClient, type ContactMessage as ApiContactMessage } from '../lib/api';
import {
  writeProgramContentOverrides,
  writeProgramPricingOverrides,
  programDefinitions,
  programList,
  type ProgramContentOverride,
  type ProgramKey,
  type ProgramPricing,
} from '../lib/programs';
import {
  defaultHomeContent,
  defaultServices,
  defaultSiteSettings,
  defaultTeamMembers,
  defaultWorkProjects,
  hydrateSiteContentCache,
  type HomeContent,
  type ServiceItem,
  type SiteSettings,
  type TeamMember,
  type WorkProject,
} from '../lib/siteContent';

type AdminSection =
  | 'dashboard'
  | 'home'
  | 'team'
  | 'work'
  | 'services'
  | 'programs'
  | 'messages'
  | 'stats'
  | 'settings';

type ImageOverrides = Record<number, string>;

type AdminStats = {
  customImages: number;
  editedPrices: number;
  liveScore: number;
  messageCount: number;
  programCount: number;
  serviceCount: number;
  teamCount: number;
  totalManaged: number;
  unreadCount: number;
  workCount: number;
};

type ContactMessage = ApiContactMessage;

const adminTabs: Array<{
  label: string;
  shortLabel: string;
  section: AdminSection;
  path: string;
  icon: ElementType;
}> = [
  { label: 'Dashboard', shortLabel: 'Dashboard', section: 'dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Home Page', shortLabel: 'Home', section: 'home', path: '/admin/home', icon: Home },
  { label: 'Team', shortLabel: 'Team', section: 'team', path: '/admin/team', icon: Users },
  { label: 'Our Work', shortLabel: 'Work', section: 'work', path: '/admin/our-work', icon: Layers },
  { label: 'Services', shortLabel: 'Services', section: 'services', path: '/admin/services', icon: Wrench },
  { label: 'Internship & Training', shortLabel: 'Programs', section: 'programs', path: '/admin/internship-training', icon: BriefcaseBusiness },
  { label: 'Inquiries', shortLabel: 'Inbox', section: 'messages', path: '/admin/messages', icon: MessageSquare },
  { label: 'Stats', shortLabel: 'Stats', section: 'stats', path: '/admin/stats', icon: BarChart3 },
  { label: 'Settings', shortLabel: 'Settings', section: 'settings', path: '/admin/settings', icon: Settings },
];

function splitLines(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinLines(value: string[]) {
  return value.join('\n');
}

function nextId(items: Array<{ id: number }>) {
  return Math.max(0, ...items.map((item) => item.id)) + 1;
}

function nextSig(...groups: Array<Array<{ photo?: { sig: number } }>>) {
  const sigs = groups.flatMap((group) => group.map((item) => item.photo?.sig ?? 0));
  return Math.max(80, ...sigs) + 1;
}

function previewImage(sig: number, keywords: string, overrides: ImageOverrides, width = 520, height = 360) {
  const override = overrides[sig]?.trim();
  if (override) return override;

  const imageId = imageMap[sig];
  if (imageId) {
    return `https://images.unsplash.com/photo-${imageId}?auto=format&fit=crop&w=${width}&h=${height}&q=80`;
  }

  return unsplash(width, height, keywords, sig);
}

function getActiveSection(pathname: string): AdminSection {
  if (pathname.includes('/messages')) return 'messages';
  if (pathname.includes('/home')) return 'home';
  if (pathname.includes('/team')) return 'team';
  if (pathname.includes('/our-work')) return 'work';
  if (pathname.includes('/services')) return 'services';
  if (pathname.includes('/internship-training') || pathname.includes('/programs')) return 'programs';
  if (pathname.includes('/stats')) return 'stats';
  if (pathname.includes('/settings')) return 'settings';
  return 'dashboard';
}

function hasPricingOverride(programKey: ProgramKey, overrides: Partial<Record<ProgramKey, ProgramPricing>>) {
  const current = overrides[programKey];
  if (!current) return false;

  const defaults = programDefinitions[programKey].pricing;
  return (
    (current.price.trim() || defaults.price) !== defaults.price ||
    (current.priceNote.trim() || defaults.priceNote) !== defaults.priceNote
  );
}

function buildStats(
  team: TeamMember[],
  work: WorkProject[],
  services: ServiceItem[],
  overrides: ImageOverrides,
  pricingOverrides: Partial<Record<ProgramKey, ProgramPricing>>,
  messages: ContactMessage[],
  saved: boolean,
): AdminStats {
  const customImages = Object.values(overrides).filter((value) => value.trim()).length;
  const editedPrices = (Object.keys(programDefinitions) as ProgramKey[]).filter((key) =>
    hasPricingOverride(key, pricingOverrides),
  ).length;
  const totalManaged = team.length + work.length + services.length + programList.length;
  const unreadMessages = messages.filter((m) => !m.read).length;
  const liveScore = Math.min(
    100,
    56 + totalManaged * 2 + customImages * 2 + editedPrices * 7 + unreadMessages * 5 + (saved ? 6 : 0),
  );

  return {
    customImages,
    editedPrices,
    liveScore,
    messageCount: messages.length,
    programCount: programList.length,
    serviceCount: services.length,
    teamCount: team.length,
    totalManaged,
    unreadCount: unreadMessages,
    workCount: work.length,
  };
}

function getProgramPricing(programKey: ProgramKey, overrides: Partial<Record<ProgramKey, ProgramPricing>>) {
  return overrides[programKey] ?? programDefinitions[programKey].pricing;
}

function getProgramContent(
  programKey: ProgramKey,
  overrides: Partial<Record<ProgramKey, ProgramContentOverride>>,
) {
  const defaults = programDefinitions[programKey];
  const current = overrides[programKey];

  return {
    audience: current?.audience ?? defaults.audience,
    duration: current?.duration ?? defaults.duration,
    highlights: current?.highlights ?? defaults.highlights,
    outcomes: current?.outcomes ?? defaults.outcomes,
    schedule: current?.schedule ?? defaults.schedule,
    steps: current?.steps ?? defaults.steps,
    summary: current?.summary ?? defaults.summary,
  };
}

function StatCard({ label, meta, value }: { label: string; meta: string; value: ReactNode }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-[0_14px_34px_rgba(16,24,16,0.04)]">
      <p className="text-xs font-medium text-black/45">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-[#6f9d24]">{meta}</p>
    </div>
  );
}

function Field({
  label,
  onChange,
  placeholder,
  textarea = false,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  textarea?: boolean;
  value: string;
}) {
  const sharedClass = 'mt-1 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none transition focus:border-[#91c642]';

  return (
    <label className="block text-xs font-medium text-black/50">
      {label}
      {textarea ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={4}
          className={`${sharedClass} min-h-[96px] py-3`}
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={`${sharedClass} h-10`}
        />
      )}
    </label>
  );
}

function ImageControl({
  label,
  keywords,
  onFile,
  onUrlChange,
  overrides,
  sig,
}: {
  label: string;
  keywords: string;
  onFile: (sig: number, file: File) => void;
  onUrlChange: (sig: number, value: string) => void;
  overrides: ImageOverrides;
  sig: number;
}) {
  const preview = previewImage(sig, keywords, overrides);

  return (
    <div className="rounded-2xl bg-[#f2f3ef] p-3">
      <div className="grid grid-cols-[88px_minmax(0,1fr)] gap-3">
        <div className="h-20 overflow-hidden rounded-xl bg-white">
          <img
            src={preview}
            alt={label}
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{label}</p>
          <p className="mt-0.5 text-xs text-black/42">Image ID {sig}</p>
          <div className="mt-2 grid grid-cols-[minmax(0,1fr)_38px] gap-2">
            <input
              value={overrides[sig] ?? ''}
              onChange={(event) => onUrlChange(sig, event.target.value)}
              placeholder="Paste image URL"
              className="h-9 min-w-0 rounded-xl border border-black/10 bg-white px-3 text-xs outline-none"
            />
            <label className="flex h-9 cursor-pointer items-center justify-center rounded-xl bg-white text-black">
              <Upload size={15} />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  const file = event.target.files?.[0];
                  if (file) onFile(sig, file);
                  event.target.value = '';
                }}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionShell({ children, eyebrow, title }: { children: ReactNode; eyebrow: string; title: string }) {
  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-black/5 bg-white/72 shadow-sm">
      <div className="shrink-0 border-b border-black/8 px-4 py-4 sm:px-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#6f9d24]">{eyebrow}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h1>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">{children}</div>
    </section>
  );
}

export default function Admin() {
  const location = useLocation();
  const { logout } = useAdminAuth();
  const activeSection = getActiveSection(location.pathname);
  const [query, setQuery] = useState('');
  const [saved, setSaved] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [imageOverrides, setImageOverrides] = useState<ImageOverrides>({});
  const [pricingOverrides, setPricingOverrides] = useState<Partial<Record<ProgramKey, ProgramPricing>>>({});
  const [programContent, setProgramContent] = useState<Partial<Record<ProgramKey, ProgramContentOverride>>>({});
  const [team, setTeam] = useState<TeamMember[]>(defaultTeamMembers);
  const [work, setWork] = useState<WorkProject[]>(defaultWorkProjects);
  const [services, setServices] = useState<ServiceItem[]>(defaultServices);
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [home, setHome] = useState<HomeContent>(defaultHomeContent);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // Load all data from DB on mount
  useEffect(() => {
    apiClient.getMessages().then(setMessages).catch(() => {});
    apiClient.getTeam().then((data) => { if (data.length) setTeam(data); }).catch(() => {});
    apiClient.getWork().then((data) => { if (data.length) setWork(data); }).catch(() => {});
    apiClient.getServices().then((data) => { if (data.length) setServices(data); }).catch(() => {});
    apiClient.getSettings().then((data) => { if (data) setSettings(data); }).catch(() => {});
    apiClient.getHomeContent().then((data) => { if (data) setHome(data); }).catch(() => {});
    apiClient.getPricingOverrides().then((data) => { if (data) setPricingOverrides(data); }).catch(() => {});
    apiClient.getProgramContent().then((data) => { if (data) setProgramContent(data); }).catch(() => {});
    apiClient.getImageOverrides().then((data) => { if (data) setImageOverrides(data as unknown as ImageOverrides); }).catch(() => {});
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const stats = useMemo(
    () => buildStats(team, work, services, imageOverrides, pricingOverrides, messages, saved),
    [imageOverrides, messages, pricingOverrides, saved, services, team, work],
  );

  const handleSave = async () => {
    try {
      const imageOverridesStringKeys = Object.fromEntries(
        Object.entries(imageOverrides).map(([k, v]) => [String(k), v])
      );
      await Promise.all([
        apiClient.saveTeam(team),
        apiClient.saveWork(work),
        apiClient.saveServices(services),
        apiClient.saveSettings(settings),
        apiClient.saveHomeContent(home),
        apiClient.savePricingOverrides(pricingOverrides),
        apiClient.saveProgramContent(programContent),
        apiClient.saveImageOverrides(imageOverridesStringKeys),
      ]);
      hydrateSiteContentCache({
        home,
        services,
        settings,
        team,
        work,
      });
      writeProgramPricingOverrides(pricingOverrides);
      writeProgramContentOverrides(programContent);
      writeImageOverrides(imageOverridesStringKeys);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2200);
    } catch (err) {
      console.error('Save failed:', err);
      alert('Saving failed. Check your connection and try again.');
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset all admin-managed site content to the ready-to-go defaults?')) return;
    try {
      await Promise.all([
        apiClient.saveTeam(defaultTeamMembers),
        apiClient.saveWork(defaultWorkProjects),
        apiClient.saveServices(defaultServices),
        apiClient.saveSettings(defaultSiteSettings),
        apiClient.saveHomeContent(defaultHomeContent),
        apiClient.savePricingOverrides({}),
        apiClient.saveProgramContent({}),
        apiClient.saveImageOverrides({}),
      ]);
      hydrateSiteContentCache({
        home: defaultHomeContent,
        services: defaultServices,
        settings: defaultSiteSettings,
        team: defaultTeamMembers,
        work: defaultWorkProjects,
      });
      writeProgramPricingOverrides({});
      writeProgramContentOverrides({});
      writeImageOverrides({});
      setImageOverrides({});
      setPricingOverrides({});
      setProgramContent({});
      setTeam(defaultTeamMembers);
      setWork(defaultWorkProjects);
      setServices(defaultServices);
      setSettings(defaultSiteSettings);
      setHome(defaultHomeContent);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2200);
    } catch (err) {
      console.error('Reset failed:', err);
      alert('Reset failed. Check your connection and try again.');
    }
  };

  const handleImageUrlChange = (sig: number, value: string) => {
    setImageOverrides((prev) => ({ ...prev, [sig]: value }));
    setSaved(false);
  };

  const handleFileUpload = (sig: number, file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    uploadImageToCloudinary(file)
      .then(({ secureUrl }) => {
        handleImageUrlChange(sig, secureUrl);
      })
      .catch((error) => {
        console.error(error);
        alert(error instanceof Error ? error.message : 'Image upload failed.');
      });
  };

  const searchText = query.trim().toLowerCase();

  const handleMarkRead = (id: string) => {
    apiClient.markAsRead(id).then((updated) => {
      setMessages((prev) => prev.map((m) => (m.id === id ? updated : m)));
    }).catch(() => {});
  };

  const handleDeleteMessage = (id: string) => {
    if (!window.confirm('Delete this message permanently?')) return;
    apiClient.deleteMessage(id).then(() => {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    }).catch(() => {});
  };

  return (
    <main className="admin-layout h-screen overflow-hidden bg-[#f6f7f3] text-[#101410]">
      <div className="grid h-full overflow-hidden lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="flex min-h-0 flex-col border-b border-black/10 bg-white lg:border-b-0 lg:border-r">
          <div className="shrink-0 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xl font-black tracking-tight">{settings.studioName}</p>
                <p className="mt-1 text-xs text-black/45">Admin workspace</p>
              </div>
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#102015] px-3 text-xs font-semibold text-white lg:hidden"
              >
                <Check size={15} />
                Save
              </button>
            </div>
          </div>

          <nav className="flex shrink-0 gap-2 overflow-x-auto px-4 pb-4 lg:min-h-0 lg:flex-1 lg:flex-col lg:overflow-y-auto">
            {adminTabs.map((item) => {
              const Icon = item.icon;
              const active = activeSection === item.section;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex h-11 shrink-0 items-center gap-3 rounded-2xl px-3 text-sm transition lg:w-full ${
                    active
                      ? 'bg-[#eff1ec] font-semibold text-black shadow-[inset_4px_0_0_#101410]'
                      : 'text-black/64 hover:bg-[#f4f5f1] hover:text-black'
                  }`}
                >
                  <Icon size={17} />
                  <span className="hidden lg:inline">{item.label}</span>
                  <span className="lg:hidden">{item.shortLabel}</span>
                </Link>
              );
            })}
          </nav>

          <div className="hidden shrink-0 p-4 lg:block">
            <div className="rounded-3xl border border-black/8 bg-[#f6f7f3] p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#101810] text-white">
                <BarChart3 size={17} />
              </div>
              <h2 className="mt-4 text-lg font-semibold">Live score</h2>
              <p className="mt-1 text-3xl font-semibold">{stats.liveScore}%</p>
              <p className="mt-1 text-xs leading-relaxed text-black/52">{settings.statusMessage}</p>
              <button
                type="button"
                onClick={handleSave}
                className="mt-4 h-10 w-full rounded-xl bg-[#101810] text-sm font-semibold text-white"
              >
                {saved ? 'Saved' : 'Save changes'}
              </button>
            </div>

            <div className="mt-4 border-t border-black/10 pt-4">
              <button className="flex h-9 items-center gap-2 text-sm text-black/58">
                <CircleHelp size={16} />
                Support
              </button>
              <button 
                onClick={logout}
                className="flex h-9 items-center gap-2 text-sm text-black/58 hover:text-black"
              >
                <LogOut size={16} />
                Exit admin
              </button>
            </div>
          </div>
        </aside>

        <section className="flex min-h-0 flex-col p-2 sm:p-3">
          <header className="shrink-0">
            <div className="grid gap-3 xl:grid-cols-[minmax(240px,420px)_1fr]">
              <label className="flex h-11 items-center gap-2 rounded-2xl bg-white px-4 shadow-[0_10px_28px_rgba(16,24,16,0.04)]">
                <Search size={17} className="text-black/42" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search admin content..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-black/35"
                />
              </label>

              <div className="flex flex-wrap items-center justify-start gap-2 xl:justify-end">
                <button className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white">
                  <Bell size={17} />
                </button>
                <div className="flex h-11 min-w-0 items-center gap-2 rounded-2xl bg-white px-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#dcecc8] text-xs font-bold">
                    CM
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{settings.adminName}</p>
                    <p className="truncate text-xs text-black/42">{settings.location}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex h-11 items-center gap-2 rounded-2xl bg-white px-3 text-sm font-semibold"
                >
                  <RefreshCw size={16} />
                  Reset
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="hidden h-11 items-center gap-2 rounded-2xl bg-[#101810] px-4 text-sm font-semibold text-white sm:flex"
                >
                  <Check size={16} />
                  {saved ? 'Saved' : 'Save'}
                </button>
              </div>
            </div>

            <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {adminTabs.map((item) => {
                const Icon = item.icon;
                const active = activeSection === item.section;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-2xl px-3 text-sm transition ${
                      active ? 'bg-[#101810] text-white' : 'bg-white text-black/62 hover:text-black'
                    }`}
                  >
                    <Icon size={16} />
                    {item.shortLabel}
                  </Link>
                );
              })}
            </nav>
          </header>

          <div className="mt-4 min-h-0 flex-1 overflow-hidden">
            {activeSection === 'dashboard' && (
              <DashboardSection now={now} stats={stats} />
            )}
            {activeSection === 'home' && (
              <HomeSection
                content={home}
                imageOverrides={imageOverrides}
                onFileUpload={handleFileUpload}
                onImageUrlChange={handleImageUrlChange}
                onContentChange={(patch) => {
                  setHome((prev) => ({ ...prev, ...patch }));
                  setSaved(false);
                }}
              />
            )}
            {activeSection === 'team' && (
              <TeamSection
                imageOverrides={imageOverrides}
                onFileUpload={handleFileUpload}
                onImageUrlChange={handleImageUrlChange}
                query={searchText}
                setSaved={setSaved}
                setTeam={setTeam}
                team={team}
                work={work}
                services={services}
              />
            )}
            {activeSection === 'work' && (
              <WorkSection
                imageOverrides={imageOverrides}
                onFileUpload={handleFileUpload}
                onImageUrlChange={handleImageUrlChange}
                query={searchText}
                setSaved={setSaved}
                setWork={setWork}
                work={work}
                team={team}
                services={services}
              />
            )}
            {activeSection === 'services' && (
              <ServicesSection
                imageOverrides={imageOverrides}
                onFileUpload={handleFileUpload}
                onImageUrlChange={handleImageUrlChange}
                query={searchText}
                services={services}
                setSaved={setSaved}
                setServices={setServices}
              />
            )}
            {activeSection === 'programs' && (
              <ProgramsSection
                imageOverrides={imageOverrides}
                onContentChange={(programKey, next) => {
                  setProgramContent((prev) => ({ ...prev, [programKey]: { ...prev[programKey], ...next } }));
                  setSaved(false);
                }}
                onFileUpload={handleFileUpload}
                onImageUrlChange={handleImageUrlChange}
                onPricingChange={(programKey, field, value) => {
                  setPricingOverrides((prev) => ({
                    ...prev,
                    [programKey]: {
                      price: prev[programKey]?.price ?? programDefinitions[programKey].pricing.price,
                      priceNote: prev[programKey]?.priceNote ?? programDefinitions[programKey].pricing.priceNote,
                      [field]: value,
                    },
                  }));
                  setSaved(false);
                }}
                pricingOverrides={pricingOverrides}
                programContent={programContent}
              />
            )}
            {activeSection === 'messages' && (
              <MessagesSection
                messages={messages}
                onMarkRead={handleMarkRead}
                onDelete={handleDeleteMessage}
              />
            )}
            {activeSection === 'stats' && (
              <StatsSection now={now} stats={stats} />
            )}
            {activeSection === 'settings' && (
              <SettingsSection
                handleReset={handleReset}
                handleSave={handleSave}
                saved={saved}
                setSaved={setSaved}
                setSettings={setSettings}
                settings={settings}
                stats={stats}
              />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function DashboardSection({ now, stats }: { now: Date; stats: AdminStats }) {
  return (
    <SectionShell eyebrow="General overview" title="Dashboard">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <section className="rounded-[26px] bg-[#101810] p-5 text-white">
            <p className="text-xs uppercase tracking-[0.28em] text-[#b9ec69]">Live performance</p>
            <div className="mt-5 grid gap-4 md:grid-cols-[1fr_180px] md:items-end">
              <div>
                <p className="text-6xl font-semibold tracking-tight">{stats.liveScore}%</p>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/62">
                  A realtime readiness score based on managed content, images, program pricing, and save state.
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs text-white/54">Updated now</p>
                <p className="mt-1 text-xl font-semibold">{now.toLocaleTimeString()}</p>
              </div>
            </div>
          </section>

          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Team" meta="members configured" value={stats.teamCount} />
            <StatCard label="Our Work" meta="projects available" value={stats.workCount} />
            <StatCard label="Services" meta="service cards live" value={stats.serviceCount} />
            <StatCard label="Images" meta="custom uploads or URLs" value={stats.customImages} />
          </section>

          <section className="grid gap-3 md:grid-cols-2">
            {adminTabs.slice(1, 7).map((tab) => {
              const Icon = tab.icon;
              const isInbox = tab.section === 'messages';
              return (
                <Link key={tab.path} to={tab.path} className="group relative rounded-3xl bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[0_18px_48px_rgba(16,24,16,0.08)]">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef6e5] text-[#6f9d24]">
                      <Icon size={18} />
                    </div>
                    {isInbox && stats.unreadCount > 0 && (
                      <span className="flex h-6 items-center rounded-full bg-[#6f9d24] px-2 text-[10px] font-bold text-white uppercase tracking-wider animate-pulse">
                        {stats.unreadCount} New
                      </span>
                    )}
                    <span className="text-sm text-black/42 group-hover:text-black">Open</span>
                  </div>
                  <h2 className="mt-5 text-xl font-semibold">{tab.label}</h2>
                  <p className="mt-1 text-sm text-black/52">
                    {isInbox ? 'Review and respond to client inquiries and applications.' : 'Manage content, details, images, and public display data.'}
                  </p>
                </Link>
              );
            })}
          </section>
        </div>

        <aside className="space-y-4">
          <StatCard label="Total managed items" meta="team, work, services, programs" value={stats.totalManaged} />
          <StatCard label="Program prices" meta="edited pricing tags" value={stats.editedPrices} />
          <div className="rounded-3xl bg-white p-5">
            <h2 className="text-lg font-semibold">Ready-to-go structure</h2>
            <p className="mt-2 text-sm leading-relaxed text-black/58">
              Each admin header tab is now a real subpage, and every page fits the screen with internal scroll panels.
            </p>
          </div>
        </aside>
      </div>
    </SectionShell>
  );
}

function TeamSection({
  imageOverrides,
  onFileUpload,
  onImageUrlChange,
  query,
  services,
  setSaved,
  setTeam,
  team,
  work,
}: {
  imageOverrides: ImageOverrides;
  onFileUpload: (sig: number, file: File) => void;
  onImageUrlChange: (sig: number, value: string) => void;
  query: string;
  services: ServiceItem[];
  setSaved: (saved: boolean) => void;
  setTeam: React.Dispatch<React.SetStateAction<TeamMember[]>>;
  team: TeamMember[];
  work: WorkProject[];
}) {
  const visible = team.filter((member) => `${member.name} ${member.role} ${member.dept}`.toLowerCase().includes(query));

  const updateMember = (id: number, patch: Partial<TeamMember>) => {
    setTeam((prev) => prev.map((member) => (member.id === id ? { ...member, ...patch } : member)));
    setSaved(false);
  };

  const removeMember = (id: number) => {
    if (!window.confirm('Remove this team member?')) return;
    setTeam((prev) => prev.filter((member) => member.id !== id));
    setSaved(false);
  };

  return (
    <SectionShell eyebrow="People and profiles" title="Team">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-black/52">{visible.length} team profiles visible</p>
        <button
          type="button"
          onClick={() => {
            setTeam((prev) => [
              ...prev,
              {
                id: nextId(prev),
                initial: 'N',
                name: 'New Team Member',
                role: 'Role title',
                dept: 'Department',
                color: '#1a5c2a',
                skills: ['Skill one', 'Skill two'],
                bio: 'Add a clear bio for this team member.',
                quote: 'Add a team quote.',
                photo: { keywords: 'professional team portrait', sig: nextSig(team, work, services) },
                linkedin: '#',
                twitter: '#',
              },
            ]);
            setSaved(false);
          }}
          className="h-10 rounded-2xl bg-[#101810] px-4 text-sm font-semibold text-white"
        >
          Add team member
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {visible.map((member) => (
          <div key={member.id} className="group relative rounded-3xl bg-white p-4">
            <button
              onClick={() => removeMember(member.id)}
              className="absolute right-4 top-4 z-50 flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 opacity-0 transition group-hover:opacity-100 hover:bg-red-600 hover:text-white"
              title="Remove member"
            >
              <Trash2 size={16} />
            </button>
            <div className="grid gap-3 sm:grid-cols-[150px_minmax(0,1fr)]">
              <ImageControl
                label={member.name}
                keywords={member.photo.keywords}
                onFile={onFileUpload}
                onUrlChange={onImageUrlChange}
                overrides={imageOverrides}
                sig={member.photo.sig}
              />
              <div className="grid gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Name" value={member.name} onChange={(value) => updateMember(member.id, { name: value, initial: value.charAt(0).toUpperCase() || member.initial })} />
                  <Field label="Role" value={member.role} onChange={(value) => updateMember(member.id, { role: value })} />
                  <Field label="Department" value={member.dept} onChange={(value) => updateMember(member.id, { dept: value })} />
                  <Field label="Color" value={member.color} onChange={(value) => updateMember(member.id, { color: value })} />
                </div>
                <Field label="Skills (one per line)" textarea value={joinLines(member.skills)} onChange={(value) => updateMember(member.id, { skills: splitLines(value) })} />
                <Field label="Bio" textarea value={member.bio} onChange={(value) => updateMember(member.id, { bio: value })} />
                <Field label="Quote" value={member.quote} onChange={(value) => updateMember(member.id, { quote: value })} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="LinkedIn URL" value={member.linkedin ?? ''} onChange={(value) => updateMember(member.id, { linkedin: value })} />
                  <Field label="Twitter URL" value={member.twitter ?? ''} onChange={(value) => updateMember(member.id, { twitter: value })} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function WorkSection({
  imageOverrides,
  onFileUpload,
  onImageUrlChange,
  query,
  services,
  setSaved,
  setWork,
  team,
  work,
}: {
  imageOverrides: ImageOverrides;
  onFileUpload: (sig: number, file: File) => void;
  onImageUrlChange: (sig: number, value: string) => void;
  query: string;
  services: ServiceItem[];
  setSaved: (saved: boolean) => void;
  setWork: React.Dispatch<React.SetStateAction<WorkProject[]>>;
  team: TeamMember[];
  work: WorkProject[];
}) {
  const visible = work.filter((project) => `${project.title} ${project.category} ${project.tags.join(' ')}`.toLowerCase().includes(query));

  const updateProject = (id: number, patch: Partial<WorkProject>) => {
    setWork((prev) => prev.map((project) => (project.id === id ? { ...project, ...patch } : project)));
    setSaved(false);
  };

  const removeProject = (id: number) => {
    if (!window.confirm('Remove this project?')) return;
    setWork((prev) => prev.filter((p) => p.id !== id));
    setSaved(false);
  };

  return (
    <SectionShell eyebrow="Projects and case studies" title="Our Work">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-black/52">{visible.length} projects visible</p>
        <button
          type="button"
          onClick={() => {
            setWork((prev) => [
              ...prev,
              {
                id: nextId(prev),
                title: 'New Project',
                category: 'Web Design & Dev',
                tags: ['React', 'Design'],
                year: String(new Date().getFullYear()),
                desc: 'Add a concise project description.',
                color: '#1a5c2a',
                size: 'small',
                photo: { keywords: 'digital project showcase', sig: nextSig(team, work, services) },
                challenge: 'Describe the client challenge.',
                outcome: 'Describe the result.',
                link: '#',
              },
            ]);
            setSaved(false);
          }}
          className="h-10 rounded-2xl bg-[#101810] px-4 text-sm font-semibold text-white"
        >
          Add project
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {visible.map((project) => (
          <div key={project.id} className="group relative rounded-3xl bg-white p-4">
            <button
              onClick={() => removeProject(project.id)}
              className="absolute right-4 top-4 z-50 flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 opacity-0 transition group-hover:opacity-100 hover:bg-red-600 hover:text-white"
              title="Remove project"
            >
              <Trash2 size={16} />
            </button>
            <ImageControl label={project.title} keywords={project.photo.keywords} onFile={onFileUpload} onUrlChange={onImageUrlChange} overrides={imageOverrides} sig={project.photo.sig} />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label="Title" value={project.title} onChange={(value) => updateProject(project.id, { title: value })} />
              <Field label="Category" value={project.category} onChange={(value) => updateProject(project.id, { category: value })} />
              <Field label="Year" value={project.year} onChange={(value) => updateProject(project.id, { year: value })} />
              <Field label="Link" value={project.link ?? ''} onChange={(value) => updateProject(project.id, { link: value })} />
              <Field label="Tags (one per line)" textarea value={joinLines(project.tags)} onChange={(value) => updateProject(project.id, { tags: splitLines(value) })} />
              <Field label="Description" textarea value={project.desc} onChange={(value) => updateProject(project.id, { desc: value })} />
              <Field label="Challenge" textarea value={project.challenge} onChange={(value) => updateProject(project.id, { challenge: value })} />
              <Field label="Outcome" textarea value={project.outcome} onChange={(value) => updateProject(project.id, { outcome: value })} />
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function ServicesSection({
  imageOverrides,
  onFileUpload,
  onImageUrlChange,
  query,
  services,
  setSaved,
  setServices,
}: {
  imageOverrides: ImageOverrides;
  onFileUpload: (sig: number, file: File) => void;
  onImageUrlChange: (sig: number, value: string) => void;
  query: string;
  services: ServiceItem[];
  setSaved: (saved: boolean) => void;
  setServices: React.Dispatch<React.SetStateAction<ServiceItem[]>>;
}) {
  const visible = services
    .map((service, index) => ({ service, index }))
    .filter(({ service }) => `${service.title} ${service.desc} ${service.capabilities.join(' ')}`.toLowerCase().includes(query));

  const updateService = (index: number, patch: Partial<ServiceItem>) => {
    setServices((prev) => prev.map((service, itemIndex) => (itemIndex === index ? { ...service, ...patch } : service)));
    setSaved(false);
  };

  const removeService = (index: number) => {
    if (!window.confirm('Remove this service?')) return;
    setServices((prev) => prev.filter((_, i) => i !== index));
    setSaved(false);
  };

  return (
    <SectionShell eyebrow="Service cards" title="Services">
      <div className="grid gap-4 xl:grid-cols-2">
        {visible.map(({ service, index }) => (
          <div key={`${service.num}-${service.title}`} className="group relative rounded-3xl bg-white p-4">
            <button
              onClick={() => removeService(index)}
              className="absolute right-4 top-4 z-50 flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 opacity-0 transition group-hover:opacity-100 hover:bg-red-600 hover:text-white"
              title="Remove service"
            >
              <Trash2 size={16} />
            </button>
            <ImageControl label={service.title} keywords={service.photo.keywords} onFile={onFileUpload} onUrlChange={onImageUrlChange} overrides={imageOverrides} sig={service.photo.sig} />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label="Number" value={service.num} onChange={(value) => updateService(index, { num: value })} />
              <Field label="Icon text" value={service.icon} onChange={(value) => updateService(index, { icon: value })} />
              <Field label="Title" value={service.title} onChange={(value) => updateService(index, { title: value })} />
              <Field label="Description" textarea value={service.desc} onChange={(value) => updateService(index, { desc: value })} />
              <div className="sm:col-span-2">
                <Field label="Capabilities (one per line)" textarea value={joinLines(service.capabilities)} onChange={(value) => updateService(index, { capabilities: splitLines(value) })} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function ProgramsSection({
  imageOverrides,
  onContentChange,
  onFileUpload,
  onImageUrlChange,
  onPricingChange,
  pricingOverrides,
  programContent,
}: {
  imageOverrides: ImageOverrides;
  onContentChange: (programKey: ProgramKey, next: ProgramContentOverride) => void;
  onFileUpload: (sig: number, file: File) => void;
  onImageUrlChange: (sig: number, value: string) => void;
  onPricingChange: (programKey: ProgramKey, field: keyof ProgramPricing, value: string) => void;
  pricingOverrides: Partial<Record<ProgramKey, ProgramPricing>>;
  programContent: Partial<Record<ProgramKey, ProgramContentOverride>>;
}) {
  return (
    <SectionShell eyebrow="Apply Now pages" title="Internship & Training">
      <div className="grid gap-4 xl:grid-cols-2">
        {programList.map((program) => {
          const pricing = getProgramPricing(program.key, pricingOverrides);
          const content = getProgramContent(program.key, programContent);
          const Icon = program.key === 'internship' ? BriefcaseBusiness : GraduationCap;

          return (
            <div key={program.key} className="rounded-3xl bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef6e5] text-[#6f9d24]">
                    <Icon size={20} />
                  </div>
                  <h2 className="mt-4 text-xl font-semibold">{program.title}</h2>
                  <p className="mt-1 text-sm text-black/52">{program.slug}</p>
                </div>
                <Link to={program.slug} className="rounded-full bg-[#eef6e5] px-3 py-1 text-xs font-semibold text-[#6f9d24]">
                  Open page
                </Link>
              </div>

              <div className="mt-4 grid gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Price tag" value={pricing.price} onChange={(value) => onPricingChange(program.key, 'price', value)} />
                  <Field label="Price note" value={pricing.priceNote} onChange={(value) => onPricingChange(program.key, 'priceNote', value)} />
                  <Field label="Duration" value={content.duration} onChange={(value) => onContentChange(program.key, { duration: value })} />
                  <Field label="Audience" value={content.audience} onChange={(value) => onContentChange(program.key, { audience: value })} />
                </div>
                <Field label="Schedule" value={content.schedule} onChange={(value) => onContentChange(program.key, { schedule: value })} />
                <Field label="Summary" textarea value={content.summary} onChange={(value) => onContentChange(program.key, { summary: value })} />
                <div className="grid gap-3 sm:grid-cols-3">
                  <Field label="Highlights" textarea value={joinLines(content.highlights)} onChange={(value) => onContentChange(program.key, { highlights: splitLines(value) })} />
                  <Field label="Outcomes" textarea value={joinLines(content.outcomes)} onChange={(value) => onContentChange(program.key, { outcomes: splitLines(value) })} />
                  <Field label="Steps" textarea value={joinLines(content.steps)} onChange={(value) => onContentChange(program.key, { steps: splitLines(value) })} />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <ImageControl label={`${program.title} hero`} keywords={program.heroKeywords} onFile={onFileUpload} onUrlChange={onImageUrlChange} overrides={imageOverrides} sig={program.heroSig} />
                  <ImageControl label={`${program.title} showcase`} keywords={program.showcaseKeywords} onFile={onFileUpload} onUrlChange={onImageUrlChange} overrides={imageOverrides} sig={program.showcaseSig} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}

function StatsSection({
  now,
  stats,
}: {
  now: Date;
  stats: AdminStats;
}) {
  return (
    <SectionShell eyebrow="Realtime performance" title="Stats">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Live score" meta="updates every second" value={`${stats.liveScore}%`} />
            <StatCard label="Managed content" meta="active records" value={stats.totalManaged} />
            <StatCard label="Inbox" meta={`${stats.unreadCount} unread`} value={stats.messageCount} />
            <StatCard label="Custom images" meta="uploads or pasted URLs" value={stats.customImages} />
          </section>

          <section className="rounded-3xl bg-white p-5">
            <h2 className="text-lg font-semibold">Content coverage</h2>
            <div className="mt-5 space-y-4">
              {[
                ['Team', stats.teamCount, 8],
                ['Our Work', stats.workCount, 6],
                ['Services', stats.serviceCount, 6],
                ['Programs', stats.programCount, 2],
                ['Images', stats.customImages, 12],
              ].map(([label, value, target]) => (
                <div key={String(label)}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{label}</span>
                    <span className="text-black/45">{value}/{target}</span>
                  </div>
                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-[#eef0eb]">
                    <div className="h-full rounded-full bg-[#91c642]" style={{ width: `${Math.min(100, (Number(value) / Number(target)) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="rounded-3xl bg-[#101810] p-5 text-white">
          <p className="text-xs uppercase tracking-[0.28em] text-[#b9ec69]">Realtime clock</p>
          <p className="mt-5 text-4xl font-semibold">{now.toLocaleTimeString()}</p>
          <p className="mt-2 text-sm text-white/58">{now.toLocaleDateString()}</p>
          <div className="mt-8 rounded-2xl bg-white/10 p-4">
            <p className="text-xs text-white/58">Price edits</p>
            <p className="mt-1 text-2xl font-semibold">{stats.editedPrices}</p>
          </div>
        </aside>
      </div>
    </SectionShell>
  );
}

function SettingsSection({
  handleReset,
  handleSave,
  saved,
  setSaved,
  setSettings,
  settings,
  stats,
}: {
  handleReset: () => void;
  handleSave: () => void;
  saved: boolean;
  setSaved: (saved: boolean) => void;
  setSettings: React.Dispatch<React.SetStateAction<SiteSettings>>;
  settings: SiteSettings;
  stats: AdminStats;
}) {
  const updateSettings = (patch: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
    setSaved(false);
  };

  return (
    <SectionShell eyebrow="Site basics" title="Settings">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-3xl bg-white p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Studio name" value={settings.studioName} onChange={(value) => updateSettings({ studioName: value })} />
            <Field label="Admin name" value={settings.adminName} onChange={(value) => updateSettings({ adminName: value })} />
            <Field label="Location" value={settings.location} onChange={(value) => updateSettings({ location: value })} />
            <Field label="Email" value={settings.email} onChange={(value) => updateSettings({ email: value })} />
            <Field label="Phone" value={settings.phone} onChange={(value) => updateSettings({ phone: value })} />
            <Field label="WhatsApp" value={settings.whatsapp} onChange={(value) => updateSettings({ whatsapp: value })} />
            <div className="sm:col-span-2">
              <Field label="Status message" textarea value={settings.statusMessage} onChange={(value) => updateSettings({ statusMessage: value })} />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={handleSave} className="inline-flex h-10 items-center gap-2 rounded-2xl bg-[#101810] px-4 text-sm font-semibold text-white">
              <Check size={16} />
              Save settings
            </button>
            <button type="button" onClick={handleReset} className="inline-flex h-10 items-center gap-2 rounded-2xl border border-black/10 px-4 text-sm font-semibold">
              <RefreshCw size={16} />
              Reset all
            </button>
          </div>
        </section>

        <aside className="space-y-4">
          <StatCard label="Save state" meta="browser localStorage" value={saved ? 'Saved' : 'Draft'} />
          <StatCard label="Readiness" meta="live admin score" value={`${stats.liveScore}%`} />
          <div className="rounded-3xl bg-white p-5">
            <h2 className="text-lg font-semibold">Storage note</h2>
            <p className="mt-2 text-sm leading-relaxed text-black/58">
              Images and content are stored in this browser. Hosted image URLs are best for production-sized media.
            </p>
          </div>
        </aside>
      </div>
    </SectionShell>
  );
}

function HomeSection({
  content,
  imageOverrides,
  onContentChange,
  onFileUpload,
  onImageUrlChange,
}: {
  content: HomeContent;
  imageOverrides: ImageOverrides;
  onContentChange: (patch: Partial<HomeContent>) => void;
  onFileUpload: (sig: number, file: File) => void;
  onImageUrlChange: (sig: number, value: string) => void;
}) {
  return (
    <SectionShell eyebrow="Landing page" title="Home Page">
      <div className="grid gap-12 xl:grid-cols-[1fr_380px]">
        <div className="space-y-12">
          {/* Hero Section */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#6f9d24]">Hero Section</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Overline Tag"
                value={content.heroTag}
                onChange={(v) => onContentChange({ heroTag: v })}
                placeholder="[ DIGITAL · CREATIVE · TECH ]"
              />
              <Field
                label="CTA Button Text"
                value={content.heroCtaText}
                onChange={(v) => onContentChange({ heroCtaText: v })}
                placeholder="Get A Quote"
              />
            </div>
            <Field
              label="Headline Line 1"
              value={content.heroLine1}
              onChange={(v) => onContentChange({ heroLine1: v })}
              placeholder="Build with"
            />
            <Field
              label="Rotating Words (One per line)"
              value={content.heroWords.join('\n')}
              onChange={(v) => onContentChange({ heroWords: splitLines(v) })}
              textarea
              placeholder="Refined\nDigital\nCreative..."
            />
            <Field
              label="Headline Line 3"
              value={content.heroLine3}
              onChange={(v) => onContentChange({ heroLine3: v })}
              placeholder="Intelligence."
            />
            <Field
              label="Subtext"
              value={content.heroSubtext}
              onChange={(v) => onContentChange({ heroSubtext: v })}
              textarea
              placeholder="Codemate engineers digital products..."
            />
          </section>

          {/* About Section */}
          <section className="space-y-4 pt-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#6f9d24]">About Strip</h2>
            <Field
              label="About Quote"
              value={content.aboutQuote}
              onChange={(v) => onContentChange({ aboutQuote: v })}
              textarea
              placeholder="For more than 3 years..."
            />
            <Field
              label="About Subtext"
              value={content.aboutText}
              onChange={(v) => onContentChange({ aboutText: v })}
              textarea
              placeholder="Our mission is to build..."
            />
          </section>
        </div>

        {/* Image Controls Sidebar */}
        <aside className="space-y-8">
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-black/40">Page Images</h3>
            <div className="space-y-4">
              <ImageControl
                label="Hero Background"
                keywords={content.heroImage.keywords}
                onFile={onFileUpload}
                onUrlChange={onImageUrlChange}
                overrides={imageOverrides}
                sig={content.heroImage.sig}
              />
              <ImageControl
                label="Services Banner"
                keywords={content.servicesImage.keywords}
                onFile={onFileUpload}
                onUrlChange={onImageUrlChange}
                overrides={imageOverrides}
                sig={content.servicesImage.sig}
              />
              <ImageControl
                label="Featured Project"
                keywords={content.featuredImage.keywords}
                onFile={onFileUpload}
                onUrlChange={onImageUrlChange}
                overrides={imageOverrides}
                sig={content.featuredImage.sig}
              />
              <ImageControl
                label="About Background"
                keywords={content.aboutBgImage.keywords}
                onFile={onFileUpload}
                onUrlChange={onImageUrlChange}
                overrides={imageOverrides}
                sig={content.aboutBgImage.sig}
              />
              <ImageControl
                label="CTA Banner"
                keywords={content.ctaImage.keywords}
                onFile={onFileUpload}
                onUrlChange={onImageUrlChange}
                overrides={imageOverrides}
                sig={content.ctaImage.sig}
              />
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-black/40">About Grid</h3>
            <div className="grid gap-3">
              {content.aboutGridImages.map((img, i) => (
                <ImageControl
                  key={i}
                  label={`Grid Image ${i + 1}`}
                  keywords={img.keywords}
                  onFile={onFileUpload}
                  onUrlChange={onImageUrlChange}
                  overrides={imageOverrides}
                  sig={img.sig}
                />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </SectionShell>
  );
}

function MessagesSection({
  messages,
  onMarkRead,
  onDelete,
}: {
  messages: ContactMessage[];
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <SectionShell eyebrow="Communications" title="Inbox">
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/5 text-black/20">
              <MessageSquare size={32} />
            </div>
            <p className="mt-4 text-lg font-semibold">Inbox is empty</p>
            <p className="mt-1 text-sm text-black/40">New inquiries from the contact page will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`group relative flex flex-col gap-4 rounded-3xl border p-6 transition-all duration-300 ${
                  msg.read ? 'border-black/5 bg-white shadow-sm' : 'border-[#6f9d24]/20 bg-[#6f9d24]/5'
                }`}
              >
                {!msg.read && (
                  <div className="absolute right-6 top-6 h-2 w-2 rounded-full bg-[#6f9d24]" title="New" />
                )}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">{msg.name}</h3>
                      <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-mono tracking-wider text-black/50 uppercase">
                        {msg.service.replace('-', ' ')}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-black/40">
                      {msg.email} • {new Date(msg.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    {!msg.read && (
                      <button
                        onClick={() => onMarkRead(msg.id)}
                        className="flex h-9 items-center gap-2 rounded-xl bg-[#102015] px-4 text-[10px] font-bold tracking-widest text-white uppercase transition-colors hover:bg-[#6f9d24]"
                      >
                        <Check size={14} />
                        Mark Read
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(msg.id)}
                      className="flex h-9 items-center gap-2 rounded-xl border border-black/5 bg-white px-4 text-[10px] font-bold tracking-widest text-red-500 uppercase transition-colors hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
                <div className="rounded-2xl bg-black/[0.03] p-4 text-sm leading-relaxed text-black/70">
                  <p className="whitespace-pre-wrap">{msg.message}</p>
                </div>
                {msg.budget && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-black/30 uppercase tracking-widest">Est. Budget:</span>
                    <span className="text-xs font-mono font-semibold text-[#1a5c2a]">{msg.budget}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </SectionShell>
  );
}
