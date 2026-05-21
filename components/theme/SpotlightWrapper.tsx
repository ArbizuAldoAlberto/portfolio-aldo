'use client'
import { useEffect } from 'react'

export default function SpotlightWrapper() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Set absolute pixels on HTML root element for exact mouse gradient positioning
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`)
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`)
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return null
}
