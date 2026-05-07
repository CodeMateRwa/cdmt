import { motion } from 'framer-motion'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const section = (title: string, content: React.ReactNode) => (
  <section className="mb-12">
    <h2
      className="font-display font-bold text-codemate-accent mb-4"
      style={{ fontSize: 'clamp(1.1rem, 3vw, 1.4rem)' }}
    >
      {title}
    </h2>
    <div className="font-sans text-sm text-black/65 leading-relaxed space-y-3">
      {content}
    </div>
  </section>
)

export default function PrivacyPolicy() {
  return (
    <motion.main
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="min-h-screen bg-[#f6f7f3] pt-32 pb-24 px-6 md:px-16 lg:px-24"
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p
            className="font-mono uppercase text-codemate-bright mb-3"
            style={{ fontSize: '11px', letterSpacing: '0.3em' }}
          >
            Legal
          </p>
          <h1
            className="font-display font-black text-codemate-accent leading-tight"
            style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)' }}
          >
            Privacy Policy
          </h1>
          <p className="font-mono text-xs text-black/40 mt-3">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Divider */}
        <div className="w-16 h-[2px] bg-codemate-bright mb-12" />

        {section('1. Introduction', (
          <>
            <p>
              Welcome to CodeMateRwa ("Company", "we", "our", "us"). This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you visit our website
              at <span className="text-codemate-accent font-medium">codematerwa.com</span>.
            </p>
            <p>
              Please read this policy carefully. If you disagree with its terms, please discontinue use
              of our site immediately.
            </p>
          </>
        ))}

        {section('2. Information We Collect', (
          <>
            <p>We may collect information about you in a variety of ways:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li><strong>Personal Data:</strong> Name, email address, phone number, and other information you voluntarily provide via our contact or application forms.</li>
              <li><strong>Usage Data:</strong> Browser type, operating system, referring URLs, page views, and time spent on pages.</li>
              <li><strong>Cookies & Tracking:</strong> Small data files stored on your device. See our Cookie Policy for details.</li>
            </ul>
          </>
        ))}

        {section('3. How We Use Your Information', (
          <>
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Respond to your inquiries and service requests</li>
              <li>Process internship or training applications</li>
              <li>Send newsletters or updates you've opted into</li>
              <li>Improve and optimise our website experience</li>
              <li>Comply with legal obligations</li>
            </ul>
          </>
        ))}

        {section('4. Sharing Your Information', (
          <>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may share
              data with trusted service providers (hosting, analytics, email delivery) who assist in
              operating our site, strictly under confidentiality agreements.
            </p>
            <p>
              We may disclose your information when required by law or to protect the rights, property,
              or safety of CodeMateRwa, our clients, or others.
            </p>
          </>
        ))}

        {section('5. Data Retention', (
          <p>
            We retain your personal data only as long as necessary to fulfil the purposes outlined
            in this policy, or as required by law. Contact form submissions and applications are
            typically retained for up to 24 months.
          </p>
        ))}

        {section('6. Your Rights', (
          <>
            <p>Depending on your location, you may have the right to:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Access the personal data we hold about you</li>
              <li>Request correction or deletion of your data</li>
              <li>Object to or restrict our processing of your data</li>
              <li>Data portability</li>
            </ul>
            <p>
              To exercise any of these rights, contact us at{' '}
              <a href="mailto:hello@codematerwa.com" className="text-codemate-accent underline underline-offset-4">
                hello@codematerwa.com
              </a>.
            </p>
          </>
        ))}

        {section('7. Security', (
          <p>
            We implement industry-standard security measures to protect your information. However,
            no method of transmission over the internet is 100% secure and we cannot guarantee
            absolute security.
          </p>
        ))}

        {section('8. Changes to This Policy', (
          <p>
            We may update this Privacy Policy from time to time. The updated version will be
            indicated by a revised "Last updated" date. We encourage you to review this policy
            periodically.
          </p>
        ))}

        {section('9. Contact Us', (
          <p>
            Questions about this Privacy Policy? Reach us at{' '}
            <a href="mailto:hello@codematerwa.com" className="text-codemate-accent underline underline-offset-4">
              hello@codematerwa.com
            </a>{' '}
            or visit our <a href="/contact" className="text-codemate-accent underline underline-offset-4">Contact page</a>.
          </p>
        ))}
      </div>
    </motion.main>
  )
}
