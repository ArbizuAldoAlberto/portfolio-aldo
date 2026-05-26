'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const bootSequence = [
  { text: 'ANTIGRAVITY STUDIO', delay: 200, type: 'brand' },
  { text: 'Initializing kernel modules...', delay: 400, type: 'system' },
  { text: 'Loading PersonaContext [DEV|FOUNDER|GENTLEMAN]', delay: 350, type: 'info' },
  { text: 'Mounting React Three Fiber canvas pipeline', delay: 300, type: 'info' },
  { text: 'Connecting Web Audio API synthesizer', delay: 250, type: 'info' },
  { text: 'DefenseClaw security gate verified [PASS]', delay: 300, type: 'success' },
  { text: 'All systems nominal. Launching interface.', delay: 200, type: 'success' }
]

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true)
  const [currentLine, setCurrentLine] = useState(0)
  const [progress, setProgress] = useState(0)
  const [logoRevealed, setLogoRevealed] = useState(false)

  // Check if first visit
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('preloader_shown')
    if (hasVisited) {
      setIsLoading(false)
      return
    }

    // Reveal logo first
    const logoTimer = setTimeout(() => setLogoRevealed(true), 300)
    
    // Run boot sequence
    let totalDelay = 800
    bootSequence.forEach((line, index) => {
      totalDelay += line.delay
      setTimeout(() => {
        setCurrentLine(index + 1)
        setProgress(((index + 1) / bootSequence.length) * 100)
      }, totalDelay)
    })

    // Complete preloader
    const completeTimer = setTimeout(() => {
      sessionStorage.setItem('preloader_shown', 'true')
      setIsLoading(false)
    }, totalDelay + 600)

    return () => {
      clearTimeout(logoTimer)
      clearTimeout(completeTimer)
    }
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          exit={{ 
            clipPath: 'inset(0 0 100% 0)',
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const }
          }}
          className="fixed inset-0 z-[200] bg-[#050508] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Background grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] opacity-40 pointer-events-none" />

          {/* Central glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_400px_at_50%_50%,rgba(29,158,117,0.06),transparent)] pointer-events-none" />

          {/* Logo SVG — Stylized "A" */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={logoRevealed ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mb-12"
          >
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <motion.path
                d="M40 8 L68 72 L56 72 L48 52 L32 52 L24 72 L12 72 L40 8 Z"
                stroke="var(--color-orbital-teal, #1D9E75)"
                strokeWidth="1.5"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: logoRevealed ? 1 : 0 }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
              />
              <motion.path
                d="M40 8 L68 72 L56 72 L48 52 L32 52 L24 72 L12 72 L40 8 Z"
                fill="var(--color-orbital-teal, #1D9E75)"
                initial={{ opacity: 0 }}
                animate={{ opacity: logoRevealed ? 0.1 : 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              />
              {/* Inner triangle cutout */}
              <motion.path
                d="M40 28 L48 48 L32 48 Z"
                stroke="var(--color-orbital-teal, #1D9E75)"
                strokeWidth="1"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: logoRevealed ? 1 : 0 }}
                transition={{ duration: 0.8, delay: 0.8, ease: 'easeInOut' }}
              />
            </svg>
          </motion.div>

          {/* Boot Sequence Lines */}
          <div className="w-80 max-w-[90vw] space-y-1.5 mb-10 font-mono text-[10px]">
            {bootSequence.slice(0, currentLine).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className={
                  line.type === 'brand' ? 'text-white font-bold text-sm font-space tracking-[0.3em] text-center mb-4' :
                  line.type === 'success' ? 'text-[#1D9E75]' :
                  line.type === 'info' ? 'text-[#C2C0B6]/60' :
                  'text-[#C2C0B6]/40'
                }
              >
                {line.type !== 'brand' && <span className="text-[#C2C0B6]/20 mr-2">{'>'}</span>}
                {line.text}
              </motion.div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="w-80 max-w-[90vw]">
            <div className="h-px w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #1D9E75, #7F77DD)' }}
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
            <div className="flex justify-between mt-2 font-mono text-[8px] text-[#C2C0B6]/30">
              <span>LOADING</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
