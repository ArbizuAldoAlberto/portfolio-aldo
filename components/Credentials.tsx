'use client'
import { motion } from 'framer-motion'

export default function Credentials() {
  const tech = [
    { name: 'Ciberseguridad', org: 'UNGS' },
    { name: 'React & SQL', org: 'Coderhouse' },
    { name: 'Inteligencia Artificial', org: 'BIG School' }
  ]

  const agro = [
    { name: 'Técnico Agropecuario', org: 'EAS Del Valle' },
    { name: 'Cs. Agrarias', org: 'UNLP' },
    { name: 'Drones y AgTech', org: 'UTN / ArgenINTA' }
  ]

  return (
    <section id="credenciales" className="py-24 px-6 md:px-24 bg-slate-950/80">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-serif text-center mb-20">Respaldo Institucional <span className="italic text-emerald-400">& Técnico.</span></h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Tech Block */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-8 relative group"
          >
            <div className="absolute -left-4 top-0 w-[1px] h-full bg-emerald-500/20 group-hover:bg-emerald-500/50 transition-all duration-700"></div>
            <h3 className="text-sm font-mono uppercase tracking-[0.3em] text-emerald-500/60 pb-4 flex items-center gap-4">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               Ecosistema Tecnológico
            </h3>
            <div className="space-y-6">
              {tech.map((item, i) => (
                <div key={i} className="flex justify-between items-end border-b border-white/5 pb-2">
                  <span className="text-lg text-white font-serif">{item.name}</span>
                  <span className="text-sm font-mono text-slate-500 uppercase">{item.org}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Agro Block */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-8 relative group"
          >
            <div className="absolute -right-4 top-0 w-[1px] h-full bg-emerald-500/20 group-hover:bg-emerald-500/50 transition-all duration-700"></div>
            <h3 className="text-sm font-mono uppercase tracking-[0.3em] text-emerald-500/60 pb-4 flex items-center justify-end gap-4">
               Raíces Agropecuarias
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </h3>
            <div className="space-y-6">
              {agro.map((item, i) => (
                <div key={i} className="flex justify-between items-end border-b border-white/5 pb-2">
                  <span className="text-lg text-white font-serif">{item.name}</span>
                  <span className="text-sm font-mono text-slate-500 uppercase">{item.org}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
