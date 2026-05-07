import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

type Props = { onDone: () => void }

const tagline = 'Empowering Digital Life Innovation'

export default function SplashScreen({ onDone }: Props) {
  const [charCount, setCharCount] = useState(0)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    // Start typewriter at 700ms
    timers.push(
      setTimeout(() => {
        let count = 0
        const interval = setInterval(() => {
          count++
          setCharCount(count)
          if (count >= tagline.length) clearInterval(interval)
        }, 35)
        timers.push(interval as unknown as ReturnType<typeof setTimeout>)
      }, 700),
    )

    // Start exit wipe at 2200ms
    timers.push(setTimeout(() => setExiting(true), 2200))

    // Call onDone at 2700ms
    timers.push(setTimeout(() => onDone(), 2700))

    return () => timers.forEach(t => clearTimeout(t))
  }, [onDone])

  return (
    <motion.div
      className="fixed inset-0 z-[9999] overflow-hidden"
      style={{ backgroundColor: '#1a5c2a' }}
      animate={exiting ? { y: '-100%' } : { y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 1, 1] as const }}
    >
      {/* Ghost Logo watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{ zIndex: 0 }}
      >
        <img
          src="/logo.jpg"
          alt=""
          className="w-full max-w-[80vw] object-contain"
          style={{
            filter: 'brightness(0) invert(1)',
            opacity: 0.03,
          }}
        />
      </div>

      {/* Radial glows */}
      <div
        className="absolute top-0 left-0 w-[600px] h-[600px] pointer-events-none blur-3xl"
        style={{ background: 'radial-gradient(ellipse at top left, rgba(76,205,110,0.08), transparent 70%)' }}
      />
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none blur-3xl"
        style={{ background: 'radial-gradient(ellipse at bottom right, rgba(76,205,110,0.05), transparent 70%)' }}
      />

      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center flex-col" style={{ zIndex: 10 }}>
        {/* Logo */}
        <motion.img
          src="/logo.jpg"
          alt="CodeMateRwa"
          className="h-20 w-auto object-contain"
          style={{ filter: 'brightness(0) invert(1)' }}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          onError={(e) => {
            // Fallback if logo.jpg not found — show text
            e.currentTarget.style.display = 'none'
          }}
        />

        {/* Fallback text logo */}
        <motion.div
          className="font-display text-white font-black"
          style={{ fontSize: '3rem', letterSpacing: '-0.02em' }}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
        >
          CodeMate<span style={{ color: '#4ccd6e' }}>Rwa</span>
        </motion.div>

        {/* Tagline typewriter */}
        <p
          className="font-mono uppercase mt-4 h-4"
          style={{
            fontSize: '11px',
            letterSpacing: '0.3em',
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          {tagline.slice(0, charCount)}
          <span
            className="animate-pulse"
            style={{ color: '#4ccd6e' }}
          >|</span>
        </p>
      </div>

      {/* Progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px]"
        style={{ backgroundColor: '#4ccd6e' }}
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{ duration: 0.4, delay: 1.8, ease: 'easeInOut' }}
      />
    </motion.div>
  )
}
