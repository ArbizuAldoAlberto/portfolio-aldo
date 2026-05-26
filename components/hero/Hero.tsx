'use client'
import { motion, AnimatePresence } from 'framer-motion'
import Hero3D from './Hero3D'
import MagneticWrapper from '../ui/MagneticWrapper'
import { usePersona } from '../theme/PersonaContext'
import PersonaSwitcher from '../ui/PersonaSwitcher'

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
  const { persona } = usePersona()

  // Dynamic content based on visitor persona
  const getPersonaContent = () => {
    switch (persona) {
      case 'dev':
        return {
          status: 'SISTEMA COMPILADO · NÚCLEOS LISTOS',
          badgeColor: 'bg-[var(--color-orbital-teal)]',
          badgeText: '● Módulos de Núcleo Listos · Compilación Ok',
          sub: 'Product Engineer · React Native Mobile · Fullstack Developer · Antigravity Studio',
          c1Title: 'SQLite WAL Local Database Sync',
          c1Desc: 'Sincronización incremental y resolución automática de conflictos bi-direccionales sin bloqueos de UI.',
          c2Title: 'Expo Bare Workflow & native modules',
          c2Desc: 'EAS Pipelines, optimización de bundles JS, e integraciones nativas Swift/Kotlin a nivel de hilo.',
          c3Title: 'Dev-Ops Telemetry local integrations',
          c3Desc: 'Automatización CI/CD con micro-scripts locales en caliente y monitoreo continuo de logs perimetrales.',
          ctaPrimary: 'Auditar Código',
          ctaSecondary: 'Socket Handoff'
        }
      case 'gentleman':
        return {
          status: 'L’ART DE L’INGÉNIERIE',
          badgeColor: 'bg-white',
          badgeText: '● L’art de l’ingénierie et de l’élégance',
          sub: 'Créateur de Produits · Architecture Logicielle · Direction Esthétique',
          c1Title: 'Simplicidad Estructural',
          c1Desc: 'Diseñar para el intelecto. Reducir el ruido visual hasta que solo quede la esencia funcional del producto.',
          c2Title: 'Experiencias Sensoriales',
          c2Desc: 'El software concebido como obra de arte. Integración de WebGL fluido y audio háptico procedural.',
          c3Title: 'Compromiso de Excelencia',
          c3Desc: 'Cada línea de código y decisión de diseño responde a los más altos estándares globales de calidad estética.',
          ctaPrimary: 'Galería de Misiones',
          ctaSecondary: 'Agendar Diálogo'
        }
      case 'founder':
      default:
        return {
          status: 'DISPONIBLE PARA PROYECTOS',
          badgeColor: 'bg-[var(--color-orbital-teal)]',
          badgeText: '● Disponible para proyectos — AR / Remote',
          sub: 'Product Engineer · React Native Mobile · Fullstack Developer · Antigravity Studio',
          c1Title: 'Arquitectura Resiliente (Offline-First)',
          c1Desc: 'Garantiza el funcionamiento 24/7 sin conexión. Cero pérdida de datos para operaciones críticas en campo.',
          c2Title: 'Ingeniería SaaS Multi-Tenant',
          c2Desc: 'Escalabilidad comercial corporativa. Una sola base de código para servir a cientos de empresas de forma segura.',
          c3Title: 'Diseño 3D & UX de Extremo a Extremo',
          c3Desc: 'Interfaces que deslumbran y convierten. Desde la fase en Blender hasta el despliegue global de producción.',
          ctaPrimary: 'Misiones Completadas',
          ctaSecondary: 'Iniciar Handoff'
        }
    }
  }

  const content = getPersonaContent()

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden bg-[var(--color-space-black)]">
      
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
          className="w-full md:w-[60%] pointer-events-auto glass-surface p-8 md:p-12 rounded-2xl relative border-l-4 border-l-[var(--color-orbital-teal)]/70 backdrop-blur-xl transition-all duration-500"
        >
          {/* Subtle Grid Pattern Overlay inside container */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] opacity-30 pointer-events-none rounded-2xl"></div>

          {/* 🔘 Floating Switcher Dock Inside Hero container */}
          <div className="mb-6 flex justify-between items-center border-b border-[var(--color-space-border)] pb-4">
            <span className="font-space text-[9px] uppercase tracking-widest text-[var(--color-mist-gray)]/40 font-bold select-none">
              NEXUS PERSONA TUNER
            </span>
            <PersonaSwitcher />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={persona}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {/* 📡 PULSING STATUS BADGE */}
              <div
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[var(--color-space-border)] bg-[var(--color-space-black)]/70 mb-8 w-fit shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
              >
                <span className={`flex h-2.5 w-2.5 rounded-full ${content.badgeColor} relative`}>
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${content.badgeColor} opacity-75`}></span>
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${content.badgeColor}`}></span>
                </span>
                <span className="text-[10px] font-space uppercase tracking-widest text-[var(--color-mist-gray)] font-bold">
                  {content.badgeText}
                </span>
              </div>
              
              {/* 👑 HEADLINE: Elegant classic Serif typography */}
              <h1
                className="text-6xl md:text-8xl font-serif font-bold tracking-tight mb-6 text-white leading-none"
              >
                Aldo Arbizu
              </h1>
              
              {/* 💻 CONSOLE STATEMENTS: High-impact adapts to mode */}
              <div
                className="space-y-4 font-mono text-sm md:text-base text-[var(--color-mist-gray)] border-t border-b border-[var(--color-space-border)] py-6 mb-8 bg-[var(--color-space-black)]/40 px-5 rounded-lg shadow-inner"
              >
                <div className="flex items-start gap-3">
                  <span className="text-[var(--color-orbital-teal)] font-bold">{"[01]"}</span>
                  <div className="flex flex-col">
                    <span className="text-[var(--color-orbital-teal)] font-bold">{content.c1Title}</span>
                    <span className="text-white/80 text-xs mt-1 leading-relaxed">{content.c1Desc}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[var(--color-electric-purple)] font-bold">{"[02]"}</span>
                  <div className="flex flex-col">
                    <span className="text-[var(--color-electric-purple)] font-bold">{content.c2Title}</span>
                    <span className="text-white/80 text-xs mt-1 leading-relaxed">{content.c2Desc}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[var(--color-amber-gold)] font-bold">{"[03]"}</span>
                  <div className="flex flex-col">
                    <span className="text-[var(--color-amber-gold)] font-bold">{content.c3Title}</span>
                    <span className="text-white/80 text-xs mt-1 leading-relaxed">{content.c3Desc}</span>
                  </div>
                </div>
              </div>

              {/* 📝 BIO BRIEF */}
              <p
                className="text-xs md:text-sm font-space text-[var(--color-mist-gray)]/80 mb-10 leading-relaxed uppercase tracking-wider"
              >
                {content.sub}
              </p>
              
              {/* 🚀 ACTION BUTTONS */}
              <div
                className="flex flex-wrap gap-4 relative z-50"
              >
                <MagneticWrapper strength={30}>
                  <a href="#projects" className="btn-primary flex items-center gap-2 cursor-none">
                    <span>{content.ctaPrimary}</span>
                    <span className="font-sans text-xs">→</span>
                  </a>
                </MagneticWrapper>
                
                <MagneticWrapper strength={20}>
                  <a href="#contact" className="btn-outline cursor-none bg-black/40 backdrop-blur-sm">
                    {content.ctaSecondary}
                  </a>
                </MagneticWrapper>
              </div>
            </motion.div>
          </AnimatePresence>

        </motion.div>
      </div>
      
    </section>
  )
}
