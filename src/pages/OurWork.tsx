import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { unsplash } from '../lib/images';
import { readWorkProjects } from '../lib/siteContent';

type Project = {
  id: number; title: string; category: string; tags: string[];
  year: string; desc: string; color: string; size: 'large' | 'small';
  photo: { keywords: string; sig: number };
  challenge: string; outcome: string; link?: string;
};
interface ProcessStep { num: string; title: string; desc: string; }

const baseFilters: string[] = ['All','Web Design & Dev','Mobile Apps','Digital Marketing','Graphic Design','IT Consulting','Intern Training'];

const fallbackProjects: Project[] = [
  { id: 1, title: 'Verdant Studio',  category: 'Web Design & Dev',   tags: ['React','Tailwind','Framer'],       year: '2024', desc: 'Full brand identity and marketing site for a boutique architecture firm.', color: '#1a5c2a', size: 'large', photo: { keywords: 'architecture website modern minimal', sig: 20 }, challenge: 'No existing web presence. Client needed brand + site from zero.', outcome: 'Launched in 6 weeks. 3× organic leads in first month.', link: '#' },
  { id: 2, title: 'Pulse Health',    category: 'Mobile Apps',         tags: ['React Native','TypeScript'],       year: '2024', desc: 'Cross-platform wellness tracking app — 4.8★ on App Store.',             color: '#2d6a4f', size: 'small', photo: { keywords: 'health app mobile wellness ui', sig: 21 }, challenge: 'Needed offline-first sync across iOS and Android from day one.', outcome: '4.8★ rating, 12k downloads in 90 days post-launch.', link: '#' },
  { id: 3, title: 'NovaBrand Co.',   category: 'Graphic Design',      tags: ['Identity','Print','Motion'],       year: '2023', desc: 'Complete visual identity system for a fintech startup.',                color: '#52796f', size: 'small', photo: { keywords: 'brand identity logo design creative', sig: 22 }, challenge: 'Founders had zero brand clarity — name, colours, tone all undefined.', outcome: 'Full identity shipped in 3 weeks. Investor deck won seed round.', link: '#' },
  { id: 4, title: 'Meridian Reach',  category: 'Digital Marketing',   tags: ['SEO','Paid Ads','Content'],        year: '2023', desc: '340% traffic increase in 6 months via integrated digital campaign.',   color: '#354f52', size: 'large', photo: { keywords: 'digital marketing campaign social media', sig: 23 }, challenge: 'Stagnant traffic, no SEO strategy, wasted ad spend.', outcome: '340% organic traffic lift, ROAS improved from 1.2× to 4.8×.', link: '#' },
  { id: 5, title: 'Stackwise ERP',   category: 'IT Consulting',       tags: ['Architecture','Cloud','DevOps'],   year: '2024', desc: 'Infrastructure audit and cloud migration for a logistics company.',     color: '#3a5a40', size: 'small', photo: { keywords: 'server data center cloud infrastructure', sig: 24 }, challenge: 'Legacy on-prem stack with zero redundancy and weekly downtime.', outcome: 'Migrated to AWS in 8 weeks. 99.97% uptime since go-live.', link: '#' },
  { id: 6, title: 'CodeCamp RW',     category: 'Intern Training',     tags: ['Curriculum','Mentorship','React'], year: '2023', desc: '12-week structured program — 18 graduates placed in tech roles.',       color: '#588157', size: 'small', photo: { keywords: 'coding bootcamp students learning africa', sig: 25 }, challenge: 'Local companies wanted junior devs but couldn\'t afford to train them.', outcome: '18 graduates, 16 hired within 30 days of program completion.', link: '#' },
];

function getProjects() {
  const storedProjects = readWorkProjects() as Project[];
  return storedProjects.length ? storedProjects : fallbackProjects;
}

function getFilters(projects: Project[]) {
  return ['All', ...Array.from(new Set([...baseFilters.slice(1), ...projects.map((project) => project.category)]))];
}

const steps: ProcessStep[] = [
  { num: '01', title: 'Discovery',  desc: 'We audit your goals, audience, and competitive landscape before writing a line of code.' },
  { num: '02', title: 'Strategy',   desc: 'A concrete plan: stack, timeline, deliverables. No vague proposals.' },
  { num: '03', title: 'Execution',  desc: 'Design and build in tight sprints with weekly client checkpoints.' },
  { num: '04', title: 'Launch +',   desc: 'Ship, measure, iterate. We stay on as partners, not just vendors.' },
];

const itemVariants: Variants = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } } };
const containerVariants: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

// ─── WorkHero ─────────────────────────────────────────────────────────────────

function WorkHero() {
  const miniStats = [{ value: '12+', label: 'Web Projects' }, { value: '8+', label: 'Mobile Apps' }, { value: '30+', label: 'Brands' }];
  return (
    <section className="relative pt-40 pb-20 px-6 md:px-16 lg:px-24 overflow-hidden bg-codemate-bg">
      <div className="absolute inset-0 dot-pattern opacity-50 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[700px] h-[500px] pointer-events-none blur-3xl" style={{ background: 'radial-gradient(ellipse at top right, rgba(46,158,79,0.06), transparent 70%)' }} />
      <div className="relative z-10 max-w-[1400px] mx-auto flex flex-col lg:flex-row items-start gap-12 lg:gap-8">
        <div className="lg:w-[60%]">
          <motion.p className="font-mono text-xs text-codemate-highlight" style={{ letterSpacing: '0.3em', textTransform: 'uppercase' }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>[ 03. OUR WORK ]</motion.p>
          <h1 className="font-display text-6xl md:text-8xl leading-tight mt-4">
            {(['Selected', 'Projects.'] as const).map((line, i) => (
              <motion.span key={line} className={`block ${i === 1 ? 'text-gradient' : 'text-codemate-text'}`} variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 + i * 0.08 }}>{line}</motion.span>
            ))}
          </h1>
          <motion.p className="font-sans text-sm text-codemate-subtext max-w-sm leading-relaxed mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.35 }}>A curated selection of digital products, brands, and campaigns we&apos;ve shipped.</motion.p>
        </div>
        <motion.div className="lg:w-[40%] flex flex-col gap-3 w-full" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
          {miniStats.map(({ value, label }) => (
            <div key={label} className="glass-card px-5 py-4 rounded-xl flex items-center gap-4 bg-white">
              <span className="font-display text-3xl text-gradient">{value}</span>
              <span className="font-mono text-[10px] text-codemate-subtext uppercase" style={{ letterSpacing: '0.15em' }}>{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── FeaturedStrip ────────────────────────────────────────────────────────────

function FeaturedStrip({ onSelect }: { onSelect: (p: Project) => void }) {
  const projects = getProjects();
  const stripRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const featuredProjects = projects.slice(0, 3);

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (stripRef.current?.offsetLeft ?? 0));
    setScrollLeft(stripRef.current?.scrollLeft ?? 0);
  };
  const onMouseUp = () => setIsDragging(false);
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !stripRef.current) return;
    e.preventDefault();
    const x = e.pageX - stripRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    stripRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="py-10 overflow-hidden">
      <div className="px-6 md:px-16 lg:px-24 mb-6 flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-codemate-highlight">[ FEATURED WORK ]</span>
        <span className="font-mono text-[10px] tracking-widest text-codemate-subtext">← DRAG →</span>
      </div>
      <div
        ref={stripRef}
        className={`flex gap-5 px-6 md:px-16 lg:px-24 pb-4 overflow-x-auto no-scrollbar select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseMove}
        onMouseMove={onMouseMove}
      >
        {featuredProjects.map(project => (
          <div
            key={project.id}
            onClick={() => onSelect(project)}
            className="flex-shrink-0 w-[85vw] md:w-[55vw] lg:w-[40vw]"
          >
            <div className="h-64 md:h-80 rounded-2xl overflow-hidden relative group transition-all duration-300 hover:ring-2 hover:ring-codemate-accent/20 hover:ring-offset-2 hover:ring-offset-codemate-bg bg-codemate-muted">
              <motion.img
                src={unsplash(900, 600, project.photo.keywords, project.photo.sig)}
                alt={project.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                onError={e => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span className="font-mono text-[10px] tracking-widest uppercase text-codemate-bright">{project.category}</span>
                <h3 className="font-display text-2xl text-white mt-1">{project.title}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── FilterBar ────────────────────────────────────────────────────────────────

function FilterBar({ active, setActive }: { active: string; setActive: (f: string) => void }) {
  const filters = getFilters(getProjects());
  return (
    <div className="sticky z-40 top-[68px] w-full border-b py-4 px-6 md:px-16 lg:px-24" style={{ background: 'rgba(248,250,248,0.92)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderBottomColor: 'rgba(26,92,42,0.12)' }}>
      <div className="flex flex-row gap-3 overflow-x-auto no-scrollbar">
        {filters.map((filter) => {
          const isAct = filter === active;
          return (
            <button key={filter} onClick={() => setActive(filter)}
              className={`relative font-mono text-[11px] tracking-[0.2em] uppercase px-5 py-2 rounded-full border whitespace-nowrap cursor-pointer transition-all duration-250 ${isAct ? 'border-codemate-accent text-codemate-accent' : 'border-codemate-border text-codemate-subtext hover:border-codemate-accent hover:text-codemate-text'}`}
              style={isAct ? { background: '#e8f5eb' } : {}}>
              {isAct && <motion.span layoutId="filter-active" className="absolute inset-0 rounded-full" style={{ background: '#e8f5eb' }} transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
              <span className="relative z-10">{filter}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── ProjectCard ──────────────────────────────────────────────────────────────

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  return (
    <motion.div key={project.id} layout
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`glass-card group relative overflow-hidden cursor-pointer bg-white ${project.size === 'large' ? 'md:col-span-2' : ''}`}>
      <div className="h-52 md:h-60 relative overflow-hidden rounded-t-2xl group bg-codemate-muted">
        <motion.img
          src={unsplash(700, 500, project.photo.keywords, project.photo.sig)}
          alt={project.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          onError={e => { e.currentTarget.style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <span className="absolute top-3 left-3 font-mono text-[9px] tracking-widest uppercase px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/15 text-white/80">{project.category}</span>
        <span className="absolute top-3 right-3 font-mono text-[10px] text-white/50">{project.year}</span>
      </div>
      <div className="p-6">
        <h3 className="font-display text-xl text-codemate-text mt-1">{project.title}</h3>
        <p className="font-sans text-xs text-codemate-subtext leading-relaxed mt-2">{project.desc}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {project.tags.map((tag) => <span key={tag} className="font-mono text-[9px] tracking-wide text-codemate-accent px-2 py-0.5 rounded bg-codemate-muted">{tag}</span>)}
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-codemate-highlight mt-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">View Project →</div>
      </div>
    </motion.div>
  );
}

// ─── ProjectsGrid ─────────────────────────────────────────────────────────────

function ProjectsGrid({ activeFilter, onSelect }: { activeFilter: string; onSelect: (p: Project) => void }) {
  const projects = getProjects();
  const filtered = activeFilter === 'All' ? projects : projects.filter((p) => p.category === activeFilter);
  return (
    <section className="py-20 px-6 md:px-16 lg:px-24 bg-codemate-bg">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => <ProjectCard key={project.id} project={project} onClick={() => onSelect(project)} />)}
          </AnimatePresence>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="font-mono text-sm text-codemate-subtext tracking-widest">No projects in this category yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({ selected, onClose }: { selected: Project; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 backdrop-blur-md" style={{ background: 'rgba(26,42,26,0.6)' }} />
      <motion.div
        className="relative z-10 glass-card rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.92, opacity: 0, y: 24 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0, y: 24 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
        onClick={e => e.stopPropagation()}
      >
        {/* Visual zone */}
        <div className="h-64 md:h-80 rounded-t-2xl overflow-hidden relative bg-codemate-muted">
          <motion.img
            src={unsplash(1200, 600, selected.photo.keywords, selected.photo.sig)}
            alt={selected.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-top"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            onError={e => { e.currentTarget.style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm border border-codemate-border flex items-center justify-center text-codemate-subtext hover:text-codemate-accent hover:border-codemate-accent transition-all duration-200 font-mono text-sm">✕</button>
          <span className="absolute top-4 left-4 font-mono text-[10px] tracking-widest text-codemate-subtext bg-white/80 backdrop-blur-sm border border-codemate-border px-3 py-1 rounded-full">{selected.year}</span>
        </div>

        {/* Content */}
        <div className="p-8 md:p-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-codemate-highlight">{selected.category}</span>
              <h2 className="font-display text-3xl md:text-4xl text-codemate-accent mt-1">{selected.title}</h2>
            </div>
            {selected.link && (
              <a href={selected.link} target="_blank" rel="noreferrer" className="flex-shrink-0 font-mono text-[11px] tracking-widest uppercase px-5 py-2.5 rounded-full bg-codemate-accent text-white hover:bg-codemate-highlight transition-colors duration-300">Visit →</a>
            )}
          </div>
          <div className="border-t border-codemate-border my-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-codemate-subtext mb-2">Overview</p>
              <p className="font-sans text-sm text-codemate-text leading-relaxed">{selected.desc}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-codemate-subtext mb-2">Challenge</p>
              <p className="font-sans text-sm text-codemate-text leading-relaxed">{selected.challenge}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-codemate-subtext mb-2">Outcome</p>
              <p className="font-sans text-sm text-codemate-text leading-relaxed">{selected.outcome}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {selected.tags.map(tag => (
              <span key={tag} className="font-mono text-[10px] tracking-wide text-codemate-accent px-3 py-1.5 rounded-full bg-codemate-muted border border-codemate-border">{tag}</span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── ProcessSection ───────────────────────────────────────────────────────────

function ProcessSection() {
  return (
    <section className="py-24 px-6 md:px-16 lg:px-24 bg-codemate-muted" style={{ borderTop: '1px solid rgba(26,92,42,0.1)' }}>
      <div className="max-w-[1400px] mx-auto">
        <motion.div className="text-center" variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          <p className="font-mono text-xs text-codemate-highlight" style={{ letterSpacing: '0.3em', textTransform: 'uppercase' }}>[ HOW WE WORK ]</p>
          <h2 className="font-display text-3xl md:text-5xl text-codemate-text mt-3 max-w-2xl mx-auto">From brief to launch — a proven process.</h2>
        </motion.div>
        <div className="relative">
          <div className="hidden md:block absolute top-0 left-0 right-0 h-px bg-codemate-border mt-16" />
          <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }}>
            {steps.map((step) => (
              <motion.div key={step.num} variants={itemVariants} className="border-t border-codemate-border pt-6">
                <span className="font-mono text-3xl font-bold text-codemate-highlight" style={{ opacity: 0.4 }}>{step.num}</span>
                <h3 className="font-display text-xl text-codemate-text mt-4">{step.title}</h3>
                <p className="font-sans text-sm text-codemate-subtext leading-relaxed mt-2">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function WorkCtaBanner() {
  return (
    <div className="mx-6 md:mx-16 lg:mx-24 mb-20 mt-16">
      <motion.div className="glass-card relative overflow-hidden rounded-2xl bg-white" initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
        <div className="absolute top-0 left-0 w-96 h-96 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top left, rgba(46,158,79,0.07), transparent 70%)' }} />
        <div className="relative z-10 py-16 px-10 md:px-20 flex flex-col items-center text-center">
          <p className="font-mono text-xs text-codemate-highlight" style={{ letterSpacing: '0.35em', textTransform: 'uppercase' }}>[ START A PROJECT ]</p>
          <h2 className="font-display text-4xl md:text-6xl text-codemate-text mt-3">Got a project in mind?</h2>
          <p className="font-sans text-sm text-codemate-subtext mt-4 max-w-md">Tell us what you&apos;re building. We&apos;ll tell you if we can make it better.</p>
          <Link to="/contact" id="work-cta-contact" className="mt-10 bg-codemate-accent text-white font-mono text-sm tracking-widest px-7 py-3 rounded-full hover:bg-codemate-highlight hover:scale-105 hover:shadow-[0_0_30px_rgba(46,158,79,0.25)] transition-all duration-300">Start a Project →</Link>
        </div>
      </motion.div>
    </div>
  );
}

// ─── OurWork ──────────────────────────────────────────────────────────────────

export default function OurWork() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selected, setSelected] = useState<Project | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = selected ? 'hidden' : '';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [selected]);

  return (
    <main>
      <WorkHero />
      <FeaturedStrip onSelect={setSelected} />
      <FilterBar active={activeFilter} setActive={setActiveFilter} />
      <ProjectsGrid activeFilter={activeFilter} onSelect={setSelected} />
      <ProcessSection />
      <WorkCtaBanner />
      <AnimatePresence>
        {selected && <Lightbox selected={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </main>
  );
}
