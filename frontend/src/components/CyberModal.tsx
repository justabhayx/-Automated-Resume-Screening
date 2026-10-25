import { ReactNode, useEffect, MouseEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CyberModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function CyberModal({ isOpen, onClose, title, children }: CyberModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleModalClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-2xl max-h-[85vh] overflow-auto rounded-lg border border-cyan-500/30 bg-gradient-to-br from-black/95 to-black/80 backdrop-blur-xl shadow-cyan-glow"
            onClick={handleModalClick}
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-white/10 bg-black/80 px-6 py-4">
              <h3 className="font-mono text-lg font-bold text-cyan-400">{title}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-cyan-400 transition-colors text-xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}