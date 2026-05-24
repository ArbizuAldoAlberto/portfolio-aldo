'use client'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

const projects = [
  {
    title: 'TitanFlow',
    role: 'SaaS Quant & Bot de Trading',
    problem: 'Pérdidas de capital por latencia y mala gestión de margen en trading manual de criptoactivos.',
    solution: 'Robots de trading autónomos con copia automática on-chain Base L2 (Quantum Vault 20% HWM), Retail API segura sin permisos de retiro, e Institutional VPS dedicado.',
    stack: ['Node.js', 'Express', 'Binance API', 'WebSockets', 'Python ML', 'Base L2'],
    link: 'https://titanflow.aldoarbizu.com'
  },
  {
    title: 'TechZone',
    role: 'POS & Omnichannel Hub',
    problem: 'Pérdida de facturación por cortes de internet en tiendas físicas y desincronización de inventarios multicanal.',
    solution: 'Punto de venta offline-first con SQLite local WAL que sincroniza de forma incremental y reconcilia las transacciones con Supabase al retornar la señal.',
    stack: ['React', 'SQLite WAL', 'Supabase', 'Zustand', 'PostgreSQL', 'TailwindCSS'],
    link: 'https://techzone.aldoarbizu.com'
  },
  {
    title: 'SentinelOS',
    role: 'SaaS de Seguridad Privada B2B',
    problem: 'Altos costos en hardware de control de ronda (bastones tradicionales) y pérdida de reportes de incidentes en sótanos o áreas offline.',
    solution: 'Aplicación de seguridad móvil con marcación NFC y localización GPS sin coste de hardware dedicado, resiliencia offline SQLite y despacho SOS inmediato mediante Aegis.',
    stack: ['React Native', 'Expo EAS', 'SQLite', 'Node.js', 'PostgreSQL'],
    link: 'https://sentinelos.aldoarbizu.com'
  },
  {
    title: 'AgroMarket Pro',
    role: 'Hub Federal de Agronegocios',
    problem: 'Brecha de conectividad rural y falta de herramientas de cubicación/auditoría rápida de silobolsas, peso de ganado y plagas.',
    solution: 'Hub multirol interactivo (trabajadores, pools, fletes) con simulador AR/VR en cámara para estimar volumen de silobolsas, peso de novillos y plagas de soja.',
    stack: ['React', 'TailwindCSS', 'HTML5 Canvas', 'Supabase', 'PostgreSQL'],
    link: 'https://agromarket.aldoarbizu.com'
  },
  {
    title: 'EcoConnect',
    role: 'SaaS ESG & Huella de Carbono',
    problem: 'Municipios y corporaciones con datos de compensación y consumo energético fragmentados y difíciles de auditar.',
    solution: 'Auditoría ESG municipal con políticas RLS en Postgres y plataforma ciudadana de créditos de carbono con certificados SBT acuñados en Base L2.',
    stack: ['Next.js', 'React', 'TailwindCSS', 'Supabase', 'PostgreSQL', 'Ethers.js'],
    link: 'https://ecoconnect.aldoarbizu.com'
  },
  {
    title: 'CannaSavias',
    role: 'Botanical Cafe & Apothecary',
    problem: 'Falta de espacios culturales integrados con botica de alta gama y control regulatorio de trazabilidad (INASE/REPROCANN).',
    solution: 'Cafetería botánica vegetariana, agenda de eventos culturales, e-commerce 18+ y un completo directorio nacional de cultivadores y proveedores de agroinsumos.',
    stack: ['Next.js', 'React', 'TailwindCSS', 'Supabase', 'PostgreSQL'],
    link: 'https://cannabis.aldoarbizu.com'
  },
  {
    title: 'PawHero',
    role: 'GPS Telemetry & Rescue Net',
    problem: 'Pérdida de mascotas, alto consumo de batería en collares GPS tradicionales, y falta de coordinación en rescates locales.',
    solution: 'Plataforma comunitaria gratuita de alertas de búsqueda activa de mascotas perdidas, telemetría de collar optimizada en ping, y micro-donaciones cripto Base L2 para protectoras locales (SAPAB/El Campito).',
    stack: ['React Native', 'Expo', 'SQLite', 'Zustand', 'Web3 / Base L2'],
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
