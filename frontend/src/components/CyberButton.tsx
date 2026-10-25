import { ReactNode } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

interface CyberButtonProps extends HTMLMotionProps<'button'> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  glow?: boolean
  loading?: boolean
}

export function CyberButton({
  children,
  variant = 'primary',
  glow = true,
  loading = false,
  className = '',
  ...props
}: CyberButtonProps) {
  const variants = {
    primary:
      'bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/30',
    secondary:
      'bg-black/40 border-white/20 text-gray-300 hover:bg-white/10 hover:text-white',
    ghost: 'bg-transparent border-transparent text-gray-400 hover:text-cyan-400',
    danger: 'bg-red-900/20 border-red-500/50 text-red-400 hover:bg-red-900/40',
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      disabled={loading || props.disabled}
      className={`px-4 py-2 rounded-md border font-mono text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${glow ? 'shadow-cyan-glow' : ''} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          Processing...
        </span>
      ) : (
        children
      )}
    </motion.button>
  )
}
