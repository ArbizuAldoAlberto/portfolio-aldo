'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import GlitchText from '../ui/GlitchText'
import RevealText from '../ui/RevealText'
import { usePersona } from '../theme/PersonaContext'

export default function Manifesto() {
  const { persona } = usePersona()
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  })

  // Parallax effects
  const bgNumberY = useTransform(scrollYProgress, [0, 1], [50, -80])
  const bgNumberOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 0.05, 0.05, 0])

  // Dynamic manifesto details
  const getManifestoContent = () => {
    switch (persona) {
      case 'engineer':
        return {
          title: 'Código blindado diseñado para sobrevivir en producción real.',
          body: 'Mi trayectoria técnica comenzó en la seguridad física y la ciberseguridad (UNGS). Entiendo la fragilidad de las conexiones móviles en sótanos de hormigón, patrullas perimetrales y terminales logísticas. Por eso me especialicé en estructurar kernels móviles en React Native (Expo Bare) con persistencia local robusta (SQLite en modo WAL + Zustand) y en blindar aplicaciones de extremo a extremo bajo los exigentes estándares de seguridad OWASP MASVS.',
          p1Num: '01',
          p1Title: 'Local Sync Coherence',
          p1Desc: 'Sincronización incremental bidireccional y manejo inmutable de colas de transacciones locales para evitar conflictos de base de datos.',
          p2Num: '02',
          p2Title: 'Security by Design',
          p2Desc: 'Cifrado SQLCipher local, firmas criptográficas de telemetría y escaneos de código estáticos en pre-compilación.',
          p3Num: '03',
          p3Title: 'Native Bridges & Performance',
          p3Desc: 'Optimización a nivel de hilos Swift/Kotlin, y calibración de ciclos del recolector de basura de JavaScript para evitar lags.'
        }
      case 'agtech':
        return {
          title: 'La unión invisible entre la matemática del código y la sobriedad estética.',
          body: 'El software no es apilar dependencias ruidosas; es una disciplina de diseño artesanal. Creo en las interfaces limpias, el audio háptico procedural y las mallas 3D fluidas modeladas a medida. Diseñar es simplificar: quitar el exceso visual para revelar la elegancia técnica del producto. Cada línea de código responde a los más altos estándares estéticos y funcionales, entregando un producto del que nos sintamos orgullosos.',
          p1Num: '01',
          p1Title: 'Pureza Estructural',
          p1Desc: 'Código limpio, modular y auto-documentado que se lee con la claridad y precisión de un texto clásico.',
          p2Num: '02',
          p2Title: 'Artesanía Digital 3D',
          p2Desc: 'Modelado a medida en Blender y optimización WebGL para lograr interfaces interactivas fluidas que cargan al instante.',
          p3Num: '03',
          p3Title: 'Diseño de Autor',
          p3Desc: 'Cada producto digital se firma como una obra singular de ingeniería, balance visual y respuesta sensorial.'
        }
      case 'security':
      default:
        return {
          title: 'Construyo software diseñado para resistir las fallas del mundo real.',
          body: 'Vengo del mundo de la seguridad privada (Maipu Seguridad, Custodiar) y ciberseguridad. En ese sector, si un sistema falla en un sótano o en un campo remoto, el impacto no es un bug molesto: es una vulnerabilidad real y una pérdida de dinero. Por eso me obsesioné con el desarrollo Offline-First y SQLite WAL. No construyo prototipos frágiles de escritorio; creo software resiliente que asegura que tus ventas sigan procesándose, tus empleados sigan reportando y tu negocio siga capturando valor, sin importar las condiciones de red.',
          p1Num: '01',
          p1Title: 'Retorno y Continuidad',
          p1Desc: 'Si tu aplicación falla cuando cae la señal celular, perdés dinero. Diseñamos con almacenamiento local atómico para asegurar que cada interacción cuente.',
          p2Num: '02',
          p2Title: 'Seguridad y Confianza',
          p2Desc: 'Protegemos tus activos de información. Implementamos cifrado local y realizamos auditorías de seguridad automáticas (MARTA QA) previas a cada despliegue.',
          p3Num: '03',
          p3Title: 'Visión de Negocio',
          p3Desc: 'El código es el medio, no el fin. Diseñamos plataformas SaaS escalables preparadas para capturar leads, procesar cobros y generar valor real 24/7.'
        }
    }
  }

  const content = getManifestoContent()

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
      {/* Huge Background Number with parallax */}
      <motion.div
        style={{ y: bgNumberY, opacity: bgNumberOpacity }}
        className="absolute top-0 right-10 text-[200px] font-serif leading-none pointer-events-none text-white select-none"
      >
        02
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-space text-[var(--color-mist-gray)] uppercase tracking-widest text-sm mb-4 block select-none"
        >
          Manifesto
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
            { y: '2020', t: 'Especialista tecnológico en seguridad privada (Custodiar)' },
            { y: '2022', t: 'Freelance fulltime — fundación de Arbizu Labs' },
            { y: '2023', t: 'Fullstack MERN · Primer SaaS multi-tenant comercializado' },
            { y: '2024', t: 'Diplomatura Ciberseguridad UNGS · TechZone offline-first sync' },
            { y: '2025', t: 'Analista Maipu Seguridad · VigiTrack core architecture' },
            { y: '2026', t: 'Crypto/DeFi engineering · 3D Prototyping & Universal Cart Integration' }
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
