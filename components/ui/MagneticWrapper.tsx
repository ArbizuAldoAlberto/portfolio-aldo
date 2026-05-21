'use client'
import { useRef, useState, ReactNode } from 'react'
import { motion } from 'framer-motion'

interface MagneticWrapperProps {
  children: ReactNode
  strength?: number
}

export default function MagneticWrapper({ children, strength = 40 }: MagneticWrapperProps) {
  const sensorRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sensorRef.current) return
    const { clientX, clientY } = e
    // Measure bounding box of the stationary sensor, not the moving child!
    const { height, width, left, top } = sensorRef.current.getBoundingClientRect()
    
    const centerX = left + width / 2
    const centerY = top + height / 2

    const distanceX = clientX - centerX
    const distanceY = clientY - centerY

    setPosition({ x: (distanceX / width) * strength, y: (distanceY / height) * strength })
  }

  const reset = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    // The sensor remains stationary to avoid jitter loops
    <div
      ref={sensorRef}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      className="inline-block relative z-10 p-2 -m-2 cursor-none" // Extra padding to increase catch area
    >
      <motion.div
        animate={{ x: position.x, y: position.y }}
        transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      >
        {children}
      </motion.div>
    </div>
  )
}
