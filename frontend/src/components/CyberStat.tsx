import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface CyberStatProps {
  label: string
  value: string | number
  icon?: ReactNode
  accent?: 'cyan' | 'violet' | 'green'
}

export function CyberStat({ label, value, icon, accent = 'cyan' }: CyberStatProps) {
  const accentColors = {
    cyan: 'text-cyan-400',
    violet: 'text-violet-400',
    green: 'text-cyberGreen',
  }

  return (
    <div className="rounded-lg border border-white/10 bg-black/40 backdrop-blur p-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-wider text-gray-500">
          {label}
        </span>
        {icon && <span className="text-gray-400">{icon}</span>}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mt-2 font-mono text-3xl font-bold ${accentColors[accent]}`}
      >
        {value}
      </motion.div>
    </div>
  )
}