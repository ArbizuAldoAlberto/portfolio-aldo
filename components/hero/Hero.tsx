'use client'
import { motion } from 'framer-motion'
import Hero3D from './Hero3D'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-10 overflow-hidden">
      {/* 3D Background on Mobile, Side on Desktop */}
      <div className="absolute inset-0 md:left-1/2 md:w-1/2 md:h-full z-0 opacity-40 md:opacity-100">
        <Hero3D />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pointer-events-none flex">
        <div className="w-full md:w-3/5 pointer-events-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-space-border)] bg-[var(--color-deep-space)]/50 mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-[var(--color-orbital-teal)] animate-pulse"></span>
            <span className="text-xs font-space uppercase tracking-wider text-[var(--color-mist-gray)]">Disponible para proyectos — AR / Remote</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-6xl md:text-8xl font-serif font-bold tracking-tight mb-6 text-white"
          >
            Aldo Arbizu.
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-[var(--color-orbital-teal)] font-mono mb-6 leading-relaxed"
          >
            {">"} Arquitecturas Offline-First que funcionan sin señal._<br/>
            {">"} Integración de Blockchain & Smart Contracts._<br/>
            {">"} Diseño 3D y Hardware Fusion._
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-sm font-space text-[var(--color-mist-gray)] mb-10"
          >
            Product Engineer · React Native · Fullstack · Antigravity Studio
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <a href="#projects" className="btn-primary">
              Ver proyectos →
            </a>
            <a href="#contact" className="btn-outline">
              Contratame
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
