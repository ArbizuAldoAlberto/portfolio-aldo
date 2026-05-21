'use client'
import { motion } from 'framer-motion'
import GlitchText from '../ui/GlitchText'

export default function Manifesto() {
  return (
    <section id="manifesto" className="relative py-32 overflow-hidden border-t border-[var(--color-space-border)]">
      {/* Huge Background Number */}
      <div className="absolute top-0 right-10 text-[200px] font-serif opacity-5 leading-none pointer-events-none text-white select-none">
        02
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <span className="font-space text-[var(--color-mist-gray)] uppercase tracking-widest text-sm mb-4 block">
          Manifesto
        </span>
        
        <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-8 max-w-2xl leading-tight">
          <GlitchText text="Construyo software que sobrevive a la realidad del campo." />
        </h2>
        
        <p className="font-mono text-lg text-[var(--color-mist-gray)] max-w-2xl mb-16 leading-relaxed">
          Trabajé en seguridad privada. Vi cómo las apps fallaban sin señal. Así nació mi obsesión por arquitecturas Offline-First. No hago portfolios de demo — hago software que funciona donde nadie más lo pensó.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {[
            { n: '01', title: 'Offline-First', desc: 'Si no funciona sin internet, no funciona. Redux + SQLite sincronizado.' },
            { n: '02', title: 'Security by Design', desc: 'OWASP Mobile en cada proyecto. Siempre.' },
            { n: '03', title: 'Product Vision', desc: 'No solo código: arquitectura, 3D hardware y métricas de negocio.' }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-surface p-8"
            >
              <div className="text-[var(--color-orbital-teal)] font-space mb-4">{item.n}</div>
              <h3 className="font-serif text-2xl text-white mb-3">{item.title}</h3>
              <p className="font-mono text-sm text-[var(--color-mist-gray)]">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Timeline */}
        <div className="space-y-6 border-l border-[var(--color-space-border)] pl-6 ml-4">
          {[
            { y: '2020', t: 'Especialista tecnológico en seguridad privada (Custodiar)' },
            { y: '2022', t: 'Freelance fulltime — fundación de Antigravity Studio' },
            { y: '2023', t: 'Fullstack MERN · Primer SaaS multi-tenant' },
            { y: '2024', t: 'Diplomatura Ciberseguridad UNGS · TechZone offline-first' },
            { y: '2025', t: 'Analista Maipu Seguridad · VigiTrack architecture' },
            { y: '2026', t: 'Crypto/DeFi engineering · 3D Prototyping Integration' }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative flex items-center"
            >
              <div className="absolute -left-[31px] w-3 h-3 bg-[var(--color-space-black)] border border-[var(--color-orbital-teal)] rounded-full"></div>
              <span className="font-space text-[var(--color-orbital-teal)] w-16 shrink-0">{item.y}</span>
              <span className="font-mono text-[var(--color-mist-gray)] text-sm">{item.t}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
