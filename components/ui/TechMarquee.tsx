'use client'
import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const coreStack = [
  'React Native', 'Next.js 16', 'TypeScript', 'Expo EAS', 'Three.js', 'Node.js',
  'PostgreSQL', 'SQLite', 'Firebase', 'Supabase', 'Zustand', 'Framer Motion'
]

const tools = [
  'n8n', 'Docker', 'GitHub Actions', 'Blender', 'Figma', 'Vercel',
  'Resend', 'Stripe', 'Ethers.js', 'PM2', 'Nginx', 'TailwindCSS'
]

function MarqueeRow({ items, speed = 40, reverse = false }: { items: string[], speed?: number, reverse?: boolean }) {
  const [duplicatedItems] = useState([...items, ...items, ...items])

  return (
    <div className="relative overflow-hidden py-3 group">
      {/* Fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[var(--color-space-black)] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[var(--color-space-black)] to-transparent pointer-events-none" />
      
      <div
        className={`flex gap-4 whitespace-nowrap ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}
        style={{
          animationDuration: `${speed}s`,
          animationPlayState: 'running'
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.animationPlayState = 'paused' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.animationPlayState = 'running' }}
      >
        {duplicatedItems.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--color-space-border)] bg-[var(--color-deep-space)]/60 text-[var(--color-mist-gray)] font-space text-xs tracking-wider uppercase hover:border-[var(--color-orbital-teal)]/40 hover:text-white transition-all duration-300 select-none shrink-0"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-orbital-teal)]/40" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function TechMarquee() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.3], [30, 0])

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y }}
      className="relative py-12 border-t border-b border-[var(--color-space-border)] overflow-hidden bg-[var(--color-space-black)]"
    >
      {/* Background accent */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_600px_at_50%_50%,rgba(29,158,117,0.03),transparent)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--color-space-border)] to-transparent" />
          <span className="font-space text-[9px] uppercase tracking-[0.3em] text-[var(--color-mist-gray)]/40 select-none">
            Tecnologías Dominadas
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--color-space-border)] to-transparent" />
        </div>
      </div>

      <MarqueeRow items={coreStack} speed={45} />
      <MarqueeRow items={tools} speed={55} reverse />
    </motion.div>
  )
}
