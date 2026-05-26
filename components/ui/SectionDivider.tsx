'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

type DividerVariant = 'wave' | 'diagonal' | 'fade'

interface SectionDividerProps {
  variant?: DividerVariant
  flip?: boolean
  color?: string
}

export default function SectionDivider({ variant = 'wave', flip = false, color }: SectionDividerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3])
  const pathOffset = useTransform(scrollYProgress, [0, 1], [0, 100])

  if (variant === 'diagonal') {
    return (
      <motion.div
        ref={ref}
        style={{ opacity }}
        className={`relative h-24 md:h-32 overflow-hidden pointer-events-none ${flip ? 'rotate-180' : ''}`}
      >
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <polygon
            fill={color || 'var(--color-deep-space)'}
            fillOpacity="0.4"
            points="0,120 1440,0 1440,120"
          />
          <line
            x1="0" y1="120" x2="1440" y2="0"
            stroke="var(--color-space-border)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </motion.div>
    )
  }

  if (variant === 'fade') {
    return (
      <motion.div
        ref={ref}
        style={{ opacity }}
        className="relative h-20 md:h-28 overflow-hidden pointer-events-none"
      >
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, 
              transparent 0%, 
              ${color || 'rgba(29,158,117,0.03)'} 30%, 
              ${color || 'rgba(127,119,221,0.03)'} 70%, 
              transparent 100%)`
          }}
        />
        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[var(--color-space-border)] to-transparent" />
      </motion.div>
    )
  }

  // Default: wave
  return (
    <motion.div
      ref={ref}
      style={{ opacity }}
      className={`relative h-20 md:h-28 overflow-hidden pointer-events-none ${flip ? 'rotate-180' : ''}`}
    >
      <svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <motion.path
          d="M0,60 C360,90 720,30 1080,60 C1260,75 1380,55 1440,60 L1440,100 L0,100 Z"
          fill={color || 'var(--color-deep-space)'}
          fillOpacity="0.3"
        />
        <motion.path
          d="M0,70 C240,40 480,90 720,60 C960,30 1200,80 1440,50"
          fill="none"
          stroke="var(--color-orbital-teal)"
          strokeOpacity="0.1"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </motion.div>
  )
}
