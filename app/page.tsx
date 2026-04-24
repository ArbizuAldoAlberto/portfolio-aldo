'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import GlobalCanvas from '../components/GlobalCanvas'

export default function ScrollytellingPage() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200])
  const opacityHero = useTransform(scrollYProgress, [0, 0.15], [1, 0])

  // 1. OPTIMIZACIÓN UI: Variantes de animación en cascada (Staggering)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
  }

  return (
    <div ref={containerRef} className="relative bg-transparent">
      <GlobalCanvas />

      {/* --- SECCIÓN 0: HERO --- */}
      <section className="h-screen sticky top-0 flex flex-col justify-center items-center text-center px-6 z-10 pointer-events-none mix-blend-difference">
        <motion.div style={{ opacity: opacityHero, y: y1 }}>
          <p className="font-space text-xs uppercase tracking-[0.4em] text-white/50 mb-8">
            Portfolio / 2026
          </p>
          <h1 className="text-6xl md:text-[8vw] font-serif font-light leading-none tracking-tighter text-white mb-6">
            ALDO ARBIZU
          </h1>
          <p className="font-mono text-lg md:text-xl text-[var(--color-orbital-teal)] max-w-xl font-light mx-auto">
            Ingeniería Offline-First, Web3 & Hardware 3D.
          </p>
        </motion.div>
      </section>

      <div className="relative z-20 pointer-events-none">
        
        {/* --- SECCIÓN 1: MANIFESTO (Offline-First & n8n) --- */}
        <section className="min-h-screen pt-[100vh] px-6 md:px-24 flex flex-col justify-center">
          {/* 2. OPTIMIZACIÓN UI: Glassmorphism layer to ensure text contrast */}
          <div className="max-w-2xl pointer-events-auto bg-black/40 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10%" }}
            >
              <motion.h2 variants={itemVariants} className="text-5xl md:text-7xl font-serif font-light text-white leading-tight mb-8">
                Ingeniería <br/><span className="italic text-[var(--color-electric-purple)]">Resiliente.</span>
              </motion.h2>
              <motion.div variants={itemVariants} className="w-16 h-[1px] bg-white/20 mb-8"></motion.div>
              
              {/* 3. OPTIMIZACIÓN DE CONTENIDO: Copywriting preciso basado en el CV real */}
              <motion.p variants={itemVariants} className="font-mono text-xl text-white/70 leading-relaxed font-light mb-6">
                Construyo sistemas que no se detienen. Mi obsesión por las arquitecturas <span className="text-white">Offline-First</span> nace de la seguridad privada, donde las apps no pueden fallar sin señal. Implemento sincronización diferida usando SQLite, React Native y Redux.
              </motion.p>
              <motion.p variants={itemVariants} className="font-mono text-lg text-white/50 leading-relaxed font-light">
                Además, orquesto flujos de trabajo hiper-eficientes utilizando <span className="text-white">n8n</span> y automatizaciones con IA para reducir tiempos operativos empresariales a cero.
              </motion.p>
            </motion.div>
          </div>
        </section>

        <div className="h-[30vh]"></div>

        {/* --- SECCIÓN 2: PROYECTOS / WEB3 / 3D HARDWARE --- */}
        <section className="min-h-screen px-6 md:px-24 flex flex-col justify-center items-end">
          <div className="max-w-2xl w-full pointer-events-auto ml-auto bg-black/40 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10%" }}
            >
              <motion.h2 variants={itemVariants} className="text-5xl md:text-7xl font-serif font-light text-white leading-tight mb-8 text-right">
                El Stack <br/><span className="italic text-[#FFB800]">Descentralizado.</span>
              </motion.h2>
              <motion.div variants={itemVariants} className="w-full border-t border-white/10 mt-12">
                {[
                  { n: 'Smart Contracts', t: 'Desarrollo Web3, DeFi y Criptomonedas', y: 'Blockchain' },
                  { n: 'Hardware 3D', t: 'Diseño, impresión y venta comercial de repuestos y drones', y: 'Fabricación' },
                  { n: 'SaaS Multi-tenant', t: 'Arquitecturas complejas B2B en React Native & Firebase', y: 'Cloud' }
                ].map((p, i) => (
                  <motion.div key={i} variants={itemVariants} className="py-8 border-b border-white/10 group cursor-pointer hover:border-[#FFB800] transition-colors flex justify-between items-center">
                    <div>
                      <h3 className="text-3xl font-serif font-light text-white/80 group-hover:text-white transition-colors">{p.n}</h3>
                      <p className="font-mono text-sm text-white/50 mt-2">{p.t}</p>
                    </div>
                    <span className="font-space text-xs text-[#FFB800]/50 tracking-wider uppercase">{p.y}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        <div className="h-[40vh]"></div>

        {/* --- SECCIÓN 3: CONTACTO --- */}
        <section className="min-h-[80vh] flex flex-col justify-center items-center text-center px-6 pb-32 pointer-events-none">
          <div className="pointer-events-auto bg-black/30 backdrop-blur-md p-12 rounded-[3rem] border border-white/5 shadow-2xl">
            <h2 className="text-5xl md:text-8xl font-serif font-light text-white leading-none mb-12 mix-blend-difference">
              Initiate <br/><span className="italic">Signal.</span>
            </h2>
            <a href="mailto:arbizualdoalberto@gmail.com" aria-label="Enviar correo electrónico a Aldo Arbizu" className="inline-block px-12 py-6 border border-white/20 text-white/80 font-space tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500 uppercase text-sm rounded-full">
              arbizualdoalberto@gmail.com
            </a>
          </div>
        </section>

      </div>
    </div>
  )
}
