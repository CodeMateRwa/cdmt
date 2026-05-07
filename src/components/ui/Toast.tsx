import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { registerToastSetter, type Toast as ToastItem } from '../../hooks/useToast'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

const icons = {
  success: <CheckCircle size={15} className="text-codemate-bright flex-shrink-0" />,
  error:   <XCircle    size={15} className="text-red-400    flex-shrink-0" />,
  info:    <Info       size={15} className="text-blue-400   flex-shrink-0" />,
}

const borders = {
  success: 'border-codemate-bright/30',
  error:   'border-red-400/30',
  info:    'border-blue-400/30',
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    registerToastSetter(setToasts)
  }, [])

  return (
    <div className="fixed top-20 right-4 md:right-6 z-[200] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, x: 60,  scale: 0.95 }}
            animate={{ opacity: 1, x: 0,   scale: 1    }}
            exit={{    opacity: 0, x: 60,   scale: 0.92 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
            className={`pointer-events-auto glass-card border ${borders[t.type]} px-4 py-3 flex items-center gap-3`}
            style={{ boxShadow: '0 4px 20px rgba(26,92,42,0.12)' }}
          >
            {icons[t.type]}
            <span className="font-sans text-sm text-codemate-text leading-snug flex-1">
              {t.message}
            </span>
            <button
              onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
              className="text-codemate-subtext hover:text-codemate-accent transition-colors duration-200 flex-shrink-0"
            >
              <X size={13} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
