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

export default function CookiePolicy() {
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
            Cookie Policy
          </h1>
          <p className="font-mono text-xs text-black/40 mt-3">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Divider */}
        <div className="w-16 h-[2px] bg-codemate-bright mb-12" />

        {section('1. What Are Cookies?', (
          <p>
            Cookies are small text files placed on your device when you visit a website. They are
            widely used to make websites work more efficiently and to provide information to the
            site owner. Cookies do not give us access to your device or any information beyond
            what you share with us.
          </p>
        ))}

        {section('2. How We Use Cookies', (
          <>
            <p>CodeMateRwa uses cookies for the following purposes:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li><strong>Essential cookies:</strong> Required for the site to function (e.g., session management for the admin panel).</li>
              <li><strong>Preference cookies:</strong> Remember your choices, such as cookie consent status.</li>
              <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with the site so we can improve it. Data is aggregated and anonymised.</li>
            </ul>
          </>
        ))}

        {section('3. Types of Cookies We Use', (
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-black/10">
                  <th className="text-left py-2 pr-4 font-mono text-codemate-accent">Cookie</th>
                  <th className="text-left py-2 pr-4 font-mono text-codemate-accent">Purpose</th>
                  <th className="text-left py-2 font-mono text-codemate-accent">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                <tr>
                  <td className="py-2 pr-4 font-mono">cmr-cookie-ok</td>
                  <td className="py-2 pr-4">Stores cookie consent decision</td>
                  <td className="py-2">1 year</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-mono">cmr_admin_session</td>
                  <td className="py-2 pr-4">Admin authentication session (HttpOnly)</td>
                  <td className="py-2">7 days</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}

        {section('4. Third-Party Cookies', (
          <p>
            We may use third-party services (such as analytics providers or Cloudinary for image
            delivery) that set their own cookies. We do not control these cookies. Please refer to
            those providers' respective privacy and cookie policies for more information.
          </p>
        ))}

        {section('5. Managing Cookies', (
          <>
            <p>
              You can control and manage cookies in several ways:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>
                <strong>Browser settings:</strong> Most browsers allow you to refuse cookies or
                delete existing ones. Refer to your browser's help documentation for instructions.
              </li>
              <li>
                <strong>Cookie banner:</strong> You can withdraw consent at any time by clearing
                your browser cookies — you will be shown the cookie banner again on your next visit.
              </li>
            </ul>
            <p>
              Please note that disabling certain cookies may affect the functionality of our website.
            </p>
          </>
        ))}

        {section('6. Changes to This Policy', (
          <p>
            We may update this Cookie Policy to reflect changes in the cookies we use or for
            other operational, legal, or regulatory reasons. Check this page periodically for
            the latest information.
          </p>
        ))}

        {section('7. Contact Us', (
          <p>
            If you have questions about our use of cookies, please contact us at{' '}
            <a href="mailto:hello@codematerwa.com" className="text-codemate-accent underline underline-offset-4">
              hello@codematerwa.com
            </a>.
          </p>
        ))}
      </div>
    </motion.main>
  )
}
