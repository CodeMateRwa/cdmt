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

export default function TermsOfService() {
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
            Terms of Service
          </h1>
          <p className="font-mono text-xs text-black/40 mt-3">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Divider */}
        <div className="w-16 h-[2px] bg-codemate-bright mb-12" />

        {section('1. Acceptance of Terms', (
          <p>
            By accessing or using the CodeMateRwa website at{' '}
            <span className="text-codemate-accent font-medium">codematerwa.com</span>, you agree
            to be bound by these Terms of Service and all applicable laws and regulations. If you
            do not agree, please do not use our site.
          </p>
        ))}

        {section('2. Use of the Site', (
          <>
            <p>You agree to use this site only for lawful purposes and in a way that does not:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Infringe the rights of any third party</li>
              <li>Transmit unsolicited or unauthorised advertising material</li>
              <li>Attempt to gain unauthorised access to any part of the site or its related systems</li>
              <li>Introduce viruses, trojans, or other harmful material</li>
            </ul>
          </>
        ))}

        {section('3. Intellectual Property', (
          <p>
            All content on this site — including text, graphics, logos, icons, images, and software —
            is the property of CodeMateRwa or its content suppliers and is protected by applicable
            intellectual property laws. Reproduction or redistribution without express written
            permission is prohibited.
          </p>
        ))}

        {section('4. Services & Engagements', (
          <>
            <p>
              Any services discussed or initiated through this website (web development, branding,
              digital marketing, training programmes, etc.) are subject to separate service agreements
              or contracts signed between CodeMateRwa and the client.
            </p>
            <p>
              Inquiries submitted via the contact form do not constitute a binding contract or
              guarantee of service delivery.
            </p>
          </>
        ))}

        {section('5. Training & Internship Applications', (
          <p>
            Submitting an application through our site does not guarantee acceptance into any
            programme. We reserve the right to accept or decline applications at our sole
            discretion. Accepted participants will receive a separate programme agreement.
          </p>
        ))}

        {section('6. Disclaimer of Warranties', (
          <p>
            This site is provided on an "as is" and "as available" basis without warranties of any
            kind, express or implied. CodeMateRwa does not warrant that the site will be
            uninterrupted, error-free, or free of viruses.
          </p>
        ))}

        {section('7. Limitation of Liability', (
          <p>
            To the fullest extent permitted by law, CodeMateRwa shall not be liable for any
            indirect, incidental, special, or consequential damages arising from your use of — or
            inability to use — this site or its content.
          </p>
        ))}

        {section('8. Third-Party Links', (
          <p>
            Our site may contain links to third-party websites. These links are provided for
            convenience only. CodeMateRwa has no control over those sites and accepts no
            responsibility for their content or privacy practices.
          </p>
        ))}

        {section('9. Governing Law', (
          <p>
            These Terms are governed by and construed in accordance with the laws of the Republic
            of Rwanda. Any disputes shall be subject to the exclusive jurisdiction of the courts
            of Kigali, Rwanda.
          </p>
        ))}

        {section('10. Changes to Terms', (
          <p>
            We reserve the right to modify these Terms at any time. Changes take effect immediately
            upon posting. Your continued use of the site constitutes acceptance of the updated Terms.
          </p>
        ))}

        {section('11. Contact', (
          <p>
            Questions about these Terms? Email us at{' '}
            <a href="mailto:hello@codematerwa.com" className="text-codemate-accent underline underline-offset-4">
              hello@codematerwa.com
            </a>.
          </p>
        ))}
      </div>
    </motion.main>
  )
}
