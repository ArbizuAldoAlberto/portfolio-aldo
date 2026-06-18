import Link from 'next/link'
import GlitchText from '../../components/ui/GlitchText'
import { AlertCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center relative overflow-hidden font-sans">
      {/* Grid sutil */}
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center text-center p-8 max-w-2xl w-full">
        <AlertCircle size={48} className="text-[var(--color-orbital-teal)] mb-8 opacity-50 animate-pulse" />
        
        <h1 className="text-8xl md:text-9xl font-serif font-bold text-white mb-4 tracking-tighter">
          <GlitchText speed={100} className="text-white" text="404" />
        </h1>
        
        <h2 className="text-xl md:text-2xl font-mono text-[var(--color-mist-gray)] mb-8">
          Señal perdida en el vacío orbital.
        </h2>
        
        <p className="text-sm font-space text-[var(--color-mist-gray)]/60 mb-12 max-w-md mx-auto leading-relaxed">
          La coordenada que intentas alcanzar no existe o ha sido reclasificada. El nodo supervisor NEXUS no puede establecer una conexión.
        </p>

        <Link 
          href="/" 
          className="btn-primary py-4 px-8 rounded flex items-center justify-center font-space tracking-widest text-xs font-bold transition-all relative overflow-hidden group border border-[var(--color-orbital-teal)]/30 hover:border-[var(--color-orbital-teal)]"
        >
          <div className="absolute inset-0 bg-[var(--color-orbital-teal)] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]" />
          <span className="relative z-10 flex items-center gap-2 group-hover:text-black text-white transition-colors duration-300">
            VOLVER AL NODO PRINCIPAL
          </span>
        </Link>
      </div>

      {/* Glow pulsante */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-orbital-teal)]/5 rounded-full blur-[120px] pointer-events-none"></div>
    </div>
  )
}
