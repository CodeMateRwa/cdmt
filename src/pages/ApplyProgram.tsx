import {
  useState,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
  type ReactNode,
} from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeDollarSign,
  CalendarRange,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Layers3,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';
import { toast } from '../hooks/useToast';
import { apiClient } from '../lib/api';
import { unsplash } from '../lib/images';
import {
  getProgramDefinition,
  getProgramPricing,
  type ProgramKey,
} from '../lib/programs';

interface ApplyProgramProps {
  programKey: ProgramKey;
}

type ApplyFormData = {
  availability: string;
  background: string;
  email: string;
  goals: string;
  name: string;
};

type ApplyFormErrors = Partial<Record<keyof ApplyFormData, string>>;
type ApplyStatus = 'idle' | 'sending' | 'sent' | 'error';

const availabilityOptions = [
  'Ready this month',
  'Next 30 days',
  'Next quarter',
  'Need guidance first',
];

function validateApplication(form: ApplyFormData): ApplyFormErrors {
  const errors: ApplyFormErrors = {};

  if (!form.name.trim()) errors.name = 'Full name is required.';
  if (!form.email.trim()) errors.email = 'Email address is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email address.';
  }
  if (!form.background.trim()) {
    errors.background = 'Share a quick background summary.';
  } else if (form.background.trim().length < 20) {
    errors.background = 'Add at least a short summary of your background.';
  }
  if (!form.goals.trim()) {
    errors.goals = 'Tell us what you want from the program.';
  } else if (form.goals.trim().length < 20) {
    errors.goals = 'Please add a bit more detail about your goals.';
  }
  if (!form.availability) errors.availability = 'Choose your expected start window.';

  return errors;
}

function FieldShell({
  children,
  error,
  label,
}: {
  children: ReactNode;
  error?: string;
  label: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error ? (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.2 }}
            className="text-[11px] text-red-200"
          >
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function ApplicationPanel({
  price,
  priceNote,
  programKey,
  title,
}: {
  price: string;
  priceNote: string;
  programKey: ProgramKey;
  title: string;
}) {
  const [form, setForm] = useState<ApplyFormData>({
    availability: '',
    background: '',
    email: '',
    goals: '',
    name: '',
  });
  const [errors, setErrors] = useState<ApplyFormErrors>({});
  const [status, setStatus] = useState<ApplyStatus>('idle');
  const [touched, setTouched] = useState<Partial<Record<keyof ApplyFormData, boolean>>>({});

  const inputClass =
    'application-panel-field w-full rounded-2xl border border-white/12 bg-white/8 px-4 py-3 sm:py-3.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/32 focus:border-codemate-bright';

  const fieldClass = (field: keyof ApplyFormData) =>
    inputClass +
    (errors[field] && touched[field]
      ? ' border-red-300/70 focus:border-red-300'
      : '');

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    const nextForm = { ...form, [name]: value };
    setForm(nextForm);

    if (touched[name as keyof ApplyFormData]) {
      setErrors(validateApplication(nextForm));
    }
  };

  const handleBlur = (
    event: FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validateApplication(form));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const touchedFields = Object.fromEntries(
      Object.keys(form).map((key) => [key, true]),
    ) as Partial<Record<keyof ApplyFormData, boolean>>;
    const nextErrors = validateApplication(form);

    setTouched(touchedFields);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setStatus('sending');

    try {
      await apiClient.createMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        service: `apply-${programKey}`,
        budget: form.availability,
        message: [
          `Program: ${title}`,
          `Availability: ${form.availability}`,
          '',
          'Background:',
          form.background.trim(),
          '',
          'Goals:',
          form.goals.trim(),
        ].join('\n'),
      });

      setStatus('sent');
      toast("Application received. We'll follow up soon.", 'success');
    } catch {
      setStatus('error');
      toast('Something went wrong. Please try again.', 'error');
    }
  };

  return (
    <motion.aside
      className="glass-card-dark rounded-[30px] p-5 text-white sm:p-6 md:sticky md:top-28 md:p-8"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-codemate-bright/80">
            Current Price
          </p>
          <p className="mt-3 font-display text-4xl text-white md:text-5xl">
            {price}
          </p>
          <p className="mt-2 text-sm text-white/65">{priceNote}</p>
        </div>
        <div className="rounded-full border border-white/15 bg-white/10 p-3 text-codemate-bright">
          <BadgeDollarSign size={24} />
        </div>
      </div>

      <div className="mt-8 rounded-[24px] border border-white/10 bg-black/10 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-codemate-bright">
            <Sparkles size={18} />
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/45">
              What happens next
            </p>
            <p className="mt-1 text-sm text-white/75">
              Share your details here and we will review your fit before reaching
              out with the next step.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <AnimatePresence mode="wait">
          {status === 'sent' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="rounded-[26px] border border-white/12 bg-white/8 p-6 text-center"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-codemate-bright/40 bg-codemate-bright/10 text-codemate-bright">
                <CheckCircle2 size={24} />
              </div>
              <p className="mt-5 font-display text-2xl text-white">
                Application received.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/65">
                We saved your submission and will follow up with the right next
                step for this program.
              </p>
              <button
                type="button"
                onClick={() => {
                  setStatus('idle');
                  setForm({
                    availability: '',
                    background: '',
                    email: '',
                    goals: '',
                    name: '',
                  });
                  setErrors({});
                  setTouched({});
                }}
                className="mt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-codemate-bright"
              >
                Submit another application
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              noValidate
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-5 sm:space-y-6"
            >
              <div>
                <p className="font-display text-2xl text-white">Quick application</p>
                <p className="mt-1 text-sm text-white/60">
                  This sends your details straight to the team inbox.
                </p>
              </div>

              <FieldShell label="Full Name" error={touched.name ? errors.name : undefined}>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Your full name"
                  className={fieldClass('name')}
                />
              </FieldShell>

              <FieldShell label="Email" error={touched.email ? errors.email : undefined}>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="you@example.com"
                  className={fieldClass('email')}
                />
              </FieldShell>

              <FieldShell
                label="Background"
                error={touched.background ? errors.background : undefined}
              >
                <textarea
                  name="background"
                  value={form.background}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={3}
                  placeholder="Tell us about your current experience, skills, or team context."
                  className={`${fieldClass('background')} resize-none min-h-[100px]`}
                />
              </FieldShell>

              <FieldShell
                label="Program Goals"
                error={touched.goals ? errors.goals : undefined}
              >
                <textarea
                  name="goals"
                  value={form.goals}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={3}
                  placeholder="What do you want to achieve by the end of this program?"
                  className={`${fieldClass('goals')} resize-none min-h-[100px]`}
                />
              </FieldShell>

              <FieldShell
                label="Preferred Start Window"
                error={touched.availability ? errors.availability : undefined}
              >
                <div className="relative">
                  <select
                    name="availability"
                    value={form.availability}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${fieldClass('availability')} appearance-none cursor-pointer`}
                  >
                    <option value="" disabled>
                      Choose a start window
                    </option>
                    {availabilityOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/45">
                    v
                  </span>
                </div>
              </FieldShell>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="flex w-full items-center justify-center gap-3 rounded-full bg-white px-6 py-4 sm:py-4 md:py-4 font-mono text-xs uppercase tracking-[0.22em] text-codemate-accent transition-all duration-300 hover:bg-codemate-bright hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
                disabled={status === 'sending'}
              >
                {status === 'idle' && 'Send Application'}
                {status === 'sending' && 'Sending...'}
                {status === 'error' && 'Try Again'}
                <ArrowRight size={16} />
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 border-t border-white/10 pt-6">
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-codemate-bright"
        >
          Need a longer conversation?
          <ArrowRight size={14} />
        </Link>
      </div>
    </motion.aside>
  );
}

export default function ApplyProgram({ programKey }: ApplyProgramProps) {
  const program = getProgramDefinition(programKey);
  const pricing = getProgramPricing(programKey);

  return (
    <main id="top" className="bg-codemate-bg">
      <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="absolute inset-0">
          <img
            src={unsplash(1800, 1000, program.heroKeywords, program.heroSig)}
            alt={program.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(112deg,rgba(8,20,12,0.95),rgba(17,64,35,0.84),rgba(8,20,12,0.48))]" />
        </div>
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative z-10 mx-auto grid max-w-[1400px] gap-8 sm:gap-10 px-6 md:px-16 lg:grid-cols-[1.15fr_0.85fr] lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.35em] text-codemate-bright">
              {program.eyebrow}
            </p>
            <h1 className="max-w-3xl font-display text-4xl leading-tight text-white md:text-6xl">
              {program.title}
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/72 md:text-base">
              {program.summary}
            </p>

            <div className="mt-8 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <div className="glass-card-dark p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-codemate-bright/80">
                  Duration
                </p>
                <p className="mt-2 text-lg text-white">{program.duration}</p>
              </div>
              <div className="glass-card-dark p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-codemate-bright/80">
                  Format
                </p>
                <p className="mt-2 text-lg text-white">{program.schedule}</p>
              </div>
              <div className="glass-card-dark p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-codemate-bright/80">
                  Best For
                </p>
                <p className="mt-2 text-lg text-white">{program.audience}</p>
              </div>
            </div>

            <div className="mt-10 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {program.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-[24px] border border-white/10 bg-white/8 p-5 backdrop-blur-md"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/48">
                    {metric.label}
                  </p>
                  <p className="mt-3 font-display text-2xl text-white">
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <ApplicationPanel
            price={pricing.price}
            priceNote={pricing.priceNote}
            programKey={programKey}
            title={program.title}
          />
        </div>
      </section>

      <section className="relative overflow-hidden px-6 py-16 sm:py-20 md:px-16 md:py-24 lg:px-24">
        <div className="mx-auto grid max-w-[1400px] gap-8 lg:grid-cols-[0.84fr_1.16fr]">
          <motion.div
            className="overflow-hidden rounded-[28px] border border-codemate-border bg-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <img
              src={unsplash(1000, 1200, program.showcaseKeywords, program.showcaseSig)}
              alt={`${program.title} showcase`}
              className="h-full min-h-[360px] w-full object-cover"
            />
          </motion.div>

          <div className="grid gap-8">
            <motion.div
              className="glass-card rounded-[28px] p-6 sm:p-8"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-codemate-highlight">
                [ What You Get ]
              </p>
              <h2 className="mt-3 max-w-3xl font-display text-3xl text-codemate-accent md:text-5xl">
                Built to turn learning into visible progress.
              </h2>
              <div className="mt-8 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {program.features.map((feature, index) => {
                  const icons = [Layers3, Users, Target];
                  const Icon = icons[index] ?? GraduationCap;

                  return (
                    <div
                      key={feature.title}
                      className="rounded-2xl border border-codemate-border bg-white/85 p-5"
                    >
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-codemate-accent/10 text-codemate-accent">
                        <Icon size={20} />
                      </div>
                      <p className="font-display text-xl text-codemate-accent">
                        {feature.title}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-codemate-subtext">
                        {feature.detail}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.55,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.05,
              }}
            >
              {program.outcomes.map((outcome) => (
                <div key={outcome} className="glass-card rounded-[24px] p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-codemate-highlight/12 text-codemate-highlight">
                    <GraduationCap size={20} />
                  </div>
                  <p className="mt-5 text-sm leading-relaxed text-codemate-subtext">
                    {outcome}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16 sm:py-20 md:px-16 md:py-24 lg:px-24">
        <div className="mx-auto grid max-w-[1400px] gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <motion.div
            className="glass-card rounded-[28px] p-6 sm:p-8"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-codemate-highlight">
              [ Application Flow ]
            </p>
            <h2 className="mt-3 font-display text-3xl text-codemate-accent md:text-5xl">
              Clear steps from interest to kickoff.
            </h2>

            <div className="mt-8 space-y-3 sm:space-y-4">
              {program.steps.map((step, index) => (
                <div
                  key={step}
                  className="rounded-[24px] border border-codemate-border bg-codemate-bg p-4 sm:p-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-codemate-accent text-sm font-mono text-white">
                      0{index + 1}
                    </div>
                    <CalendarRange size={18} className="text-codemate-highlight" />
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-codemate-subtext">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="glass-card rounded-[28px] p-6 sm:p-8"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.55,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.05,
            }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-codemate-highlight">
              [ Good Fit ]
            </p>
            <h2 className="mt-3 font-display text-3xl text-codemate-accent md:text-5xl">
              Best results come from aligned expectations.
            </h2>

            <div className="mt-8 grid gap-3 sm:gap-4">
              {program.fitPoints.map((point, index) => {
                const icons = [Clock3, CheckCircle2, Users];
                const Icon = icons[index] ?? CheckCircle2;

                return (
                  <div
                    key={point}
                    className="flex items-start gap-3 sm:gap-4 rounded-[24px] border border-codemate-border bg-codemate-bg p-4 sm:p-5"
                  >
                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-codemate-accent/10 text-codemate-accent">
                      <Icon size={18} />
                    </div>
                    <p className="text-sm leading-relaxed text-codemate-subtext">
                      {point}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 rounded-[24px] bg-codemate-accent p-5 sm:p-6 text-white">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-codemate-bright/80">
                Need clarity first?
              </p>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/72">
                If you are not sure whether this is the right path, send the quick
                application anyway. We can help you choose the better fit before
                anything moves forward.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-6 py-16 sm:py-20 md:px-16 md:py-24 lg:px-24">
        <div className="mx-auto max-w-[1400px]">
          <motion.div
            className="mb-10 max-w-3xl"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-codemate-highlight">
              [ FAQs ]
            </p>
            <h2 className="mt-3 font-display text-3xl text-codemate-accent md:text-5xl">
              Practical answers before you apply.
            </h2>
          </motion.div>

          <div className="grid gap-3 sm:gap-4 lg:grid-cols-3">
            {program.faqs.map((faq, index) => (
              <motion.article
                key={faq.question}
                className="glass-card rounded-[24px] p-5 sm:p-6"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                  delay: index * 0.05,
                }}
              >
                <p className="font-display text-2xl text-codemate-accent">
                  {faq.question}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-codemate-subtext">
                  {faq.answer}
                </p>
              </motion.article>
            ))}
          </div>

          <motion.div
            className="glass-card relative mt-10 overflow-hidden rounded-[30px] bg-white p-6 sm:p-8 md:p-10"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="absolute inset-y-0 right-0 hidden w-1/2 md:block"
              style={{
                background:
                  'radial-gradient(circle at top right, rgba(76,205,110,0.18), transparent 62%)',
              }}
            />
            <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-codemate-highlight">
                  [ Ready To Start ]
                </p>
                <h2 className="mt-3 font-display text-3xl text-codemate-accent md:text-5xl">
                  Apply now, or talk it through with the team.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-codemate-subtext md:text-base">
                  The quick application keeps momentum moving. If you need a longer
                  conversation first, the contact page is still there for a full
                  discussion.
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <a
                  href="#top"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-codemate-accent px-6 py-3.5 sm:py-3 font-mono text-xs uppercase tracking-[0.22em] text-white transition-all duration-300 hover:bg-codemate-highlight"
                >
                  Back to application
                  <ArrowRight size={16} />
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-3 rounded-full border border-codemate-border px-6 py-3.5 sm:py-3 font-mono text-xs uppercase tracking-[0.22em] text-codemate-accent transition-all duration-300 hover:border-codemate-highlight hover:text-codemate-highlight"
                >
                  Contact the team
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
