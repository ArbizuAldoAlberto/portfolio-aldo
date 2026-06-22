'use client'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import MagneticWrapper from '../ui/MagneticWrapper'
import GlitchText from '../ui/GlitchText'
import { usePersona } from '../theme/PersonaContext'
import PersonaSwitcher from '../ui/PersonaSwitcher'
import { useTranslations } from 'next-intl'

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
  const { persona, setPersona } = usePersona()
  const t = useTranslations('Hero')

  const personasList = ['engineer', 'security', 'agtech']
  
  const handleDragEnd = (event: any, info: any) => {
    // Only trigger on intentional swipes
    if (Math.abs(info.offset.x) > 50) {
      const currentIndex = personasList.indexOf(persona)
      if (info.offset.x < -50) {
        // Swipe left -> next persona
        const nextIdx = (currentIndex + 1) % personasList.length
        setPersona(personasList[nextIdx] as any)
      } else if (info.offset.x > 50) {
        // Swipe right -> prev persona
        const prevIdx = (currentIndex - 1 + personasList.length) % personasList.length
        setPersona(personasList[prevIdx] as any)
      }
    }
  }

  const getPersonaContent = () => {
    return {
      status: t(`${persona}.status`),
      badgeColor: 'bg-[var(--color-orbital-teal)]',
      badgeText: t(`${persona}.badgeText`),
      sub: t(`${persona}.sub`),
      c1Title: t(`${persona}.c1Title`),
      c1Desc: t(`${persona}.c1Desc`),
      c2Title: t(`${persona}.c2Title`),
      c2Desc: t(`${persona}.c2Desc`),
      c3Title: t(`${persona}.c3Title`),
      c3Desc: t(`${persona}.c3Desc`),
      ctaPrimary: t(`${persona}.ctaPrimary`),
      ctaSecondary: t(`${persona}.ctaSecondary`),
      cvName: persona === 'engineer' ? 'CV_Aldo_Arbizu_Software_Engineer.md' : 
              persona === 'agtech' ? 'CV_Aldo_Arbizu_AgTech.md' : 
              'CV_Aldo_Arbizu_Cybersecurity.md'
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
          <motion.div variants={itemVariants} className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[var(--color-space-border)] pb-4 gap-4 md:gap-0">
            <div className="flex flex-col gap-1">
              <span className="font-space text-[9px] uppercase tracking-widest text-white font-bold select-none">
                NEXUS PERSONA TUNER
              </span>
              <span className="font-mono text-[9px] text-[var(--color-orbital-teal)] uppercase tracking-widest select-none transition-colors">
                {t(`personaLabels.${persona}`)}
              </span>
            </div>
            <PersonaSwitcher />
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={persona}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              initial={{ opacity: 0, y: 15, filter: 'blur(5px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -15, filter: 'blur(10px)' }}
              transition={{ duration: 0.3 }}
              className="touch-pan-y cursor-grab active:cursor-grabbing"
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
              <motion.div variants={itemVariants} className="flex flex-col md:flex-row flex-wrap gap-4 relative z-50 mt-10">
                <MagneticWrapper strength={30} className="w-full md:w-auto">
                  <a href="#projects" className="btn-primary flex items-center justify-center gap-2 w-full md:w-auto">
                    <span>{content.ctaPrimary}</span>
                    <span className="font-sans text-xs">→</span>
                  </a>
                </MagneticWrapper>

                <MagneticWrapper strength={20} className="w-full md:w-auto">
                  <a href="#contact" className="btn-outline bg-black/40 backdrop-blur-sm flex justify-center w-full md:w-auto">
                    {content.ctaSecondary}
                  </a>
                </MagneticWrapper>

                <MagneticWrapper strength={20} className="w-full md:w-auto">
                  <a href={`/cv/${content.cvName}`} download className="btn-outline border-[var(--color-orbital-teal)]/30 hover:border-white text-[var(--color-mist-gray)] hover:text-white transition-colors bg-black/40 backdrop-blur-sm flex items-center justify-center gap-2 w-full md:w-auto">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    <span className="font-bold">{t('downloadCv')}</span>
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
