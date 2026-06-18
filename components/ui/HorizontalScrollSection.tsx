'use client'
import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

interface HorizontalScrollSectionProps {
  children: React.ReactNode
  className?: string
}

export default function HorizontalScrollSection({ children, className = '' }: HorizontalScrollSectionProps) {
  const targetRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end']
  })

  // Smooth the scroll
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 25,
    mass: 0.1
  })

  // We translate horizontally by moving the container left by 100% of its width,
  // but we add back 100vw so the final item aligns with the right edge of the screen!
  // No JS measurements required for the width.
  const x = useTransform(smoothProgress, [0, 1], ['0%', 'calc(-100% + 100vw)'])
  
  // Progress bar logic
  const progressWidth = useTransform(smoothProgress, [0, 1], ['0%', '100%'])

  return isMobile ? (
    <div className={`w-full flex flex-col gap-12 ${className}`}>
      {children}
    </div>
  ) : (
    // height 400vw makes the scroll length proportional to the width!
    <section ref={targetRef} className="relative h-[650vw]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* w-max is CRITICAL so it takes the full width of all children */}
        <motion.div style={{ x }} className={`flex gap-8 px-16 w-max ${className}`}>
          {children}
        </motion.div>
        
        {/* Progress Bar */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 h-[2px] bg-[var(--color-space-border)] overflow-hidden rounded-full">
          <motion.div 
            className="h-full bg-gradient-to-r from-[var(--color-orbital-teal)] to-[var(--color-electric-purple)] rounded-full" 
            style={{ width: progressWidth }} 
          />
        </div>
      </div>
    </section>
  )
}
