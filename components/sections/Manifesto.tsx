'use client'
import { motion, AnimatePresence } from 'framer-motion'
import GlitchText from '../ui/GlitchText'
import { usePersona } from '../theme/PersonaContext'

export default function Manifesto() {
  const { persona } = usePersona()

  // Dynamic manifesto details
  const getManifestoContent = () => {
    switch (persona) {
      case 'dev':
        return {
          title: 'Código limpio que sobrevive en producción real.',
          body: 'Pasé años en seguridad física e informática. Sé lo que es que un servidor falle en medio de sótanos blindados u operaciones sin señal. Por eso me especialicé en sincronización incremental (SQLite WAL + Firebase) y blindaje contra OWASP Mobile Top 10.',
          p1Num: '01',
          p1Title: 'Offline-First Kernels',
          p1Desc: 'Zustand + SQLite. Transacciones atómicas locales reconciliadas de forma incremental.',
          p2Num: '02',
          p2Title: 'Security by Design',
          p2Desc: 'SQLCipher local, SSL pinning, y auditorías estáticas automatizadas con DefenseClaw.',
          p3Num: '03',
          p3Title: 'Native Bare Mappings',
          p3Desc: 'Puentes de Native Modules optimizados y optimización de recolector de basura JS.'
        }
      case 'gentleman':
        return {
          title: 'La armonía entre la matemática del código y la sobriedad.',
          body: 'El software no debe ser una acumulación tosca de librerías; es una arquitectura artesanal. Creo en el diseño sobrio, los detalles invisibles y el minimalismo intencional. Menos ruido visual se traduce directamente en claridad operativa.',
          p1Num: '01',
          p1Title: 'Pureza Estructural',
          p1Desc: 'Código limpio, modularizado y auto-documentado que se lee como un texto clásico.',
          p2Num: '02',
          p2Title: 'Artesanía del Píxel',
          p2Desc: 'Modelado interactivo en Blender y renders optimizados en WebGL para interfaces inolvidables.',
          p3Num: '03',
          p3Title: 'Ingeniería de Autor',
          p3Desc: 'Cada producto digital se desarrolla como una firma única de diseño, elegancia e ingeniería.'
        }
      case 'founder':
      default:
        return {
          title: 'Construyo software que sobrevive a la realidad del campo.',
          body: 'Trabajé en seguridad privada. Vi cómo las apps fallaban sin señal en sótanos y áreas rurales. Así nació mi obsesión por las arquitecturas Offline-First. No hago prototipos de vitrina — hago software resiliente que funciona donde otros fallan.',
          p1Num: '01',
          p1Title: 'Resiliencia Móvil',
          p1Desc: 'Si no funciona sin internet, no funciona. Redux + SQLite sincronizado de forma inteligente.',
          p2Num: '02',
          p2Title: 'Security by Design',
          p2Desc: 'Cumplimiento OWASP Mobile y auditoría estática automatizada en pre-commits.',
          p3Num: '03',
          p3Title: 'Product Vision',
          p3Desc: 'No solo código: arquitectura comercial escalable, prototipado 3D y telemetría de negocio.'
        }
    }
  }

  const content = getManifestoContent()

  return (
    <section id="manifesto" className="relative py-32 overflow-hidden border-t border-[var(--color-space-border)]">
      {/* Huge Background Number */}
      <div className="absolute top-0 right-10 text-[200px] font-serif opacity-5 leading-none pointer-events-none text-white select-none">
        02
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <span className="font-space text-[var(--color-mist-gray)] uppercase tracking-widest text-sm mb-4 block select-none">
          Manifesto
        </span>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={persona}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-8 max-w-3xl leading-tight">
              <GlitchText text={content.title} />
            </h2>
            
            <p className="font-mono text-lg text-[var(--color-mist-gray)] max-w-2xl mb-16 leading-relaxed">
              {content.body}
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-20">
              <div className="glass-surface p-8">
                <div className="text-[var(--color-orbital-teal)] font-space mb-4 font-bold">{content.p1Num}</div>
                <h3 className="font-serif text-2xl text-white mb-3">{content.p1Title}</h3>
                <p className="font-mono text-sm text-[var(--color-mist-gray)]">{content.p1Desc}</p>
              </div>

              <div className="glass-surface p-8">
                <div className="text-[var(--color-orbital-teal)] font-space mb-4 font-bold">{content.p2Num}</div>
                <h3 className="font-serif text-2xl text-white mb-3">{content.p2Title}</h3>
                <p className="font-mono text-sm text-[var(--color-mist-gray)]">{content.p2Desc}</p>
              </div>

              <div className="glass-surface p-8">
                <div className="text-[var(--color-orbital-teal)] font-space mb-4 font-bold">{content.p3Num}</div>
                <h3 className="font-serif text-2xl text-white mb-3">{content.p3Title}</h3>
                <p className="font-mono text-sm text-[var(--color-mist-gray)]">{content.p3Desc}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Timeline */}
        <div className="space-y-6 border-l border-[var(--color-space-border)] pl-6 ml-4">
          {[
            { y: '2020', t: 'Especialista tecnológico en seguridad privada (Custodiar)' },
            { y: '2022', t: 'Freelance fulltime — fundación de Antigravity Studio' },
            { y: '2023', t: 'Fullstack MERN · Primer SaaS multi-tenant comercializado' },
            { y: '2024', t: 'Diplomatura Ciberseguridad UNGS · TechZone offline-first sync' },
            { y: '2025', t: 'Analista Maipu Seguridad · VigiTrack core architecture' },
            { y: '2026', t: 'Crypto/DeFi engineering · 3D Prototyping & Universal Cart Integration' }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative flex items-center"
            >
              <div className="absolute -left-[31px] w-3 h-3 bg-[var(--color-space-black)] border border-[var(--color-orbital-teal)] rounded-full"></div>
              <span className="font-space text-[var(--color-orbital-teal)] w-16 shrink-0 font-bold">{item.y}</span>
              <span className="font-mono text-[var(--color-mist-gray)] text-sm">{item.t}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
