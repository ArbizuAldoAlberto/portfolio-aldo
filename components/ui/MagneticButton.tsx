'use client'
import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface MagneticButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'outline' | 'ghost'
  href?: string
  onClick?: () => void
  className?: string
  strength?: number
  target?: string
  rel?: string
}

export default function MagneticButton({
  children,
  variant = 'primary',
  href,
  onClick,
  className = '',
  strength = 30,
  target,
  rel
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const { clientX, clientY } = e
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    
    const x = ((clientX - left) / width - 0.5) * strength
    const y = ((clientY - top) / height - 0.5) * strength
    setPosition({ x, y })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
    setIsHovered(false)
  }

  const baseClasses = "relative overflow-hidden inline-flex items-center justify-center transition-colors duration-300 group"
  
  const variants = {
    primary: "bg-[var(--color-orbital-teal)] text-black px-6 py-3 rounded-xl font-bold border border-transparent",
    outline: "bg-transparent text-[var(--color-mist-gray)] hover:text-white px-5 py-2.5 rounded-lg text-sm font-bold border border-[var(--color-space-border)]",
    ghost: "bg-transparent text-[var(--color-mist-gray)] hover:text-white px-4 py-2 font-medium"
  }

  const fillVariants = {
    primary: "bg-gradient-to-r from-white/20 to-transparent",
    outline: "bg-[var(--color-orbital-teal)]",
    ghost: "bg-white/5 rounded-lg"
  }

  const classes = `${baseClasses} ${variants[variant]} ${className}`

  const MotionComponent = motion(href ? 'a' : 'button') as any

  return (
    <MotionComponent
      ref={ref as any}
      href={href}
      onClick={onClick}
      target={target}
      rel={rel}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      className={classes}
    >
      {/* Fill effect */}
      {variant !== 'ghost' && (
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: isHovered ? 1.05 : 0, 
            opacity: isHovered ? 1 : 0 
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={`absolute inset-0 origin-center rounded-lg ${fillVariants[variant]}`}
          style={{ zIndex: 0 }}
        />
      )}
      
      {variant === 'ghost' && (
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: isHovered ? '100%' : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-0 left-0 h-[1px] bg-[var(--color-orbital-teal)]"
        />
      )}

      {/* When hovered on outline, the text needs to change color or be mixed properly, so let's rely on CSS and standard class group-hover */}
      <span className={`relative z-10 flex items-center justify-center gap-2 ${variant === 'outline' && isHovered ? 'text-black' : ''} transition-colors duration-300`}>
        {children}
      </span>
    </MotionComponent>
  )
}
