'use client'
import { motion } from 'framer-motion'
import Hero3D from './Hero3D'
import MagneticWrapper from '../ui/MagneticWrapper'

// Animation variants for staggered parent-child revealing
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 70,
      damping: 15
    }
  }
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-10 overflow-hidden bg-[var(--color-space-black)]">
      
      {/* 3D Quantum Reactor Centerpiece: Backing layer on mobile, 50% right column on desktop */}
      <div className="absolute inset-0 md:left-1/2 md:w-1/2 md:h-full z-0 opacity-55 md:opacity-100 mix-blend-screen">
        <Hero3D />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pointer-events-none flex items-center">
        
        {/* Text Container: 60% width with glass holographic frame */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full md:w-[55%] pointer-events-auto glass-surface p-8 md:p-12 rounded-2xl relative border-l-4 border-l-[var(--color-orbital-teal)]/70 backdrop-blur-xl"
        >
          {/* Subtle Grid Pattern Overlay inside container */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] opacity-30 pointer-events-none rounded-2xl"></div>

          {/* 📡 PULSING STATUS BADGE */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[var(--color-space-border)] bg-[var(--color-space-black)]/70 mb-8 w-fit shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
          >
            <span className="flex h-2.5 w-2.5 rounded-full bg-[var(--color-orbital-teal)] relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-orbital-teal)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--color-orbital-teal)]"></span>
            </span>
            <span className="text-[10px] font-space uppercase tracking-widest text-[var(--color-mist-gray)] font-bold">
              Disponible para proyectos — AR / Remote
            </span>
          </motion.div>
          
          {/* 👑 HEADLINE: Elegant classic Serif typography */}
          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-8xl font-serif font-bold tracking-tight mb-6 text-white leading-none"
          >
            Aldo Arbizu
          </motion.h1>
          
          {/* 💻 CONSOLE STATEMENTS: High-impact business value */}
          <motion.div
            variants={itemVariants}
            className="space-y-4 font-mono text-sm md:text-base text-[var(--color-mist-gray)] border-t border-b border-[var(--color-space-border)] py-6 mb-8 bg-[var(--color-space-black)]/40 px-5 rounded-lg shadow-inner"
          >
            <div className="flex items-start gap-3">
              <span className="text-[var(--color-orbital-teal)] font-bold">{"[sys]"}</span>
              <div className="flex flex-col">
                <span className="text-[var(--color-orbital-teal)]">Arquitectura Resiliente (Offline-First)</span>
                <span className="text-white/80 text-xs mt-1">Garantiza el funcionamiento 24/7 sin conexión. Cero pérdida de datos para operaciones críticas en campo.</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[var(--color-electric-purple)] font-bold">{"[sys]"}</span>
              <div className="flex flex-col">
                <span className="text-[var(--color-electric-purple)]">Ingeniería SaaS Multi-Tenant</span>
                <span className="text-white/80 text-xs mt-1">Escalabilidad de nivel corporativo. Una sola base de código para servir a cientos de empresas de forma segura.</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[var(--color-amber-gold)] font-bold">{"[sys]"}</span>
              <div className="flex flex-col">
                <span className="text-[var(--color-amber-gold)]">Diseño 3D & UX de Extremo a Extremo</span>
                <span className="text-white/80 text-xs mt-1">Interfaces que deslumbran y convierten. Desde la idea en Blender hasta el despliegue global.</span>
              </div>
            </div>
          </motion.div>

          {/* 📝 BIO BRIEF */}
          <motion.p
            variants={itemVariants}
            className="text-xs md:text-sm font-space text-[var(--color-mist-gray)]/80 mb-10 leading-relaxed uppercase tracking-wider"
          >
            Product Engineer · React Native Mobile · Fullstack Developer · Antigravity Studio
          </motion.p>
          
          {/* 🚀 ACTION BUTTONS */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-4 relative z-50"
          >
            <MagneticWrapper strength={30}>
              <a href="#projects" className="btn-primary flex items-center gap-2 cursor-none">
                <span>Misiones Completadas</span>
                <span className="font-sans text-xs">→</span>
              </a>
            </MagneticWrapper>
            
            <MagneticWrapper strength={20}>
              <a href="#contact" className="btn-outline cursor-none bg-black/40 backdrop-blur-sm">
                Iniciar Handoff
              </a>
            </MagneticWrapper>
          </motion.div>

        </motion.div>
      </div>
      
    </section>
  )
}
