'use client'

export default function GrainOverlay() {
  return (
    <div className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden opacity-[0.03]">
      <div 
        className="absolute inset-[-200%] w-[400%] h-[400%] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] animate-grain"
      />
    </div>
  )
}
