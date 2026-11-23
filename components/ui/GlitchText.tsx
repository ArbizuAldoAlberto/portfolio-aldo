'use client'
import { useRef } from 'react'
import { motion } from 'framer-motion'

interface GlitchTextProps {
  text: string
  className?: string
  delay?: number
  speed?: number
  triggerOnView?: boolean
  as?: React.ElementType
  scrambleOnHover?: boolean
}

export default function GlitchText({
  text = '',
  className = '',
  delay = 0,
  as: Tag = 'span',
}: GlitchTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const TagComponent = motion[Tag as keyof typeof motion] as any

  return (
    <TagComponent
      ref={ref as any}
      className={`inline-block ${className}`}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay }}
      aria-label={text}
    >
      {text}
    </TagComponent>
  )
}
