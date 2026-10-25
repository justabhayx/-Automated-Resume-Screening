export function CyberLoader({ message = 'Screening candidates...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30" />
        <div className="absolute inset-0 rounded-full border-2 border-t-cyan-400 border-r-violet-400 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-3 w-3 rounded-full bg-cyan-400 shadow-cyan-glow animate-pulse" />
        </div>
      </div>
      <p className="mt-4 font-mono text-sm text-gray-400 animate-pulse">{message}</p>
    </div>
  )
}