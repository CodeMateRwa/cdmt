import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { unsplash } from '../lib/images';
import { readTeamMembers, type TeamMember } from '../lib/siteContent';
import TeamHeroSlideshow from '../components/ui/TeamHeroSlideshow';

// Inline social icons (lucide-react doesn't include these in this version)
function LinkedinIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
function TwitterIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const itemVariants = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } } };
const headerVariants = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } } };

interface ValueItem { symbol: string; title: string; desc: string; }
interface CultureFact { label: string; value: string; }
interface RoleItem { title: string; type: string; dept: string; }

const values: ValueItem[] = [
  { symbol: '⟁', title: 'Precision',        desc: 'We measure twice and ship once. Vague deliverables are a client problem we solve before they become ours.' },
  { symbol: '⊕', title: 'Ownership',        desc: 'Every team member owns their output end to end. No hiding behind process or waiting to be told.' },
  { symbol: '◬', title: 'Speed with Taste', desc: 'Fast does not mean rough. We move quickly because we have strong defaults, not because we cut corners.' },
  { symbol: '⟳', title: 'Iteration',        desc: 'Version one is never the final answer. We build feedback loops into everything we ship.' },
  { symbol: '◈', title: 'Clarity',          desc: 'Plain communication over corporate language. If we cannot explain it simply, we do not understand it.' },
  { symbol: '⬡', title: 'Craft',            desc: 'The last 10% is not optional. Attention to detail is the difference between good work and work that earns referrals.' },
];

const cultureFacts: CultureFact[] = [
  { label: 'Avg. response time', value: '< 2hrs' },
  { label: 'Remote-first',       value: '100%'   },
  { label: 'Interns placed',     value: '18+'    },
  { label: 'Coffee consumed',    value: '∞'      },
];

const roles: RoleItem[] = [
  { title: 'Frontend Engineer', type: 'Full-time',  dept: 'Engineering' },
  { title: 'UI/UX Designer',    type: 'Contract',   dept: 'Design'      },
  { title: 'Marketing Intern',  type: 'Internship', dept: 'Strategy'    },
];


// ─── TeamCard ─────────────────────────────────────────────────────────────────

const TeamCard = ({
  member,
  onSelect,
}: {
  member: TeamMember;
  onSelect: () => void;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className={`relative overflow-hidden rounded-[2.5rem] cursor-pointer group h-[480px] shadow-[0_20px_50px_rgba(0,0,0,0.1)]`}
      variants={itemVariants}
      whileInView="visible"
      initial="hidden"
      viewport={{ once: true, amount: 0.15 }}
      onClick={onSelect}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* ── BACKGROUND COLOR TINT ── */}
      <div 
        className="absolute inset-0 z-0 opacity-40 transition-opacity duration-500 group-hover:opacity-60"
        style={{ background: `linear-gradient(to bottom, ${member.color}, transparent)` }}
      />

      {/* ── RIBBON TAG (Top Left) ── */}
      <div className="absolute top-0 left-6 z-40 w-8 h-12 bg-[#1a1a1a] flex flex-col items-center justify-center rounded-b-md shadow-lg">
        <div className="text-white mb-1">
           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
        </div>
        <div className="w-4 h-0.5 bg-white/20 rounded-full" />
      </div>

      {/* ── DEPARTMENT BADGE (Top Right) ── */}
      <div className="absolute top-4 right-6 z-40 bg-black/25 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
        <span className="text-white text-[9px] font-bold tracking-widest uppercase">
          {member.dept}
        </span>
      </div>

      {/* ── PORTRAIT PHOTO ── */}
      <motion.img
        src={unsplash(600, 800, member.photo.keywords, member.photo.sig)}
        alt={member.name}
        loading="lazy"
        className="absolute inset-0 z-10 w-full h-full object-cover object-top"
        animate={{ scale: hovered ? 1.05 : 1 }}
        transition={{ duration: 0.8 }}
      />

      {/* ── FROSTED BOTTOM PANEL ── */}
      <div className="absolute bottom-0 inset-x-0 z-30 p-2">
        <div className="bg-white/70 backdrop-blur-2xl rounded-[2rem] p-5 shadow-inner border border-white/40">
          {/* Name and Role */}
          <div className="mb-3">
            <h3 className="font-sans font-bold text-xl text-[#1a1a1a] leading-tight">
              {member.name}
            </h3>
            <p className="font-sans text-[11px] text-[#1a1a1a]/60 font-medium leading-relaxed mt-1 line-clamp-2">
              {member.bio}
            </p>
          </div>

          {/* Stats Row + Follow Button */}
          <div className="flex items-center justify-between gap-2 mt-4 pt-4 border-t border-black/5">
            <div className="flex gap-4">
              <div>
                <p className="text-[9px] font-bold text-black/30 uppercase tracking-tighter">Role</p>
                <p className="text-[11px] font-black text-black/80 truncate max-w-[80px]">{member.role.split(' ')[0]}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-black/30 uppercase tracking-tighter">Dept</p>
                <p className="text-[11px] font-black text-black/80">{member.dept.slice(0, 3).toUpperCase()}</p>
              </div>
            </div>

            <button 
              className="bg-white px-5 py-2 rounded-full text-[11px] font-bold text-black shadow-sm border border-black/5 hover:bg-black hover:text-white transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation();
                if (member.linkedin) {
                  window.open(member.linkedin, '_blank', 'noopener,noreferrer');
                }
              }}
            >
              Follow
            </button>
          </div>
        </div>
      </div>

      {/* ── DARK VIGNETTE ── */}
      <div className="absolute inset-0 z-20 bg-gradient-to-b from-transparent via-transparent to-black/20" />
    </motion.div>
  );
};

// ─── TeamGrid ─────────────────────────────────────────────────────────────────

function TeamGrid({ onSelect }: { onSelect: (m: TeamMember) => void }) {
  const team = readTeamMembers();
  return (
    <section className="py-16 px-6 md:px-16 lg:px-24 bg-codemate-bg">
      <div className="max-w-[1400px] mx-auto">

        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-codemate-highlight">
              [ WHO WE ARE ]
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-codemate-accent mt-2">
              Built by builders.
            </h2>
          </div>
          <div className="glass-card px-5 py-3 rounded-xl flex items-center gap-3 self-start md:self-auto bg-white">
            <span className="font-display text-3xl text-gradient">{team.length}</span>
            <div>
              <p className="font-sans text-sm text-codemate-accent font-semibold">Team Members</p>
              <p className="font-mono text-[10px] text-codemate-subtext tracking-wide">3 departments</p>
            </div>
          </div>
        </div>

        {/* Masonry grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
        >
          {team.map((member) => (
            <TeamCard
              key={member.id}
              member={member}
              onSelect={() => onSelect(member)}
            />
          ))}
        </motion.div>

      </div>
    </section>
  );
}

// ─── MemberModal ──────────────────────────────────────────────────────────────

function MemberModal({ selected, onClose }: { selected: TeamMember; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 backdrop-blur-md" style={{ background: 'rgba(26,42,26,0.5)' }} />
      <motion.div
        className="relative z-10 glass-card rounded-2xl w-full max-w-lg overflow-hidden"
        initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header band */}
        <div className="h-40 relative overflow-hidden rounded-t-2xl bg-codemate-muted">
          <motion.img
            src={unsplash(600, 300, selected.photo.keywords, selected.photo.sig)}
            alt={selected.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-top"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            onError={e => { e.currentTarget.style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-codemate-border flex items-center justify-center text-codemate-subtext hover:text-codemate-accent transition-colors duration-200 font-mono text-xs">✕</button>
          <span className="absolute top-4 left-4 font-mono text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-codemate-border text-codemate-subtext">{selected.dept}</span>
        </div>

        {/* Avatar overlapping header */}
        <div className="px-8 -mt-8 relative z-10">
          <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-white shadow-lg bg-codemate-muted" style={{ borderColor: selected.color }}>
            <motion.img
              src={unsplash(120, 120, selected.photo.keywords, selected.photo.sig)}
              alt={selected.name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-top"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              onError={e => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="px-8 pb-8 pt-4">
          <h3 className="font-display text-2xl text-codemate-accent">{selected.name}</h3>
          <p className="font-mono text-xs text-codemate-subtext tracking-wide mt-0.5">{selected.role}</p>

          <blockquote className="border-l-2 border-codemate-highlight pl-4 mt-5">
            <p className="font-display text-base text-codemate-text italic leading-relaxed">&ldquo;{selected.quote}&rdquo;</p>
          </blockquote>

          <p className="font-sans text-sm text-codemate-subtext leading-relaxed mt-5">{selected.bio}</p>

          <div className="flex flex-wrap gap-2 mt-5">
            {selected.skills.map(s => (
              <span key={s} className="font-mono text-[10px] tracking-wide text-codemate-accent px-3 py-1.5 rounded-full bg-codemate-muted border border-codemate-border">{s}</span>
            ))}
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t border-codemate-border">
            {selected.linkedin && (
              <a href={selected.linkedin} className="flex items-center gap-2 font-mono text-xs tracking-widest text-codemate-subtext hover:text-codemate-accent transition-colors duration-200">
                <LinkedinIcon size={13} /> LinkedIn
              </a>
            )}
            {selected.twitter && (
              <a href={selected.twitter} className="flex items-center gap-2 font-mono text-xs tracking-widest text-codemate-subtext hover:text-codemate-accent transition-colors duration-200">
                <TwitterIcon size={13} /> Twitter
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── ValuesSection ────────────────────────────────────────────────────────────

function ValuesSection() {
  return (
    <section className="relative py-24 px-6 md:px-16 lg:px-24 overflow-hidden" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      {/* Background photo */}
      <div className="absolute inset-0 z-0 bg-codemate-muted">
        <motion.img
          src={unsplash(1920, 800, 'technology abstract pattern dark', 50)}
          alt=""
          role="presentation"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 0.5 }}
          onError={e => { e.currentTarget.style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-codemate-accent/95" />
      </div>
      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto">
        <motion.div variants={headerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          <p className="font-mono text-xs text-codemate-bright" style={{ letterSpacing: '0.3em', textTransform: 'uppercase' }}>[ WHAT DRIVES US ]</p>
          <h2 className="font-display text-4xl md:text-5xl text-white mt-2 max-w-xl">Principles we don&apos;t negotiate.</h2>
        </motion.div>
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px mt-16" style={{ background: 'rgba(255,255,255,0.1)' }} variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          {values.map((v) => (
            <motion.div key={v.title} variants={itemVariants} className="group p-8 transition-colors duration-300 cursor-default" style={{ background: '#1a5c2a' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.07)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = '#1a5c2a')}>
              <span className="font-mono text-3xl text-codemate-bright" style={{ opacity: 0.6 }}>{v.symbol}</span>
              <h3 className="font-display text-xl text-white mt-5">{v.title}</h3>
              <p className="font-sans text-sm leading-relaxed mt-2" style={{ color: 'rgba(255,255,255,0.65)' }}>{v.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CultureSection() {
  return (
    <section className="py-24 px-6 md:px-16 lg:px-24 bg-white">
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
        <motion.div className="lg:w-1/2" variants={headerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          <div className="font-display leading-none select-none text-gradient" style={{ fontSize: 'clamp(7rem, 15vw, 14rem)', opacity: 0.8 }} aria-hidden="true">8</div>
          <p className="font-display text-5xl md:text-6xl text-codemate-text -mt-4">people.</p>
          <p className="font-sans text-sm text-codemate-subtext mt-4">One shared obsession:</p>
          <p className="font-display text-2xl md:text-3xl text-codemate-accent mt-1">shipping things that matter.</p>
          {/* Photo grid */}
          <div className="grid grid-cols-2 gap-3 mt-8 max-w-xs">
            {[
              { kw: 'team collaboration office',       sig: 41 },
              { kw: 'developer coding laptop',         sig: 42 },
              { kw: 'design creative workspace',       sig: 43 },
              { kw: 'africa technology innovation',    sig: 44 },
            ].map((img, i) => (
              <div key={i} className="rounded-xl overflow-hidden h-28 relative group bg-codemate-muted">
                <motion.img
                  src={unsplash(300, 250, img.kw, img.sig)}
                  alt=""
                  role="presentation"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  onError={e => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-codemate-accent/40 group-hover:bg-codemate-accent/20 transition-colors duration-300" />
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div className="lg:w-1/2 w-full pt-4" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          {cultureFacts.map((fact) => (
            <motion.div key={fact.label} variants={itemVariants} className="group flex justify-between items-center py-5 border-b border-codemate-border">
              <span className="font-mono text-xs text-codemate-subtext uppercase" style={{ letterSpacing: '0.15em' }}>{fact.label}</span>
              <span className="font-display text-2xl text-codemate-accent transition-colors duration-300 group-hover:text-codemate-highlight">{fact.value}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function JoinSection() {
  return (
    <section className="py-24 px-6 md:px-16 lg:px-24 mb-20 bg-codemate-bg">
      <div className="max-w-[1400px] mx-auto">
        <motion.div variants={headerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          <p className="font-mono text-xs text-codemate-highlight" style={{ letterSpacing: '0.3em', textTransform: 'uppercase' }}>[ JOIN US ]</p>
          <h2 className="font-display text-4xl md:text-5xl text-codemate-text mt-2">Work with us.</h2>
        </motion.div>
        <div className="flex flex-col lg:flex-row gap-8 mt-12">
          <motion.div className="lg:w-1/2 flex flex-col" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }}>
            <p className="font-mono text-xs text-codemate-subtext uppercase tracking-widest mb-2">Open Roles</p>
            {roles.map((role) => (
              <motion.div key={role.title} variants={itemVariants} className="glass-card bg-white px-6 py-5 rounded-xl flex justify-between items-center group hover:border-codemate-highlight/50 transition-all duration-300 cursor-pointer mt-4">
                <div>
                  <p className="font-display text-lg text-codemate-text">{role.title}</p>
                  <p className="font-mono text-[10px] text-codemate-subtext mt-0.5" style={{ letterSpacing: '0.1em' }}>{role.dept}</p>
                </div>
                <div className="flex items-center">
                  <span className="font-mono text-[9px] tracking-widest uppercase px-3 py-1 rounded-full border border-codemate-border text-codemate-subtext group-hover:border-codemate-highlight group-hover:text-codemate-highlight transition-all duration-300">{role.type}</span>
                  <span className="text-codemate-highlight opacity-0 group-hover:opacity-100 ml-3 transition-opacity duration-300">→</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
          <motion.div className="lg:w-1/2" variants={headerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} transition={{ delay: 0.15 }}>
            <div className="bg-codemate-muted border border-codemate-border rounded-2xl p-8 relative overflow-hidden h-full flex flex-col justify-between">
              <div className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none" style={{ background: 'radial-gradient(ellipse at bottom right, rgba(46,158,79,0.1), transparent 70%)' }} />
              <div className="relative z-10">
                <p className="font-mono text-[10px] text-codemate-highlight" style={{ letterSpacing: '0.3em', textTransform: 'uppercase' }}>[ INTERNSHIP PROGRAM ]</p>
                <h3 className="font-display text-2xl text-codemate-text mt-3">Start your career at Codemate.</h3>
                <p className="font-sans text-sm text-codemate-subtext leading-relaxed mt-3">Our 12-week structured program turns motivated learners into deployable engineers. Stipend, mentorship, and a real portfolio included.</p>
              </div>
              <Link to="/contact" id="team-intern-apply" className="relative z-10 mt-6 inline-block self-start bg-codemate-accent text-white font-mono text-sm tracking-widest px-7 py-3 rounded-full hover:bg-codemate-highlight hover:scale-105 hover:shadow-[0_0_30px_rgba(46,158,79,0.25)] transition-all duration-300">Apply Now →</Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Team ─────────────────────────────────────────────────────────────────────

export default function Team() {
  const [selected, setSelected] = useState<TeamMember | null>(null);

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
      <TeamHeroSlideshow />
      <TeamGrid onSelect={setSelected} />
      <ValuesSection />
      <CultureSection />
      <JoinSection />
      <AnimatePresence>
        {selected && <MemberModal selected={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </main>
  );
}
