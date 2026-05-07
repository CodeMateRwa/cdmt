export type ProgramKey = 'internship' | 'training';

export interface ProgramPricing {
  price: string;
  priceNote: string;
}

export interface ProgramMetric {
  label: string;
  value: string;
}

export interface ProgramFeature {
  title: string;
  detail: string;
}

export interface ProgramFaq {
  question: string;
  answer: string;
}

export interface ProgramContentOverride {
  audience?: string;
  duration?: string;
  highlights?: string[];
  outcomes?: string[];
  schedule?: string;
  steps?: string[];
  summary?: string;
}

export interface ProgramDefinition {
  key: ProgramKey;
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  duration: string;
  schedule: string;
  audience: string;
  heroSig: number;
  showcaseSig: number;
  heroKeywords: string;
  showcaseKeywords: string;
  highlights: string[];
  outcomes: string[];
  steps: string[];
  metrics: ProgramMetric[];
  features: ProgramFeature[];
  fitPoints: string[];
  faqs: ProgramFaq[];
  pricing: ProgramPricing;
}

export const programStorageKey = 'cmr-program-pricing';
export const programContentStorageKey = 'cmr-program-content';

export const programDefinitions: Record<ProgramKey, ProgramDefinition> = {
  internship: {
    key: 'internship',
    slug: '/apply/internship',
    title: 'Software Internship',
    eyebrow: '[ Apply Now / Internship ]',
    summary:
      'A guided product internship for emerging developers who want real team experience, mentor feedback, and portfolio-ready delivery.',
    duration: '12 weeks',
    schedule: 'Hybrid support with weekly mentor reviews',
    audience: 'Students, recent graduates, and junior builders',
    heroSig: 70,
    showcaseSig: 71,
    heroKeywords: 'software internship teamwork coding mentorship',
    showcaseKeywords: 'junior developers collaborative product planning',
    highlights: [
      'Hands-on React and TypeScript project work',
      'Weekly engineering and product mentorship',
      'Portfolio case study support before graduation',
      'Career readiness sessions and mock interviews',
    ],
    outcomes: [
      'Ship features in a collaborative workflow',
      'Present clean code and explain technical decisions',
      'Strengthen Git, UI implementation, and QA habits',
    ],
    steps: [
      'Apply with your background and current skill level.',
      'Join an onboarding call and receive your learning track.',
      'Build real deliverables with weekly reviews from the team.',
    ],
    metrics: [
      { label: 'Commitment', value: '8-10 hrs / week' },
      { label: 'Review cadence', value: 'Weekly live feedback' },
      { label: 'Delivery style', value: 'Real product tasks' },
    ],
    features: [
      {
        title: 'Mentored build sprints',
        detail:
          'Work through scoped product tickets with review notes, iteration cycles, and clear acceptance criteria.',
      },
      {
        title: 'Portfolio-ready output',
        detail:
          'Finish the track with documented work samples, practical talking points, and presentation support.',
      },
      {
        title: 'Career preparation',
        detail:
          'Practice code walkthroughs, interview framing, and team collaboration habits that hiring managers notice.',
      },
    ],
    fitPoints: [
      'You already know basic HTML, CSS, and JavaScript and want guided real-world practice.',
      'You want accountability, feedback, and a stronger portfolio instead of learning alone.',
      'You can commit consistent weekly time for reviews, revisions, and delivery.',
    ],
    faqs: [
      {
        question: 'Do I need prior work experience?',
        answer:
          'No. This track is built for emerging developers with fundamentals, not production experience.',
      },
      {
        question: 'Is this only for students?',
        answer:
          'No. It also works well for recent graduates, self-taught developers, and career switchers with a basic coding foundation.',
      },
      {
        question: 'Will I build real projects?',
        answer:
          'Yes. The program centers on practical deliverables, review cycles, and outcomes you can talk about with confidence.',
      },
    ],
    pricing: {
      price: 'RWF 180,000',
      priceNote: 'Full 12-week internship track',
    },
  },
  training: {
    key: 'training',
    slug: '/apply/training',
    title: 'Professional Training',
    eyebrow: '[ Apply Now / Training ]',
    summary:
      'A focused training program for teams and individuals who need practical digital skills with clear structure, live support, and measurable outcomes.',
    duration: '6 weeks',
    schedule: 'Live sessions, exercises, and guided check-ins',
    audience: 'Teams, founders, and upskilling professionals',
    heroSig: 72,
    showcaseSig: 73,
    heroKeywords: 'technology training workshop classroom leadership',
    showcaseKeywords: 'professional training session digital skills coaching',
    highlights: [
      'Structured modules in design, marketing, and delivery',
      'Facilitated workshops with hands-on assignments',
      'Templates and practical playbooks for daily use',
      'Progress checkpoints with tailored feedback',
    ],
    outcomes: [
      'Launch repeatable digital workflows faster',
      'Improve team confidence with current tools',
      'Turn lessons into immediate business action',
    ],
    steps: [
      'Choose the training path that matches your goals.',
      'Receive a schedule and prep resources from the team.',
      'Complete practical sessions and apply the playbooks in real work.',
    ],
    metrics: [
      { label: 'Commitment', value: '2 live sessions / week' },
      { label: 'Team format', value: 'Individuals or cohorts' },
      { label: 'Outcome focus', value: 'Immediate implementation' },
    ],
    features: [
      {
        title: 'Applied workshop structure',
        detail:
          'Each module mixes instruction, guided exercises, and practical templates teams can reuse after the program.',
      },
      {
        title: 'Business-ready playbooks',
        detail:
          'Participants leave with repeatable frameworks for planning, delivery, marketing, and operational follow-through.',
      },
      {
        title: 'Action-oriented support',
        detail:
          'Facilitators help turn the lessons into next steps that match your team context, goals, and constraints.',
      },
    ],
    fitPoints: [
      'You need a structured upskilling program with practical output, not abstract theory.',
      'You want guided support to help your team apply new tools and workflows quickly.',
      'You value measurable progress, accountability, and reusable templates.',
    ],
    faqs: [
      {
        question: 'Can a company register multiple people?',
        answer:
          'Yes. The training works for individual learners and small teams who want a shared process and vocabulary.',
      },
      {
        question: 'Do sessions happen online or in person?',
        answer:
          'The schedule can support live virtual delivery, in-person sessions, or a blended format depending on the cohort setup.',
      },
      {
        question: 'What happens after the program ends?',
        answer:
          'Participants leave with templates, exercises, and implementation guidance they can keep using in day-to-day work.',
      },
    ],
    pricing: {
      price: 'RWF 95,000',
      priceNote: 'Per participant for the 6-week program',
    },
  },
};

export const programList = Object.values(programDefinitions);

export function readProgramPricingOverrides(): Partial<
  Record<ProgramKey, ProgramPricing>
> {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const raw = localStorage.getItem(programStorageKey);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getProgramPricing(programKey: ProgramKey): ProgramPricing {
  const overrides = readProgramPricingOverrides();
  const saved = overrides[programKey];

  return {
    price: saved?.price?.trim() || programDefinitions[programKey].pricing.price,
    priceNote:
      saved?.priceNote?.trim() || programDefinitions[programKey].pricing.priceNote,
  };
}

export function readProgramContentOverrides(): Partial<
  Record<ProgramKey, ProgramContentOverride>
> {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const raw = localStorage.getItem(programContentStorageKey);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getProgramDefinition(programKey: ProgramKey): ProgramDefinition {
  const defaults = programDefinitions[programKey];
  const overrides = readProgramContentOverrides()[programKey];

  if (!overrides) return defaults;

  return {
    ...defaults,
    audience: overrides.audience?.trim() || defaults.audience,
    duration: overrides.duration?.trim() || defaults.duration,
    highlights: overrides.highlights?.length ? overrides.highlights : defaults.highlights,
    outcomes: overrides.outcomes?.length ? overrides.outcomes : defaults.outcomes,
    schedule: overrides.schedule?.trim() || defaults.schedule,
    steps: overrides.steps?.length ? overrides.steps : defaults.steps,
    summary: overrides.summary?.trim() || defaults.summary,
  };
}

export function writeProgramPricingOverrides(
  overrides: Partial<Record<ProgramKey, ProgramPricing>>,
) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(programStorageKey, JSON.stringify(overrides));
}

export function writeProgramContentOverrides(
  overrides: Partial<Record<ProgramKey, ProgramContentOverride>>,
) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(programContentStorageKey, JSON.stringify(overrides));
}

export function hydrateProgramCache(data: {
  pricingOverrides?: Partial<Record<ProgramKey, ProgramPricing>> | null;
  programContent?: Partial<Record<ProgramKey, ProgramContentOverride>> | null;
}) {
  if (data.pricingOverrides) {
    writeProgramPricingOverrides(data.pricingOverrides);
  }

  if (data.programContent) {
    writeProgramContentOverrides(data.programContent);
  }
}
