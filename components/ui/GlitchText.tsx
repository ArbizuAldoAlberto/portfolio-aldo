'use client'
import React, { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const GLITCH_CHARS = '!<>-_\\/[]{}—=+*^?#@$%&'

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
  text,
  className = '',
  delay = 0,
  speed = 35,
  triggerOnView = false,
  as: Tag = 'span',
  scrambleOnHover = true
}: GlitchTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [displayText, setDisplayText] = useState(
    triggerOnView ? text.replace(/[a-zA-Z0-9]/g, '▓') : text.replace(/[a-zA-Z0-9]/g, '-')
  )
  const [isHovered, setIsHovered] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(!triggerOnView)

  useEffect(() => {
    if (triggerOnView && !isInView) return
    if (hasAnimated && !isHovered) return

    let iteration = 0
    const maxIterations = text.length * 3

    const interval = setInterval(() => {
      setDisplayText((prev) =>
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' '
            if (index < iteration / 3) {
              return text[index]
            }
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
          })
          .join('')
      )

      iteration += 1

      if (iteration >= maxIterations) {
        clearInterval(interval)
        setDisplayText(text)
        setHasAnimated(true)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, delay, isHovered, isInView, triggerOnView, hasAnimated, speed])

  const MotionTag = motion(Tag as any)

  return (
    <MotionTag
      ref={ref as any}
      className={`inline-block ${className}`}
      onMouseEnter={() => scrambleOnHover && setIsHovered(true)}
      onMouseLeave={() => scrambleOnHover && setIsHovered(false)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
      aria-label={text}
      role="text"
    >
      <span aria-hidden="true">{displayText}</span>
    </MotionTag>
  )
}
