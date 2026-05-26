'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion'

const sections = [
  { id: 'hero', label: 'Inicio' },
  { id: 'manifesto', label: 'Manifesto' },
  { id: 'offline-simulator', label: 'Lab' },
  { id: 'services', label: 'Servicios' },
  { id: 'projects', label: 'Proyectos' },
  { id: 'studio-lab', label: 'Studio' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'nexus-telemetry', label: 'NEXUS' },
  { id: 'contact', label: 'Contacto' }
]

export default function Navigation() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const { scrollYProgress } = useScroll()

  // Hide/show nav based on scroll direction
  useMotionValueEvent(scrollYProgress, 'change', () => {
    const currentScrollY = window.scrollY
    
    if (currentScrollY < 100) {
      setIsVisible(false)
      setLastScrollY(currentScrollY)
      return
    }
    
    if (currentScrollY < lastScrollY || isHovered) {
      setIsVisible(true)
    } else if (currentScrollY > lastScrollY + 5) {
      setIsVisible(false)
    }
    
    setLastScrollY(currentScrollY)
  })

  // Track active section with IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = []
    
    sections.forEach(section => {
      const el = document.getElementById(section.id)
      if (!el) return
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(section.id)
          }
        },
        { threshold: 0.3, rootMargin: '-10% 0px -60% 0px' }
      )
      
      observer.observe(el)
      observers.push(observer)
    })
    
    return () => observers.forEach(o => o.disconnect())
  }, [])

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  return (
    <>
      {/* Scroll Progress Bar — Always visible */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] z-[100] origin-left"
        style={{
          scaleX: scrollYProgress,
          background: 'linear-gradient(90deg, var(--color-orbital-teal), var(--color-electric-purple), var(--color-amber-gold))'
        }}
      />

      {/* Navigation Bar */}
      <AnimatePresence>
        {isVisible && (
          <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="fixed top-2 left-1/2 -translate-x-1/2 z-[99] flex items-center gap-1 px-2 py-1.5 rounded-full border border-[var(--color-space-border)] bg-[var(--color-space-black)]/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
          >
            {sections.map((section) => {
              const isActive = activeSection === section.id
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="relative px-3 py-1.5 rounded-full transition-all cursor-pointer group"
                  title={section.label}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-[var(--color-orbital-teal)]/15 border border-[var(--color-orbital-teal)]/30"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-10 font-space text-[9px] uppercase tracking-widest transition-colors ${
                    isActive ? 'text-[var(--color-orbital-teal)] font-bold' : 'text-[var(--color-mist-gray)]/60 group-hover:text-white'
                  }`}>
                    {section.label}
                  </span>
                </button>
              )
            })}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
