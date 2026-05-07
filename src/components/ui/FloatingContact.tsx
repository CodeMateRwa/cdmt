import { motion, AnimatePresence } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { MessageSquare } from 'lucide-react'

export default function FloatingContact() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const visible = pathname !== '/contact'

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const, delay: 1 }}
          onClick={() => navigate('/contact')}
          className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-50
            flex items-center gap-2.5 px-5 py-3 rounded-full
            bg-codemate-accent text-white
            hover:bg-codemate-highlight
            transition-all duration-300 group"
          style={{ boxShadow: '0 4px 24px rgba(26,92,42,0.35)' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full bg-codemate-accent animate-ping opacity-20 group-hover:opacity-0" />
          <MessageSquare size={15} className="flex-shrink-0" />
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase whitespace-nowrap">
            Let's Talk
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
