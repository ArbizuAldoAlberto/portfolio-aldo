'use client'
import { useEffect, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false)
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  const springConfig = { damping: 25, stiffness: 250 }
  const x = useSpring(cursorX, springConfig)
  const y = useSpring(cursorY, springConfig)

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const handleHover = () => setIsHovered(true)
    const handleUnhover = () => setIsHovered(false)

    window.addEventListener('mousemove', moveCursor)
    
    const interactables = document.querySelectorAll('a, button, .interactive')
    interactables.forEach((el) => {
      el.addEventListener('mouseenter', handleHover)
      el.addEventListener('mouseleave', handleUnhover)
    })

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      interactables.forEach((el) => {
        el.removeEventListener('mouseenter', handleHover)
        el.removeEventListener('mouseleave', handleUnhover)
      })
    }
  }, [cursorX, cursorY])

  return (
    <>
      <motion.div
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-emerald-500/50 pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        animate={{
          scale: isHovered ? 2.5 : 1,
          backgroundColor: isHovered ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
        }}
      />
      <motion.div
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
        className="fixed top-0 left-0 w-1 h-1 bg-emerald-400 rounded-full pointer-events-none z-[9999] hidden md:block"
      />
    </>
  )
}
