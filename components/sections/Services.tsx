'use client'
import { motion } from 'framer-motion'

const services = [
  {
    orbit: 'ÓRBITA 01',
    title: 'Mobile Apps',
    desc: 'React Native & Expo SDK. Arquitecturas Offline-First, SQLite, Redux Toolkit.',
    price: 'Desde USD 3.000',
    color: 'var(--color-orbital-teal)'
  },
  {
    orbit: 'ÓRBITA 02',
    title: 'SaaS & Fullstack',
    desc: 'Arquitecturas Multi-tenant escalables. Next.js, Supabase, PostgreSQL.',
    price: 'Desde USD 5.000',
    color: 'var(--color-electric-purple)'
  },
  {
    orbit: 'ÓRBITA 03',
    title: 'Automatización n8n',
    desc: 'Workflows que trabajan solos. Integración de IA y APIs de negocio.',
    price: 'Desde USD 500',
    color: 'var(--color-coral-burn)'
  },
  {
    orbit: 'ÓRBITA 04',
    title: 'Consultoría & Cripto',
    desc: 'Estrategia técnica OWASP, Smart Contracts, Diseño 3D/Hardware.',
    price: 'USD 50/h',
    color: 'var(--color-amber-gold)'
  }
]

export default function Services() {
  return (
    <section id="services" className="relative py-32 bg-[var(--color-deep-space)]/30 border-t border-[var(--color-space-border)]">
      <div className="absolute top-0 right-10 text-[200px] font-serif opacity-5 leading-none pointer-events-none text-white select-none">
        03
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <span className="font-space text-[var(--color-mist-gray)] uppercase tracking-widest text-sm mb-4 block">
          Servicios
        </span>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-16">Las 4 Órbitas</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {services.map((svc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-surface p-8 group hover:border-white/20 transition-all duration-300 relative overflow-hidden"
              style={{ borderTopColor: svc.color, borderTopWidth: '2px' }}
            >
              <div className="font-space text-xs tracking-wider mb-6 opacity-70" style={{ color: svc.color }}>
                {svc.orbit}
              </div>
              <h3 className="font-serif text-2xl text-white mb-4">{svc.title}</h3>
              <p className="font-mono text-sm text-[var(--color-mist-gray)] h-20">{svc.desc}</p>
              
              <div className="mt-8 pt-6 border-t border-[var(--color-space-border)] flex justify-between items-center">
                <span className="font-space text-xs text-white">{svc.price}</span>
                <span className="font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: svc.color }}>Más info →</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Proceso */}
        <div className="border-t border-[var(--color-space-border)] pt-16">
          <div className="flex flex-wrap justify-between items-center gap-4 text-center md:text-left">
            {[
              { s: '01 Brief', d: '48h respuesta' },
              { s: '02 Propuesta', d: '72h entrega' },
              { s: '03 Dev Sprint', d: 'Sprints 2 sem.' },
              { s: '04 Deploy', d: 'Expo EAS/Vercel' },
              { s: '05 Soporte', d: 'Post-launch' }
            ].map((step, i) => (
              <div key={i} className="flex-1 min-w-[120px]">
                <div className="font-space text-white text-sm mb-2">{step.s}</div>
                <div className="font-mono text-[var(--color-mist-gray)] text-xs">{step.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
