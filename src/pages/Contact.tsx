import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import { toast } from '../hooks/useToast';
import { apiClient } from '../lib/api';
import { readSiteSettings } from '../lib/siteContent';

type FormData = { name: string; email: string; service: string; budget: string; message: string; };
type FormStatus = 'idle' | 'sending' | 'sent' | 'error';
type FormErrors = Partial<Record<keyof FormData, string>>;
interface AvailabilityItem { service: string; status: string; available: boolean; }
interface ContactItem { icon: React.ElementType; label: string; value: string; }
interface SocialItem { platform: string; handle: string; }
interface HourItem { day: string; time: string; }

const availability: AvailabilityItem[] = [
  { service: 'Web Projects',    status: 'Taking on clients', available: true  },
  { service: 'Mobile Apps',     status: '1 slot open',       available: true  },
  { service: 'Design Retainer', status: 'Fully booked',      available: false },
];

const socials: SocialItem[] = [
  { platform: 'LinkedIn',  handle: '@codemate.rw'  },
  { platform: 'Twitter/X', handle: '@codematerw'   },
  { platform: 'Instagram', handle: '@codemate.rw'  },
  { platform: 'GitHub',    handle: 'codemate-rw'   },
];

const hours: HourItem[] = [
  { day: 'Mon – Fri', time: '8:00 AM – 6:00 PM' },
  { day: 'Saturday',  time: '9:00 AM – 1:00 PM'  },
  { day: 'Sunday',    time: 'Closed'              },
];

const trust: string[] = [
  '✓  Free initial consultation',
  '✓  Quote within 24 hours',
  '✓  No lock-in contracts',
];

const itemVariants = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } } };

const inputClass = `
  w-full bg-transparent border border-codemate-border rounded-xl
  px-4 py-3.5 font-mono text-sm text-codemate-text
  placeholder:text-codemate-subtext placeholder:opacity-50
  focus:outline-none focus:border-codemate-highlight
  focus:shadow-[0_0_0_3px_rgba(46,158,79,0.1)]
  transition-all duration-300
`.trim();

function validate(data: FormData): FormErrors {
  const e: FormErrors = {};
  if (!data.name.trim()) e.name = 'Full name is required.';
  if (!data.email.trim()) e.email = 'Email address is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Enter a valid email address.';
  if (!data.service) e.service = 'Please select a service.';
  if (!data.message.trim()) e.message = 'Tell us a bit about your project.';
  else if (data.message.trim().length < 20) e.message = 'Message must be at least 20 characters.';
  return e;
}

function FieldWrapper({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-[10px] tracking-[0.25em] uppercase text-codemate-subtext">{label}</label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.2 }}
            className="font-mono text-[10px] text-red-400 tracking-wide flex items-center gap-1.5"
          >
            <span>⚠</span> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── ContactHero ──────────────────────────────────────────────────────────────

function ContactHero() {
  const headlineLines = ["Let's build", 'something', 'together.'];
  return (
    <section className="relative pt-40 pb-16 px-6 md:px-16 lg:px-24 overflow-hidden bg-codemate-bg">
      <div className="absolute inset-0 dot-pattern opacity-50 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[400px] pointer-events-none blur-3xl" style={{ background: 'radial-gradient(ellipse at top right, rgba(46,158,79,0.06), transparent 70%)' }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[300px] pointer-events-none blur-3xl" style={{ background: 'radial-gradient(ellipse at bottom left, rgba(76,205,110,0.04), transparent 70%)' }} />
      <div className="relative z-10 max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
        <div className="lg:w-[60%]">
          <motion.p className="font-mono text-xs text-codemate-highlight" style={{ letterSpacing: '0.3em', textTransform: 'uppercase' }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>[ 05. CONTACT ]</motion.p>
          <h1 className="font-display text-6xl md:text-8xl text-codemate-text leading-tight mt-4">
            {headlineLines.map((line, i) => (
              <motion.span key={line} className={`block ${i === 2 ? 'text-gradient' : ''}`} variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 + i * 0.08 }}>{line}</motion.span>
            ))}
          </h1>
          <motion.p className="font-sans text-sm text-codemate-subtext max-w-sm leading-relaxed mt-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.45 }}>
            Tell us what you&apos;re working on. We respond within 24 hours — no automated replies, no sales funnels.
          </motion.p>
        </div>
        <motion.div className="lg:w-[40%] w-full" initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}>
          <div className="glass-card rounded-2xl p-7 bg-white">
            <div className="flex justify-between items-center">
              <span className="font-mono text-[10px] text-codemate-subtext uppercase" style={{ letterSpacing: '0.3em' }}>AVAILABILITY STATUS</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-codemate-bright animate-pulse" />
                <span className="font-mono text-[10px] text-codemate-highlight" style={{ letterSpacing: '0.15em' }}>OPEN</span>
              </div>
            </div>
            <div className="border-t border-codemate-border mt-4 pt-4">
              {availability.map((item) => (
                <div key={item.service} className="flex justify-between items-center py-3 border-b border-codemate-border last:border-0">
                  <span className="font-mono text-xs text-codemate-text">{item.service}</span>
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full mr-2" style={{ background: item.available ? '#2e9e4f' : '#4a6b52', opacity: item.available ? 1 : 0.4 }} />
                    <span className="font-mono text-[10px]" style={{ color: item.available ? '#2e9e4f' : '#4a6b52', opacity: item.available ? 1 : 0.4 }}>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="font-mono text-[10px] text-codemate-subtext mt-5 text-center" style={{ letterSpacing: '0.15em' }}>Response time: &lt; 24 hrs</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── ContactForm ──────────────────────────────────────────────────────────────

function ContactForm() {
  const [form, setForm] = useState<FormData>({ name: '', email: '', service: '', budget: '', message: '' });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [shaking, setShaking] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    setForm(updated);
    if (touched[name as keyof FormData]) setErrors(validate(updated));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(t => ({ ...t, [name]: true }));
    setErrors(validate(form));
  };

  const fieldClass = (field: keyof FormData) =>
    inputClass + (errors[field] && touched[field]
      ? ' !border-red-400/60 focus:!border-red-400 focus:!shadow-[0_0_0_3px_rgba(248,113,113,0.1)]'
      : '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = Object.fromEntries(Object.keys(form).map(k => [k, true])) as typeof touched;
    setTouched(allTouched);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
      return;
    }
    setStatus('sending');
    try {
      await apiClient.createMessage(form);
      setStatus('sent');
      toast("Message sent! We'll reply within 24 hours.", 'success');
    } catch {
      setStatus('error');
      toast("Something went wrong. Please try again.", 'error');
    }
  };

  return (
    <div className="glass-card rounded-2xl p-8 md:p-10 bg-white">
      <AnimatePresence mode="wait">
        {status === 'sent' ? (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-full border border-codemate-accent flex items-center justify-center text-codemate-accent text-2xl mb-6">✓</div>
            <p className="font-display text-2xl text-codemate-text">Message received.</p>
            <p className="font-sans text-sm text-codemate-subtext mt-2 max-w-xs">We&apos;ll review your brief and respond within 24 hours.</p>
            <button onClick={() => { setStatus('idle'); setForm({ name: '', email: '', service: '', budget: '', message: '' }); setErrors({}); setTouched({}); }} className="font-mono text-xs tracking-widest text-codemate-highlight underline underline-offset-4 mt-8 hover:opacity-70 transition">Send another message</button>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <p className="font-display text-2xl text-codemate-text">Start a conversation</p>
            <p className="font-sans text-xs text-codemate-subtext mt-1">Fill this out and we&apos;ll get back to you within one business day.</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-8" noValidate>
              <FieldWrapper label="Name" error={touched.name ? errors.name : undefined}>
                <input type="text" name="name" value={form.name} onChange={handleChange} onBlur={handleBlur} placeholder="Your full name" className={fieldClass('name')} />
              </FieldWrapper>

              <FieldWrapper label="Email" error={touched.email ? errors.email : undefined}>
                <input type="email" name="email" value={form.email} onChange={handleChange} onBlur={handleBlur} placeholder="your@email.com" className={fieldClass('email')} />
              </FieldWrapper>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FieldWrapper label="Service" error={touched.service ? errors.service : undefined}>
                  <div className="relative">
                    <select name="service" value={form.service} onChange={handleChange} onBlur={handleBlur} className={`${fieldClass('service')} appearance-none cursor-pointer`}>
                      <option value="" disabled>Select a service...</option>
                      <option value="digital-marketing">Digital Marketing</option>
                      <option value="graphic-design">Graphic Design</option>
                      <option value="web-dev">Web Design &amp; Development</option>
                      <option value="it-consulting">IT Consulting</option>
                      <option value="mobile-apps">Mobile App Development</option>
                      <option value="intern-training">Intern Training</option>
                      <option value="not-sure">Not sure yet</option>
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-codemate-subtext text-xs pointer-events-none">▾</span>
                  </div>
                </FieldWrapper>

                <FieldWrapper label="Budget">
                  <div className="relative">
                    <select name="budget" value={form.budget} onChange={handleChange} onBlur={handleBlur} className={`${fieldClass('budget')} appearance-none cursor-pointer`}>
                      <option value="" disabled>Budget range...</option>
                      <option value="under-500">Under $500</option>
                      <option value="500-2000">$500 – $2,000</option>
                      <option value="2000-10000">$2,000 – $10,000</option>
                      <option value="10000+">$10,000+</option>
                      <option value="discuss">Let&apos;s discuss</option>
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-codemate-subtext text-xs pointer-events-none">▾</span>
                  </div>
                </FieldWrapper>
              </div>

              <FieldWrapper label="Message" error={touched.message ? errors.message : undefined}>
                <textarea name="message" value={form.message} onChange={handleChange} onBlur={handleBlur} rows={5} placeholder="Tell us about your project, timeline, and any specific requirements..." className={`${fieldClass('message')} resize-none`} />
              </FieldWrapper>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full mt-2 py-4 rounded-xl font-mono text-sm tracking-[0.25em] uppercase transition-all duration-300 bg-codemate-accent text-white hover:bg-codemate-highlight hover:shadow-[0_0_40px_rgba(46,158,79,0.25)] disabled:opacity-40 disabled:cursor-not-allowed ${shaking ? 'animate-[shake_0.4s_ease]' : ''}`}
                disabled={status === 'sending'}
              >
                {status === 'idle'    && 'Send Message →'}
                {status === 'sending' && 'Sending...'}
                {status === 'error'   && 'Try Again →'}
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── ContactInfoPanel ─────────────────────────────────────────────────────────

function ContactInfoPanel() {
  const settings = readSiteSettings();
  const contacts: ContactItem[] = [
    { icon: Mail, label: 'Email', value: settings.email },
    { icon: Phone, label: 'Phone', value: settings.phone },
    { icon: MapPin, label: 'Location', value: settings.location },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="glass-card rounded-2xl p-6 bg-white">
        <p className="font-mono text-[10px] text-codemate-highlight" style={{ letterSpacing: '0.3em', textTransform: 'uppercase' }}>DIRECT CONTACT</p>
        <div className="flex flex-col gap-4 mt-4">
          {contacts.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <Icon size={15} className="text-codemate-highlight mt-0.5 shrink-0" />
              <div>
                <p className="font-mono text-[9px] text-codemate-subtext uppercase" style={{ letterSpacing: '0.15em' }}>{label}</p>
                <p className="font-mono text-xs text-codemate-text mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="glass-card rounded-2xl p-6 bg-white">
        <p className="font-mono text-[10px] text-codemate-highlight" style={{ letterSpacing: '0.3em', textTransform: 'uppercase' }}>FIND US ONLINE</p>
        <div className="mt-3">
          {socials.map(({ platform, handle }) => (
            <div key={platform} className="flex justify-between items-center py-3 border-b border-codemate-border last:border-0 group cursor-pointer">
              <span className="font-mono text-xs text-codemate-text">{platform}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-codemate-subtext group-hover:text-codemate-highlight transition-colors duration-200">{handle}</span>
                <span className="text-codemate-highlight opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="glass-card rounded-2xl p-6 bg-white">
        <p className="font-mono text-[10px] text-codemate-highlight" style={{ letterSpacing: '0.3em', textTransform: 'uppercase' }}>OFFICE HOURS</p>
        <div className="mt-3">
          {hours.map(({ day, time }) => (
            <div key={day} className="flex justify-between py-2.5 border-b border-codemate-border last:border-0">
              <span className="font-mono text-xs text-codemate-subtext">{day}</span>
              <span className="font-mono text-xs text-codemate-text">{time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactBody() {
  return (
    <section className="py-16 px-6 md:px-16 lg:px-24 bg-codemate-bg">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12">
        <ContactForm />
        <ContactInfoPanel />
      </div>
    </section>
  );
}

function MapSection() {
  return (
    <section className="py-20 bg-codemate-bg" style={{ borderTop: '1px solid rgba(26,92,42,0.08)', borderBottom: '1px solid rgba(26,92,42,0.08)' }}>
      <h2 className="font-display text-3xl md:text-4xl text-codemate-text text-center px-6">Find us in Kigali, Rwanda.</h2>
      <div className="glass-card rounded-2xl overflow-hidden mx-6 md:mx-16 lg:mx-24 mt-10 h-64 md:h-80 bg-white">
        <svg viewBox="0 0 900 320" className="w-full h-full" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <rect width="900" height="320" fill="#f8faf8" />
          {[40,80,120,160,200,240,280].map((y) => <line key={`h${y}`} x1="0" y1={y} x2="900" y2={y} stroke="#1a5c2a" strokeOpacity="0.08" strokeWidth="1" />)}
          {[75,150,225,300,375,450,525,600,675,750,825].map((x) => <line key={`v${x}`} x1={x} y1="0" x2={x} y2="320" stroke="#1a5c2a" strokeOpacity="0.08" strokeWidth="1" />)}
          <rect x="80" y="50" width="120" height="60" fill="#1a5c2a" fillOpacity="0.06" rx="2" />
          <rect x="230" y="90" width="80" height="90" fill="#1a5c2a" fillOpacity="0.06" rx="2" />
          <rect x="350" y="40" width="140" height="50" fill="#1a5c2a" fillOpacity="0.06" rx="2" />
          <line x1="0" y1="160" x2="900" y2="160" stroke="#1a5c2a" strokeOpacity="0.15" strokeWidth="2" />
          <line x1="450" y1="0" x2="450" y2="320" stroke="#1a5c2a" strokeOpacity="0.15" strokeWidth="2" />
          <g transform="translate(450, 155)">
            <circle r="10" fill="rgba(46,158,79,0.15)" />
            <circle r="5" fill="#2e9e4f" />
            <text y="22" textAnchor="middle" fill="#1a5c2a" fontSize="8" fontFamily="monospace" letterSpacing="2" style={{ textTransform: 'uppercase' }}>CODEMATE HQ</text>
          </g>
          <text x="880" y="310" textAnchor="end" fill="#1a5c2a" fillOpacity="0.5" fontSize="9" fontFamily="monospace">1.9441° S, 30.0619° E</text>
        </svg>
      </div>
    </section>
  );
}

function ContactFooterCta() {
  return (
    <section className="py-20 px-6 md:px-16 lg:px-24 mb-16 bg-codemate-bg">
      <div className="max-w-[1400px] mx-auto">
        <motion.div className="glass-card relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-white p-10 md:p-14 overflow-hidden"
          initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
          <div className="absolute top-0 left-0 w-96 h-96 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top left, rgba(46,158,79,0.07), transparent 70%)' }} />
          <div className="relative z-10">
            <p className="font-display text-3xl md:text-4xl text-codemate-text">No commitments.</p>
            <p className="font-display text-3xl md:text-4xl text-gradient block">Just a conversation.</p>
          </div>
          <div className="relative z-10 flex flex-col gap-3">
            {trust.map((item) => {
              const [tick, ...rest] = item.split('  ');
              return (
                <div key={item} className="flex items-center gap-2 font-mono text-xs tracking-wide text-codemate-subtext">
                  <span className="text-codemate-highlight">{tick}</span>
                  <span>{rest.join('  ')}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function Contact() {
  return (
    <main>
      <ContactHero />
      <ContactBody />
      <MapSection />
      <ContactFooterCta />
    </main>
  );
}
