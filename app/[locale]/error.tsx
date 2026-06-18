'use client'

import { useEffect } from 'react'
import { ShieldAlert, RefreshCw } from 'lucide-react'
import GlitchText from '../../components/ui/GlitchText'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('[NEXUS ANOMALY DETECTED]:', error)
  }, [error])

  return (
    <div className="min-h-[80vh] bg-[#050508] flex items-center justify-center relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center text-center p-8 max-w-2xl w-full glass-surface border border-red-500/20 rounded-2xl">
        <ShieldAlert size={48} className="text-red-500 mb-6 opacity-80 animate-pulse" />
        
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4 tracking-tighter">
          <GlitchText speed={50} className="text-white" text="ANOMALÍA DETECTADA" />
        </h1>
        
        <h2 className="text-sm md:text-base font-mono text-red-400/80 mb-6 uppercase tracking-widest">
          Fallo de renderizado en el cliente
        </h2>
        
        <p className="text-xs font-space text-[var(--color-mist-gray)]/60 mb-10 max-w-md mx-auto leading-relaxed border border-[var(--color-space-border)] p-4 rounded bg-black/50">
          {error.message || 'Se ha producido un error inesperado en el árbol de componentes.'}
        </p>

        <button 
          onClick={() => reset()}
          className="py-4 px-8 rounded flex items-center justify-center font-space tracking-widest text-xs font-bold transition-all relative overflow-hidden group border border-red-500/30 hover:border-red-500"
        >
          <div className="absolute inset-0 bg-red-500 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]" />
          <span className="relative z-10 flex items-center gap-2 group-hover:text-white text-white transition-colors duration-300">
            <RefreshCw size={14} className="group-hover:animate-spin" />
            REINICIAR SISTEMA
          </span>
        </button>
      </div>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[100px] pointer-events-none"></div>
    </div>
  )
}
