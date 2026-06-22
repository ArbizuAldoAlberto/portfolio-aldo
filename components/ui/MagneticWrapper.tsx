'use client'
import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface MagneticWrapperProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

export default function MagneticWrapper({ children, strength = 40, className = '' }: MagneticWrapperProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e
    if (!ref.current) return
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    const x = clientX - (left + width / 2)
    const y = clientY - (top + height / 2)
    const factor = strength / 100
    setPosition({ x: x * factor, y: y * factor })
  }

  const handleMouseLeave = () => { setPosition({ x: 0, y: 0 }) }

  return (
    <motion.div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} animate={position} transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }} className={className}>
      {children}
    </motion.div>
  )
}

