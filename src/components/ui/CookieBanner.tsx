import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie } from 'lucide-react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cmr-cookie-consent')
    if (!consent) {
      const t = setTimeout(() => setVisible(true), 3000)
      return () => clearTimeout(t)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('cmr-cookie-consent', 'accepted')
    setVisible(false)
  }
  const decline = () => {
    localStorage.setItem('cmr-cookie-consent', 'declined')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0,   opacity: 1 }}
          exit={{    y: 120, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
          className="fixed bottom-24 md:bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-[150]"
        >
          <div
            className="glass-card p-5"
            style={{ boxShadow: '0 8px 40px rgba(26,92,42,0.15)' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Cookie size={14} className="text-codemate-highlight flex-shrink-0" />
              <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-codemate-accent">
                Cookie Preferences
              </span>
            </div>

            <p className="font-sans text-xs text-codemate-subtext leading-relaxed">
              We use cookies to improve your experience and analyze site traffic.
              No data is sold to third parties.
            </p>

            <button className="font-mono text-[10px] text-codemate-highlight underline underline-offset-4 mt-1 hover:opacity-70 transition-opacity">
              Privacy Policy
            </button>

            <div className="flex gap-2 mt-4">
              <button
                onClick={accept}
                className="flex-1 py-2 rounded-xl bg-codemate-accent text-white font-mono text-[11px] tracking-widest uppercase hover:bg-codemate-highlight transition-colors duration-300"
              >
                Accept
              </button>
              <button
                onClick={decline}
                className="flex-1 py-2 rounded-xl border border-codemate-border text-codemate-subtext font-mono text-[11px] tracking-widest uppercase hover:border-codemate-accent hover:text-codemate-accent transition-all duration-300"
              >
                Decline
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
