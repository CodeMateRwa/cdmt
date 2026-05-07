import { motion } from 'framer-motion'

const variants = {
  initial: { opacity: 0, y: 18, filter: 'blur(4px)' },
  enter: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] },
  },
  exit: {
    opacity: 0, y: -10, filter: 'blur(2px)',
    transition: { duration: 0.3, ease: [0.4, 0, 1, 1] as [number,number,number,number] },
  },
}

export default function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      {children}
    </motion.div>
  )
}
