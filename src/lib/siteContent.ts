export interface ManagedImage {
  keywords: string;
  sig: number;
}

export interface ServiceItem {
  num: string;
  title: string;
  desc: string;
  icon: string;
  capabilities: string[];
  photo: ManagedImage;
}

export interface WorkProject {
  id: number;
  title: string;
  category: string;
  tags: string[];
  year: string;
  desc: string;
  color: string;
  size: 'large' | 'small';
  photo: ManagedImage;
  challenge: string;
  outcome: string;
  link?: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  dept: string;
  color: string;
  skills: string[];
  bio: string;
  photo: ManagedImage;
  linkedin?: string;
  twitter?: string;
  quote: string;
  initial: string;
}

export interface HomeContent {
  heroTag: string;
  heroLine1: string;
  heroWords: string[];
  heroLine3: string;
  heroSubtext: string;
  heroCtaText: string;
  aboutQuote: string;
  aboutText: string;
  heroImage: ManagedImage;
  servicesImage: ManagedImage;
  aboutBgImage: ManagedImage;
  aboutGridImages: ManagedImage[];
  featuredImage: ManagedImage;
  ctaImage: ManagedImage;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  service: string;
  budget: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface SiteSettings {
  studioName: string;
  adminName: string;
  location: string;
  email: string;
  phone: string;
  whatsapp: string;
  statusMessage: string;
}

export const contentStorageKeys = {
  home: 'cmr-home-content',
  messages: 'cmr-contact-messages',
  services: 'cmr-services-content',
  settings: 'cmr-site-settings',
  team: 'cmr-team-content',
  work: 'cmr-work-content',
} as const;

export const defaultServices: ServiceItem[] = [
  {
    num: '01',
    title: 'Digital Marketing',
    icon: 'DM',
    desc: 'SEO, social strategy, paid ads, and content that converts.',
    capabilities: ['SEO & SEM', 'Social Media Strategy', 'Paid Advertising', 'Content Marketing', 'Analytics & Reporting'],
    photo: { keywords: 'digital marketing analytics dashboard', sig: 10 },
  },
  {
    num: '02',
    title: 'Graphic Design',
    icon: 'GD',
    desc: 'Brand identity, print, motion, and visuals that stop the scroll.',
    capabilities: ['Brand Identity', 'Logo Design', 'Print Materials', 'Motion Graphics', 'Social Assets'],
    photo: { keywords: 'graphic design creative studio branding', sig: 11 },
  },
  {
    num: '03',
    title: 'Web Design & Dev',
    icon: 'WD',
    desc: 'Performant, accessible, pixel-precise web products.',
    capabilities: ['UI/UX Design', 'React & Next.js', 'CMS Integration', 'Performance Optimization', 'Accessibility'],
    photo: { keywords: 'web development code programming', sig: 12 },
  },
  {
    num: '04',
    title: 'IT Consulting',
    icon: 'IT',
    desc: 'Architecture reviews and technical roadmaps that reduce risk.',
    capabilities: ['Infrastructure Audit', 'Cloud Migration', 'Security Review', 'DevOps Setup', 'Tech Stack Advisory'],
    photo: { keywords: 'server infrastructure technology cloud', sig: 13 },
  },
  {
    num: '05',
    title: 'Mobile Apps',
    icon: 'MA',
    desc: 'Cross-platform iOS and Android from wireframe to store launch.',
    capabilities: ['React Native', 'Expo', 'API Integration', 'Push Notifications', 'App Store Launch'],
    photo: { keywords: 'mobile app smartphone ux design', sig: 14 },
  },
  {
    num: '06',
    title: 'Intern Training',
    icon: 'IN',
    desc: 'Structured apprenticeships that produce deployable engineers.',
    capabilities: ['12-Week Curriculum', 'React & TypeScript', 'Real Project Work', 'Mentorship', 'Career Placement'],
    photo: { keywords: 'students learning technology classroom africa', sig: 15 },
  },
];

export const defaultWorkProjects: WorkProject[] = [
  {
    id: 1,
    title: 'Verdant Studio',
    category: 'Web Design & Dev',
    tags: ['React', 'Tailwind', 'Framer'],
    year: '2024',
    desc: 'Full brand identity and marketing site for a boutique architecture firm.',
    color: '#1a5c2a',
    size: 'large',
    photo: { keywords: 'architecture website modern minimal', sig: 20 },
    challenge: 'No existing web presence. Client needed brand and site from zero.',
    outcome: 'Launched in 6 weeks. 3x organic leads in the first month.',
    link: '#',
  },
  {
    id: 2,
    title: 'Pulse Health',
    category: 'Mobile Apps',
    tags: ['React Native', 'TypeScript'],
    year: '2024',
    desc: 'Cross-platform wellness tracking app with a polished mobile experience.',
    color: '#2d6a4f',
    size: 'small',
    photo: { keywords: 'health app mobile wellness ui', sig: 21 },
    challenge: 'Needed offline-first sync across iOS and Android from day one.',
    outcome: '4.8-star rating and 12k downloads in 90 days post-launch.',
    link: '#',
  },
  {
    id: 3,
    title: 'NovaBrand Co.',
    category: 'Graphic Design',
    tags: ['Identity', 'Print', 'Motion'],
    year: '2023',
    desc: 'Complete visual identity system for a fintech startup.',
    color: '#52796f',
    size: 'small',
    photo: { keywords: 'brand identity logo design creative', sig: 22 },
    challenge: 'Founders had zero brand clarity, from colors to tone.',
    outcome: 'Full identity shipped in 3 weeks. Investor deck supported seed funding.',
    link: '#',
  },
  {
    id: 4,
    title: 'Meridian Reach',
    category: 'Digital Marketing',
    tags: ['SEO', 'Paid Ads', 'Content'],
    year: '2023',
    desc: 'Integrated campaign that lifted traffic and qualified leads.',
    color: '#354f52',
    size: 'large',
    photo: { keywords: 'digital marketing campaign social media', sig: 23 },
    challenge: 'Stagnant traffic, no SEO strategy, and wasted ad spend.',
    outcome: '340% organic traffic lift and ROAS improved from 1.2x to 4.8x.',
    link: '#',
  },
  {
    id: 5,
    title: 'Stackwise ERP',
    category: 'IT Consulting',
    tags: ['Architecture', 'Cloud', 'DevOps'],
    year: '2024',
    desc: 'Infrastructure audit and cloud migration for a logistics company.',
    color: '#3a5a40',
    size: 'small',
    photo: { keywords: 'server data center cloud infrastructure', sig: 24 },
    challenge: 'Legacy on-prem stack with zero redundancy and weekly downtime.',
    outcome: 'Migrated to AWS in 8 weeks. 99.97% uptime since go-live.',
    link: '#',
  },
  {
    id: 6,
    title: 'CodeCamp RW',
    category: 'Intern Training',
    tags: ['Curriculum', 'Mentorship', 'React'],
    year: '2023',
    desc: '12-week structured program that placed graduates in tech roles.',
    color: '#588157',
    size: 'small',
    photo: { keywords: 'coding bootcamp students learning africa', sig: 25 },
    challenge: 'Local companies wanted junior devs but could not afford to train them.',
    outcome: '18 graduates, 16 hired within 30 days of program completion.',
    link: '#',
  },
];

export const defaultTeamMembers: TeamMember[] = [
  {
    id: 1,
    initial: 'A',
    name: 'Amos Nkurunziza',
    role: 'CEO & Lead Strategist',
    dept: 'Leadership',
    color: '#1a5c2a',
    skills: ['Vision', 'Product', 'Growth'],
    bio: 'Drives the overall direction of Codemate with a focus on long-term client outcomes.',
    photo: { keywords: 'professional black man portrait headshot ceo', sig: 30 },
    linkedin: '#',
    twitter: '#',
    quote: 'A great product is the best marketing you will ever do.',
  },
  {
    id: 2,
    initial: 'C',
    name: 'Claire Uwimana',
    role: 'Creative Director',
    dept: 'Design',
    color: '#7c3aed',
    skills: ['Figma', 'Motion', 'Brand'],
    bio: 'Turns brand briefs into visual systems with clear decisions behind every pixel.',
    photo: { keywords: 'professional african woman portrait headshot', sig: 31 },
    linkedin: '#',
    twitter: '#',
    quote: 'Design is not decoration. It is decision-making.',
  },
  {
    id: 3,
    initial: 'D',
    name: 'David Habimana',
    role: 'CTO & Principal Engineer',
    dept: 'Engineering',
    color: '#2563eb',
    skills: ['React', 'Node.js', 'Architecture'],
    bio: 'Architects the systems we ship and keeps the engineering standard sharp.',
    photo: { keywords: 'young black man developer headshot smiling', sig: 32 },
    linkedin: '#',
    twitter: '#',
    quote: 'Complexity is easy. Simplicity is the real craft.',
  },
  {
    id: 4,
    initial: 'G',
    name: 'Grace Mukamana',
    role: 'Digital Marketing Lead',
    dept: 'Marketing',
    color: '#db2777',
    skills: ['SEO', 'Paid Ads', 'Analytics'],
    bio: 'Runs measurable campaigns that turn attention into revenue.',
    photo: { keywords: 'african woman professional headshot marketer', sig: 33 },
    linkedin: '#',
    twitter: '#',
    quote: 'Data tells you what happened. Strategy tells you what to do next.',
  },
  {
    id: 5,
    initial: 'E',
    name: 'Eric Nsengimana',
    role: 'Full-Stack Engineer',
    dept: 'Engineering',
    color: '#ea580c',
    skills: ['TypeScript', 'PostgreSQL', 'DevOps'],
    bio: 'Full-stack generalist who gravitates toward the hard problems.',
    photo: { keywords: 'african man headshot engineer portrait', sig: 34 },
    linkedin: '#',
    twitter: '#',
    quote: 'The best bug fix is the one that never ships.',
  },
  {
    id: 6,
    initial: 'B',
    name: 'Bella Iradukunda',
    role: 'UI/UX Designer',
    dept: 'Design',
    color: '#059669',
    skills: ['Wireframing', 'Prototyping', 'Research'],
    bio: 'Advocates for users and maps the journey before code starts.',
    photo: { keywords: 'african woman designer portrait headshot', sig: 35 },
    linkedin: '#',
    twitter: '#',
    quote: 'Empathy is the most important design tool.',
  },
  {
    id: 7,
    initial: 'J',
    name: 'Joel Tuyishime',
    role: 'IT Consultant',
    dept: 'Consulting',
    color: '#d97706',
    skills: ['Cloud', 'Security', 'Roadmaps'],
    bio: 'Audits technical stacks and turns chaos into a practical plan.',
    photo: { keywords: 'professional african man portrait consultant', sig: 36 },
    linkedin: '#',
    twitter: '#',
    quote: 'Precision is not a preference. It is the baseline.',
  },
  {
    id: 8,
    initial: 'N',
    name: 'Nina Umutoniwase',
    role: 'Training Program Lead',
    dept: 'Education',
    color: '#0891b2',
    skills: ['Mentorship', 'Curriculum', 'React'],
    bio: 'Designs apprenticeship paths that turn motivated learners into builders.',
    photo: { keywords: 'african woman educator mentor portrait', sig: 37 },
    linkedin: '#',
    twitter: '#',
    quote: 'Teach someone to ship, and they will ship forever.',
  },
];

export const defaultSiteSettings: SiteSettings = {
  studioName: 'CodeMateRwa',
  adminName: 'Codemate Admin',
  location: 'Kigali, Rwanda',
  email: 'hello@codematerwa.com',
  phone: '+250 788 000 000',
  whatsapp: '+250 788 000 000',
  statusMessage: 'Site content is ready for publishing.',
};

export const defaultHomeContent: HomeContent = {
  heroTag: '[ DIGITAL · CREATIVE · TECH ]',
  heroLine1: 'Build with',
  heroWords: ['Refined', 'Digital', 'Creative', 'Strategic', 'Engineered', 'Innovative'],
  heroLine3: 'Intelligence.',
  heroSubtext: 'Codemate engineers digital products and brands that perform. From code to campaign — one studio, full stack.',
  heroCtaText: 'Get A Quote',
  aboutQuote: 'For more than 3 years, we\'ve been crafting and transforming digital products.',
  aboutText: 'Our mission is to build powerful, elegant, and scalable solutions that outlast trends.',
  heroImage: { keywords: 'modern tech office kigali africa innovation', sig: 1 },
  servicesImage: { keywords: 'creative digital agency team working', sig: 5 },
  aboutBgImage: { keywords: 'abstract technology pattern dark green', sig: 6 },
  aboutGridImages: [
    { keywords: 'developer coding laptop dark', sig: 41 },
    { keywords: 'design creative studio workspace', sig: 42 },
    { keywords: 'team meeting collaboration', sig: 43 },
    { keywords: 'africa technology startup kigali', sig: 44 },
  ],
  featuredImage: { keywords: 'modern website ui design interface', sig: 20 },
  ctaImage: { keywords: 'modern office collaboration technology', sig: 7 },
};

export const defaultHomepageStats = [
  { value: 50, suffix: '+', label: 'Completed Projects', sub: 'across 6 service lines' },
  { value: 6, suffix: '', label: 'Core Services', sub: 'one studio, full stack' },
  { value: 94, suffix: '%', label: 'Client Retention', sub: 'because results speak' },
  { value: 18, suffix: '+', label: 'Interns Placed', sub: 'into tech roles' },
];

function readStoredValue<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;

  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeStoredValue<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function readServiceItems() {
  return readStoredValue(contentStorageKeys.services, defaultServices);
}

export function readTeamMembers() {
  return readStoredValue(contentStorageKeys.team, defaultTeamMembers);
}

export function readWorkProjects() {
  return readStoredValue(contentStorageKeys.work, defaultWorkProjects);
}

export function readSiteSettings() {
  return readStoredValue(contentStorageKeys.settings, defaultSiteSettings);
}

export function readHomeContent() {
  return readStoredValue(contentStorageKeys.home, defaultHomeContent);
}

export function readContactMessages(): ContactMessage[] {
  return readStoredValue(contentStorageKeys.messages, []);
}

export function saveContactMessage(msg: Omit<ContactMessage, 'id' | 'timestamp' | 'read'>) {
  const messages = readContactMessages();
  const newMessage: ContactMessage = {
    ...msg,
    id: Math.random().toString(36).substring(2, 9),
    timestamp: new Date().toISOString(),
    read: false,
  };
  localStorage.setItem(contentStorageKeys.messages, JSON.stringify([newMessage, ...messages]));
}

export function writeServiceItems(services: ServiceItem[]) {
  writeStoredValue(contentStorageKeys.services, services);
}

export function writeTeamMembers(team: TeamMember[]) {
  writeStoredValue(contentStorageKeys.team, team);
}

export function writeWorkProjects(work: WorkProject[]) {
  writeStoredValue(contentStorageKeys.work, work);
}

export function writeSiteSettings(settings: SiteSettings) {
  writeStoredValue(contentStorageKeys.settings, settings);
}

export function writeHomeContent(content: HomeContent) {
  writeStoredValue(contentStorageKeys.home, content);
}

export function hydrateSiteContentCache(data: {
  home?: HomeContent | null;
  services?: ServiceItem[] | null;
  settings?: SiteSettings | null;
  team?: TeamMember[] | null;
  work?: WorkProject[] | null;
}) {
  if (data.home) writeHomeContent(data.home);
  if (data.services) writeServiceItems(data.services);
  if (data.settings) writeSiteSettings(data.settings);
  if (data.team) writeTeamMembers(data.team);
  if (data.work) writeWorkProjects(data.work);
}
