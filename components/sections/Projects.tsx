'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { usePersona } from '../theme/PersonaContext'

const rawProjects = [
  {
    id: 'titanflow',
    title: 'TitanFlow',
    role: 'SaaS Quant & Bot de Trading',
    stack: ['Node.js', 'Express', 'Binance API', 'WebSockets', 'Python ML', 'Base L2'],
    link: 'https://titanflow.aldoarbizu.com',
    dev: {
      problem: 'Latencia en la ejecución de APIs REST estándar y fugas de memoria en streams persistentes.',
      solution: 'Bots con WebSockets de baja latencia reconectados en <200ms. Script Python ML local para detección de regímenes de mercado que reduce las llamadas en un 40%.'
    },
    founder: {
      problem: 'Pérdidas de capital por latencia y mala gestión de margen en trading manual de criptoactivos.',
      solution: 'Robots de trading autónomos con copia automática on-chain Base L2 (Quantum Vault 20% HWM), Retail API segura sin permisos de retiro, e Institutional VPS dedicado.'
    },
    gentleman: {
      problem: 'Interfaces caóticas de trading que provocan fatiga visual y decisiones impulsivas.',
      solution: 'Plataforma de ejecución limpia, sin ruido de mercado. Un balance estético impecable entre la telemetría de datos numéricos y el diseño minimalista.'
    }
  },
  {
    id: 'techzone',
    title: 'TechZone',
    role: 'POS & Omnichannel Hub',
    stack: ['React', 'SQLite WAL', 'Supabase', 'Zustand', 'PostgreSQL', 'TailwindCSS'],
    link: 'https://techzone.aldoarbizu.com',
    dev: {
      problem: 'Cortes de red que interrumpen escrituras SQL remotas y desincronizan esquemas locales.',
      solution: 'SQLite local en modo WAL. Cola de sincronización incremental basada en triggers locales reconciliada bidireccionalmente con Supabase al restaurarse la señal.'
    },
    founder: {
      problem: 'Pérdida de facturación por cortes de internet en tiendas físicas y desincronización de inventarios multicanal.',
      solution: 'Punto de venta offline-first con SQLite local WAL que sincroniza de forma incremental y reconcilia las transacciones con Supabase al retornar la señal.'
    },
    gentleman: {
      problem: 'Puntos de venta obsoletos y ruidosos que deterioran la experiencia de marca en tiendas de diseño.',
      solution: 'Una interfaz limpia de catálogo y POS con micro-interacciones suaves en el carrito y transiciones fluidas durante la simulación de cobro.'
    }
  },
  {
    id: 'sentinelos',
    title: 'SentinelOS',
    role: 'SaaS de Seguridad Privada B2B',
    stack: ['React Native', 'Expo EAS', 'SQLite', 'Node.js', 'PostgreSQL'],
    link: 'https://sentinelos.aldoarbizu.com',
    dev: {
      problem: 'Pérdida de incidentes locales sin red y vulnerabilidades frente a la manipulación de coordenadas GPS.',
      solution: 'Expo React Native Bare Workflow. Cifrado SQLite local mediante SQLCipher y firma criptográfica hash de lecturas NFC para mitigar spoofing.'
    },
    founder: {
      problem: 'Altos costos en hardware de control de ronda (bastones tradicionales) y pérdida de reportes de incidentes en sótanos o áreas offline.',
      solution: 'Aplicación de seguridad móvil con marcación NFC y localización GPS sin coste de hardware dedicado, resiliencia offline SQLite y despacho SOS inmediato mediante Aegis.'
    },
    gentleman: {
      problem: 'Sistemas de control de seguridad militarizados con pantallas complejas e intimidantes para los vigilantes.',
      solution: 'Layouts ergonómicos de alto contraste optimizados para visión nocturna, tipografía monoespaciada crisp y botones amplios de 56px para uso con guantes.'
    }
  },
  {
    id: 'agromarket',
    title: 'AgroMarket Pro',
    role: 'Hub Federal de Agronegocios',
    stack: ['React', 'TailwindCSS', 'HTML5 Canvas', 'Supabase', 'PostgreSQL'],
    link: 'https://agromarket.aldoarbizu.com',
    dev: {
      problem: 'Falta de APIs rurales y cálculo de volumen volumétrico tridimensional en el cliente móvil.',
      solution: 'Motor matemático local en JavaScript que proyecta mallas poligonales en un canvas 2D, calculando volumen estimado de silobolsas sin llamadas a servidor.'
    },
    founder: {
      problem: 'Brecha de conectividad rural y falta de herramientas de cubicación/auditoría rápida de silobolsas, peso de ganado y plagas.',
      solution: 'Hub multirol interactivo (trabajadores, pools, fletes) con simulador AR/VR en cámara para estimar volumen de silobolsas, peso de novillos y plagas de soja.'
    },
    gentleman: {
      problem: 'La tosquedad habitual del software agropecuario tradicional argentino.',
      solution: 'Rediseño conceptual completo: un dashboard agrícola con texturas oscuras y Bento Grid que dignifica el trabajo de campo y agiliza las misiones de transporte.'
    }
  },
  {
    id: 'ecoconnect',
    title: 'EcoConnect',
    role: 'SaaS ESG & Huella de Carbono',
    stack: ['Next.js', 'React', 'TailwindCSS', 'Supabase', 'PostgreSQL', 'Ethers.js'],
    link: 'https://ecoconnect.aldoarbizu.com',
    dev: {
      problem: 'Políticas de seguridad a nivel de fila (RLS) vulnerables ante joins complejos en Postgres.',
      solution: 'Esquema estricto de Row Level Security con validación de tokens JWT on-chain Base L2 y acuñamiento de hashes de verificación usando Ethers.js.'
    },
    founder: {
      problem: 'Municipios y corporaciones con datos de compensación y consumo energético fragmentados y difíciles de auditar.',
      solution: 'Auditoría ESG municipal con políticas RLS en Postgres y plataforma ciudadana de créditos de carbono con certificados SBT acuñados en Base L2.'
    },
    gentleman: {
      problem: 'Plataformas de ecología aburridas que no generan engagement ni transmiten seriedad institucional.',
      solution: 'Un panel de telemetría de carbono de alta gama que utiliza gradientes verdes oscuros sutiles y mallas de datos limpias.'
    }
  }
]

export default function Projects() {
  const { persona } = usePersona()

  return (
    <section id="projects" className="relative py-32 border-t border-[var(--color-space-border)]">
      <div className="absolute top-0 right-10 text-[200px] font-serif opacity-5 leading-none pointer-events-none text-white select-none">
        04
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <span className="font-space text-[var(--color-mist-gray)] uppercase tracking-widest text-sm mb-4 block select-none">
          Proyectos
        </span>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-16">Misiones Completadas</h2>

        <div className="space-y-12">
          {rawProjects.map((p, i) => {
            // Get content depending on persona selection
            const details = p[persona] || p.founder

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-surface p-8 md:p-12 relative group transition-all duration-500"
              >
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-serif text-3xl text-white mb-2">{p.title}</h3>
                    <div className="font-space text-[var(--color-orbital-teal)] text-sm mb-8 font-bold">{p.role}</div>
                    
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={persona}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4 font-mono text-sm"
                      >
                        <div>
                          <span className="text-white block mb-1 font-bold">PROBLEMA:</span>
                          <span className="text-[var(--color-mist-gray)]">{details.problem}</span>
                        </div>
                        <div>
                          <span className="text-white block mb-1 font-bold">SOLUCIÓN:</span>
                          <span className="text-[var(--color-mist-gray)]">{details.solution}</span>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  
                  <div className="flex flex-col justify-between">
                    <div>
                      <span className="font-mono text-white text-sm block mb-4 font-bold">STACK:</span>
                      <div className="flex flex-wrap gap-2">
                        {p.stack.map((tech, j) => (
                          <span key={j} className="px-3 py-1 border border-[var(--color-space-border)] bg-[var(--color-deep-space)] font-space text-xs text-[var(--color-mist-gray)] hover:border-[var(--color-orbital-teal)] transition-colors">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-8 flex gap-4">
                      <a href={p.link} target="_blank" rel="noreferrer" className="btn-outline flex items-center gap-2 cursor-none">
                        <ExternalLink size={16} /> Demo En Vivo
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
