/**
 * Unsplash deterministic image helper.
 * Uses handpicked high-quality image IDs from images.unsplash.com
 * mapped specifically to the components to bypass the deprecated source.unsplash.com API
 * and get rid of random placeholders.
 */

export const imageMap: Record<number, string> = {
  // Hero
  1: '1515378791036-0648a3ef77b2', // abstract dark tech background
  2: '1526304640581-d334cdbbf45e', // modern coding workspace monitors
  
  // Home Services
  10: '1460925895917-afdab827c52f', // digital marketing analytics dashboard
  11: '1561070791-2eaf1fb016f3', // graphic design creative studio branding
  12: '1498050108023-c5249f4df085', // web development code programming
  13: '1558494949-ef010cbdcc31', // server infrastructure technology cloud
  14: '1512941937669-90a1b58e7e9c', // mobile app smartphone ux design
  15: '1522202176988-66273c2fd55f', // students learning technology classroom africa
  40: '1454165804606-c3d57bc86b40', // kigali rwanda modern city skyline

  // Our Work
  20: '1486406146926-c627a92ad1ab', // architecture website modern minimal
  21: '1512941937669-90a1b58e7e9c', // health app mobile wellness ui
  22: '1561070791-2eaf1fb016f3', // brand identity logo design creative
  23: '1460925895917-afdab827c52f', // digital marketing campaign social media
  24: '1558494949-ef010cbdcc31', // server data center cloud infrastructure
  25: '1522202176988-66273c2fd55f', // coding bootcamp students learning africa

  // Team
  30: '1507003211169-0a1dd7228f2d', // professional black man portrait ceo tech
  31: '1531123897727-8f129e1bfa82', // professional black woman portrait creative director
  32: '1506803682983-e4c56c6d2ef6', // young black man developer portrait smiling
  33: '1531123414770-6e40baf65612', // professional african woman portrait marketing
  34: '1500648767791-00dcc994a43e', // young african man portrait developer glasses
  35: '1531123897727-8f129e1bfa82', // african woman portrait designer smiling
  36: '1507003211169-0a1dd7228f2d', // professional african man portrait consultant
  37: '1531123414770-6e40baf65612', // african woman educator portrait mentor
  
  // Culture & Backgrounds
  50: '1518770660439-4636190af475', // technology abstract pattern dark
  41: '1522071820081-009f0129c71c', // team collaboration office
  42: '1498050108023-c5249f4df085', // developer coding laptop
  43: '1499951360447-b19be8fe80f5', // design creative workspace
  44: '1531403009284-440f080d1e12', // africa technology innovation
  70: '1516321318423-f06f85e504b3', // internship coding mentorship workspace
  71: '1521737604893-d14cc237f11d', // junior team workshop collaboration
  72: '1517048676732-d65bc937f952', // training session laptop workshop
  73: '1513258496099-48168024aec0', // business training collaboration
};

export const defaultMapLabels: Record<number, string> = {
  1: 'Hero Background', 2: 'Hero Card',
  10: 'Service: Digital Marketing', 11: 'Service: Graphic Design', 12: 'Service: Web Dev',
  13: 'Service: IT Consulting', 14: 'Service: Mobile Apps', 15: 'Service: Intern Training',
  40: 'Home: About City Skyline',
  20: 'Work: Verdant Studio', 21: 'Work: Pulse Health', 22: 'Work: NovaBrand Co.',
  23: 'Work: Meridian Reach', 24: 'Work: Stackwise ERP', 25: 'Work: CodeCamp RW',
  30: 'Team: Amos', 31: 'Team: Claire', 32: 'Team: David', 33: 'Team: Grace',
  34: 'Team: Eric', 35: 'Team: Bella', 36: 'Team: Joel', 37: 'Team: Nina',
  50: 'Team Values Background',
  41: 'Culture Image 1', 42: 'Culture Image 2', 43: 'Culture Image 3', 44: 'Culture Image 4',
  70: 'Apply: Internship Hero',
  71: 'Apply: Internship Showcase',
  72: 'Apply: Training Hero',
  73: 'Apply: Training Showcase',
};

export const imageOverrideStorageKey = 'cmr-image-overrides';

export function readImageOverrides(): Record<number, string> {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    return JSON.parse(localStorage.getItem(imageOverrideStorageKey) || '{}');
  } catch {
    return {};
  }
}

export function writeImageOverrides(overrides: Record<string, string>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(imageOverrideStorageKey, JSON.stringify(overrides));
}

export const unsplash = (
  width: number,
  height: number,
  _keywords: string,
  sig: number = 0,
): string => {
  const overrides = readImageOverrides();
  if (overrides[sig] && overrides[sig].trim() !== '') {
    return overrides[sig];
  }
  const id = imageMap[sig] || '1498050108023-c5249f4df085';
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&h=${height}&q=80`;
};
