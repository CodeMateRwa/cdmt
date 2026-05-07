import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { unsplash } from '../../lib/images';
import { readHomeContent } from '../../lib/siteContent';

// ── Animation Variants ────────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 32, filter: 'blur(6px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

// ── Word Rotator Defaults ───────────────────────────────────────────────────
const defaultWords = ['Refined', 'Digital', 'Creative', 'Strategic', 'Engineered', 'Innovative'];

// ── HeroSection ───────────────────────────────────────────────────────────────

export default function HeroSection() {
  const content = readHomeContent();
  const words = content.heroWords.length ? content.heroWords : defaultWords;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() =>
      setIndex(i => (i + 1) % words.length), 2500);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center">

      {/* ── Layer 1 — Background Photo ── */}
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          src={unsplash(1920, 1080, content.heroImage.keywords, content.heroImage.sig)}
          alt=""
          role="presentation"
          decoding="async"
          className="w-full h-full object-cover object-center animate-slow-zoom"
        />
      </div>

      {/* ── Layer 2 — Gradient Overlays ── */}
      {/* Primary dark overlay — base legibility */}
      <div className="absolute inset-0 z-[1] bg-black/55" />
      {/* Green brand wash — top */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-codemate-accent/70 via-transparent to-transparent" />
      {/* Bottom vignette — fades to page bg */}
      <div className="absolute bottom-0 left-0 right-0 z-[2] h-64 bg-gradient-to-t from-codemate-bg to-transparent" />
      {/* Left edge glow — brand accent */}
      <div className="absolute inset-y-0 left-0 z-[2] w-1/3 bg-gradient-to-r from-codemate-accent/30 to-transparent" />

      {/* ── Layer 3 — Noise Texture ── */}
      <div
        className="absolute inset-0 z-[3] pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Layer 4 — Content ── */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center min-h-screen px-6 md:px-16 pt-28 pb-32 text-center lg:text-left w-full gap-8 lg:gap-16">

        {/* PART 1 — Headline Section (Left) */}
        <div className="flex flex-col items-center lg:items-start justify-center flex-1 w-full lg:w-auto">

          {/* 4a — Overline Tag */}
          <motion.div variants={itemVariants} initial="hidden" animate="visible" className="mb-8">
            <span className="font-mono text-[9px] md:text-[11px] tracking-[0.2em] md:tracking-[0.4em] uppercase text-white/60 border border-white/15 px-3 py-1.5 md:px-4 md:py-2 rounded-full backdrop-blur-sm bg-white/5 max-w-[90vw] lg:max-w-none text-center lg:text-left inline-block">
              {content.heroTag}
            </span>
          </motion.div>

          {/* 4b — Giant Headline with Static Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center lg:items-start gap-0 leading-none"
          >
            {/* Line 1 — static */}
            <motion.h1
              variants={itemVariants}
              className="font-display font-black text-white leading-[0.88] tracking-tight"
              style={{ fontSize: 'clamp(2rem, 8vw, 5rem)' }}
            >
              {content.heroLine1}
            </motion.h1>

            {/* Line 2 — Word Rotator */}
            <motion.div
              variants={itemVariants}
              className="overflow-hidden flex items-center"
              style={{ height: 'clamp(2rem, 8vw, 5rem)' }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={words[index]}
                  initial={{ y: '110%', opacity: 0, filter: 'blur(8px)' }}
                  animate={{ y: '0%',   opacity: 1, filter: 'blur(0px)' }}
                  exit={{    y: '-110%', opacity: 0, filter: 'blur(8px)' }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                  className="block font-display font-black text-gradient leading-[0.88] tracking-tight"
                  style={{ fontSize: 'clamp(2rem, 8vw, 5rem)' }}
                >
                  {words[index]}
                </motion.span>
              </AnimatePresence>
            </motion.div>

            {/* Line 3 — static */}
            <motion.h1
              variants={itemVariants}
              className="font-display font-black text-white leading-[0.88] tracking-tight"
              style={{ fontSize: 'clamp(2rem, 8vw, 5rem)' }}
            >
              {content.heroLine3}
            </motion.h1>
          </motion.div>

          {/* 4d — CTA Row */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.65 }}
            className="flex flex-col items-center lg:items-start gap-3 mt-8 w-full"
          >
            <Link to="/contact" id="hero-cta-quote" className="w-full lg:w-auto">
              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="w-full lg:w-auto inline-flex items-center justify-center lg:justify-start gap-2 font-mono text-xs md:text-sm tracking-[0.15em] md:tracking-[0.2em] uppercase px-6 py-3.5 md:px-8 md:py-4 rounded-full bg-white text-codemate-accent hover:bg-codemate-bright hover:text-white shadow-[0_4px_30px_rgba(255,255,255,0.15)] hover:shadow-[0_4px_40px_rgba(76,205,110,0.35)] transition-all duration-300 cursor-pointer"
              >
                {content.heroCtaText} →
              </motion.span>
            </Link>
            <Link to="/work" id="hero-cta-work" className="w-full lg:w-auto">
              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="w-full lg:w-auto inline-flex items-center justify-center lg:justify-start gap-2 font-mono text-xs md:text-sm tracking-[0.15em] md:tracking-[0.2em] uppercase px-6 py-3.5 md:px-8 md:py-4 rounded-full border border-white/30 text-white hover:border-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 cursor-pointer"
              >
                View Our Work
              </motion.span>
            </Link>
          </motion.div>
        </div>

        {/* PART 2 — Supporting Content Section (Right) */}
        <div className="flex flex-col items-center lg:items-start justify-center flex-1 w-full lg:w-auto">

          {/* 4c — Subtext */}
          <motion.p
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
            className="font-sans text-sm md:text-base text-white/60 max-w-md leading-relaxed text-center lg:text-left"
          >
            {content.heroSubtext}
          </motion.p>

          {/* 4e — Stats Pills */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.8 }}
            className="flex flex-col gap-2 mt-8 md:mt-12 w-full"
          >
            {[
              { value: '50+', label: 'Projects'       },
              { value: '6',   label: 'Services'       },
              { value: '94%', label: 'Retention Rate' },
            ].map(stat => (
              <div
                key={stat.label}
                className="flex items-center gap-2 md:gap-3 px-3 py-2 md:px-5 md:py-3 rounded-full backdrop-blur-md border border-white/12 justify-center lg:justify-start"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                <span className="font-display text-lg md:text-xl font-bold text-codemate-bright">
                  {stat.value}
                </span>
                <span className="font-mono text-[9px] md:text-[10px] tracking-[0.15em] md:tracking-widest uppercase text-white/50">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Layer 5 — Scroll Indicator ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-5 md:bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 md:gap-2 cursor-pointer group"
        onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <span className="font-mono text-[8px] md:text-[9px] tracking-[0.4em] uppercase text-white/30 group-hover:text-white/60 transition-colors duration-300">
          Scroll
        </span>
        <div className="flex flex-col items-center gap-0.5">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              animate={{ opacity: [0.2, 1, 0.2], y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
              className="w-2 h-2 md:w-3 md:h-3 border-r-2 border-b-2 border-white/40 rotate-45"
            />
          ))}
        </div>
      </motion.div>

    </section>
  );
}
