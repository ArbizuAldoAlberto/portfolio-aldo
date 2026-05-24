'use client'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

const projects = [
  {
    title: 'TitanFlow',
    role: 'SaaS Quant & Bot de Trading',
    problem: 'Pérdidas de capital por latencia y mala gestión de margen en trading manual de criptoactivos.',
    solution: 'Robots de trading autónomos conectados a la API de Binance con gestión aislada de margen, interruptor Aegis y telemetría.',
    stack: ['Node.js', 'Express', 'Binance API', 'WebSockets', 'Python ML'],
    link: 'https://titanflow.aldoarbizu.com'
  },
  {
    title: 'TechZone',
    role: 'E-commerce & POS Offline-First',
    problem: 'Comercios en zonas de baja conectividad que sufren caídas de ventas al no poder facturar o actualizar catálogos offline.',
    solution: 'Caché local en SQLite y sincronización diferencial asíncrona bidireccional automática con la base central.',
    stack: ['React Native', 'Expo', 'SQLite', 'Zustand', 'Firebase', 'Stripe'],
    link: 'https://techzone.aldoarbizu.com'
  },
  {
    title: 'VigiTrack',
    role: 'SaaS de Seguridad Privada',
    problem: 'Agencias de seguridad física que registran rondas en papel, resultando en pérdidas de datos y falta de control de guardias.',
    solution: 'SaaS multi-tenant con rondas offline y marcación NFC inmutable, guardado en SQLite local y sincronización diferida.',
    stack: ['React Native', 'Expo', 'SQLite', 'Redux Toolkit', 'Firebase'],
    link: 'https://vigitrack.aldoarbizu.com'
  },
  {
    title: 'AgroMarket Pro',
    role: 'Plataforma Agropecuaria Offline',
    problem: 'Productores sin señal de red móvil que no pueden registrar inventario, maquinaria y ganado en el campo.',
    solution: 'UI brutalista de alto contraste para visibilidad solar y reconciliación automática offline de inventarios con Supabase/Postgres.',
    stack: ['React', 'TailwindCSS', 'Supabase', 'PostgreSQL', 'React Native'],
    link: 'https://agromarket.aldoarbizu.com'
  },
  {
    title: 'EcoConnect',
    role: 'SaaS ESG & Huella de Carbono',
    problem: 'Municipios y corporaciones con datos de compensación y consumo energético fragmentados y difíciles de auditar.',
    solution: 'Arquitectura multi-tenant unificada con políticas RLS (Row-Level Security) estrictas en Postgres para auditar créditos de carbono.',
    stack: ['Next.js', 'React', 'TailwindCSS', 'Supabase', 'PostgreSQL'],
    link: 'https://ecoconnect.aldoarbizu.com'
  },
  {
    title: 'Cannabis SaaS',
    role: 'Trazabilidad y Dispensario Premium',
    problem: 'Clubes cannábicos medicinales sin controles automatizados contra el fraude y el exceso de límites legales de dispensación.',
    solution: 'Validaciones matemáticas inmutables de consumo acumulado a 30 días, bajo una interfaz de alta gama en tonos oscuros y dorados.',
    stack: ['Node.js', 'Express', 'React', 'TailwindCSS', 'PostgreSQL'],
    link: 'https://cannabis.aldoarbizu.com'
  },
  {
    title: 'PawHero',
    role: 'Telemetría Satelital para Mascotas',
    problem: 'Collares rastreadores GPS comerciales con alto consumo de batería o desconexión en zonas sin señal de red.',
    solution: 'Pings adaptativos basados en movimiento, búfer de telemetría local vía Bluetooth y geovallas con alertas en tiempo real.',
    stack: ['React Native', 'Expo', 'Redux Toolkit', 'Firebase'],
    link: 'https://pawhero.aldoarbizu.com'
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
                    <a href={p.link} target="_blank" rel="noreferrer" className="btn-outline flex items-center gap-2">
                      <ExternalLink size={16} /> Demo En Vivo
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
