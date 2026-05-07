import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, ArrowUp } from 'lucide-react';
import { readServiceItems, readSiteSettings } from '../../lib/siteContent';

// ─── Inline social SVGs (lucide-react v1.x removed brand icons) ───────────────
const IconLinkedin = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);
const IconTwitter = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const IconInstagram = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);
const IconGithub = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavLinkItem  { label: string; path: string }
interface ContactItem  { icon: React.ElementType; text: string }
type SubmitStatus = 'idle' | 'done';

// ─── Data ─────────────────────────────────────────────────────────────────────

const navLinks: NavLinkItem[] = [
  { label: 'Home',       path: '/'        },
  { label: 'Our Work',   path: '/work'    },
  { label: 'Our Team',   path: '/team'    },
  { label: 'Contact Us', path: '/contact' },
];

const socials: { Icon: () => React.ReactElement; label: string }[] = [
  { Icon: IconLinkedin,  label: 'LinkedIn'  },
  { Icon: IconTwitter,   label: 'Twitter'   },
  { Icon: IconInstagram, label: 'Instagram' },
  { Icon: IconGithub,    label: 'GitHub'    },
];

// ─── Variants ─────────────────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const itemVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

// ─── Footer ───────────────────────────────────────────────────────────────────

export default function Footer() {
  const [email, setEmail]     = useState('');
  const [status, setStatus]   = useState<SubmitStatus>('idle');
  const [showTop, setShowTop] = useState(false);
  const settings = readSiteSettings();
  const services = readServiceItems().map((item) => item.title);
  const contacts: ContactItem[] = [
    { icon: Mail, text: settings.email },
    { icon: Phone, text: settings.phone },
    { icon: MapPin, text: settings.location },
  ];

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setTimeout(() => setStatus('done'), 800);
  };

  return (
    <>
      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="relative bg-codemate-accent overflow-hidden">

        {/* ── Decorative — glows & dot strip ── */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 w-[400px] h-[300px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse, rgba(76,205,110,0.06) 0%, transparent 70%)',
            filter: 'blur(48px)',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute bottom-0 right-0 w-[300px] h-[200px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse, rgba(76,205,110,0.04) 0%, transparent 70%)',
            filter: 'blur(48px)',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-[120px] dot-pattern opacity-10 pointer-events-none"
        />

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* ZONE 1 — Main Content                                         */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <div className="relative pt-20 pb-12 px-6 md:px-16 lg:px-24">
          <div className="max-w-[1400px] mx-auto">

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >

              {/* ── Col 1 — Brand ── */}
              <motion.div variants={itemVariants}>
                <Link to="/" id="footer-logo">
                  <img
                    src="/logo.png"
                    alt="CodeMateRwa"
                    className="h-16 w-auto object-contain brightness-0 invert transition-transform hover:scale-105"
                  />
                </Link>

                <p
                  className="font-mono text-[11px] uppercase text-white/50 mt-3"
                  style={{ letterSpacing: '0.25em' }}
                >
                  Empowering Digital Life Innovation
                </p>

                <p className="font-sans text-sm text-white/65 leading-relaxed mt-4 max-w-[220px]">
                  A full-service digital studio based in Kigali, Rwanda. We build
                  products, brands, and campaigns that perform.
                </p>

                {/* Social icons */}
                <div className="flex gap-3 mt-6">
                  {socials.map(({ Icon, label }) => (
                    <button
                      key={label}
                      aria-label={label}
                      className="w-9 h-9 rounded-full border border-white/15 flex items-center
                        justify-center text-white/50 hover:text-white hover:border-white/40
                        transition-all duration-250 cursor-pointer"
                      style={{ background: 'transparent' }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                      }}
                    >
                      <Icon />
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* ── Col 2 — Navigation ── */}
              <motion.div variants={itemVariants}>
                <p
                  className="font-mono text-[10px] uppercase text-codemate-bright mb-5"
                  style={{ letterSpacing: '0.3em' }}
                >
                  Navigation
                </p>
                <ul className="flex flex-col gap-3">
                  {navLinks.map(({ label, path }) => (
                    <li key={path}>
                      <Link
                        to={path}
                        className="group font-sans text-sm text-white/65 hover:text-white
                          flex items-center gap-2 transition-all duration-200 hover:translate-x-1"
                      >
                        <span
                          className="opacity-0 group-hover:opacity-100 text-codemate-bright
                            transition-opacity duration-200 text-xs"
                        >
                          →
                        </span>
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* ── Col 3 — Services ── */}
              <motion.div variants={itemVariants}>
                <p
                  className="font-mono text-[10px] uppercase text-codemate-bright mb-5"
                  style={{ letterSpacing: '0.3em' }}
                >
                  Services
                </p>
                <ul className="flex flex-col gap-1">
                  {services.map((s) => (
                    <li
                      key={s}
                      className="font-sans text-sm text-white/65 hover:text-white
                        cursor-default transition-colors duration-200 py-0.5"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* ── Col 4 — Contact + Newsletter ── */}
              <motion.div variants={itemVariants}>
                <p
                  className="font-mono text-[10px] uppercase text-codemate-bright mb-5"
                  style={{ letterSpacing: '0.3em' }}
                >
                  Get In Touch
                </p>

                {/* Contact items */}
                <ul className="flex flex-col gap-3 mb-7">
                  {contacts.map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-center gap-2.5">
                      <Icon size={13} className="text-codemate-bright shrink-0" />
                      <span
                        className="font-mono text-xs text-white/65 hover:text-white
                          transition-colors duration-200"
                      >
                        {text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Newsletter */}
                <p
                  className="font-mono text-[10px] uppercase text-codemate-bright mb-3"
                  style={{ letterSpacing: '0.3em' }}
                >
                  Stay Updated
                </p>

                {status === 'done' ? (
                  <p className="font-mono text-xs text-codemate-bright">✓ You're in.</p>
                ) : (
                  <form onSubmit={handleNewsletter} className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="flex-1 min-w-0 rounded-xl px-4 py-2.5 font-mono text-xs
                        text-white placeholder:text-white/30 border border-white/15
                        focus:outline-none focus:border-codemate-bright/50
                        transition-all duration-300"
                      style={{ background: 'rgba(255,255,255,0.08)' }}
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-codemate-bright text-codemate-accent
                        font-mono text-xs tracking-widest hover:bg-white
                        hover:text-codemate-accent transition-all duration-300 whitespace-nowrap"
                    >
                      JOIN →
                    </button>
                  </form>
                )}
              </motion.div>

            </motion.div>{/* /grid */}

            {/* ── Large brand watermark ── */}
            <div className="mt-16 overflow-hidden select-none pointer-events-none" aria-hidden="true">
              <p
                className="font-display font-black text-white text-center whitespace-nowrap
                  leading-none tracking-tight"
                style={{
                  fontSize: 'clamp(4rem, 12vw, 10rem)',
                  opacity: 0.04,
                }}
              >
                CodeMateRwa
              </p>
            </div>

          </div>
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-white/10 mx-6 md:mx-16 lg:mx-24" />

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* ZONE 2 — Bottom Bar                                           */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <div className="py-6 px-6 md:px-16 lg:px-24">
          <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-4">

            {/* Left — copyright */}
            <p
              className="font-mono text-[11px] text-white/40 tracking-wide"
            >
              © {new Date().getFullYear()} CodeMateRwa. All rights reserved.
            </p>

            {/* Center — legal links (hidden on mobile) */}
            <div className="hidden sm:flex items-center gap-3">
              {(['Privacy Policy', 'Terms of Service', 'Cookie Policy'] as const).map(
                (label, i, arr) => (
                  <span key={label} className="flex items-center gap-3">
                    <span
                      className="font-mono text-[11px] text-white/40 hover:text-white/70
                        transition-colors duration-200 cursor-pointer"
                    >
                      {label}
                    </span>
                    {i < arr.length - 1 && (
                      <span className="text-white/20 text-[11px]">·</span>
                    )}
                  </span>
                )
              )}
            </div>

            {/* Right — made in Kigali */}
            <p className="font-mono text-[11px] text-white/40 tracking-wide">
              Made in Kigali 🇷🇼
            </p>

          </div>
        </div>

      </footer>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* ZONE 3 — Back To Top (fixed, outside footer flow)                */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            key="back-to-top"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1,   y: 0  }}
            exit={{    opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.3, ease: EASE }}
            onClick={scrollToTop}
            aria-label="Back to top"
            className="hidden md:flex fixed bottom-6 right-6 z-50
              w-11 h-11 rounded-full items-center justify-center
              bg-codemate-accent border border-white/20 text-white
              hover:border-codemate-bright/40
              transition-colors duration-300"
            style={{
              boxShadow: '0 4px 20px rgba(26,92,42,0.3)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-codemate-highlight, #2e9e4f)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-codemate-accent, #1a5c2a)';
            }}
          >
            <ArrowUp size={16} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
