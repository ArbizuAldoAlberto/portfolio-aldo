'use client'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import MagneticWrapper from '../ui/MagneticWrapper'
import GlitchText from '../ui/GlitchText'
import { usePersona } from '../theme/PersonaContext'
import PersonaSwitcher from '../ui/PersonaSwitcher'

const Hero3D = dynamic(() => import('./Hero3D'), { ssr: false })

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring' as const,
      stiffness: 70,
      damping: 15
    }
  }
}

export default function Hero() {
  const { persona } = usePersona()

  const getPersonaContent = () => {
    switch (persona) {
      case 'dev':
        return {
          status: 'NÚCLEOS COMPILADOS · SISTEMA NOMINAL',
          badgeColor: 'bg-[var(--color-orbital-teal)]',
          badgeText: '● Ingeniería de Software Senior · React Native & Fullstack',
          sub: 'Product Engineer · Obsesionado por el código limpio, arquitecturas eficientes y estándares estrictos de ciberseguridad.',
          c1Title: 'Local Sync Core (SQLite WAL + Zustand)',
          c1Desc: 'Estructuración de datos atómicos y colas de reconciliación asíncronas bidireccionales de alta fiabilidad.',
          c2Title: 'React Native (Expo Bare Workflow)',
          c2Desc: 'EAS Pipelines, puentes nativos personalizados Swift/Kotlin, optimización de bundles JS y calibración fina del garbage collector.',
          c3Title: 'Security Gates y Calidad de Código',
          c3Desc: 'Integración continua con auditorías de seguridad automáticas (MARTA QA) y blindaje móvil bajo estándares OWASP MASVS.',
          ctaPrimary: 'Ver Código',
          ctaSecondary: 'Socket Handoff'
        }
      case 'gentleman':
        return {
          status: 'LA ARTESANÍA DETRÁS DEL CÓDIGO',
          badgeColor: 'bg-white',
          badgeText: '● El arte de simplificar y diseñar con elegancia',
          sub: 'Creador de Productos · Arquitectura de Software Limpia · Dirección de Estética Interactiva',
          c1Title: 'Elegancia Estructural',
          c1Desc: 'Diseñar es quitar ruido. Creemos en el orden matemático, el código desacoplado y las interfaces pulidas.',
          c2Title: 'Interfaces Sensoriales Inmersivas',
          c2Desc: 'Bento grids elegantes, animaciones en Framer Motion, renders 3D WebGL de alto rendimiento y sutiles respuestas hápticas.',
          c3Title: 'Ingeniería de Autor',
          c3Desc: 'Cada desarrollo digital se trata como una pieza única. Cuidamos la experiencia de principio a fin.',
          ctaPrimary: 'Galería Estética',
          ctaSecondary: 'Agendar Diálogo'
        }
      case 'founder':
      default:
        return {
          status: '¿BUSCÁS HACER CRECER TU NEGOCIO?',
          badgeColor: 'bg-[var(--color-orbital-teal)]',
          badgeText: '● Diseñando Soluciones con Retorno de Inversión (ROI)',
          sub: 'Ingeniero de Producto · Creamos apps y plataformas comerciales de alto impacto que capturan valor y escalan sin fricciones.',
          c1Title: 'Resiliencia de Facturación (Offline-First)',
          c1Desc: 'Tu negocio no puede detenerse si se cae la red. Creamos sistemas móviles que siguen operando y cobrando sin internet.',
          c2Title: 'Arquitecturas SaaS Robustas y Escalables',
          c2Desc: 'Modelamos la base de tu software para crecer. Integraciones de pago ágiles con Stripe (fiat) y Base L2 (cripto).',
          c3Title: 'Experiencia de Usuario 3D e Interactiva',
          c3Desc: 'Tus clientes merecen una experiencia premium. Fusionamos WebGL, Blender y micro-interacciones para impresionar.',
          ctaPrimary: 'Ver Soluciones',
          ctaSecondary: 'Agendar una Charla'
        }
    }
  }

  const content = getPersonaContent()

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden bg-[var(--color-space-black)]">
      {/* 3D Quantum Reactor Centerpiece */}
      <div className="absolute inset-0 md:left-1/2 md:w-1/2 md:h-full z-0 opacity-55 md:opacity-100 mix-blend-screen">
        <Hero3D />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pointer-events-none flex items-center">
        {/* Text Container with glass holographic frame */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full md:w-[60%] pointer-events-auto glass-surface p-8 md:p-12 rounded-2xl relative border-l-4 border-l-[var(--color-orbital-teal)]/70 backdrop-blur-xl transition-all duration-500"
        >
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] opacity-30 pointer-events-none rounded-2xl" />

          {/* Floating Switcher Dock */}
          <motion.div variants={itemVariants} className="mb-6 flex justify-between items-center border-b border-[var(--color-space-border)] pb-4">
            <span className="font-space text-[9px] uppercase tracking-widest text-[var(--color-mist-gray)]/40 font-bold select-none">
              NEXUS PERSONA TUNER
            </span>
            <PersonaSwitcher />
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={persona}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {/* PULSING STATUS BADGE */}
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[var(--color-space-border)] bg-[var(--color-space-black)]/70 mb-8 w-fit shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                <span className={`flex h-2.5 w-2.5 rounded-full ${content.badgeColor} relative`}>
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${content.badgeColor} opacity-75`} />
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${content.badgeColor}`} />
                </span>
                <span className="text-[10px] font-space uppercase tracking-widest text-[var(--color-mist-gray)] font-bold">
                  {content.badgeText}
                </span>
              </motion.div>

              {/* HEADLINE with Walbi-style decrypt effect */}
              <motion.h1
                variants={itemVariants}
                className="text-6xl md:text-8xl font-serif font-bold tracking-tight mb-6 text-white leading-none"
              >
                <GlitchText
                  text="Aldo Arbizu"
                  triggerOnView={true}
                  speed={40}
                  scrambleOnHover={true}
                />
              </motion.h1>

              {/* CONSOLE STATEMENTS */}
              <motion.div
                variants={itemVariants}
                className="space-y-4 font-mono text-sm md:text-base text-[var(--color-mist-gray)] border-t border-b border-[var(--color-space-border)] py-6 mb-8 bg-[var(--color-space-black)]/40 px-5 rounded-lg shadow-inner"
              >
                <div className="flex items-start gap-3">
                  <span className="text-[var(--color-orbital-teal)] font-bold">{'[01]'}</span>
                  <div className="flex flex-col">
                    <span className="text-[var(--color-orbital-teal)] font-bold">{content.c1Title}</span>
                    <span className="text-white/80 text-xs mt-1 leading-relaxed">{content.c1Desc}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[var(--color-electric-purple)] font-bold">{'[02]'}</span>
                  <div className="flex flex-col">
                    <span className="text-[var(--color-electric-purple)] font-bold">{content.c2Title}</span>
                    <span className="text-white/80 text-xs mt-1 leading-relaxed">{content.c2Desc}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[var(--color-amber-gold)] font-bold">{'[03]'}</span>
                  <div className="flex flex-col">
                    <span className="text-[var(--color-amber-gold)] font-bold">{content.c3Title}</span>
                    <span className="text-white/80 text-xs mt-1 leading-relaxed">{content.c3Desc}</span>
                  </div>
                </div>
              </motion.div>

              {/* BIO BRIEF */}
              <motion.p
                variants={itemVariants}
                className="text-xs md:text-sm font-space text-[var(--color-mist-gray)]/80 mb-10 leading-relaxed uppercase tracking-wider"
              >
                {content.sub}
              </motion.p>

              {/* ACTION BUTTONS */}
              <motion.div variants={itemVariants} className="flex flex-wrap gap-4 relative z-50">
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
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
