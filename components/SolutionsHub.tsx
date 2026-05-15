'use client'
import { motion } from 'framer-motion'
import { Smartphone, Shield, BarChart3, Download } from 'lucide-react'

export default function SolutionsHub() {
  const cards = [
    {
      title: 'Agro-Tech & Mobile',
      icon: <Smartphone className="w-8 h-8 text-emerald-400" />,
      desc: 'Desarrollo React Native, UX de campo, Ciberseguridad, Integración Web3/IA.',
      btn: 'Perfil IT & Desarrollo (CV 3)'
    },
    {
      title: 'Operaciones Logísticas',
      icon: <Shield className="w-8 h-8 text-emerald-400" />,
      desc: 'Prevención de Pérdidas, Logística, Seguridad Física, Auditoría con Drones.',
      btn: 'Perfil Operativo (CV 2)'
    },
    {
      title: 'Traducción B2B',
      icon: <BarChart3 className="w-8 h-8 text-emerald-400" />,
      desc: 'Venta consultiva High-Ticket, asesoría tecnológica y traducción de ingeniería a negocio.',
      btn: 'Perfil Comercial (CV 1)'
    }
  ]

  return (
    <section id="hub" className="py-24 px-6 md:px-24 bg-slate-900/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif">Capacidad de Respuesta <span className="italic text-emerald-400">Integral.</span></h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
             "El diseño de soluciones integrales donde la fluidez de la app en la mano del operario es tan importante como la seguridad del dato en el servidor contable."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6">
          {/* Card 1: Main Feature (Large) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="md:col-span-3 lg:col-span-8 antigravity-card p-10 flex flex-col group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/10 transition-all duration-700"></div>
            <div className="mb-8 p-4 w-fit rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <Smartphone className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-3xl font-serif mb-4">Agro-Tech & Mobile Engineering</h3>
            <p className="text-slate-400 leading-relaxed mb-8 max-w-xl">
               Desarrollo de aplicaciones React Native robustas para entornos de baja conectividad. 
               Arquitecturas resilientes con SQLite, sincronización en tiempo real y UX optimizada para el operario rural.
            </p>
            <div className="mt-auto">
               <button className="btn-secondary flex items-center justify-center gap-2 text-sm w-fit">
                 <Download className="w-4 h-4" />
                 Perfil IT & Desarrollo (CV 3)
               </button>
            </div>
          </motion.div>

          {/* Card 2: Operations */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-3 lg:col-span-4 antigravity-card p-10 flex flex-col group"
          >
            <div className="mb-8 p-4 w-fit rounded-2xl bg-cyber-blue/10 border border-cyber-blue/20">
              <Shield className="w-8 h-8 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-serif mb-4">Operaciones Logísticas</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
               Prevención de pérdidas y seguridad física integrada con tecnología de monitoreo remoto y drones.
            </p>
            <div className="mt-auto">
               <button className="btn-secondary w-full border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 flex items-center justify-center gap-2 text-xs">
                 <Download className="w-4 h-4" />
                 Perfil Operativo (CV 2)
               </button>
            </div>
          </motion.div>

          {/* Card 3: B2B Strategy */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-6 lg:col-span-12 antigravity-card p-10 flex flex-col md:flex-row items-center gap-12 group"
          >
            <div className="flex-1 space-y-6">
               <div className="p-4 w-fit rounded-2xl bg-amber-500/10 border border-amber-500/20">
                 <BarChart3 className="w-8 h-8 text-amber-500" />
               </div>
               <h3 className="text-3xl font-serif">Consultoría & Estrategia Comercial B2B</h3>
               <p className="text-slate-400 leading-relaxed">
                 Traducción de ingeniería compleja a valor de negocio tangible. Venta consultiva de soluciones de alto impacto tecnológico y asesoría estratégica para la transformación digital del agro.
               </p>
            </div>
            <div className="w-full md:w-auto min-w-[280px]">
               <button className="btn-secondary w-full border-amber-500/30 text-amber-500 hover:bg-amber-500/10 flex items-center justify-center gap-2 text-sm">
                 <Download className="w-4 h-4" />
                 Perfil Comercial (CV 1)
               </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
