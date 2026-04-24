'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import GlobalCanvas from '../components/GlobalCanvas'

export default function NeonKineticPage() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Aggressive parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -600])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -900])
  const opacityHero = useTransform(scrollYProgress, [0, 0.15], [1, 0])

  return (
    <div ref={containerRef} className="relative min-h-[300vh] bg-transparent">
      {/* 3D Background */}
      <GlobalCanvas />

      {/* Hero Section */}
      <section className="h-screen sticky top-0 flex flex-col justify-center items-center text-center z-10 pointer-events-none mix-blend-screen">
        <motion.h1 
          style={{ opacity: opacityHero, y: y1 }} 
          className="text-6xl md:text-[10vw] font-display font-bold leading-none mb-6 px-4 text-white drop-shadow-[0_0_30px_rgba(255,0,127,0.5)]"
        >
          ALDO ARBIZU
        </motion.h1>
        <motion.p 
          style={{ opacity: opacityHero, y: y2 }} 
          className="text-lg md:text-2xl font-body uppercase tracking-[0.5em] text-[var(--color-cyan)] drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]"
        >
          Product Engineer & 3D Designer
        </motion.p>
      </section>

      {/* Content Section */}
      <section className="relative z-20 min-h-screen pt-[100vh] px-4 md:px-12">
        <div className="max-w-7xl mx-auto py-32">
          
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="glass-panel p-10 md:p-16 mb-40 backdrop-blur-3xl"
          >
            <h2 className="text-4xl md:text-7xl font-display text-neon-gradient mb-8 leading-tight">
              SYSTEM <br/> ARCHITECTURE.
            </h2>
            <p className="text-xl md:text-3xl leading-relaxed text-white/90 max-w-4xl font-light">
              Diseñando productos digitales resilientes. Desde aplicaciones <span className="text-[var(--color-cyan)] font-bold">React Native Offline-First</span> hasta integraciones avanzadas de <span className="text-[var(--color-purple)] font-bold">Smart Contracts</span> y Renderizado 3D Inmersivo.
            </p>
          </motion.div>

          {/* Projects Gallery */}
          <h2 className="text-5xl md:text-8xl font-display text-white/10 mb-16">MISSIONS</h2>
          
          <div className="grid md:grid-cols-2 gap-10">
            {[
              { t: 'TechZone', d: 'Offline-First E-commerce. Sincronización diferida con Redux Toolkit + SQLite.', c: 'from-[var(--color-cyan)] to-blue-600' },
              { t: 'VigiTrack', d: 'SaaS Multi-tenant para Seguridad Privada. Firebase Auth & Theme Engine.', c: 'from-[var(--color-magenta)] to-[var(--color-purple)]' },
              { t: 'AgroMarket', d: 'Web + Mobile Sync con Supabase y PostgreSQL para operarios de campo.', c: 'from-orange-500 to-[var(--color-magenta)]' },
              { t: 'Crypto Lab', d: 'Integración DeFi & Smart Contracts interactivos.', c: 'from-[var(--color-purple)] to-[var(--color-cyan)]' },
            ].map((p, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
                whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -15, scale: 1.02 }}
                transition={{ duration: 0.5 }}
                className={`glass-panel p-10 md:p-14 relative overflow-hidden group border border-white/10 hover:border-white/30`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${p.c} opacity-10 group-hover:opacity-30 transition-opacity duration-700 blur-xl`}></div>
                <h3 className="text-4xl md:text-5xl font-display text-white mb-6 relative z-10 tracking-tight">{p.t}</h3>
                <p className="text-lg md:text-xl font-body text-white/70 relative z-10 font-light">{p.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / Contact */}
      <section className="relative z-20 min-h-[80vh] flex items-center justify-center mt-32 pb-32">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-panel p-12 md:p-24 text-center max-w-5xl mx-4 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-cyan)] via-[var(--color-purple)] to-[var(--color-magenta)] opacity-20 blur-3xl"></div>
          
          <h2 className="text-6xl md:text-[8vw] font-display mb-8 text-white relative z-10 leading-none">
            INITIATE.
          </h2>
          <p className="text-xl md:text-2xl text-[var(--color-cyan)] mb-16 relative z-10 font-light tracking-widest uppercase">
            arbizualdoalberto@gmail.com
          </p>
          
          <a href="mailto:arbizualdoalberto@gmail.com" className="relative z-10 inline-block px-12 py-6 border border-[var(--color-magenta)] text-[var(--color-magenta)] font-display text-xl tracking-widest hover:bg-[var(--color-magenta)] hover:text-white hover:shadow-[0_0_40px_rgba(255,0,127,0.8)] transition-all duration-300 rounded-full">
            TRANSMIT SIGNAL
          </a>
        </motion.div>
      </section>
    </div>
  )
}
