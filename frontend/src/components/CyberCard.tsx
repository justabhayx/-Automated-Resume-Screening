import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface CyberCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: 'cyan' | 'violet' | 'none'
}

export function CyberCard({ children, className = '', hover = true, glow = 'none' }: CyberCardProps) {
  const glowClass = glow === 'cyan' ? 'shadow-cyan-glow' : glow === 'violet' ? 'shadow-violet-glow' : ''

  return (
    <motion.div
      whileHover={hover ? { scale: 1.01 } : undefined}
      className={`rounded-lg border border-white/10 bg-gradient-to-br from-black/80 to-black/40 backdrop-blur-xl ${glowClass} ${className}`}
    >
      {children}
    </motion.div>
  )
}