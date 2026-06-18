'use client'
import { useRef, useState, useEffect, ReactNode } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

interface HorizontalScrollSectionProps {
  children: ReactNode
  className?: string
}

export default function HorizontalScrollSection({ children, className = '' }: HorizontalScrollSectionProps) {
  const targetRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollRange, setScrollRange] = useState(0)
  const scrollRangeRef = useRef(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    scrollRangeRef.current = scrollRange
  }, [scrollRange])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      if (containerRef.current) {
        const range = containerRef.current.scrollWidth - window.innerWidth
        setScrollRange(range > 0 ? range + 100 : 0) // Extra padding
      }
    }
    
    handleResize()
    // Small timeout to ensure DOM is fully rendered before calculating
    const timeout = setTimeout(handleResize, 100)
    window.addEventListener('resize', handleResize)
    return () => {
      clearTimeout(timeout)
      window.removeEventListener('resize', handleResize)
    }
  }, [children])

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end']
  })

  // Use a spring to make the scroll incredibly smooth
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 25,
    mass: 0.1
  })

  // Dynamic transform evaluating the current scrollRangeRef state
  const x = useTransform(smoothProgress, (value) => {
    return value * -scrollRangeRef.current
  })
  const progressWidth = useTransform(smoothProgress, [0, 1], ['0%', '100%'])

  return isMobile ? (
    <div className={`w-full flex flex-col gap-12 ${className}`}>
      {children}
    </div>
  ) : (
    <div ref={targetRef} style={{ height: `calc(${scrollRange}px + 100vh)` }} className="relative">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div ref={containerRef} style={{ x }} className={`flex gap-8 px-16 ${className}`}>
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
    </div>
  )
}
