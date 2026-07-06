'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { usePersona } from '../theme/PersonaContext'
import HorizontalScrollSection from '../ui/HorizontalScrollSection'
import GlitchText from '../ui/GlitchText'
import MagneticButton from '../ui/MagneticButton'
const rawProjects = [
  {
    id: 'titanflow',
    title: 'TitanFlow',
    type: 'saas',
    role: 'DeFi Copy Trading & Algorithmic Bot',
    stack: ['Node.js', 'TypeScript', 'Ollama AI', 'CCXT', 'Solidity', 'Base L2'],
    link: 'https://titanflow.aldoarbizu.com',
    featuredIn: ['engineer'],
    engineer: {
      problem: 'Fricción por deslizamiento (slippage) y latencia en APIs de futuros.',
      solution: 'WebSockets concurrentes de baja latencia con oráculo de Kelly para control de slippage.'
    },
    security: {
      problem: 'Tarifas elevadas de copy-trading y riesgo de custodia de API keys.',
      solution: 'Contratos inteligentes en Base L2 (ERC-4626) con firma local de órdenes sin custodia.'
    },
    'agtech': {
      problem: 'Consolas de trading ruidosas que inducen al overtrading y fatiga visual.',
      solution: 'Dashboard minimalista oscuro con gráficos netos y telemetría purgada.'
    }
  },
  {
    id: 'sentinelos',
    title: 'SentinelOS',
    type: 'labs',
    role: 'Security Dispatch & Command Center',
    stack: ['React Native', 'Expo EAS', 'SQLite', 'Redux Toolkit', 'Firebase RTDB', 'Lottie'],
    link: 'https://sentinelos.aldoarbizu.com',
    featuredIn: ['security'],
    engineer: {
      problem: 'Fraude por clonación de tags NFC de control de rondas.',
      solution: 'Validación biométrica con red TensorFlow Lite local que audita fotos de control.'
    },
    security: {
      problem: 'Elevados costos en bastones de patrulla y pérdida de señal en subterráneos.',
      solution: 'App móvil con despacho SOS Aegis y comunicación en malla Mesh P2P local.'
    },
    'agtech': {
      problem: 'Pantallas tácticas sobrecargadas que fatigan al operador nocturno.',
      solution: 'Contraste ultra-alto con tipografía monoespaciada e interfaces optimizadas para la noche.'
    }
  },
  {
    id: 'aeroshot',
    title: 'AeroShot',
    type: 'prototype',
    role: 'Agricultural Drone Processing SaaS',
    stack: ['React Native', 'Expo', 'SQLite', 'Animated', 'Jest', 'Expo Haptics'],
    link: 'https://aeroshot.aldoarbizu.com',
    featuredIn: ['agtech'],
    engineer: {
      problem: 'Transiciones de telemetría de vuelo bruscas en el renderizado móvil.',
      solution: 'Control de estados fluido con Animated.spring y amortiguación de señal por hardware.'
    },
    security: {
      problem: 'Pérdida de mapas de parcelas por nula señal en campos remotos.',
      solution: 'Procesamiento de imágenes y telemetría de parcelas Offline-First con sync en background.'
    },
    'agtech': {
      problem: 'Visualizaciones cartográficas toscas en informes de entrega.',
      solution: 'Capas cartográficas con transiciones glassmorphic suaves e interfaz háptica precisa.'
    }
  },
  {
    id: 'agromarket',
    title: 'AgroMarket Pro',
    type: 'labs',
    role: 'AgriTech Logistics & Marketplace',
    stack: ['React', 'Zustand', 'Supabase', 'HTML5 Canvas', 'Gemini API', 'Universal Cart'],
    link: 'https://agromarket.aldoarbizu.com',
    featuredIn: ['agtech'],
    engineer: {
      problem: 'Cálculo volumétrico tridimensional local en el cliente móvil impreciso.',
      solution: 'Proyección de mallas poligonales en Canvas 2D y auditoría fitotóxica con Gemini API.'
    },
    security: {
      problem: 'Tasaciones de silobolsas y hacienda lentas y procesos de remate complejos.',
      solution: 'Simulador AR para cubicación sin red y remates de hacienda con WebRTC en tiempo real.'
    },
    'agtech': {
      problem: 'Interfaces agrarias toscas que desalientan su adopción diaria.',
      solution: 'Panel premium con Bento Grid, texturas oscuras y contrastes de luz ámbar.'
    }
  },
  {
    id: 'cannabis',
    title: 'SabioBosque',
    type: 'labs',
    role: 'E-commerce & Legal Compliance SaaS',
    stack: ['Next.js', 'React', 'Zustand', 'Supabase', 'Gemini API', 'Universal Cart'],
    link: 'https://sabiobosque.aldoarbizu.com',
    featuredIn: ['security', 'agtech', 'engineer'],
    engineer: {
      problem: 'Fricción en la verificación manual de recetas REPROCANN legales.',
      solution: 'Validación automatizada con Gemini API de stock y recetas en pasarela.'
    },
    security: {
      problem: 'Riesgo de sanciones por exceder stock legal y checkouts complejos.',
      solution: 'e-Commerce integrado a la base federal REPROCANN y checkout Universal Cart.'
    },
    'agtech': {
      problem: 'Sitios cannábicos informales que no transmiten rigurosidad.',
      solution: 'Boutique digital refinada con gradientes verde esmeralda y micro-interacciones.'
    }
  },
  {
    id: 'ecoconnect',
    title: 'EcoConnect',
    type: 'labs',
    role: 'ESG Registry & Carbon Platform',
    stack: ['Next.js', 'React', 'Zustand', 'Supabase', 'PostgreSQL', 'Ethers.js (Base L2)'],
    link: 'https://ecoconnect.aldoarbizu.com',
    featuredIn: ['agtech', 'security'],
    engineer: {
      problem: 'Políticas de seguridad RLS vulnerables ante consultas complejas de auditorías.',
      solution: 'Esquema estricto de RLS y firmas criptográficas on-chain en Base L2.'
    },
    security: {
      problem: 'Costos elevados de certificación y auditorías forestales para municipios.',
      solution: 'Estimación de biomasa satelital Sentinel-2 y emisión de Soulbound Tokens (SBT).'
    },
    'agtech': {
      problem: 'Interfaces de carbono frías que parecen hojas de cálculo de Excel.',
      solution: 'Modelo 3D interactivo del bosque municipal que crece según tus donaciones.'
    }
  },
  {
    id: 'pawhero',
    title: 'PawHero',
    type: 'prototype',
    role: 'Pet Tracking & NGO Donations',
    stack: ['Next.js', 'React Native', 'SQLite', 'Base L2', 'Three.js', 'STL 3D Print'],
    link: 'https://pawhero.aldoarbizu.com',
    featuredIn: ['engineer', 'security', 'agtech'],
    engineer: {
      problem: 'Geolocalización de mascotas perdidas sin costosas suscripciones celulares.',
      solution: 'Chapas QR cifradas e interconectadas mediante WebSockets y red P2P.'
    },
    security: {
      problem: 'Costos prohibitivos en collares GPS y desorganización de ONGs.',
      solution: 'Placas QR descargables en STL para impresión 3D a costo cero y donaciones SBT.'
    },
    'agtech': {
      problem: 'Identificadores genéricos o interfaces lúdicas sin seriedad.',
      solution: 'Perfiles interactivos 3D con tipografía minimalista y medallas SBT on-chain.'
    }
  },
  {
    id: 'impresion3d',
    title: 'Impresión 3D P2P',
    type: 'prototype',
    role: 'Collaborative 3D Printing Platform',
    stack: ['Kotlin', 'Jetpack Compose', 'Room SQLite', 'Gemini API', 'Web3 Escrow', 'STL 3D Print'],
    link: 'https://impresion3d.aldoarbizu.com',
    featuredIn: ['engineer', 'security'],
    engineer: {
      problem: 'Complejidad y lentitud en la cotización manual de archivos de diseño STL.',
      solution: 'IA Slicer integrado que analiza y cotiza mallas poligonales 3D localmente en el cliente.'
    },
    security: {
      problem: 'Comisiones elevadas en plataformas de manufactura y falta de confianza entre partes.',
      solution: 'Escrow descentralizado seguro en Base L2 y red P2P de Makers con hardware verificado.'
    },
    'agtech': {
      problem: 'Interfaces de manufactura 3D toscas e industriales que aburren al usuario.',
      solution: 'Visualizador de mallas 3D premium e interactivo con diseño liquid glass moderno.'
    }
  },
  {
    id: 'habitat',
    title: 'Hábitat',
    type: 'prototype',
    role: 'Decentralized Direct Rentals & Land Control',
    stack: ['Kotlin', 'Jetpack Compose', 'Room SQLite', 'Solidity (Base L2)', 'Gemini API'],
    link: 'https://habitat.aldoarbizu.com',
    featuredIn: ['engineer', 'security', 'agtech'],
    engineer: {
      problem: 'Vulnerabilidades en el flujo de verificación y firma de contratos tradicionales.',
      solution: 'Firmas criptográficas on-chain en Base L2 con verificación directa del inquilino.'
    },
    security: {
      problem: 'Intermediarios inmobiliarios costosos y especulación con tierras ociosas.',
      solution: 'Contratos inteligentes autoejecutables y base de datos local para reconversión productiva.'
    },
    'agtech': {
      problem: 'Procesos de alquiler fríos y complejos sin guías ni soporte dinámico.',
      solution: 'Dashboard minimalista de reubicación y contratos con glassmorphism premium.'
    }
  },
  {
    id: 'marketingadvisor',
    title: 'Smart Marketing Advisor',
    type: 'prototype',
    role: 'AI Omnichannel Marketing Coach',
    stack: ['Kotlin', 'Jetpack Compose', 'Room SQLite', 'Gemini API', 'Recharts analytics'],
    link: 'https://marketingadvisor.aldoarbizu.com',
    featuredIn: ['engineer'],
    engineer: {
      problem: 'Baja velocidad en la generación y publicación de contenido promocional.',
      solution: 'Generador de copys publicitarios ultrarrápido con LLM local y encolado en SQLite.'
    },
    security: {
      problem: 'Falta de analítica clara de retorno sobre inversión publicitaria para pymes.',
      solution: 'Panel de control con métricas e informes automáticos en vivo para optimizar prospectos.'
    },
    'agtech': {
      problem: 'Administradores de redes sociales sobrecargados de botones que fatigan la vista.',
      solution: 'Bento Grid de control de marketing con tipografías elegantes Outfit e Inter.'
    }
  },
  {
    id: 'nomadhub',
    title: 'NOMAD Tactical Hub',
    type: 'prototype',
    role: 'Off-grid Resilient Survival System',
    stack: ['Kotlin', 'Jetpack Compose', 'Room SQLite', 'Vigenère Cipher', 'Morse Encoder'],
    link: 'https://nomadhub.aldoarbizu.com',
    featuredIn: ['agtech', 'security', 'engineer'],
    engineer: {
      problem: 'Dependencia de servidores centrales para cifrado y cálculos de radio en crisis.',
      solution: 'Calculadoras RF locales para antenas dipolo y cifrado Vigenère sin conexión.'
    },
    security: {
      problem: 'Caída de infraestructura telefónica que incomunica a comunidades vulnerables.',
      solution: 'Portal de Solidaridad Humana con mensajería simulada LoRa Mesh P2P y mapas GPS offline.'
    },
    'agtech': {
      problem: 'Diseño militar clásico descuidado que resulta ilegible en condiciones nocturnas.',
      solution: 'Estilo cyber-dark con alto contraste verde neón y volt cian para mayor legibilidad.'
    }
  }
]


function ProjectCard({ project, index, total }: { project: typeof rawProjects[0] & { featuredIn?: string[] }, index: number, total: number }) {
  const { persona } = usePersona()
  const t = useTranslations('Projects')
  
  const projectId = project.id as keyof typeof rawProjects
  // we access the translation for this specific project
  // the project details will depend on the persona, if not exists fallback to engineer
  const targetPersona = project[persona as keyof typeof project] ? persona : 'engineer'
  const problem = t(`projects.${project.id}.${targetPersona}.problem`)
  const solution = t(`projects.${project.id}.${targetPersona}.solution`)

  const isSecurity = persona === 'security';
  const isEngineer = persona === 'engineer';
  const isAgtech = persona === 'agtech';
  const isFeatured = project.featuredIn?.includes(persona);

  let cardClasses = "";
  if (isSecurity) {
    cardClasses = "glass-surface p-8 md:p-12 relative group transition-all duration-500 overflow-hidden bg-black/40 backdrop-blur-2xl border border-white/5 hover:border-[#EF4444]/50 hover:bg-[#050508]/80 shadow-[inset_0_0_80px_rgba(239,68,68,0.03)] hover:shadow-[0_0_50px_rgba(239,68,68,0.1)] rounded-2xl h-full flex flex-col";
  } else if (isAgtech) {
    cardClasses = "glass-surface p-8 md:p-12 relative group transition-all duration-500 hover:border-[#84CC16]/30 hover:shadow-[0_0_30px_rgba(132,204,22,0.15)] overflow-hidden rounded-2xl h-full flex flex-col";
  } else {
    cardClasses = "glass-surface p-8 md:p-12 relative group transition-all duration-500 hover:border-[#3BEACE]/30 hover:shadow-[0_0_30px_rgba(59,234,206,0.15)] overflow-hidden rounded-2xl h-full flex flex-col";
  }

  const getTechGlowClass = (tech: string) => {
    const engineerTech = ['Node.js', 'TypeScript', 'React Native', 'Expo Bare', 'SQLite WAL', 'Zustand', 'Kotlin', 'Jetpack Compose'];
    const securityTech = ['Base L2', 'Supabase', 'Solidity', 'Room SQLite', 'Ethers.js (Base L2)', 'Web3 Escrow'];
    const agtechTech = ['Three.js', 'HTML5 Canvas', 'Lottie', 'STL 3D Print', 'Animated', 'Mapbox', 'IoT'];

    if (isEngineer && engineerTech.includes(tech)) return 'border-[var(--color-orbital-teal)] text-white shadow-[0_0_15px_rgba(29,158,117,0.4)] bg-[var(--color-orbital-teal)]/10';
    if (isSecurity && securityTech.includes(tech)) return 'border-[var(--color-orbital-teal)] text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] bg-[var(--color-orbital-teal)]/10';
    if (isAgtech && agtechTech.includes(tech)) return 'border-[var(--color-orbital-teal)] text-white shadow-[0_0_15px_rgba(132,204,22,0.4)] bg-[var(--color-orbital-teal)]/10';
    return 'border-[var(--color-space-border)] text-[var(--color-mist-gray)] hover:border-white/20';
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`w-full mx-auto ${isSecurity ? 'drop-shadow-2xl' : 'orbital-glow'} h-full flex`}
    >
      <div className={`flex-1 ${cardClasses} ${isFeatured ? 'border-t-2 border-t-[var(--color-orbital-teal)]' : ''}`} style={isFeatured ? { borderTopColor: 'var(--color-orbital-teal)' } : {}}>
        <div
          className={`absolute top-6 right-8 font-serif text-6xl md:text-8xl leading-none select-none pointer-events-none transition-colors ${isSecurity ? 'text-white/[0.02] group-hover:text-[#EF4444]/10' : isAgtech ? 'text-white/[0.02] group-hover:text-[#84CC16]/10' : 'text-white/[0.03] group-hover:text-[#1D9E75]/10'}`}
        >
          {String(index + 1).padStart(2, '0')}
        </div>

        {isSecurity && (
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#EF4444]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        )}
        {isAgtech && (
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#84CC16]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        )}

        <div className="flex flex-col relative z-10 flex-1 h-full">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className={`font-space text-[9px] tracking-widest ${isSecurity ? 'text-[#EF4444]/60' : isAgtech ? 'text-[#84CC16]/60' : 'text-[var(--color-orbital-teal)]/60'}`}>
                {String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
              </span>
              <div className={`h-px flex-1 ${isSecurity ? 'bg-gradient-to-r from-[#EF4444]/20 to-transparent' : isAgtech ? 'bg-gradient-to-r from-[#84CC16]/20 to-transparent' : 'bg-gradient-to-r from-[var(--color-orbital-teal)]/20 to-transparent'}`} />
              
              <span className={`font-space text-[9px] tracking-widest font-bold px-2 py-0.5 rounded border ${
                project.type === 'saas' 
                  ? 'border-[var(--color-amber-gold)] text-[var(--color-amber-gold)] shadow-[0_0_10px_rgba(239,159,39,0.2)] bg-[var(--color-amber-gold)]/5' 
                  : project.type === 'labs'
                    ? 'border-[var(--color-electric-purple)] text-[var(--color-electric-purple)] shadow-[0_0_10px_rgba(127,119,221,0.2)] bg-[var(--color-electric-purple)]/5'
                    : 'border-[var(--color-space-border)] text-[var(--color-mist-gray)] bg-black/10'
              }`}>
                {t(`labels.types.${project.type}`)}
              </span>

              {isFeatured && (
                <span className={`font-space text-[9px] tracking-widest font-bold px-2 py-0.5 rounded border ${isSecurity ? 'border-[#EF4444] text-[#EF4444] shadow-[0_0_10px_rgba(239,68,68,0.2)]' : isAgtech ? 'border-[#84CC16] text-[#84CC16] shadow-[0_0_10px_rgba(132,204,22,0.2)]' : 'border-[var(--color-orbital-teal)] text-[var(--color-orbital-teal)] shadow-[0_0_10px_rgba(29,158,117,0.2)]'}`}>
                  {t('labels.featured')}
                </span>
              )}
            </div>

            <h3 className="font-serif text-3xl md:text-4xl text-white mb-2 group-hover:text-gradient transition-all">{t(`projects.${project.id}.title`)}</h3>
            <div className="font-space text-[var(--color-orbital-teal)] text-sm mb-8 font-bold" style={{ color: 'var(--color-orbital-teal)' }}>{t(`projects.${project.id}.role`)}</div>

            <AnimatePresence mode="wait">
              <motion.div
                key={persona}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 font-mono text-sm mb-8"
              >
                <div>
                  <span className="text-white block mb-1 font-bold">{t('labels.problem')}</span>
                  <span className="text-[var(--color-mist-gray)]">{problem}</span>
                </div>
                <div>
                  <span className="text-white block mb-1 font-bold">{t('labels.solution')}</span>
                  <span className="text-[var(--color-mist-gray)]">{solution}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex flex-col justify-between mt-auto">
            <div>
              <span className="font-mono text-white text-sm block mb-4 font-bold">{t('labels.stack')}</span>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((tech, j) => (
                  <span
                    key={j}
                    className={`px-3 py-1 border font-space text-xs transition-all duration-300 cursor-default rounded-sm ${getTechGlowClass(tech)}`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-[var(--color-space-border)] flex flex-col md:flex-row gap-4">
              <MagneticButton
                href={project.link}
                target="_blank"
                rel="noreferrer"
                variant="outline"
                className="group/link w-full md:w-auto justify-center"
              >
                <ExternalLink size={14} className="group-hover/link:text-black transition-colors" />
                <span>{t('labels.demo')}</span>
              </MagneticButton>
              
              {(project.stack.includes('React Native') || project.stack.includes('Kotlin')) && (
                <>
                  <MagneticButton
                    href={`${project.link}/downloads/${project.id}.apk`}
                    target="_blank"
                    rel="noreferrer"
                    variant="outline"
                    className="group/link w-full md:w-auto justify-center"
                  >
                    <span className="text-green-500 group-hover/link:text-black transition-colors">🤖</span>
                    <span>{t('labels.apk')}</span>
                  </MagneticButton>
                </>
              )}
              
              <MagneticButton
                href="/#services"
                variant="outline"
                className="group/link w-full md:w-auto justify-center border-[var(--color-orbital-teal)] text-[var(--color-orbital-teal)] hover:bg-[var(--color-orbital-teal)] hover:text-black"
              >
                <span>{t('labels.b2b')}</span>
              </MagneticButton>
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
  
  const { persona } = usePersona()
  const t = useTranslations('Projects')

  const bgY = useTransform(scrollYProgress, [0, 1], [50, -80])
  const bgOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 0.05, 0.05, 0])

  // Sort projects: featured projects for active persona come first
  const sortedProjects = [...rawProjects].sort((a, b) => {
    const aFeatured = (a as any).featuredIn?.includes(persona) ? 1 : 0;
    const bFeatured = (b as any).featuredIn?.includes(persona) ? 1 : 0;
    return bFeatured - aFeatured;
  });

  const getTitles = () => {
    if (persona === 'security') {
      return { small: t('security.small'), large1: t('security.large1'), large2: t('security.large2') };
    }
    if (persona === 'agtech') {
      return { small: t('agtech.small'), large1: t('agtech.large1'), large2: t('agtech.large2') };
    }
    return { small: t('engineer.small'), large1: t('engineer.large1'), large2: t('engineer.large2') };
  }
  const titles = getTitles();


  return (
    <section id="projects" ref={sectionRef} className="pt-32 pb-32 relative bg-[var(--color-space-black)]">


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 mb-16">
        <GlitchText delay={0.1} text={titles.small} className="font-space text-[var(--color-mist-gray)] uppercase tracking-widest text-sm mb-4 block select-none" />
        <div className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-white leading-tight">
          <GlitchText delay={0.2} text={titles.large1} /><br />
          <GlitchText delay={0.3} text={titles.large2} />
        </div>
      </div>

      <div className="w-full relative z-20 overflow-visible">
        <HorizontalScrollSection>
          <AnimatePresence mode="popLayout">
            {sortedProjects.map((p, i) => (
              <div key={p.id} className="shrink-0 w-[85vw] md:w-[60vw] lg:w-[40vw] h-auto flex snap-start">
                <ProjectCard project={p as any} index={i} total={rawProjects.length} />
              </div>
            ))}
          </AnimatePresence>
        </HorizontalScrollSection>
      </div>
    </section>
  )
}
