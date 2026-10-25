import { InputHTMLAttributes, forwardRef } from 'react'

export const CyberInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`bg-black/40 border border-white/10 rounded-md px-3 py-2 font-mono text-sm text-gray-200 placeholder-gray-500 focus:border-cyan-400/50 focus:shadow-cyan-glow transition-colors ${className}`}
        {...props}
      />
    )
  }
)

CyberInput.displayName = 'CyberInput'