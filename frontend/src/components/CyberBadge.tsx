import { ReactNode } from 'react'

interface CyberBadgeProps {
  children: ReactNode
  variant?: 'cyan' | 'violet' | 'green' | 'magenta' | 'gray'
  size?: 'sm' | 'md'
}

export function CyberBadge({ children, variant = 'cyan', size = 'sm' }: CyberBadgeProps) {
  const variants = {
    cyan: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    violet: 'bg-violet-500/10 text-violet-300 border-violet-500/30',
    green: 'bg-green-900/20 text-cyberGreen border-green-500/30',
    magenta: 'bg-magenta-900/20 text-neonMagenta border-magenta-500/30',
    gray: 'bg-gray-800/50 text-gray-400 border-gray-600/30',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  }

  return (
    <span
      className={`inline-flex items-center rounded border font-mono font-medium ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </span>
  )
}