'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import MagneticWrapper from '../ui/MagneticWrapper'
import GlitchText from '../ui/GlitchText'
import { usePersona } from '../theme/PersonaContext'
import PersonaSwitcher from '../ui/PersonaSwitcher'
import { useTranslations, useLocale } from 'next-intl'
import { LayoutDashboard } from 'lucide-react'

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

const wrapperVariants = {
  hidden: { opacity: 0, y: 15, filter: 'blur(5px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.35,
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  },
  exit: {
    opacity: 0,
    y: -15,
    filter: 'blur(10px)',
    transition: { duration: 0.2 }
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
  const locale = useLocale()
  const [downloadOpen, setDownloadOpen] = useState(false)
  const [activeSatellite, setActiveSatellite] = useState<{ active: boolean; name?: string; desc?: string; color?: string }>({ active: false })

  useEffect(() => {
    const handleHover = (e: any) => {
      setActiveSatellite(e.detail)
    }
    window.addEventListener('satellite-hover', handleHover)
    return () => window.removeEventListener('satellite-hover', handleHover)
  }, [])

  const personasList = ['engineer', 'security', 'agtech']
  
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  
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

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const minSwipeDistance = 50
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe || isRightSwipe) {
      const currentIndex = personasList.indexOf(persona)
      if (isLeftSwipe) {
        const nextIdx = (currentIndex + 1) % personasList.length
        setPersona(personasList[nextIdx] as any)
      } else {
        const prevIdx = (currentIndex - 1 + personasList.length) % personasList.length
        setPersona(personasList[prevIdx] as any)
      }
    }
  }

  const getPersonaContent = () => {
    const isEn = locale === 'en';
    const langSuffix = isEn ? '_en' : '';
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
      cvName: persona === 'engineer' ? `cv_desarrollador${langSuffix}.pdf` : 
              persona === 'agtech' ? `cv_agro${langSuffix}.pdf` : 
              `cv_comercial${langSuffix}.pdf`,
      cvUnifiedName: `cv_unificado${langSuffix}.pdf`
    }
  }

  const content = getPersonaContent()

  return (
    <section 
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden bg-[var(--color-space-black)]"
    >
      {/* 3D Quantum Reactor Centerpiece */}
      <div className="absolute inset-0 md:left-1/2 md:w-1/2 md:h-full z-0 opacity-55 md:opacity-100 mix-blend-screen">
        <Hero3D />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pointer-events-none flex items-center">
        {/* Text Container with glass holographic frame */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-[60%] pointer-events-auto glass-surface p-8 md:p-12 rounded-2xl relative border-l-4 border-l-[var(--color-orbital-teal)]/70 backdrop-blur-xl transition-all duration-500"
          style={{
            boxShadow: persona === 'engineer' ? '0 20px 40px -15px rgba(29, 158, 117, 0.1), inset 0 1px 1px rgba(255,255,255,0.05)' :
                       persona === 'security' ? '0 20px 40px -15px rgba(239, 68, 68, 0.1), inset 0 1px 1px rgba(255,255,255,0.05)' :
                       '0 20px 40px -15px rgba(132, 204, 22, 0.1), inset 0 1px 1px rgba(255,255,255,0.05)'
          }}
        >
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] opacity-30 pointer-events-none rounded-2xl" />
 
          {/* Floating Switcher Dock */}
          <motion.div variants={itemVariants} className="mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-[var(--color-space-border)] pb-4 gap-4 lg:gap-0">
            <div className="flex flex-col gap-1 max-w-full sm:max-w-xs md:max-w-md">
              <span className="font-sans text-[10px] uppercase tracking-wider text-white/90 font-bold select-none">
                NEXUS PERSONA TUNER
              </span>
              <span className="font-mono text-[9px] text-[var(--color-orbital-teal)] uppercase tracking-wide select-none transition-colors leading-relaxed">
                {t(`personaLabels.${persona}`)}
              </span>
            </div>
            <PersonaSwitcher />
          </motion.div>
 
          <AnimatePresence mode="wait">
            <motion.div
              key={persona}
              variants={wrapperVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragSnapToOrigin={true}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
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
                className="space-y-4 font-mono text-sm md:text-base text-[var(--color-mist-gray)] border-t border-b border-[var(--color-space-border)] py-6 mb-8 bg-[var(--color-space-black)]/45 px-5 rounded-lg shadow-inner relative overflow-hidden"
              >
                {/* Dynamic Category Visual Overlays */}
                {persona === 'engineer' && (
                  <div className="absolute inset-0 bg-[radial-gradient(rgba(29,158,117,0.02)_1px,transparent_1px)] bg-[size:8px_8px] pointer-events-none opacity-80" />
                )}
                {persona === 'security' && (
                  <>
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.015)_50%,rgba(0,0,0,0)_50%)] bg-[size:100%_4px] pointer-events-none opacity-50" />
                    <motion.div
                      initial={{ top: '-10%' }}
                      animate={{ top: '110%' }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                      className="absolute left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#EF4444]/40 to-transparent pointer-events-none z-20 shadow-[0_0_8px_rgba(239,68,68,0.6)]"
                    />
                  </>
                )}
                {persona === 'agtech' && (
                  <>
                    <div className="absolute top-1.5 left-2 text-[9px] text-[#84CC16]/30 select-none pointer-events-none font-sans font-extralight">+</div>
                    <div className="absolute top-1.5 right-2 text-[9px] text-[#84CC16]/30 select-none pointer-events-none font-sans font-extralight">+</div>
                    <div className="absolute bottom-1.5 left-2 text-[9px] text-[#84CC16]/30 select-none pointer-events-none font-sans font-extralight">+</div>
                    <div className="absolute bottom-1.5 right-2 text-[9px] text-[#84CC16]/30 select-none pointer-events-none font-sans font-extralight">+</div>
                  </>
                )}

                {/* Terminal Header */}
                {persona === 'engineer' && (
                  <div className="flex justify-between items-center text-[9px] text-[var(--color-orbital-teal)]/70 uppercase tracking-widest border-b border-[var(--color-space-border)] pb-2 mb-2 font-bold select-none relative z-10">
                    <span>SYSTEM TERMINAL v4.01</span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-orbital-teal)] animate-pulse" />
                      CORE SYNC: OK
                    </span>
                  </div>
                )}
                {persona === 'security' && (
                  <div className="flex justify-between items-center text-[9px] text-[#EF4444]/70 uppercase tracking-widest border-b border-[var(--color-space-border)] pb-2 mb-2 font-bold select-none relative z-10">
                    <span>SECURE PATHWAY GATEWAY</span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#EF4444] animate-ping" />
                      SHIELD ACTIVE (MASVS)
                    </span>
                  </div>
                )}
                {persona === 'agtech' && (
                  <div className="flex justify-between items-center text-[9px] text-[#84CC16]/70 uppercase tracking-widest border-b border-[var(--color-space-border)] pb-2 mb-2 font-bold select-none relative z-10">
                    <span>TELEMETRY FEED · EAS DEL VALLE</span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#84CC16] animate-pulse" />
                      GPS COORDINATES MESH
                    </span>
                  </div>
                )}

                <div className="flex items-start gap-3 relative z-10">
                  <span className="text-[var(--color-orbital-teal)] font-bold">{'[01]'}</span>
                  <div className="flex flex-col">
                    <span className="text-[var(--color-orbital-teal)] font-bold">{content.c1Title}</span>
                    <span className="text-white/80 text-xs mt-1 leading-relaxed">{content.c1Desc}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 relative z-10">
                  <span className="text-[var(--color-electric-purple)] font-bold">{'[02]'}</span>
                  <div className="flex flex-col">
                    <span className="text-[var(--color-electric-purple)] font-bold">{content.c2Title}</span>
                    <span className="text-white/80 text-xs mt-1 leading-relaxed">{content.c2Desc}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 relative z-10">
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
                    <LayoutDashboard size={16} />
                  </a>
                </MagneticWrapper>

                <MagneticWrapper strength={20} className="w-full md:w-auto">
                  <a href="#services" className="btn-outline bg-black/40 backdrop-blur-sm flex justify-center w-full md:w-auto">
                    {content.ctaSecondary}
                  </a>
                </MagneticWrapper>

                <div className="relative w-full md:w-auto">
                  <MagneticWrapper strength={20} className="w-full md:w-auto">
                    <button 
                      onClick={() => setDownloadOpen(!downloadOpen)}
                      className="btn-outline border-[var(--color-orbital-teal)]/30 hover:border-white text-[var(--color-mist-gray)] hover:text-white transition-colors bg-black/40 backdrop-blur-sm flex items-center justify-center gap-2 w-full md:w-auto"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      <span className="font-bold">{t('downloadCv')}</span>
                      <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${downloadOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                  </MagneticWrapper>

                  <AnimatePresence>
                    {downloadOpen && (
                      <>
                        {/* Overlay to close when clicking outside */}
                        <div className="fixed inset-0 z-40" onClick={() => setDownloadOpen(false)} />
                        
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-0 md:left-auto md:right-0 mt-2 w-64 glass-surface rounded-xl border border-[var(--color-space-border)] bg-[var(--color-space-black)]/95 backdrop-blur-xl shadow-2xl p-2 z-50 flex flex-col gap-1 pointer-events-auto"
                        >
                          <a
                            href={`/cv/${content.cvName}`}
                            download
                            onClick={() => setDownloadOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-left hover:bg-white/5 transition-all text-white/90 group"
                          >
                            <div className="p-1.5 rounded bg-[var(--color-orbital-teal)]/15 text-[var(--color-orbital-teal)] group-hover:bg-[var(--color-orbital-teal)]/25 transition-colors">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            <div className="flex flex-col">
                              <span className="font-space text-xs font-bold">{locale === 'en' ? 'Specialized Resume' : 'CV Especialista'}</span>
                              <span className="font-mono text-[9px] text-[var(--color-mist-gray)]/60 mt-0.5">
                                {persona === 'engineer' ? (locale === 'en' ? 'Software Developer' : 'Desarrollador Software') :
                                 persona === 'agtech' ? (locale === 'en' ? 'AgTech & Operations' : 'AgTech y Operaciones') :
                                 (locale === 'en' ? 'Commercial & Security' : 'Comercial y Seguridad')}
                              </span>
                            </div>
                          </a>
                          
                          <div className="h-[1px] bg-[var(--color-space-border)] my-1" />

                          <a
                            href={`/cv/${content.cvUnifiedName}`}
                            download
                            onClick={() => setDownloadOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-left hover:bg-white/5 transition-all text-white/90 group"
                          >
                            <div className="p-1.5 rounded bg-[var(--color-electric-purple)]/15 text-[var(--color-electric-purple)] group-hover:bg-[var(--color-electric-purple)]/25 transition-colors">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                            </div>
                            <div className="flex flex-col">
                              <span className="font-space text-xs font-bold">{locale === 'en' ? 'Full Master Resume' : 'CV Maestro Unificado'}</span>
                              <span className="font-mono text-[9px] text-[var(--color-mist-gray)]/60 mt-0.5">
                                {locale === 'en' ? 'All personas integrated' : 'Todos los perfiles integrados'}
                              </span>
                            </div>
                          </a>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* 🌌 SATELITE HOVER HUD TOOLTIP */}
      <AnimatePresence>
        {activeSatellite.active && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="absolute bottom-6 right-6 md:right-12 z-50 glass-surface p-6 rounded-2xl max-w-xs border-t-2 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl pointer-events-none"
            style={{ borderTopColor: activeSatellite.color }}
          >
            <span className="font-space text-[9px] tracking-widest text-[var(--color-mist-gray)]/50 uppercase block mb-2 font-bold">NEXUS ACTIVE NODE</span>
            <h4 className="text-white font-serif text-xl font-bold mb-1" style={{ color: activeSatellite.color }}>{activeSatellite.name}</h4>
            <p className="font-mono text-xs text-[var(--color-mist-gray)] leading-relaxed">{activeSatellite.desc}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
