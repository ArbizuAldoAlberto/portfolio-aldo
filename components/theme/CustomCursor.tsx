'use client'
import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { useCursor } from './CursorContext'

export default function CustomCursor() {
  const { cursorState } = useCursor()
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
    default: {
      width: 20,
      height: 20,
      backgroundColor: '#ffffff',
      mixBlendMode: 'difference' as const,
      border: '0px solid transparent',
    },
    drag: {
      width: 72,
      height: 72,
      backgroundColor: 'rgba(0, 255, 255, 0.03)',
      border: '1px dashed rgba(0, 255, 255, 0.7)',
      mixBlendMode: 'normal' as const,
    },
    click: {
      width: 40,
      height: 40,
      backgroundColor: 'rgba(0, 255, 255, 0.2)',
      border: '1px solid #00ffff',
      mixBlendMode: 'normal' as const,
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
        className="rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
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
