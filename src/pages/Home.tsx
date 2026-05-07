import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import HeroSection from '../components/ui/HeroSection';
import { unsplash } from '../lib/images';
import { defaultHomepageStats, readHomeContent, readServiceItems } from '../lib/siteContent';

interface StatItem { value: number; suffix: string; label: string; sub: string; }
interface ServiceItem {
  num: string; title: string; desc: string; icon: string;
  capabilities: string[];
  photo: { keywords: string; sig: number };
}

const fallbackServices: ServiceItem[] = [
  { num: '01', title: 'Digital Marketing', icon: '◈', desc: 'SEO, social strategy, paid ads, and content that converts.', capabilities: ['SEO & SEM', 'Social Media Strategy', 'Paid Advertising', 'Content Marketing', 'Analytics & Reporting'], photo: { keywords: 'digital marketing analytics dashboard', sig: 10 } },
  { num: '02', title: 'Graphic Design',    icon: '◉', desc: 'Brand identity, print, motion — visuals that stop the scroll.', capabilities: ['Brand Identity', 'Logo Design', 'Print Materials', 'Motion Graphics', 'Social Assets'], photo: { keywords: 'graphic design creative studio branding', sig: 11 } },
  { num: '03', title: 'Web Design & Dev',  icon: '⬡', desc: 'Performant, accessible, pixel-precise web products.', capabilities: ['UI/UX Design', 'React & Next.js', 'CMS Integration', 'Performance Optimization', 'Accessibility'], photo: { keywords: 'web development code programming', sig: 12 } },
  { num: '04', title: 'IT Consulting',     icon: '◫', desc: 'Architecture reviews and technical roadmaps that reduce risk.', capabilities: ['Infrastructure Audit', 'Cloud Migration', 'Security Review', 'DevOps Setup', 'Tech Stack Advisory'], photo: { keywords: 'server infrastructure technology cloud', sig: 13 } },
  { num: '05', title: 'Mobile Apps',       icon: '◱', desc: 'Cross-platform iOS & Android from wireframe to store launch.', capabilities: ['React Native', 'Expo', 'API Integration', 'Push Notifications', 'App Store Launch'], photo: { keywords: 'mobile app smartphone ux design', sig: 14 } },
  { num: '06', title: 'Intern Training',   icon: '◎', desc: 'Structured apprenticeships that produce deployable engineers.', capabilities: ['12-Week Curriculum', 'React & TypeScript', 'Real Project Work', 'Mentorship', 'Career Placement'], photo: { keywords: 'students learning technology classroom africa', sig: 15 } },
];

const stats: StatItem[] = defaultHomepageStats;

const marqueeItems = ['Digital Marketing', 'Graphic Design', 'Web Development', 'IT Consulting', 'Mobile Apps', 'Intern Training'];
const techItems = ['React', 'TypeScript', 'Next.js', 'React Native', 'Figma', 'Node.js', 'Tailwind', 'Firebase', 'AWS', 'PostgreSQL', 'Flutter', 'Expo'];

// ─── MarqueeStrip ─────────────────────────────────────────────────────────────

function MarqueeStrip() {
  const rSvc = [...marqueeItems, ...marqueeItems, ...marqueeItems];
  const rTech = [...techItems, ...techItems, ...techItems];
  return (
    <div className="bg-codemate-accent border-y border-white/10 py-0 overflow-hidden">
      <div className="overflow-hidden border-b border-white/10 py-2.5 md:py-3">
        <div className="marquee-track flex gap-10 md:gap-16 items-center w-max">
          {rSvc.map((item, i) => (
            <span key={i} className="flex items-center gap-10 md:gap-16">
              <span className="font-mono text-[9px] md:text-xs text-white/50 tracking-[0.2em] md:tracking-[0.25em] uppercase whitespace-nowrap">{item}</span>
              <span className="text-codemate-bright opacity-40 text-[9px] md:text-xs">◆</span>
            </span>
          ))}
        </div>
      </div>
      <div className="hidden md:block overflow-hidden py-2.5 md:py-3">
        <div className="marquee-track-reverse flex gap-12 items-center w-max">
          {rTech.map((t, i) => (
            <span key={i} className="flex items-center gap-3">
              <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-white/30 whitespace-nowrap">{t}</span>
              <span className="text-white/15 text-xs">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ServicesSection ──────────────────────────────────────────────────────────

function ServicesSection() {
  const storedServices = readServiceItems() as ServiceItem[];
  const services = storedServices.length ? storedServices : fallbackServices;
  const [active, setActive] = useState(0);
  const [mobileActive, setMobileActive] = useState<number>(-1);

  return (
    <section id="services" className="relative py-14 md:py-28 px-4 md:px-16 lg:px-24 bg-white grain-overlay overflow-hidden">
      <div className="relative z-10 max-w-[1400px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
          <p className="font-mono text-[9px] md:text-xs text-codemate-highlight tracking-[0.2em] md:tracking-[0.3em] uppercase">[ 02. SERVICES ]</p>
          <h2 className="font-display text-3xl md:text-5xl text-codemate-text max-w-2xl leading-tight mt-3 mb-4 md:mt-3 md:mb-0">We offer top services to bring your idea to life.</h2>
        </motion.div>

        <div className="relative h-36 md:h-64 rounded-xl md:rounded-2xl overflow-hidden mb-10 md:mb-16 mt-6 md:mt-10 group">
          <img src={unsplash(1400, 500, 'creative digital agency team working', 5)} alt="Codemate team" className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-r from-codemate-accent/80 via-codemate-accent/40 to-transparent" />
          <div className="absolute inset-0 flex items-end px-5 pb-5 md:items-center md:px-10">
            <div>
              <p className="font-mono text-[8px] md:text-[10px] tracking-[0.3em] uppercase text-codemate-bright mb-1">What we do</p>
              <h3 className="font-display text-lg md:text-4xl text-white max-w-xs md:max-w-md leading-tight">Six services. One studio. Full ownership.</h3>
            </div>
          </div>
        </div>

        {/* Desktop interactive showcase */}
        <div className="hidden md:flex gap-8 mt-16 min-h-[520px]">
          {/* Left list */}
          <div className="w-[35%] flex flex-col justify-center">
            {services.map((s, i) => (
              <div key={s.num} onMouseEnter={() => setActive(i)}
                className={`flex items-center gap-4 py-5 border-b cursor-pointer group transition-all duration-300 ${active === i ? 'border-codemate-highlight' : 'border-codemate-border'}`}>
                <span className={`font-mono text-xs transition-colors duration-300 ${active === i ? 'text-codemate-highlight' : 'text-codemate-subtext'}`}>{s.num}</span>
                <span className={`font-display text-xl transition-all duration-300 ${active === i ? 'text-codemate-accent translate-x-2' : 'text-codemate-subtext group-hover:text-codemate-text'}`}>{s.title}</span>
                <span className={`ml-auto transition-opacity duration-300 text-codemate-highlight ${active === i ? 'opacity-100' : 'opacity-0'}`}>→</span>
              </div>
            ))}
          </div>

          {/* Right panel */}
          <div className="w-[65%] glass-card rounded-2xl overflow-hidden relative">
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }} className="h-full flex flex-col">
                {/* Photo header */}
                <div className="h-52 relative overflow-hidden flex-shrink-0">
                  <motion.img
                    src={unsplash(800, 400, services[active].photo.keywords, services[active].photo.sig)}
                    alt={services[active].title}
                    loading="lazy" decoding="async"
                    className="w-full h-full object-cover object-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    onError={e => { e.currentTarget.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-codemate-accent/70 to-transparent" />
                  <span className="absolute bottom-4 left-5 font-mono text-4xl text-white/80">{services[active].icon}</span>
                </div>
                {/* Text content */}
                <div className="p-8 flex flex-col flex-1">
                  <h3 className="font-display text-3xl text-codemate-accent">{services[active].title}</h3>
                  <p className="font-sans text-sm text-codemate-subtext leading-relaxed mt-3 max-w-md">{services[active].desc}</p>
                  <ul className="mt-5 flex flex-col gap-2">
                    {services[active].capabilities.map(cap => (
                      <li key={cap} className="flex items-center gap-2 font-mono text-xs text-codemate-text">
                        <span className="w-1 h-1 rounded-full bg-codemate-highlight flex-shrink-0" />{cap}
                      </li>
                    ))}
                  </ul>
                  <Link to="/contact" className="inline-flex items-center gap-2 mt-6 font-mono text-xs tracking-widest uppercase text-codemate-highlight hover:gap-3 transition-all duration-200">Start a project →</Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile: stacked accordion */}
        <div className="md:hidden flex flex-col gap-0 mt-8">
          {services.map((s, i) => (
            <div key={s.num} className="border-b border-codemate-border">
              {/* Trigger row */}
              <button
                onClick={() => setMobileActive(mobileActive === i ? -1 : i)}
                className="w-full flex items-center justify-between py-4 px-0 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-codemate-highlight">{s.num}</span>
                  <span className={`font-display text-lg transition-colors duration-200 ${mobileActive === i ? 'text-codemate-accent' : 'text-codemate-subtext'}`}>
                    {s.title}
                  </span>
                </div>
                <motion.span
                  animate={{ rotate: mobileActive === i ? 45 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-codemate-highlight font-mono text-lg flex-shrink-0"
                >
                  +
                </motion.span>
              </button>

              {/* Expanded content */}
              <AnimatePresence>
                {mobileActive === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pb-5">
                      <div className="h-36 rounded-xl overflow-hidden mb-4 relative">
                        <img
                          src={unsplash(600, 300, s.photo.keywords, s.photo.sig)}
                          alt={s.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-codemate-accent/60 to-transparent" />
                      </div>
                      <p className="font-sans text-sm text-codemate-subtext leading-relaxed mb-3">{s.desc}</p>
                      <ul className="flex flex-col gap-1.5">
                        {s.capabilities.map(cap => (
                          <li key={cap} className="flex items-center gap-2 font-mono text-[10px] text-codemate-text">
                            <span className="w-1 h-1 rounded-full bg-codemate-highlight flex-shrink-0" />
                            {cap}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── AboutStrip ───────────────────────────────────────────────────────────────

function AboutStrip() {
  const content = readHomeContent();

  return (
    <section className="relative bg-codemate-accent overflow-hidden py-16 md:py-24 px-4 md:px-16 lg:px-24">
      <div className="absolute inset-0 z-0"><img src={unsplash(1920, 800, content.aboutBgImage.keywords, content.aboutBgImage.sig)} alt="" role="presentation" className="w-full h-full object-cover opacity-[0.07]" /><div className="absolute inset-0 bg-codemate-accent/95" /></div>
      <div className="absolute inset-0 z-[1]" style={{ backgroundImage: 'radial-gradient(circle, rgba(76,205,110,0.08) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 z-[1] w-[600px] h-[400px] rounded-full blur-3xl pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(76,205,110,0.12) 0%, transparent 70%)' }} />
      <div className="relative z-10 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          <motion.div whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 32 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}>
            <span className="font-mono text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.35em] uppercase text-codemate-bright">[ ABOUT CODEMATE ]</span>
            <blockquote className="font-display text-2xl md:text-5xl text-white leading-snug mt-3 md:mt-4 mb-4 md:mb-0 max-w-xl">&ldquo;{content.aboutQuote}&rdquo;</blockquote>
            <p className="font-sans text-sm md:text-base text-white/50 leading-relaxed mt-5 max-w-md">{content.aboutText}</p>
            <div className="flex flex-wrap gap-6 md:gap-8 mt-8 pt-6 md:pt-8 border-t border-white/10">
              {[{val:'3+',label:'Years active'},{val:'50+',label:'Projects shipped'},{val:'8',label:'Team members'}].map(s => (
                <div key={s.label}><p className="font-display text-2xl md:text-3xl text-codemate-bright">{s.val}</p><p className="font-mono text-[9px] md:text-[10px] tracking-widest uppercase text-white/40 mt-1">{s.label}</p></div>
              ))}
            </div>
            <Link to="/work" className="inline-flex items-center gap-2 mt-8 font-mono text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.3em] uppercase text-codemate-bright hover:gap-4 transition-all duration-300">Learn more →</Link>
          </motion.div>
          <motion.div whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: 40 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }} className="grid grid-cols-2 gap-2 md:gap-3 mt-6 md:mt-8">
            {content.aboutGridImages.map((img, i) => {
              const heights = ['h-36 md:h-52', 'h-28 md:h-36', 'h-28 md:h-36', 'h-36 md:h-52'];
              const h = heights[i] || 'h-32';
              return (
                <div key={i} className={`${h} rounded-xl md:rounded-2xl overflow-hidden relative group ${i === 1 ? 'md:mt-8' : ''} ${i === 2 ? 'md:-mt-8' : ''}`}>
                  <img src={unsplash(400, 500, img.keywords, img.sig)} alt="" role="presentation" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-codemate-accent/30 group-hover:bg-codemate-accent/10 transition-colors duration-300" />
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FeaturedProject() {
  const content = readHomeContent();
  const navigate = useNavigate();
  const mini = [{title:'Pulse Health',cat:'Mobile Apps',kw:'health app mobile ui',sig:21,result:'4.8★ App Store'},{title:'NovaBrand Co.',cat:'Graphic Design',kw:'brand identity logo design',sig:22,result:'Full identity system'},{title:'Meridian Reach',cat:'Digital Marketing',kw:'marketing campaign digital',sig:23,result:'340% traffic growth'}];
  return (
    <section className="relative py-14 md:py-24 bg-codemate-bg grain-overlay overflow-hidden">
      <div className="relative z-10 px-4 md:px-16 lg:px-24 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-3">
          <div><span className="font-mono text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.35em] uppercase text-codemate-highlight">[ FEATURED PROJECT ]</span><h2 className="font-display text-3xl md:text-5xl text-codemate-accent mt-3 md:mt-2 mb-4 md:mb-0">Work we&apos;re proud of.</h2></div>
          <Link to="/work" className="font-mono text-[10px] md:text-xs tracking-widest uppercase text-codemate-highlight flex items-center gap-1.5 md:gap-2 hover:gap-3 md:hover:gap-4 transition-all duration-300 self-start md:self-auto">View all projects →</Link>
        </div>
        <motion.div whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 40 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }} className="relative rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer group h-[340px] md:h-[560px]" onClick={() => navigate('/work')}>
          <img src={unsplash(1400, 800, content.featuredImage.keywords, content.featuredImage.sig)} alt="Featured project" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-codemate-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-3"><span className="font-mono text-[8px] md:text-[9px] tracking-[0.3em] uppercase px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-sm border border-white/15 text-white/70">Web Design &amp; Dev</span><span className="font-mono text-[8px] md:text-[9px] tracking-widest text-white/40">2024</span></div>
          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-10">
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-2xl md:text-5xl text-white leading-tight">Verdant Studio</h3>
                <p className="hidden md:block font-sans text-sm text-white/60 mt-2 max-w-md leading-relaxed">Full brand identity and marketing site for a boutique architecture firm. Launched in 6 weeks.</p>
                <div className="flex flex-wrap gap-1.5 mt-3">{['React','Tailwind','Framer Motion'].map((tag, idx) => <span key={tag} className={`font-mono text-[8px] md:text-[9px] tracking-wide uppercase px-2 py-1 md:px-3 md:py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white/60 ${idx > 1 ? 'hidden md:inline-flex' : ''}`}>{tag}</span>)}</div>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0 w-10 h-10 md:w-14 md:h-14 rounded-full bg-white flex items-center justify-center text-codemate-accent font-mono text-base md:text-lg shadow-[0_4px_20px_rgba(255,255,255,0.2)] group-hover:bg-codemate-bright group-hover:text-white transition-all duration-300">→</motion.div>
            </div>
          </div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.6 }} className="absolute top-4 right-4 md:top-6 md:right-6 glass-card px-3 py-2 md:px-4 md:py-3 rounded-xl border border-white/15 bg-white/10 backdrop-blur-md">
            <p className="font-mono text-[8px] md:text-[9px] tracking-widest uppercase text-white/50 mb-0.5 md:mb-1">Result</p>
            <p className="font-display text-lg md:text-xl text-codemate-bright">3× leads</p>
            <p className="font-mono text-[8px] md:text-[9px] text-white/40 mt-0.5">in first month</p>
          </motion.div>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 md:mt-4">
          {mini.map((p,i) => (
            <motion.div key={p.title} whileInView={{ opacity:1, y:0 }} initial={{ opacity:0, y:24 }} viewport={{ once:true }} transition={{ delay:i*0.1, duration:0.5, ease:[0.16,1,0.3,1] as [number,number,number,number] }} onClick={() => navigate('/work')} className="relative h-40 md:h-48 rounded-xl md:rounded-2xl overflow-hidden cursor-pointer group">
              <img src={unsplash(600,400,p.kw,p.sig)} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute inset-0 bg-codemate-accent/0 group-hover:bg-codemate-accent/40 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="font-mono text-[8px] md:text-[9px] tracking-widest uppercase text-codemate-bright">{p.cat}</p>
                <h4 className="font-display text-lg md:text-lg text-white mt-0.5">{p.title}</h4>
                <p className="font-mono text-[10px] text-white/50 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{p.result}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Count-up + StatBlock ─────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const started = useRef(false);
  useEffect(() => {
    if (!isInView || started.current) return;
    started.current = true;
    const startTime = performance.now();
    function easeOut(t: number) { return 1 - Math.pow(1 - t, 3); }
    function step(now: number) {
      const progress = Math.min((now - startTime) / duration, 1);
      setCount(Math.round(easeOut(progress) * target));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [isInView, target, duration]);
  return { count, ref };
}

function StatCard({ stat, index }: { stat: StatItem; index: number }) {
  const { count, ref } = useCountUp(stat.value);

  return (
    <div className={`flex flex-col items-center text-center py-8 md:py-10 px-4 relative ${index % 2 === 0 ? 'border-r border-codemate-border' : ''} ${index < 2 ? 'border-b border-codemate-border' : ''} md:border-b-0 ${index < 3 ? 'md:border-r' : 'md:border-r-0'} border-codemate-border`}>
      <div className="flex items-end"><span ref={ref} className="font-display text-5xl md:text-6xl lg:text-7xl font-black text-gradient leading-none">{count}</span><span className="font-display text-5xl md:text-6xl lg:text-7xl text-codemate-highlight leading-none">{stat.suffix}</span></div>
      <p className="font-sans text-sm md:text-base text-codemate-accent font-semibold mt-3 tracking-wide">{stat.label}</p>
      <p className="font-mono text-[9px] md:text-[10px] text-codemate-subtext mt-1 tracking-widest">{stat.sub}</p>
    </div>
  );
}

function StatsSection() {
  return (
    <section className="relative py-16 md:py-24 bg-white grain-overlay overflow-hidden">
      <div className="absolute top-0 left-4 md:left-6 right-4 md:right-6 h-px bg-gradient-to-r from-transparent via-codemate-border to-transparent" />
      <div className="absolute bottom-0 left-4 md:left-6 right-4 md:right-6 h-px bg-gradient-to-r from-transparent via-codemate-border to-transparent" />
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-16 lg:px-24">
        <div className="text-center mb-10 md:mb-16">
          <span className="font-mono text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.35em] uppercase text-codemate-highlight">[ BY THE NUMBERS ]</span>
          <h2 className="font-display text-3xl md:text-5xl text-codemate-accent mt-3 md:mt-2 mb-4 md:mb-0">Results that speak.</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
          {stats.map((stat, i) => <StatCard key={stat.label} stat={stat} index={i} />)}
        </div>
      </div>
    </section>
  );
}

// ─── TestimonialsSection ──────────────────────────────────────────────────────

const testimonials = [
  { quote: "Codemate didn't just build our website — they rebuilt how we think about our digital presence. The results were immediate.", name: 'Sarah Kaminski', role: 'CEO, Verdant Studio', company: 'Architecture Firm', photo: { kw: 'professional woman portrait business ceo', sig: 60 } },
  { quote: "The team delivered our mobile app ahead of schedule with zero compromises on quality. Rare in this industry.", name: 'James Okonkwo', role: 'Founder, Pulse Health', company: 'Health Tech Startup', photo: { kw: 'professional african man portrait founder', sig: 61 } },
  { quote: "Our marketing campaign saw a 340% traffic increase in 6 months. These guys understand both design and growth.", name: 'Amina Hassan', role: 'Marketing Director', company: 'Meridian Reach', photo: { kw: 'professional woman marketing director portrait', sig: 62 } },
];

function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const t = testimonials[active];
  return (
    <section className="relative py-16 md:py-24 bg-codemate-bg dot-pattern overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-3xl" style={{ background: 'radial-gradient(ellipse, rgba(46,158,79,0.06) 0%, transparent 70%)' }} /></div>
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-16 lg:px-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-4">
          <div><span className="font-mono text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.35em] uppercase text-codemate-highlight">[ CLIENT LOVE ]</span><h2 className="font-display text-3xl md:text-5xl text-codemate-accent mt-3 md:mt-2 mb-4 md:mb-0">Don&apos;t take our word for it.</h2></div>
          <div className="flex gap-2 self-start md:self-auto">{testimonials.map((_,i) => <button key={i} onClick={() => setActive(i)} className={`rounded-full transition-all duration-300 ${i===active?'w-8 h-2 bg-codemate-accent':'w-2 h-2 bg-codemate-border'}`} />)}</div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }} transition={{ duration:0.45, ease:[0.16,1,0.3,1] as [number,number,number,number] }} className="glass-card rounded-2xl md:rounded-3xl p-6 md:p-12 relative overflow-hidden">
            <span className="absolute top-4 right-8 font-display text-[6rem] md:text-[10rem] text-codemate-accent/[0.04] leading-none select-none pointer-events-none">"</span>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6 md:gap-10 items-center">
              <div>
                <div className="flex gap-1 mb-4 md:mb-6">{Array.from({length:5}).map((_,i) => <span key={i} className="text-codemate-bright text-base md:text-lg">★</span>)}</div>
                <blockquote className="font-display text-xl md:text-3xl text-codemate-accent leading-snug">&ldquo;{t.quote}&rdquo;</blockquote>
                <div className="flex items-center gap-3 mt-6 md:mt-8">
                  <div className="w-10 h-10 md:w-12 h-12 rounded-full overflow-hidden ring-2 ring-codemate-border flex-shrink-0"><img src={unsplash(100,100,t.photo.kw,t.photo.sig)} alt={t.name} className="w-full h-full object-cover object-top" /></div>
                  <div><p className="font-sans text-xs md:text-sm font-semibold text-codemate-accent">{t.name}</p><p className="font-mono text-[9px] md:text-[10px] tracking-wide text-codemate-subtext mt-0.5">{t.role} · {t.company}</p></div>
                </div>
              </div>
              <div className="h-64 rounded-2xl overflow-hidden relative hidden md:block group"><img src={unsplash(400,500,t.photo.kw,t.photo.sig)} alt={t.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" /><div className="absolute inset-0 bg-gradient-to-t from-codemate-accent/40 to-transparent" /></div>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 md:mt-4">
          {testimonials.map((test,i) => (
            <motion.div key={i} onClick={() => setActive(i)} whileHover={{ y:-4 }} className={`glass-card rounded-xl md:rounded-2xl p-4 md:p-5 cursor-pointer transition-all duration-300 ${i===active?'border-codemate-accent/40 bg-codemate-muted':'hover:border-codemate-accent/20'}`}>
              <div className="flex items-center gap-3 mb-3"><div className="w-7 h-7 md:w-8 md:h-8 rounded-full overflow-hidden flex-shrink-0"><img src={unsplash(80,80,test.photo.kw,test.photo.sig)} alt={test.name} className="w-full h-full object-cover object-top" /></div><div><p className="font-sans text-[11px] md:text-xs font-semibold text-codemate-accent">{test.name}</p><p className="font-mono text-[9px] text-codemate-subtext tracking-wide">{test.company}</p></div></div>
              <p className="font-sans text-[11px] md:text-xs text-codemate-subtext leading-relaxed line-clamp-2">&ldquo;{test.quote}&rdquo;</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CtaBanner ────────────────────────────────────────────────────────────────

function CtaBanner() {
  const content = readHomeContent();

  return (
    <section className="relative py-20 md:py-32 px-4 md:px-16 lg:px-24 mb-0 overflow-hidden">
      <div className="absolute inset-0 z-0"><img src={unsplash(1920, 600, content.ctaImage.keywords, content.ctaImage.sig)} alt="" role="presentation" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-codemate-accent/88" /></div>
      <div className="absolute inset-0 z-[1]" style={{ backgroundImage: 'radial-gradient(circle, rgba(76,205,110,0.1) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      <motion.div whileInView={{ opacity:1, scale:1 }} initial={{ opacity:0, scale:0.97 }} viewport={{ once:true, amount:0.3 }} transition={{ duration:0.7, ease:[0.16,1,0.3,1] as [number,number,number,number] }} className="relative z-10 max-w-3xl mx-auto text-center">
        <span className="font-mono text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.4em] uppercase text-codemate-bright">[ READY? ]</span>
        <h2 className="font-display text-4xl md:text-7xl text-white mt-3 md:mt-4 mb-4 md:mb-0 leading-tight">Let&apos;s Build Something Remarkable.</h2>
        <p className="font-sans text-sm md:text-base text-white/60 mt-4 md:mt-5 leading-relaxed max-w-lg mx-auto">Drop us a message and get a quote within 24 hours. No automated replies. No sales funnels. Just real people.</p>
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 md:gap-4 mt-6 md:mt-8 mb-8 md:mb-10">{['✓ Free consultation','✓ 24hr response','✓ No lock-in contracts'].map(t => <span key={t} className="font-mono text-[10px] md:text-[11px] tracking-wide text-white/50 text-center">{t}</span>)}</div>
        <Link to="/contact" id="cta-banner-contact" className="w-full sm:w-auto inline-block">
          <motion.span whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }} className="flex sm:inline-flex w-full sm:w-auto items-center justify-center gap-3 font-mono text-xs md:text-sm tracking-[0.15em] md:tracking-[0.2em] uppercase px-8 py-4 rounded-full bg-white text-codemate-accent hover:bg-codemate-bright hover:text-white shadow-[0_4px_40px_rgba(255,255,255,0.15)] hover:shadow-[0_4px_40px_rgba(76,205,110,0.4)] transition-all duration-300 cursor-pointer">Contact Us →</motion.span>
        </Link>
      </motion.div>
    </section>
  );
}

// ─── Home ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="relative">
      <HeroSection />
      <div className="h-px bg-gradient-to-r from-transparent via-codemate-border to-transparent" />
      <MarqueeStrip />
      <ServicesSection />
      <div className="h-px bg-gradient-to-r from-transparent via-codemate-border to-transparent" />
      <FeaturedProject />
      <AboutStrip />
      <StatsSection />
      <TestimonialsSection />
      <CtaBanner />
    </main>
  );
}
