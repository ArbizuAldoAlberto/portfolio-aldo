'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const GLITCH_CHARS = '!<>-_\\/[]{}—=+*^?#_'

interface GlitchTextProps {
  text: string
  className?: string
  delay?: number
}

export default function GlitchText({ text, className = '', delay = 0 }: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(text.replace(/[a-zA-Z0-9]/g, '-'))
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    let iteration = 0
    let interval: NodeJS.Timeout

    const startGlitch = () => {
      clearInterval(interval)
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

        if (iteration >= text.length) {
          clearInterval(interval)
        }
        iteration += 1 / 3
      }, 30)
    }

    const initialTimeout = setTimeout(startGlitch, delay * 1000)

    if (isHovered) {
      iteration = 0
      startGlitch()
    }

    return () => {
      clearInterval(interval)
      clearTimeout(initialTimeout)
    }
  }, [text, delay, isHovered])

  return (
    <motion.span
      className={`inline-block ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      {displayText}
    </motion.span>
  )
}
