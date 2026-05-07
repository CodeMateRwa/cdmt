import { useEffect, useRef, useState, type ElementType } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BriefcaseBusiness,
  ChevronDown,
  GraduationCap,
  Home,
  Layers,
  Mail,
  Users,
} from 'lucide-react';

interface NavLink {
  label: string;
  path: string;
  icon: ElementType;
}

const navLinks: NavLink[] = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Our Work', path: '/work', icon: Layers },
  { label: 'Team', path: '/team', icon: Users },
  { label: 'Contact Us', path: '/contact', icon: Mail },
];

const applyLinks = [
  {
    label: 'Internship',
    description: 'Mentored product experience',
    path: '/apply/internship',
    icon: BriefcaseBusiness,
  },
  {
    label: 'Training',
    description: 'Practical professional upskilling',
    path: '/apply/training',
    icon: GraduationCap,
  },
];

function isActive(path: string, pathname: string): boolean {
  if (path === '/') return pathname === '/';
  return pathname.startsWith(path);
}

function isApplyActive(pathname: string): boolean {
  return pathname.startsWith('/apply');
}

interface NavProps {
  pathname: string;
}

function DesktopNav({ pathname }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isHome = pathname === '/';
  const isTransparentOnHome = isHome && !scrolled;
  const applyActive = isApplyActive(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 z-50 hidden w-full transition-all duration-300 md:flex ${
        scrolled
          ? 'glass-nav shadow-[0_4px_40px_rgba(26,92,42,0.1)]'
          : 'border-transparent bg-transparent'
      }`}
      style={{ height: '80px' }}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
    >
      <div className="mx-auto flex h-full w-full max-w-[1400px] items-center justify-between px-8 md:px-16 lg:px-24">
        <Link to="/" className="flex items-center" id="nav-logo">
          <img
            src="/logo.png"
            alt="CodeMateRwa"
            className="h-16 w-auto object-contain transition-transform hover:scale-105"
          />
        </Link>

        <div className="flex items-center gap-10">
          {navLinks.map((link) => {
            const active = isActive(link.path, pathname);

            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`relative flex flex-col items-center pb-1 font-mono text-[11px] uppercase transition-colors duration-200 ${
                  isTransparentOnHome
                    ? active
                      ? 'text-white'
                      : 'text-white/80 hover:text-white'
                    : active
                      ? 'text-codemate-accent'
                      : 'text-codemate-subtext hover:text-codemate-accent'
                }`}
                style={{ letterSpacing: '0.25em' }}
              >
                {link.label}
                <AnimatePresence>
                  {active && (
                    <motion.span
                      key="dot"
                      className={`absolute -bottom-0.5 h-1 w-1 rounded-full ${
                        isTransparentOnHome ? 'bg-white' : 'bg-codemate-highlight'
                      }`}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    />
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className={`flex items-center gap-2 rounded-full border px-5 py-2.5 font-mono text-[11px] uppercase transition-all duration-300 ${
                isTransparentOnHome
                  ? 'border-white text-white hover:bg-white hover:text-black'
                  : applyActive
                    ? 'border-codemate-accent bg-codemate-accent text-white'
                    : 'border-codemate-accent text-codemate-accent hover:bg-codemate-accent hover:text-white'
              }`}
              style={{ letterSpacing: '0.22em' }}
            >
              Apply Now
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  className="absolute right-0 top-[calc(100%+12px)] w-[280px] overflow-hidden rounded-[24px] border border-codemate-border bg-white shadow-[0_18px_80px_rgba(14,37,20,0.18)]"
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  {applyLinks.map((link) => {
                    const active = pathname === link.path;
                    const Icon = link.icon;

                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setMenuOpen(false)}
                        className={`flex items-start gap-4 px-5 py-4 transition-colors duration-200 ${
                          active ? 'bg-codemate-accent/8' : 'hover:bg-codemate-muted'
                        }`}
                      >
                        <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-codemate-accent/10 text-codemate-accent">
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className="font-display text-lg text-codemate-accent">
                            {link.label}
                          </p>
                          <p className="mt-1 text-xs text-codemate-subtext">
                            {link.description}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            id="nav-cta-quote"
            className={`rounded-full border px-5 py-2.5 font-mono text-[11px] uppercase transition-all duration-300 ${
              isTransparentOnHome
                ? 'border-white text-white hover:bg-white hover:text-black'
                : 'border-codemate-accent text-codemate-accent hover:bg-codemate-accent hover:text-white'
            }`}
            style={{ letterSpacing: '0.25em' }}
          >
            Get A Quote
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

function MobileBottomNav({ pathname }: NavProps) {
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const applyActive = isApplyActive(pathname);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;

      if (current < 60) {
        setHidden(false);
      } else if (current > lastScrollY.current) {
        setHidden(true);
        setMenuOpen(false);
      } else {
        setHidden(false);
      }

      lastScrollY.current = current;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  return (
    <motion.div
      className="fixed inset-x-0 bottom-0 z-50 flex md:hidden"
      style={{
        paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))',
        paddingLeft: '1rem',
        paddingRight: '1rem',
      }}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: hidden ? 120 : 0, opacity: hidden ? 0 : 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div ref={menuRef} className="relative w-full">
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="absolute bottom-[calc(100%+12px)] right-0 w-[220px] overflow-hidden rounded-[22px] border border-codemate-border bg-white shadow-[0_18px_80px_rgba(14,37,20,0.18)]"
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {applyLinks.map((link) => {
                const Icon = link.icon;
                const active = pathname === link.path;

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-4 ${
                      active ? 'bg-codemate-accent/8' : 'hover:bg-codemate-muted'
                    }`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-codemate-accent/10 text-codemate-accent">
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="font-display text-base text-codemate-accent">
                        {link.label}
                      </p>
                      <p className="text-[11px] text-codemate-subtext">
                        {link.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className="flex w-full flex-row overflow-hidden rounded-2xl"
          style={{
            background: 'rgba(255,255,255,0.94)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(26,92,42,0.12)',
            boxShadow: '0 8px 40px rgba(26,92,42,0.14)',
          }}
        >
          {navLinks.map((link) => {
            const active = isActive(link.path, pathname);
            const Icon = link.icon;

            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className="relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 py-3"
              >
                {active && (
                  <motion.div
                    layoutId="mobile-active-pill"
                    className="absolute inset-x-1 inset-y-1.5 rounded-xl"
                    style={{
                      background: 'rgba(26,92,42,0.08)',
                      border: '1px solid rgba(26,92,42,0.15)',
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}

                <Icon
                  size={18}
                  className={`relative z-10 transition-colors duration-200 ${
                    active ? 'text-codemate-accent' : 'text-codemate-subtext'
                  }`}
                />
                <span
                  className={`relative z-10 max-w-full truncate font-mono text-[9px] uppercase transition-colors duration-200 ${
                    active ? 'text-codemate-accent' : 'text-codemate-subtext'
                  }`}
                  style={{ letterSpacing: '0.15em' }}
                >
                  {link.label === 'Our Work'
                    ? 'Work'
                    : link.label === 'Contact Us'
                      ? 'Contact'
                      : link.label}
                </span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 py-3"
          >
            {applyActive && (
              <motion.div
                layoutId="mobile-apply-pill"
                className="absolute inset-x-1 inset-y-1.5 rounded-xl"
                style={{
                  background: 'rgba(26,92,42,0.08)',
                  border: '1px solid rgba(26,92,42,0.15)',
                }}
              />
            )}
            <BriefcaseBusiness
              size={18}
              className={`relative z-10 transition-colors duration-200 ${
                applyActive || menuOpen
                  ? 'text-codemate-accent'
                  : 'text-codemate-subtext'
              }`}
            />
            <span
              className={`relative z-10 max-w-full truncate font-mono text-[9px] uppercase transition-colors duration-200 ${
                applyActive || menuOpen
                  ? 'text-codemate-accent'
                  : 'text-codemate-subtext'
              }`}
              style={{ letterSpacing: '0.15em' }}
            >
              Apply
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <>
      <DesktopNav key={`desktop-${pathname}`} pathname={pathname} />
      <MobileBottomNav key={`mobile-${pathname}`} pathname={pathname} />
    </>
  );
}
