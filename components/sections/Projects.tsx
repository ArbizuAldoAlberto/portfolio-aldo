'use client'
import { motion } from 'framer-motion'
import { Code, ExternalLink } from 'lucide-react'

const projects = [
  {
    title: 'TechZone',
    role: 'Offline-First E-commerce',
    problem: 'Comercios en zonas con conectividad inestable necesitaban e-commerce que no dependiera de señal constante.',
    solution: 'Arquitectura Single Source of Truth local: Redux Toolkit + SQLite → sincronización diferida con Firestore.',
    stack: ['React Native', 'Expo', 'Firebase', 'SQLite', 'Redux'],
    link: 'github.com/ArbizuAldoAlberto/TechZone-E-commerce'
  },
  {
    title: 'VigiTrack',
    role: 'SaaS de Seguridad Privada',
    problem: 'Empresas de seguridad sin sistema digital de rondas. Excel y papel como única herramienta operativa.',
    solution: 'Plataforma SaaS white-label multi-tenant. Una sola app, infinitas empresas. Theme Engine y Custom Claims.',
    stack: ['React Native', 'EAS', 'Firebase Auth', 'Firestore Rules'],
    link: '#'
  },
  {
    title: 'AgroMarket Pro',
    role: 'Web + Mobile Sync',
    problem: 'Productores agropecuarios sin herramienta digital para gestión offline y ventas en el campo.',
    solution: 'Plataforma web + app mobile con funcionalidad offline y sincronización de inventario distribuido.',
    stack: ['React', 'Supabase', 'PostgreSQL', 'React Native'],
    link: '#'
  }
]

export default function Projects() {
  return (
    <section id="projects" className="relative py-32 border-t border-[var(--color-space-border)]">
      <div className="absolute top-0 right-10 text-[200px] font-serif opacity-5 leading-none pointer-events-none text-white select-none">
        04
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <span className="font-space text-[var(--color-mist-gray)] uppercase tracking-widest text-sm mb-4 block">
          Proyectos
        </span>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-16">Misiones Completadas</h2>

        <div className="space-y-12">
          {projects.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-surface p-8 md:p-12 relative group"
            >
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-serif text-3xl text-white mb-2">{p.title}</h3>
                  <div className="font-space text-[var(--color-orbital-teal)] text-sm mb-8">{p.role}</div>
                  
                  <div className="space-y-4 font-mono text-sm">
                    <div>
                      <span className="text-white block mb-1">PROBLEMA:</span>
                      <span className="text-[var(--color-mist-gray)]">{p.problem}</span>
                    </div>
                    <div>
                      <span className="text-white block mb-1">SOLUCIÓN:</span>
                      <span className="text-[var(--color-mist-gray)]">{p.solution}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-white text-sm block mb-4">STACK:</span>
                    <div className="flex flex-wrap gap-2">
                      {p.stack.map((tech, j) => (
                        <span key={j} className="px-3 py-1 border border-[var(--color-space-border)] bg-[var(--color-deep-space)] font-space text-xs text-[var(--color-mist-gray)] hover:border-[var(--color-orbital-teal)] transition-colors">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-8 flex gap-4">
                    <a href={p.link !== '#' ? `https://${p.link}` : '#'} target="_blank" rel="noreferrer" className="btn-outline flex items-center gap-2">
                      <Code size={16} /> Source
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
