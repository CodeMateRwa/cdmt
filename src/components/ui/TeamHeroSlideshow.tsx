import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { unsplash } from '../../lib/images';

// ─────────────────────────────────────────────────────────────────────────────
// themeConfig — export this object; change any value to propagate site-wide.
// ─────────────────────────────────────────────────────────────────────────────
export const themeConfig = {
  leftBg:     '#ffffff',
  rightBg:    '#1a3a2a',
  nameStroke: '#1a3a2a',
  textColor:  '#1a3a2a',
  tagBorder:  '#ffffff',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Slide data
// photo: path to a transparent PNG placed in /public/team/.
//        Unsplash URL used as placeholder until real assets land.
// ─────────────────────────────────────────────────────────────────────────────
interface HeroSlide {
  id:    number;
  name:  string;
  role:  string;
  years: string;
  dept:  string;
  /** Transparent PNG path, e.g. "/team/amos.png". Swap Unsplash URL when ready. */
  photo: string;
  socialLinks: {
    instagram?: string;
    x?:         string;
    linkedin?:  string;
  };
}

const heroSlides: HeroSlide[] = [
  {
    id: 1, name: 'Amos Nkurunziza', role: 'CEO & Lead Strategist',
    years: '2021', dept: 'Leadership',
    photo: unsplash(600, 800, 'professional black man portrait headshot ceo', 30),
    socialLinks: { instagram: '#', x: '#', linkedin: '#' },
  },
  {
    id: 2, name: 'Claire Uwimana', role: 'Creative Director',
    years: '2022', dept: 'Design',
    photo: unsplash(600, 800, 'professional african woman portrait headshot', 31),
    socialLinks: { instagram: '#', x: '#', linkedin: '#' },
  },
  {
    id: 3, name: 'David Habimana', role: 'CTO & Principal Engineer',
    years: '2021', dept: 'Engineering',
    photo: unsplash(600, 800, 'young black man developer headshot smiling', 32),
    socialLinks: { instagram: '#', x: '#', linkedin: '#' },
  },
  {
    id: 4, name: 'Grace Mukamana', role: 'Digital Marketing Lead',
    years: '2023', dept: 'Marketing',
    photo: unsplash(600, 800, 'african woman professional headshot marketer', 33),
    socialLinks: { instagram: '#', x: '#', linkedin: '#' },
  },
  {
    id: 5, name: 'Eric Nsengimana', role: 'Full-Stack Engineer',
    years: '2022', dept: 'Engineering',
    photo: unsplash(600, 800, 'african man headshot engineer portrait', 34),
    socialLinks: { instagram: '#', x: '#', linkedin: '#' },
  },
  {
    id: 6, name: 'Bella Iradukunda', role: 'UI/UX Designer',
    years: '2023', dept: 'Design',
    photo: unsplash(600, 800, 'african woman designer portrait headshot', 35),
    socialLinks: { instagram: '#', x: '#', linkedin: '#' },
  },
  {
    id: 7, name: 'Joel Tuyishime', role: 'IT Consultant',
    years: '2024', dept: 'Consulting',
    photo: unsplash(600, 800, 'professional african man portrait consultant', 36),
    socialLinks: { instagram: '#', x: '#', linkedin: '#' },
  },
  {
    id: 8, name: 'Nina Umutoniwase', role: 'Training Program Lead',
    years: '2024', dept: 'Education',
    photo: unsplash(600, 800, 'african woman educator mentor portrait', 37),
    socialLinks: { instagram: '#', x: '#', linkedin: '#' },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Inline SVG icons
// ─────────────────────────────────────────────────────────────────────────────
const InstagramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const ChevronLeft = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ChevronRight = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// Framer Motion variants — name and photo animate; counter + nav are static
// ─────────────────────────────────────────────────────────────────────────────
const nameVariants = {
  enter:  (d: number) => ({ opacity: 0, x: d > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.48, ease: [0.16, 1, 0.3, 1] as const } },
  exit:   (d: number) => ({ opacity: 0, x: d > 0 ? -30 : 30, transition: { duration: 0.28 } }),
};

const metaVariants = {
  enter:  { opacity: 0, y: 10 },
  center: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const } },
  exit:   { opacity: 0, transition: { duration: 0.2 } },
};

const photoVariants = {
  enter:  (d: number) => ({ opacity: 0, x: d > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const } },
  exit:   (d: number) => ({ opacity: 0, x: d > 0 ? -40 : 40, transition: { duration: 0.3 } }),
};

// ─────────────────────────────────────────────────────────────────────────────
// Social icon button
// ─────────────────────────────────────────────────────────────────────────────
function SocialBtn({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-300 hover:bg-[var(--th-right)] hover:text-white hover:border-[var(--th-right)]"
      style={{
        borderColor: `${themeConfig.textColor}30`,
        color: themeConfig.textColor,
      }}
    >
      {children}
    </a>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TeamHeroSlideshow
// ─────────────────────────────────────────────────────────────────────────────
export default function TeamHeroSlideshow() {
  const [index, setIndex]         = useState(0);
  const [direction, setDirection] = useState(1);
  const [autoPlay, setAutoPlay]   = useState(true);
  const pauseRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigate = useCallback((dir: number) => {
    setDirection(dir);
    setIndex((prev) => (prev + dir + heroSlides.length) % heroSlides.length);
    setAutoPlay(false);
    if (pauseRef.current) clearTimeout(pauseRef.current);
    pauseRef.current = setTimeout(() => setAutoPlay(true), 8000);
  }, []);

  useEffect(() => {
    if (!autoPlay) return;
    const id = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [autoPlay]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate]);

  useEffect(() => () => { if (pauseRef.current) clearTimeout(pauseRef.current); }, []);

  const slide     = heroSlides[index];
  const slideNum  = String(index + 1).padStart(2, '0');
  const totalNum  = String(heroSlides.length).padStart(2, '0');

  return (
    <section
      aria-label="Team member slideshow"
      className="w-full overflow-hidden"
      style={{ backgroundColor: themeConfig.leftBg }}
    >
      {/* ── Outer padding wrapper ─────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 py-10 md:py-16">

        {/* ── Card ──────────────────────────────────────────────────────── */}
        <div
          className="relative w-full rounded-[2rem] overflow-hidden shadow-[0_28px_80px_rgba(0,0,0,0.14)]"
          style={{ height: 'clamp(480px, 60vh, 640px)' }}
        >

          {/* ═══════════════════ LEFT PANEL (white) ═══════════════════════ */}
          <div
            className="absolute inset-y-0 left-0 z-20 flex flex-col"
            style={{
              width: 'clamp(240px, 45%, 540px)',
              backgroundColor: themeConfig.leftBg,
              padding: 'clamp(1.75rem, 3.5vw, 3.5rem)',
            }}
          >
            {/* ── Slide counter (static — does NOT animate) ── */}
            <div className="mb-auto">
              <span
                className="font-mono text-[10px] tracking-[0.28em] uppercase select-none"
                style={{ color: `${themeConfig.textColor}70` }}
              >
                [ {slideNum} / {totalNum} ]
              </span>
            </div>

            {/* ── Animated name ── */}
            <div className="flex-1 flex flex-col justify-center py-2 overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.h2
                  key={`name-${slide.id}`}
                  custom={direction}
                  variants={nameVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  aria-label={slide.name}
                  style={{
                    fontFamily: "'Horizon', 'Orbitron', sans-serif",
                    fontSize:   'clamp(2rem, 4vw, 4.4rem)',
                    fontWeight: 700,
                    color:      'transparent',
                    WebkitTextStroke: `2px ${themeConfig.nameStroke}`,
                    textTransform:    'uppercase',
                    letterSpacing:    '0.04em',
                    lineHeight:       1.0,
                    wordBreak:        'break-word',
                  }}
                >
                  {slide.name.split(' ').map((word, i) => (
                    <span key={i} style={{ display: 'block' }}>{word}</span>
                  ))}
                </motion.h2>
              </AnimatePresence>

              {/* ── Animated role + year ── */}
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={`meta-${slide.id}`}
                  custom={direction}
                  variants={metaVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="mt-4"
                >
                  <p
                    className="font-mono text-[10px] tracking-[0.22em] uppercase"
                    style={{ color: `${themeConfig.textColor}90` }}
                  >
                    {slide.role}
                    <span className="mx-2" style={{ color: `${themeConfig.textColor}40` }}>|</span>
                    Since {slide.years}
                  </p>

                  {/* Social icons */}
                  <div className="flex items-center gap-2 mt-4">
                    {slide.socialLinks.instagram && (
                      <SocialBtn href={slide.socialLinks.instagram} label="Instagram">
                        <InstagramIcon />
                      </SocialBtn>
                    )}
                    {slide.socialLinks.x && (
                      <SocialBtn href={slide.socialLinks.x} label="X (Twitter)">
                        <XIcon />
                      </SocialBtn>
                    )}
                    {slide.socialLinks.linkedin && (
                      <SocialBtn href={slide.socialLinks.linkedin} label="LinkedIn">
                        <LinkedinIcon />
                      </SocialBtn>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Navigation (static — does NOT animate) ── */}
            <div className="flex items-center gap-3 pt-4">
              {/* Prev arrow */}
              <button
                id="team-hero-prev"
                onClick={() => navigate(-1)}
                aria-label="Previous member"
                className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-250 hover:scale-110 active:scale-95"
                style={{ backgroundColor: themeConfig.textColor, color: '#ffffff' }}
              >
                <ChevronLeft />
              </button>

              {/* Dot indicators */}
              <div className="flex items-center gap-[6px]" role="tablist" aria-label="Slides">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    role="tab"
                    aria-selected={i === index}
                    onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); setAutoPlay(false); }}
                    aria-label={`Go to slide ${i + 1}`}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width:           i === index ? '20px' : '6px',
                      height:          '6px',
                      backgroundColor: i === index ? themeConfig.textColor : `${themeConfig.textColor}22`,
                    }}
                  />
                ))}
              </div>

              {/* Next arrow */}
              <button
                id="team-hero-next"
                onClick={() => navigate(1)}
                aria-label="Next member"
                className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-250 hover:scale-110 active:scale-95"
                style={{ backgroundColor: themeConfig.textColor, color: '#ffffff' }}
              >
                <ChevronRight />
              </button>
            </div>
          </div>

          {/* ═══════════════════ RIGHT PANEL (dark green) ═════════════════
              Diagonal left edge at ~79° from horizontal.
              Maths: for a 600px-tall card, offset at top = 600 × tan(11°) ≈ 117px.
              clip-path: top-left corner at 117px → bottom-left at 0 → full right edge.
          ══════════════════════════════════════════════════════════════════ */}
          <div
            className="absolute inset-y-0 right-0 z-10"
            style={{
              width:           '58%',
              backgroundColor: themeConfig.rightBg,
              clipPath:        'polygon(117px 0%, 100% 0%, 100% 100%, 0% 100%)',
            }}
          >
            {/* Dept badge — top-right, pill-shaped outlined */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`dept-${slide.id}`}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.35, delay: 0.25 } }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                className="absolute top-7 right-7 z-30 font-mono text-[9px] tracking-[0.25em] uppercase px-3 py-1.5 rounded-full border"
                style={{
                  color:       themeConfig.tagBorder,
                  borderColor: themeConfig.tagBorder,
                  backgroundColor: 'transparent',
                }}
              >
                {slide.dept}
              </motion.div>
            </AnimatePresence>

            {/* ── Team member photo ──────────────────────────────────────
                Expects a transparent PNG. No filter, no tint, no overlay.
                Anchored bottom-center; object-contain so the cutout
                sits cleanly on the green panel bg.
            ─────────────────────────────────────────────────────────── */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`photo-${slide.id}`}
                custom={direction}
                variants={photoVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 flex items-end justify-center"
                style={{ paddingLeft: '117px' }}
              >
                <img
                  src={slide.photo}
                  alt={slide.name}
                  loading="eager"
                  decoding="async"
                  className="h-full w-full object-cover object-top select-none pointer-events-none"
                  /* No filter, no blend mode — pure transparent PNG sits on green bg */
                />
              </motion.div>
            </AnimatePresence>
          </div>

        </div>{/* /card */}
      </div>

      {/* ── Mobile layout (stacked) ──────────────────────────────────────── */}
      <style>{`
        @media (max-width: 767px) {
          .team-hero-card {
            flex-direction: column !important;
            height: auto !important;
          }
        }
      `}</style>
    </section>
  );
}
