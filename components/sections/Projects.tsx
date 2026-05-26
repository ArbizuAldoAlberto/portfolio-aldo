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
      problem: 'Fricción por deslizamiento (slippage) y latencia en APIs de futuros cripto en vivo.',
      solution: 'Conexión de baja latencia mediante websockets robustos, oráculo de mitigación de Kelly ante slippage (>0.25%) e integraciones de análisis emocional con LLM local.'
    },
    founder: {
      problem: 'El riesgo de hackeo de API keys centralizadas en servidores y tarifas fijas elevadas de copy-trading.',
      solution: 'Oráculo de claves cifrado localmente en extensión de navegador Web3, firmando órdenes de Binance mediante WebSockets locales. Bucle ERC-4626 en Base L2 con cobro High-Water Mark (20% fee) sin custodia directa.'
    },
    gentleman: {
      problem: 'Consolas de trading ruidosas y caóticas que inducen al overtrading y causan fatiga visual.',
      solution: 'Un panel de control sobrio con gradientes oscuros, trazando retornos acumulados netos y telemetría de balances purgada de ruidos de mercado.'
    }
  },
  {
    id: 'aureus',
    title: 'Aureus',
    role: 'Wealth OS & AI Financial Advisor',
    stack: ['Next.js 16', 'TypeScript', 'Zustand', 'Recharts', 'Gemini API', 'Base L2'],
    link: 'https://aureus.aldoarbizu.com',
    dev: {
      problem: 'Procesamiento y mitigación en tiempo real de sesgos cognitivos en los diálogos del inversor.',
      solution: 'Algoritmo detector de sesgos cognitivos (WASM local) acoplado a Vercel AI SDK para calibrar las respuestas de streaming de la IA de forma asíncrona.'
    },
    founder: {
      problem: 'Tarifas excesivas de asesoramiento patrimonial tradicional y falta de simulaciones financieras realistas.',
      solution: 'Asesor financiero de élite Víctor Harland (Gemini) integrado a simulaciones dinámicas probabilísticas y micropagos en Base L2 ($0.20 USD) por consulta.'
    },
    gentleman: {
      problem: 'Interfaces bancarias frías e impersonales que carecen de discreción y prestigio visual.',
      solution: 'Un dashboard premium de gestión patrimonial con glassmorphism oscuro y acentos en oro cepillado, inspirado en la sobriedad de la banca suiza.'
    }
  },
  {
    id: 'techzone',
    title: 'TechZone',
    role: 'POS Retail & Omnichannel Gateway',
    stack: ['React Native', 'Expo Bare', 'SQLite WAL', 'Zustand', 'Stripe Elements', 'Universal Cart'],
    link: 'https://techzone.aldoarbizu.com',
    dev: {
      problem: 'Pérdidas de transacciones de compra en el cliente por caídas abruptas de conectividad.',
      solution: 'Persistencia local Zustand AsyncStorage y encolamiento SQLite local en modo WAL con triggers diferenciales automáticos hacia base remota.'
    },
    founder: {
      problem: 'Pérdidas de ventas en mostradores retail debido a internet inestable en locales físicos.',
      solution: 'Punto de venta Offline-First (Store & Forward) con firmas QR de intención de cobro dual y checkout Universal Cart de Google Pay para agilizar el mostrador.'
    },
    gentleman: {
      problem: 'Interfaces de catálogo lentas y toscas que interrumpen la fluidez del cliente al comprar.',
      solution: 'Un catálogo minimalista con animaciones fluidas de adición al carrito, transiciones de suavizado de Bento Grid y tipografía refinada.'
    }
  },
  {
    id: 'sentinelos',
    title: 'SentinelOS',
    role: 'Security Dispatch & Command Center',
    stack: ['React Native', 'Expo EAS', 'SQLite', 'Redux Toolkit', 'Firebase RTDB', 'Lottie'],
    link: 'https://sentinelos.aldoarbizu.com',
    dev: {
      problem: 'Fraude en rondas mediante clonación de tags NFC (NFC spoofing) y caídas de reportes sin señal.',
      solution: 'Validación geométrica en tiempo real mediante red neuronal TensorFlow Lite local que audita fotos tomadas al punto de control.'
    },
    founder: {
      problem: 'Elevados costos de hardware para control de guardias y pérdida de comunicación en cocheras subterráneas.',
      solution: 'Software móvil de rondas con SOS perimetral inteligente (Aegis) y red de socorro en malla (Mesh P2P) a través de Wi-Fi Direct/Bluetooth.'
    },
    gentleman: {
      problem: 'Pantallas de monitoreo sobrecargadas que ciegan o fatigan al personal en turnos nocturnos.',
      solution: 'Esquema táctico de alto contraste con tipografía monoespaciada crisp y botones sobredimensionados de 56px ergonómicos para uso nocturno.'
    }
  },
  {
    id: 'aeroshot',
    title: 'AeroShot',
    role: 'Agricultural Drone Processing SaaS',
    stack: ['React Native', 'Expo', 'SQLite', 'Animated', 'Jest', 'Expo Haptics'],
    link: '#projects',
    dev: {
      problem: 'Transiciones de telemetría de vuelo bruscas en el renderizado móvil local.',
      solution: 'Control de estados óptimo mediante Animated.spring local, amortiguando fluctuaciones de señal con caché SQLite e interfaz háptica.'
    },
    founder: {
      problem: 'Pilotos de drones que pierden mapas de calor y reportes de parcelas debido a la nula conectividad en campos abiertos.',
      solution: 'Procesamiento de imágenes y telemetría de parcelas Offline-First con sincronización diferida en segundo plano, optimizando EAS bundles.'
    },
    gentleman: {
      problem: 'Visualizaciones de mapas toscas que restan profesionalidad a los informes de entrega a clientes.',
      solution: 'Capas cartográficas con transiciones glassmorphic suaves, alertas de telemetría y micro-vibraciones hápticas de navegación precisa.'
    }
  },
  {
    id: 'agromarket',
    title: 'AgroMarket Pro',
    role: 'AgriTech Logistics & Marketplace',
    stack: ['React', 'Zustand', 'Supabase', 'HTML5 Canvas', 'Gemini API', 'Universal Cart'],
    link: 'https://agromarket.aldoarbizu.com',
    dev: {
      problem: 'Cálculo volumétrico tridimensional local en el cliente móvil pesado e impreciso.',
      solution: 'Proyección de mallas poligonales locales en HTML5 Canvas 2D y análisis asíncrono con Gemini para compatibilidad fitotóxica.'
    },
    founder: {
      problem: 'Incertidumbre en la cubicación de silobolsas y procesos de remate engorrosos en zonas rurales.',
      solution: 'Simulador AR para cubicación de silobolsas sin internet, pasarela inteligente Universal Cart y remates de hacienda con WebRTC libre de delay.'
    },
    gentleman: {
      problem: 'Interfaces agropecuarias rudimentarias y toscas que desalientan el uso diario.',
      solution: 'Un panel premium con Bento Grid, texturas metálicas oscuras y contrastes de luz en ámbar que realzan la elegancia del campo.'
    }
  },
  {
    id: 'cannabis',
    title: 'CannaSavias',
    role: 'E-commerce & Legal Compliance SaaS',
    stack: ['Next.js', 'React', 'Zustand', 'Supabase', 'Gemini API', 'Universal Cart'],
    link: 'https://cannabis.aldoarbizu.com',
    dev: {
      problem: 'Fricción en la verificación del cumplimiento normativo legal de recetas REPROCANN en tiempo real.',
      solution: 'Conexión y validación asíncrona con Gemini API para auditar los límites legales de stock y dosificaciones de prescripciones del cliente.'
    },
    founder: {
      problem: 'Sanciones comerciales por sobrepasar límites de stock legal y procesos de checkout lentos en fitomedicina.',
      solution: 'Plataforma e-commerce con checkout inteligente Universal Cart y auditoría automática REPROCANN, centrada en La Plata, Buenos Aires.'
    },
    gentleman: {
      problem: 'Sitios web de farmacia cannábica toscos o informales que no transmiten rigurosidad médica.',
      solution: 'Botica digital elegante con contrastes de verde esmeralda, micro-interacciones suaves en la compra y transiciones fluidas de selección.'
    }
  },
  {
    id: 'ecoconnect',
    title: 'EcoConnect',
    role: 'ESG Registry & Carbon Platform',
    stack: ['Next.js', 'React', 'Zustand', 'Supabase', 'PostgreSQL', 'Ethers.js (Base L2)'],
    link: 'https://ecoconnect.aldoarbizu.com',
    dev: {
      problem: 'Políticas de seguridad a nivel de fila (RLS) vulnerables ante consultas complejas de auditorías forestales.',
      solution: 'Esquema estricto de RLS combinado con firmas criptográficas on-chain e inmutabilidad en Base L2 usando Ethers.js.'
    },
    founder: {
      problem: 'Altas barreras de costo para pequeños municipios al auditar y emitir créditos de carbono verificados.',
      solution: 'Estimación de biomasa mediante imágenes multiespectrales de satélite Sentinel-2 sin hardware inicial, y donaciones mediante Soulbound Tokens (SBT).'
    },
    gentleman: {
      problem: 'Plataformas de sostenibilidad y carbono áridas que parecen simples planillas de Excel.',
      solution: 'Panel interactivo con gradientes forestales oscuros y modelo 3D del bosque municipal que crece según el impacto del ciudadano.'
    }
  },
  {
    id: 'pawhero',
    title: 'PawHero',
    role: 'Pet Tracking & NGO Donations',
    stack: ['Next.js', 'React Native', 'SQLite', 'Base L2', 'Three.js', 'STL 3D Print'],
    link: 'https://pawhero.aldoarbizu.com',
    dev: {
      problem: 'Validación y geolocalización asíncrona de mascotas perdidas sin consumo de APIs celulares de pago.',
      solution: 'Red de rescate pasiva P2P. Las chapas QR impresas en 3D transmiten el GPS del lector de forma cifrada mediante WebSockets locales.'
    },
    founder: {
      problem: 'Costos mensuales prohibitivos en collares GPS y desorganización de rescate animal en protectoras (SAPAB).',
      solution: 'Chapas identificatorias QR descargables en STL para impresión 3D a costo cero de suscripción, e integraciones de donaciones mediante SBT.'
    },
    gentleman: {
      problem: 'Placas de identificación de mascotas genéricas o interfaces lúdicas infantiles sin seriedad.',
      solution: 'Perfiles de mascotas interactivos 3D con tipografía minimalista limpia y visualización de medallas SBT de bronce, plata y oro.'
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

  return (
    <motion.div
      ref={cardRef}
      style={{ width, opacity: cardOpacity, y: cardY }}
      className="mx-auto orbital-glow"
    >
      <div className="glass-surface p-8 md:p-12 relative group transition-all duration-500 hover:border-[var(--color-orbital-teal)]/30 overflow-hidden">
        {/* Decorative index */}
        <motion.div
          className="absolute top-6 right-8 font-serif text-6xl md:text-8xl text-white/[0.03] leading-none select-none pointer-events-none"
        >
          {String(index + 1).padStart(2, '0')}
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            {/* Project counter */}
            <div className="flex items-center gap-3 mb-4">
              <span className="font-space text-[9px] text-[var(--color-mist-gray)]/40 tracking-widest">
                {String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
              </span>
              <div className="h-px flex-1 bg-[var(--color-space-border)]" />
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
            
            <div className="mt-8 flex gap-4">
              <motion.a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                whileHover={{ x: 4 }}
                className="btn-outline flex items-center gap-2 cursor-none group/link"
              >
                <ExternalLink size={16} className="group-hover/link:text-[var(--color-orbital-teal)] transition-colors" />
                <span>Demo En Vivo</span>
              </motion.a>
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
