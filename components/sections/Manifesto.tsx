'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import GlitchText from '../ui/GlitchText'
import RevealText from '../ui/RevealText'
import { usePersona } from '../theme/PersonaContext'
import { useTranslations } from 'next-intl'

export default function Manifesto() {
  const { persona } = usePersona()
  const t = useTranslations(`Manifesto.${persona}`)
  const tTime = useTranslations('Manifesto.timeline')
  
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  })

  // Parallax effects
  const bgNumberY = useTransform(scrollYProgress, [0, 1], [50, -80])
  const bgNumberOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 0.05, 0.05, 0])

  const content = {
    sectionLabel: t('sectionLabel'),
    title: t('title'),
    body: t('body'),
    p1Num: t('p1Num'),
    p1Title: t('p1Title'),
    p1Desc: t('p1Desc'),
    p2Num: t('p2Num'),
    p2Title: t('p2Title'),
    p2Desc: t('p2Desc'),
    p3Num: t('p3Num'),
    p3Title: t('p3Title'),
    p3Desc: t('p3Desc')
  }

  const pillarVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const
      }
    })
  }

  return (
    <section id="manifesto" ref={sectionRef} className="relative py-32 overflow-hidden border-t border-[var(--color-space-border)]">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-space text-[var(--color-mist-gray)] uppercase tracking-widest text-sm mb-4 block select-none"
        >
          {content.sectionLabel}
        </motion.span>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={persona}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3 }}
          >
            {/* Title with word-by-word reveal */}
            <motion.h2
              ref={titleRef}
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/40 mb-8 max-w-4xl leading-tight"
            >
              <GlitchText delay={0.1} text={content.title} />
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-mono text-lg text-[var(--color-mist-gray)] max-w-2xl mb-16 leading-relaxed"
            >
              {content.body}
            </motion.p>

            {/* Pillar cards with stagger */}
            <div className="grid md:grid-cols-3 gap-6 mb-20">
              {[
                { num: content.p1Num, title: content.p1Title, desc: content.p1Desc },
                { num: content.p2Num, title: content.p2Title, desc: content.p2Desc },
                { num: content.p3Num, title: content.p3Title, desc: content.p3Desc }
              ].map((pillar, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={pillarVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  whileHover={{ 
                    y: -4, 
                    transition: { duration: 0.3 },
                    boxShadow: '0 12px 40px rgba(29, 158, 117, 0.08)'
                  }}
                  className="glass-surface p-8 group"
                >
                  <div className="text-[var(--color-orbital-teal)] font-space mb-4 font-bold text-lg group-hover:text-gradient transition-all">{pillar.num}</div>
                  <h3 className="font-serif text-2xl text-white mb-3 group-hover:text-[var(--color-orbital-teal)] transition-colors duration-300">{pillar.title}</h3>
                  <p className="font-mono text-sm text-[var(--color-mist-gray)]">{pillar.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Timeline with pulse-on-enter */}
        <div className="space-y-6 border-l border-[var(--color-space-border)] pl-6 ml-4">
          {[
            { y: '2020', t: tTime('item1') },
            { y: '2022', t: tTime('item2') },
            { y: '2023', t: tTime('item3') },
            { y: '2024', t: tTime('item4') },
            { y: '2025', t: tTime('item5') },
            { y: '2026', t: tTime('item6') }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const }}
              className="relative flex items-center group"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.08 + 0.2, type: 'spring', stiffness: 400 }}
                className="absolute -left-[31px] w-3 h-3 bg-[var(--color-space-black)] border-2 border-[var(--color-orbital-teal)] rounded-full group-hover:bg-[var(--color-orbital-teal)] group-hover:shadow-[0_0_12px_rgba(29,158,117,0.5)] transition-all duration-300"
              />
              <span className="font-space text-[var(--color-orbital-teal)] w-16 shrink-0 font-bold group-hover:text-white transition-colors">{item.y}</span>
              <span className="font-mono text-[var(--color-mist-gray)] text-sm group-hover:text-white transition-colors">{item.t}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
