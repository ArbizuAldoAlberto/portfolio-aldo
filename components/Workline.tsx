'use client'
import { motion } from 'framer-motion'

export default function Workline() {
  const steps = [
    {
      year: '2011',
      title: 'Formación de Base (El Terreno)',
      subtitle: 'Técnico Agropecuario (EAS Del Valle) & Cs. Agrarias (UNLP)',
      impact: 'Adquisición de la perspectiva real del productor y del operador de campo. Comprensión profunda de los ciclos biológicos, operativos y logísticos.',
      skill: 'Pensamiento sistémico y empatía operativa'
    },
    {
      year: 'Pre-Pandemia',
      title: 'El Momento de Quiebre',
      subtitle: 'Ingreso a la Universidad de Informática (Analista IT)',
      impact: 'Reconocimiento de que la falta de tecnología en el agro se resolvía construyendo el software que el sector necesitaba.',
      skill: 'Transición lógica: del trabajo físico a algoritmos'
    },
    {
      year: '2020/2024',
      title: 'Consolidación Tecnológica',
      subtitle: 'Especialización en React Native, Ciberseguridad e IA',
      impact: 'Dominio de herramientas digitales. Capacidad de crear ecosistemas móviles robustos y seguros (OWASP) para entornos sin señal.',
      skill: 'Desarrollo Full Stack y orquestación de IA'
    },
    {
      year: 'Presente',
      title: 'La Fusión (Agro-Tech)',
      subtitle: 'Antigravity Studio & Proyectos Mobile',
      impact: 'Desarrollo de POCs como "Sentinel" y auditoría de fallas GPS en el terreno. Visión en tokenización y trazabilidad.',
      skill: 'Arquitectura Mobile End-to-End'
    }
  ]

  return (
    <section id="workline" className="py-32 px-6 md:px-24 bg-slate-950/50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 space-y-4">
          <h2 className="text-4xl md:text-6xl font-serif">Workline <span className="italic text-emerald-400">Profesional.</span></h2>
          <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.3em]">La evolución del barro al código</p>
        </div>

        <div className="relative space-y-24">
          {/* Vertical Line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-emerald-500/50 via-emerald-500/10 to-transparent"></div>

          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className={`relative flex flex-col md:flex-row items-center gap-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              {/* Point */}
              <div className="absolute left-[-4px] md:left-1/2 md:-translate-x-1/2 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] z-10"></div>
              
              <div className={`w-full md:w-1/2 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                <div className="space-y-4">
                  <span className="text-3xl md:text-5xl font-serif text-emerald-400 italic opacity-50">{step.year}</span>
                  <h3 className="text-2xl md:text-3xl font-serif text-white">{step.title}</h3>
                  <p className="text-emerald-500/80 font-mono text-xs uppercase tracking-widest">{step.subtitle}</p>
                </div>
              </div>

              <div className="w-full md:w-1/2">
                <div className="antigravity-card p-8 space-y-6">
                  <p className="text-slate-400 text-sm leading-relaxed italic">
                    "{step.impact}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-[1px] bg-emerald-500/30"></div>
                    <span className="text-xs font-mono text-emerald-400 uppercase tracking-tighter">
                      Habilidad activada: {step.skill}
                    </span>
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
