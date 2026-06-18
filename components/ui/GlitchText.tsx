'use client'
import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface GlitchTextProps {
  text: string
  className?: string
  delay?: number
  speed?: number
  triggerOnView?: boolean
  as?: React.ElementType
  scrambleOnHover?: boolean
}

const GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'

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
  const [displayText, setDisplayText] = useState(text.replace(/[a-zA-Z0-9]/g, '▒'))
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (triggerOnView && !isInView) return
    if (hasAnimated) return

    let timeout: NodeJS.Timeout
    let interval: NodeJS.Timeout

    timeout = setTimeout(() => {
      let iteration = 0
      const maxIterations = text.length

      interval = setInterval(() => {
        setDisplayText((prev) =>
          text
            .split('')
            .map((char, index) => {
              if (char === ' ') return ' '
              if (index < iteration) {
                return text[index]
              }
              return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
            })
            .join('')
        )

        iteration += 0.5 // faster reveal

        if (iteration >= maxIterations) {
          clearInterval(interval)
          setDisplayText(text)
          setHasAnimated(true)
        }
      }, 30) // fast speed
    }, delay * 1000)

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [text, delay, isInView, triggerOnView, hasAnimated])

  const TagComponent = motion[Tag as keyof typeof motion] as React.ElementType

  return (
    <TagComponent
      ref={ref as any}
      className={`inline-block ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay }}
      aria-label={text}
      role="text"
    >
      <span aria-hidden="true">{displayText}</span>
    </TagComponent>
  )
}
