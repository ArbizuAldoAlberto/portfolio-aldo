'use client'
import { motion } from 'framer-motion'

export default function OriginStory() {
  return (
    <section id="origen" className="py-24 px-6 md:px-24 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative order-2 lg:order-1"
        >
          {/* Placeholder for professional image */}
          <div className="aspect-square bg-slate-800 rounded-3xl overflow-hidden border border-white/5 shadow-2xl relative group">
             <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 to-transparent"></div>
             <div className="absolute inset-0 flex items-center justify-center text-slate-700 font-serif italic text-2xl">
                [Imagen Profesional]
             </div>
          </div>
          {/* Decorative element */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-500/20 blur-3xl rounded-full"></div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 order-1 lg:order-2"
        >
          <h2 className="text-4xl md:text-6xl font-serif font-light">
            Todo empezó <span className="text-emerald-400 italic font-medium">en la tierra.</span>
          </h2>
          
          <div className="space-y-6 text-base md:text-lg text-slate-300 leading-relaxed font-light">
            <p>
              "Mientras me formaba como Técnico Agropecuario en la Escuela Agrotécnica Salesiana Del Valle y estudiaba Ciencias Agrarias en La Plata, notaba un patrón frustrante: el campo estaba desactualizado. Veía cómo el sector demandaba innovación, pero las pocas soluciones tecnológicas que llegaban parecían diseñadas por personas que jamás habían lidiado con el barro, el sol en la pantalla o la falta de señal."
            </p>
            <p>
              "Me di cuenta de que si quería cambiar esa realidad, tenía que aprender el idioma de las máquinas. Cambié el rumbo hacia la informática justo antes de la pandemia. Me especialicé en Desarrollo Mobile (React Native), Ciberseguridad y arquitecturas robustas. Quería entender cómo construir sistemas de punta a punta que realmente aguantaran la fricción del mundo real."
            </p>
            <p>
              "Hoy mi visión está puesta en el futuro del Agro-Tech: tokenización, realidad virtual y trazabilidad absoluta. Construyo el software que sirve de puente entre el trabajo más antiguo del mundo y la tecnología del mañana."
            </p>
          </div>
          <div className="pt-4">
             <div className="inline-block px-4 py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 font-mono text-xs uppercase tracking-widest">
                Identidad: Empatía Operativa
             </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
