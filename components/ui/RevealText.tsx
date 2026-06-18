'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface RevealTextProps {
  children: React.ReactNode
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
  blur?: boolean
  className?: string
}

export default function RevealText({
  children,
  direction = 'up',
  delay = 0,
  blur = true,
  className = ''
}: RevealTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const getDirectionOffset = () => {
    switch (direction) {
      case 'up': return { y: 30, x: 0 }
      case 'down': return { y: -30, x: 0 }
      case 'left': return { x: 30, y: 0 }
      case 'right': return { x: -30, y: 0 }
    }
  }

  const offset = getDirectionOffset()

  return (
    <motion.span
      ref={ref}
      initial={{ 
        opacity: 0, 
        x: offset.x, 
        y: offset.y, 
        filter: blur ? 'blur(10px)' : 'none' 
      }}
      animate={{ 
        opacity: isInView ? 1 : 0, 
        x: isInView ? 0 : offset.x, 
        y: isInView ? 0 : offset.y, 
        filter: isInView ? 'blur(0px)' : (blur ? 'blur(10px)' : 'none') 
      }}
      transition={{ 
        duration: 0.8, 
        delay, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.span>
  )
}
