'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Grid } from 'lucide-react'

export default function FloatingProjectsButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Mostrar solo si scrollearon más de 300px (para que no tape el hero principal de inmediato)
      if (window.scrollY > 300) {
        setVisible(true)
      } else {
        setVisible(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href="#projects"
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color-orbital-teal)] text-black shadow-[0_0_20px_var(--color-orbital-teal)] hover:scale-110 transition-transform cursor-pointer group"
          aria-label="Ir a Proyectos"
        >
          <Grid className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        </motion.a>
      )}
    </AnimatePresence>
  )
}
