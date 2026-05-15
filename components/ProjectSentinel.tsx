'use client'
import { motion } from 'framer-motion'
import { Smartphone, Database, Zap, MapPin } from 'lucide-react'
import { Github } from './BrandIcons'
import Magnetic from './Magnetic'

export default function ProjectSentinel() {
  const features = [
    { icon: <Database className="w-5 h-5" />, title: 'Offline-First Nativo', desc: 'Single Source of Truth con SQLite local.' },
    { icon: <Zap className="w-5 h-5" />, title: 'Sincronización Asíncrona', desc: 'Recuperación fluida al detectar red (Firestore).' },
    { icon: <MapPin className="w-5 h-5" />, title: 'Geo-Tracking', desc: 'Precisión de fondo con bajo consumo de recursos.' },
  ]

  return (
    <section id="showcase" className="min-h-screen py-24 px-6 md:px-24 flex flex-col justify-center bg-slate-950/50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: High-Fidelity Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          whileHover={{ rotateY: 5, rotateX: -5, perspective: 1000 }}
          transition={{ duration: 0.8 }}
          className="relative aspect-[9/16] max-w-[320px] mx-auto lg:ml-0 rounded-[3rem] border-[12px] border-slate-800 shadow-[0_0_50px_rgba(16,185,129,0.15)] overflow-hidden bg-slate-900 group"
        >
          <img 
            src="/images/sentinel-mockup.png" 
            alt="Sentinel App Mockup" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60"></div>
          <div className="absolute bottom-8 left-8 right-8">
             <div className="w-12 h-1 bg-emerald-500 rounded-full mb-4"></div>
             <p className="text-white text-xs font-mono tracking-widest uppercase">Active Sentinel Node</p>
          </div>
        </motion.div>

        {/* Right: Content */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-10"
        >
          <div className="inline-block px-4 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-widest">
            Case Study: Mobile Resilience
          </div>
          <h2 className="text-4xl md:text-6xl font-serif font-light leading-tight">
            Proyecto <span className="text-emerald-400 italic">Sentinel.</span>
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed max-w-xl font-light">
            "La conectividad inestable es el mayor bloqueador de la adopción tecnológica en el campo. Diseñé Sentinel como una arquitectura de referencia para ecosistemas AgTech resilientes."
          </p>
          
          <ul className="grid grid-cols-1 gap-8">
            {features.map((f, i) => (
              <motion.li 
                key={i} 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
                className="flex gap-6 items-start group"
              >
                <div className="p-3 rounded-xl bg-emerald-500/5 text-emerald-500 border border-emerald-500/10 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/40 transition-all duration-500">
                  {f.icon}
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg mb-1">{f.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              </motion.li>
            ))}
          </ul>

          <div className="pt-4">
            <Magnetic>
              <a 
                href="https://github.com/ArbizuAldoAlberto" 
                className="btn-secondary inline-flex items-center gap-3 px-8"
              >
                <Github className="w-5 h-5" />
                Explorar Arquitectura
              </a>
            </Magnetic>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
