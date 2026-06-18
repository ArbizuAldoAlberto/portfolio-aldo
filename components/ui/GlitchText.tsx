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
  text = '',
  className = '',
  delay = 0,
  speed = 35,
  triggerOnView = false,
  as: Tag = 'span',
  scrambleOnHover = true
}: GlitchTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  
  // Safe default for text to avoid .replace crashes
  const safeText = text || ''
  const [displayText, setDisplayText] = useState(safeText.replace(/[a-zA-Z0-9]/g, '▒'))
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (triggerOnView && !isInView) return
    if (hasAnimated) return

    const initTimer = setTimeout(() => {
      let iteration = 0
      
      const interval = setInterval(() => {
        setDisplayText(prev => {
          return safeText.split('').map((char, index) => {
            // Si el caracter ya se descifró o es un espacio, mantenerlo
            if (index < iteration || char === ' ') {
              return safeText[index]
            }
            // De lo contrario, mostrar un caracter glitch
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
          }).join('')
        })

        // Aceleramos la iteración saltando de a 2 caracteres para que sea más rápido
        iteration += 2
        
        if (iteration >= safeText.length + 2) {
          clearInterval(interval)
          setDisplayText(safeText)
          setHasAnimated(true)
        }
      }, 25) // Intervalo muy rápido (25ms) para que sea instantáneo y fluido

      return () => clearInterval(interval)
    }, delay * 1000)

    return () => clearTimeout(initTimer)
  }, [safeText, delay, isInView, triggerOnView, hasAnimated])

  const TagComponent = motion[Tag as keyof typeof motion] as any

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
