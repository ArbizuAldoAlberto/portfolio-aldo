'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { usePersona } from '../theme/PersonaContext'
const rawProjects = [
  {
    id: 'titanflow',
    title: 'TitanFlow',
    role: 'DeFi Copy Trading & Algorithmic Bot',
    stack: ['Node.js', 'TypeScript', 'Ollama AI', 'CCXT', 'Solidity', 'Base L2'],
    link: 'https://titanflow.aldoarbizu.com',
    dev: {
      problem: 'Fricción por deslizamiento (slippage) y latencia en APIs de futuros.',
      solution: 'WebSockets concurrentes de baja latencia con oráculo de Kelly para control de slippage.'
    },
    founder: {
      problem: 'Tarifas elevadas de copy-trading y riesgo de custodia de API keys.',
      solution: 'Contratos inteligentes en Base L2 (ERC-4626) con firma local de órdenes sin custodia.'
    },
    gentleman: {
      problem: 'Consolas de trading ruidosas que inducen al overtrading y fatiga visual.',
      solution: 'Dashboard minimalista oscuro con gráficos netos y telemetría purgada.'
    }
  },
  {
    id: 'aureus',
    title: 'Aureus',
    role: 'Wealth OS & AI Financial Advisor',
    stack: ['Next.js 16', 'TypeScript', 'Zustand', 'Recharts', 'Gemini API', 'Base L2'],
    link: 'https://aureus.aldoarbizu.com',
    dev: {
      problem: 'Procesamiento en tiempo real de sesgos cognitivos en los diálogos del inversor.',
      solution: 'Detector de sesgos local con WASM acoplado al SDK de Vercel AI en streaming.'
    },
    founder: {
      problem: 'Costos elevados de asesoramiento patrimonial tradicional.',
      solution: 'Asesor de IA premium integrado a simulaciones de ROI con micropagos de $0.20 USD.'
    },
    gentleman: {
      problem: 'Interfaces bancarias frías que carecen de discreción y prestigio visual.',
      solution: 'Dashboard de gestión patrimonial con glassmorphism oscuro y acentos en oro cepillado.'
    }
  },
  {
    id: 'techzone',
    title: 'TechZone',
    role: 'POS Retail & Omnichannel Gateway',
    stack: ['React Native', 'Expo Bare', 'SQLite WAL', 'Zustand', 'Stripe Elements', 'Universal Cart'],
    link: 'https://techzone.aldoarbizu.com',
    dev: {
      problem: 'Pérdidas de transacciones de venta por caídas abruptas de conectividad.',
      solution: 'Encolamiento local atómico en SQLite WAL con triggers diferenciales automáticos.'
    },
    founder: {
      problem: 'Fuga de clientes en mostradores físicos debido a internet inestable.',
      solution: 'Punto de venta Offline-First con firmas QR de cobro dual y checkout de Google Pay.'
    },
    gentleman: {
      problem: 'Interfaces de catálogo lentas que interrumpen la fluidez del cliente.',
      solution: 'Catálogo premium interactivo con transiciones de Bento Grid y tipografía refinada.'
    }
  },
  {
    id: 'sentinelos',
    title: 'SentinelOS',
    role: 'Security Dispatch & Command Center',
    stack: ['React Native', 'Expo EAS', 'SQLite', 'Redux Toolkit', 'Firebase RTDB', 'Lottie'],
    link: 'https://sentinelos.aldoarbizu.com',
    dev: {
      problem: 'Fraude por clonación de tags NFC de control de rondas.',
      solution: 'Validación biométrica con red TensorFlow Lite local que audita fotos de control.'
    },
    founder: {
      problem: 'Elevados costos en bastones de patrulla y pérdida de señal en subterráneos.',
      solution: 'App móvil con despacho SOS Aegis y comunicación en malla Mesh P2P local.'
    },
    gentleman: {
      problem: 'Pantallas tácticas sobrecargadas que fatigan al operador nocturno.',
      solution: 'Contraste ultra-alto con tipografía monoespaciada e interfaces optimizadas para la noche.'
    }
  },
  {
    id: 'aeroshot',
    title: 'AeroShot',
    role: 'Agricultural Drone Processing SaaS',
    stack: ['React Native', 'Expo', 'SQLite', 'Animated', 'Jest', 'Expo Haptics'],
    link: 'https://aeroshot.aldoarbizu.com',
    dev: {
      problem: 'Transiciones de telemetría de vuelo bruscas en el renderizado móvil.',
      solution: 'Control de estados fluido con Animated.spring y amortiguación de señal por hardware.'
    },
    founder: {
      problem: 'Pérdida de mapas de parcelas por nula señal en campos remotos.',
      solution: 'Procesamiento de imágenes y telemetría de parcelas Offline-First con sync en background.'
    },
    gentleman: {
      problem: 'Visualizaciones cartográficas toscas en informes de entrega.',
      solution: 'Capas cartográficas con transiciones glassmorphic suaves e interfaz háptica precisa.'
    }
  },
  {
    id: 'agromarket',
    title: 'AgroMarket Pro',
    role: 'AgriTech Logistics & Marketplace',
    stack: ['React', 'Zustand', 'Supabase', 'HTML5 Canvas', 'Gemini API', 'Universal Cart'],
    link: 'https://agromarket.aldoarbizu.com',
    dev: {
      problem: 'Cálculo volumétrico tridimensional local en el cliente móvil impreciso.',
      solution: 'Proyección de mallas poligonales en Canvas 2D y auditoría fitotóxica con Gemini API.'
    },
    founder: {
      problem: 'Tasaciones de silobolsas y hacienda lentas y procesos de remate complejos.',
      solution: 'Simulador AR para cubicación sin red y remates de hacienda con WebRTC en tiempo real.'
    },
    gentleman: {
      problem: 'Interfaces agrarias toscas que desalientan su adopción diaria.',
      solution: 'Panel premium con Bento Grid, texturas oscuras y contrastes de luz ámbar.'
    }
  },
  {
    id: 'cannabis',
    title: 'CannaSavias',
    role: 'E-commerce & Legal Compliance SaaS',
    stack: ['Next.js', 'React', 'Zustand', 'Supabase', 'Gemini API', 'Universal Cart'],
    link: 'https://cannabis.aldoarbizu.com',
    dev: {
      problem: 'Fricción en la verificación manual de recetas REPROCANN legales.',
      solution: 'Validación automatizada con Gemini API de stock y recetas en pasarela.'
    },
    founder: {
      problem: 'Riesgo de sanciones por exceder stock legal y checkouts complejos.',
      solution: 'e-Commerce integrado a la base federal REPROCANN y checkout Universal Cart.'
    },
    gentleman: {
      problem: 'Sitios cannábicos informales que no transmiten rigurosidad.',
      solution: 'Boutique digital refinada con gradientes verde esmeralda y micro-interacciones.'
    }
  },
  {
    id: 'ecoconnect',
    title: 'EcoConnect',
    role: 'ESG Registry & Carbon Platform',
    stack: ['Next.js', 'React', 'Zustand', 'Supabase', 'PostgreSQL', 'Ethers.js (Base L2)'],
    link: 'https://ecoconnect.aldoarbizu.com',
    dev: {
      problem: 'Políticas de seguridad RLS vulnerables ante consultas complejas de auditorías.',
      solution: 'Esquema estricto de RLS y firmas criptográficas on-chain en Base L2.'
    },
    founder: {
      problem: 'Costos elevados de certificación y auditorías forestales para municipios.',
      solution: 'Estimación de biomasa satelital Sentinel-2 y emisión de Soulbound Tokens (SBT).'
    },
    gentleman: {
      problem: 'Interfaces de carbono frías que parecen hojas de cálculo de Excel.',
      solution: 'Modelo 3D interactivo del bosque municipal que crece según tus donaciones.'
    }
  },
  {
    id: 'pawhero',
    title: 'PawHero',
    role: 'Pet Tracking & NGO Donations',
    stack: ['Next.js', 'React Native', 'SQLite', 'Base L2', 'Three.js', 'STL 3D Print'],
    link: 'https://pawhero.aldoarbizu.com',
    dev: {
      problem: 'Geolocalización de mascotas perdidas sin costosas suscripciones celulares.',
      solution: 'Chapas QR cifradas e interconectadas mediante WebSockets y red P2P.'
    },
    founder: {
      problem: 'Costos prohibitivos en collares GPS y desorganización de ONGs.',
      solution: 'Placas QR descargables en STL para impresión 3D a costo cero y donaciones SBT.'
    },
    gentleman: {
      problem: 'Identificadores genéricos o interfaces lúdicas sin seriedad.',
      solution: 'Perfiles interactivos 3D con tipografía minimalista y medallas SBT on-chain.'
    }
  },
  {
    id: 'impresion3d',
    title: 'Impresión 3D P2P',
    role: 'Collaborative 3D Printing Platform',
    stack: ['Kotlin', 'Jetpack Compose', 'Room SQLite', 'Gemini API', 'Web3 Escrow', 'STL 3D Print'],
    link: 'https://impresion3d.aldoarbizu.com',
    dev: {
      problem: 'Complejidad y lentitud en la cotización manual de archivos de diseño STL.',
      solution: 'IA Slicer integrado que analiza y cotiza mallas poligonales 3D localmente en el cliente.'
    },
    founder: {
      problem: 'Comisiones elevadas en plataformas de manufactura y falta de confianza entre partes.',
      solution: 'Escrow descentralizado seguro en Base L2 y red P2P de Makers con hardware verificado.'
    },
    gentleman: {
      problem: 'Interfaces de manufactura 3D toscas e industriales que aburren al usuario.',
      solution: 'Visualizador de mallas 3D premium e interactivo con diseño liquid glass moderno.'
    }
  },
  {
    id: 'habitat',
    title: 'Hábitat',
    role: 'Decentralized Direct Rentals & Land Control',
    stack: ['Kotlin', 'Jetpack Compose', 'Room SQLite', 'Solidity (Base L2)', 'Gemini API'],
    link: 'https://habitat.aldoarbizu.com',
    dev: {
      problem: 'Vulnerabilidades en el flujo de verificación y firma de contratos tradicionales.',
      solution: 'Firmas criptográficas on-chain en Base L2 con verificación directa del inquilino.'
    },
    founder: {
      problem: 'Intermediarios inmobiliarios costosos y especulación con tierras ociosas.',
      solution: 'Contratos inteligentes autoejecutables y base de datos local para reconversión productiva.'
    },
    gentleman: {
      problem: 'Procesos de alquiler fríos y complejos sin guías ni soporte dinámico.',
      solution: 'Dashboard minimalista de reubicación y contratos con glassmorphism premium.'
    }
  },
  {
    id: 'marketingadvisor',
    title: 'Smart Marketing Advisor',
    role: 'AI Omnichannel Marketing Coach',
    stack: ['Kotlin', 'Jetpack Compose', 'Room SQLite', 'Gemini API', 'Recharts analytics'],
    link: 'https://marketingadvisor.aldoarbizu.com',
    dev: {
      problem: 'Baja velocidad en la generación y publicación de contenido promocional.',
      solution: 'Generador de copys publicitarios ultrarrápido con LLM local y encolado en SQLite.'
    },
    founder: {
      problem: 'Falta de analítica clara de retorno sobre inversión publicitaria para pymes.',
      solution: 'Panel de control con métricas e informes automáticos en vivo para optimizar prospectos.'
    },
    gentleman: {
      problem: 'Administradores de redes sociales sobrecargados de botones que fatigan la vista.',
      solution: 'Bento Grid de control de marketing con tipografías elegantes Outfit e Inter.'
    }
  },
  {
    id: 'nomadhub',
    title: 'NOMAD Tactical Hub',
    role: 'Off-grid Resilient Survival System',
    stack: ['Kotlin', 'Jetpack Compose', 'Room SQLite', 'Vigenère Cipher', 'Morse Encoder'],
    link: 'https://nomadhub.aldoarbizu.com',
    dev: {
      problem: 'Dependencia de servidores centrales para cifrado y cálculos de radio en crisis.',
      solution: 'Calculadoras RF locales para antenas dipolo y cifrado Vigenère sin conexión.'
    },
    founder: {
      problem: 'Caída de infraestructura telefónica que incomunica a comunidades vulnerables.',
      solution: 'Portal de Solidaridad Humana con mensajería simulada LoRa Mesh P2P y mapas GPS offline.'
    },
    gentleman: {
      problem: 'Diseño militar clásico descuidado que resulta ilegible en condiciones nocturnas.',
      solution: 'Estilo cyber-dark con alto contraste verde neón y volt cian para mayor legibilidad.'
    }
  }
]

function ProjectCard({ project, index, total }: { project: typeof rawProjects[0], index: number, total: number }) {
  const { persona } = usePersona()
  const cardRef = useRef<HTMLDivElement>(null)
  const details = project[persona] || project.founder

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'center center']
  })

  const width = useTransform(scrollYProgress, [0, 0.8], ['92%', '100%'])
  const cardOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])
  const cardY = useTransform(scrollYProgress, [0, 0.5], [60, 0])

  // WALBI AESTHETIC CLASSES
  const isFounder = persona === 'founder';
  const cardClasses = isFounder 
    ? "glass-surface p-8 md:p-12 relative group transition-all duration-500 overflow-hidden bg-black/40 backdrop-blur-2xl border border-white/5 hover:border-[#7C3AED]/50 hover:bg-[#050508]/80 shadow-[inset_0_0_80px_rgba(124,58,237,0.03)] hover:shadow-[0_0_50px_rgba(124,58,237,0.1)] rounded-2xl"
    : "glass-surface p-8 md:p-12 relative group transition-all duration-500 hover:border-[var(--color-orbital-teal)]/30 overflow-hidden rounded-none";

  return (
    <motion.div
      ref={cardRef}
      style={{ width, opacity: cardOpacity, y: cardY }}
      className={`mx-auto ${isFounder ? 'drop-shadow-2xl' : 'orbital-glow'}`}
    >
      <div className={cardClasses}>
        {/* Decorative index */}
        <motion.div
          className={`absolute top-6 right-8 font-serif text-6xl md:text-8xl leading-none select-none pointer-events-none transition-colors ${isFounder ? 'text-white/[0.02] group-hover:text-[#06B6D4]/10' : 'text-white/[0.03]'}`}
        >
          {String(index + 1).padStart(2, '0')}
        </motion.div>

        {/* Walbi top accent line */}
        {isFounder && (
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#7C3AED]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        )}

        <div className="grid md:grid-cols-2 gap-8 relative z-10">
          <div>
            {/* Project counter */}
            <div className="flex items-center gap-3 mb-4">
              <span className={`font-space text-[9px] tracking-widest ${isFounder ? 'text-[#06B6D4]/60' : 'text-[var(--color-mist-gray)]/40'}`}>
                {String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
              </span>
              <div className={`h-px flex-1 ${isFounder ? 'bg-gradient-to-r from-[#06B6D4]/20 to-transparent' : 'bg-[var(--color-space-border)]'}`} />
            </div>

            <h3 className="font-serif text-3xl text-white mb-2 group-hover:text-gradient transition-all">{project.title}</h3>
            <div className="font-space text-[var(--color-orbital-teal)] text-sm mb-8 font-bold">{project.role}</div>
            
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
                {project.stack.map((tech, j) => (
                  <motion.span
                    key={j}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: j * 0.05, duration: 0.3 }}
                    className="px-3 py-1 border border-[var(--color-space-border)] bg-[var(--color-deep-space)] font-space text-xs text-[var(--color-mist-gray)] hover:border-[var(--color-orbital-teal)] hover:text-white transition-all duration-200 cursor-default"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <motion.a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -2 }}
                className="btn-outline flex items-center gap-2 cursor-none group/link px-4 py-2 border border-white/10 hover:border-[var(--color-orbital-teal)]/50 rounded-lg text-xs transition-all"
              >
                <ExternalLink size={14} className="group-hover/link:text-[var(--color-orbital-teal)] transition-colors" />
                <span>Demo En Vivo</span>
              </motion.a>
              {(project.stack.includes('React Native') || project.stack.includes('Kotlin')) && (
                <>
                  <motion.a
                    href={`${project.link}/downloads/${project.id}.apk`}
                    download
                    whileHover={{ y: -2 }}
                    className="btn-outline flex items-center gap-2 cursor-none group/link px-4 py-2 border border-white/10 hover:border-green-500/50 rounded-lg text-xs transition-all"
                  >
                    <span className="text-green-500">🤖</span>
                    <span>Android APK</span>
                  </motion.a>
                  <motion.a
                    href="https://testflight.apple.com"
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ y: -2 }}
                    className="btn-outline flex items-center gap-2 cursor-none group/link px-4 py-2 border border-white/10 hover:border-blue-500/50 rounded-lg text-xs transition-all"
                  >
                    <span className="text-blue-400">🍎</span>
                    <span>iOS Beta</span>
                  </motion.a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  })

  const bgY = useTransform(scrollYProgress, [0, 1], [50, -80])
  const bgOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 0.05, 0.05, 0])

  return (
    <section id="projects" ref={sectionRef} className="relative py-32 border-t border-[var(--color-space-border)]">
      <motion.div
        style={{ y: bgY, opacity: bgOpacity }}
        className="absolute top-0 right-10 text-[200px] font-serif leading-none pointer-events-none text-white select-none"
      >
        04
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="font-space text-[var(--color-mist-gray)] uppercase tracking-widest text-sm mb-4 block select-none"
        >
          Proyectos
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-serif font-bold text-white mb-16"
        >
          Misiones Completadas
        </motion.h2>

        <div className="space-y-8">
          {rawProjects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} total={rawProjects.length} />
          ))}
        </div>
      </div>
    </section>
  )
}
