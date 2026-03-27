// Scroll-triggered entrance animation wrapper powered by framer-motion
// Usage: <Reveal direction="up" delay={0.1}><SomeContent /></Reveal>
import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
  duration?: number
  className?: string
}

const directionVariants: Record<string, Variants> = {
  up:    { hidden: { opacity: 0, y: 48 },  visible: { opacity: 1, y: 0 } },
  down:  { hidden: { opacity: 0, y: -48 }, visible: { opacity: 1, y: 0 } },
  left:  { hidden: { opacity: 0, x: 48 },  visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: -48 }, visible: { opacity: 1, x: 0 } },
}

export function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  className,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration, ease: 'easeOut', delay }}
      variants={directionVariants[direction]}
    >
      {children}
    </motion.div>
  )
}
