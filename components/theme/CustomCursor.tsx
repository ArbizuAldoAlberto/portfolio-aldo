'use client'
import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { useCursor } from './CursorContext'
import { usePersona } from './PersonaContext'

export default function CustomCursor() {
  const { cursorState } = useCursor()
  const { persona } = usePersona()
  const [isVisible, setIsVisible] = useState(false)
  
  // Track exact mouse coordinates
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  
  const springConfig = { damping: 30, stiffness: 350, mass: 0.6 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    window.addEventListener('mousemove', moveCursor)
    document.body.addEventListener('mouseleave', handleMouseLeave)
    document.body.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      document.body.removeEventListener('mouseleave', handleMouseLeave)
      document.body.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [cursorX, cursorY, isVisible])

  const variants = {
    default: persona === 'dev' ? {
      width: 12,
      height: 20,
      backgroundColor: 'rgba(0, 255, 102, 0.45)',
      border: '1px solid #00FF66',
      mixBlendMode: 'normal' as const,
      borderRadius: '0px',
    } : persona === 'gentleman' ? {
      width: 6,
      height: 6,
      backgroundColor: '#ffffff',
      border: '0px solid transparent',
      mixBlendMode: 'normal' as const,
      borderRadius: '50%',
    } : { // founder (default)
      width: 20,
      height: 20,
      backgroundColor: '#ffffff',
      border: '0px solid transparent',
      mixBlendMode: 'difference' as const,
      borderRadius: '50%',
    },
    drag: persona === 'dev' ? {
      width: 64,
      height: 64,
      backgroundColor: 'rgba(0, 255, 102, 0.05)',
      border: '1px dashed #00FF66',
      mixBlendMode: 'normal' as const,
      borderRadius: '0px',
    } : persona === 'gentleman' ? {
      width: 24,
      height: 24,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      mixBlendMode: 'normal' as const,
      borderRadius: '50%',
    } : { // founder
      width: 72,
      height: 72,
      backgroundColor: 'rgba(0, 255, 255, 0.03)',
      border: '1px dashed rgba(0, 255, 255, 0.7)',
      mixBlendMode: 'normal' as const,
      borderRadius: '50%',
    },
    click: persona === 'dev' ? {
      width: 28,
      height: 28,
      backgroundColor: 'rgba(0, 255, 102, 0.25)',
      border: '1px solid #00FF66',
      mixBlendMode: 'normal' as const,
      borderRadius: '0px',
    } : persona === 'gentleman' ? {
      width: 10,
      height: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      border: '0px solid transparent',
      mixBlendMode: 'normal' as const,
      borderRadius: '50%',
    } : { // founder
      width: 40,
      height: 40,
      backgroundColor: 'rgba(0, 255, 255, 0.2)',
      border: '1px solid #00ffff',
      mixBlendMode: 'normal' as const,
      borderRadius: '50%',
    },
    hidden: {
      opacity: 0,
    }
  }

  if (!isVisible) return null

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] style-none"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
    >
      <motion.div
        variants={variants}
        animate={cursorState}
        transition={{ type: 'spring', damping: 25, stiffness: 250 }}
        className={`${persona === 'dev' ? 'rounded-none' : 'rounded-full'} flex items-center justify-center -translate-x-1/2 -translate-y-1/2`}
      >
        <AnimatePresence>
          {cursorState === 'drag' && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-[9px] font-mono text-[var(--color-orbital-teal)] tracking-wider whitespace-nowrap uppercase select-none"
            >
              DRAG
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
