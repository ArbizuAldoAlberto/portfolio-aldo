'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import GlobalCanvas from '../components/GlobalCanvas'
import ProjectSentinel from '../components/ProjectSentinel'
import SolutionsHub from '../components/SolutionsHub'
import OriginStory from '../components/OriginStory'
import Credentials from '../components/Credentials'
import Workline from '../components/Workline'
import Magnetic from '../components/Magnetic'
import { Mail, ArrowRight } from 'lucide-react'
import { Github, Linkedin } from '../components/BrandIcons'

export default function AntigravityPortfolio() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const yHero = useTransform(scrollYProgress, [0, 0.1], [0, -100])
  const opacityHero = useTransform(scrollYProgress, [0, 0.1], [1, 0])

  return (
    <div ref={containerRef} className="relative bg-slate-950 text-slate-200">
      <GlobalCanvas />

      {/* --- SECCIÓN 1: HEADER / HERO --- */}
      <section className="relative h-screen flex flex-col justify-center items-center px-6 z-10 text-center">
        <motion.div 
          style={{ opacity: opacityHero, y: yHero }}
          className="space-y-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/20 flex items-center justify-center text-slate-950 font-bold">A</div>
            <span className="font-mono text-sm tracking-[0.3em] uppercase text-emerald-400">Antigravity Studio</span>
          </div>
          
          <h1 className="text-4xl md:text-[5vw] font-serif font-light leading-[1.1] tracking-tight text-white flex flex-col items-center">
            <span className="text-reveal">
               <span className="text-reveal-inner">Desarrollador Mobile</span>
            </span>
            <span className="text-reveal" style={{ animationDelay: '0.2s' }}>
               <span className="text-reveal-inner italic text-emerald-400">& Innovación Agro-Tech</span>
            </span>
          </h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="max-w-3xl mx-auto text-lg md:text-xl text-slate-400 font-light leading-relaxed"
          >
            Soy Desarrollador Mobile y Full Stack con raíces en la producción agropecuaria. 
            Diseño aplicaciones en <span className="text-emerald-400/80">React Native</span> que conectan el trabajo duro en el medio del lote con la gestión administrativa, de forma fluida y segura.
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8 pointer-events-auto">
            <Magnetic>
               <a href="#showcase" className="btn-primary flex items-center justify-center gap-2">
                 Ver Proyecto Sentinel
                 <ArrowRight className="w-4 h-4" />
               </a>
            </Magnetic>
            <Magnetic>
               <a href="#workline" className="btn-secondary">
                 Ver Workline Profesional
               </a>
            </Magnetic>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-12 w-6 h-10 border border-white/10 rounded-full flex justify-center p-1"
        >
          <div className="w-1 h-2 bg-emerald-500 rounded-full"></div>
        </motion.div>
      </section>

      <div className="relative z-20">
        {/* --- SECCIÓN 2: SHOWCASE (SENTINEL) --- */}
        <ProjectSentinel />

        {/* --- SECCIÓN 2.5: WORKLINE --- */}
        <Workline />

        {/* --- SECCIÓN 3: SOLUTIONS HUB (CVs) --- */}
        <SolutionsHub />

        {/* --- SECCIÓN 4: ORIGIN STORY --- */}
        <OriginStory />

        {/* --- SECCIÓN 5: CREDENTIALS --- */}
        <Credentials />

        {/* --- SECCIÓN 6: FOOTER --- */}
        <footer className="py-32 px-6 md:px-24 bg-slate-950 border-t border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
          
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-8xl font-serif font-light text-white leading-none tracking-tight"
            >
              Iniciar <br /><span className="italic text-emerald-400">Conversación.</span>
            </motion.h2>
            
            <div className="flex flex-col items-center space-y-6">
               <p className="text-slate-500 font-mono text-xs tracking-[0.4em] uppercase max-w-md">Base operativa en Bolívar, Buenos Aires. <br />Despliegue y Disponibilidad LATAM.</p>
               <Magnetic>
                  <a href="mailto:arbizualdoalberto@gmail.com" className="text-2xl md:text-4xl font-serif text-white hover:text-emerald-400 transition-all duration-500">
                     arbizualdoalberto@gmail.com
                  </a>
               </Magnetic>
            </div>

            <div className="flex gap-6 pt-12">
               <Magnetic>
                  <a href="https://linkedin.com/in/aldo-alberto-arbizu" target="_blank" rel="noopener noreferrer" className="w-14 h-14 flex items-center justify-center rounded-full bg-emerald-500/5 border border-emerald-500/20 text-emerald-500/50 hover:text-emerald-400 hover:border-emerald-400 hover:bg-emerald-400/10 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all duration-500 group">
                     <Linkedin className="w-6 h-6 group-hover:scale-110 transition-transform duration-500" />
                  </a>
               </Magnetic>
               <Magnetic>
                  <a href="https://github.com/ArbizuAldoAlberto" target="_blank" rel="noopener noreferrer" className="w-14 h-14 flex items-center justify-center rounded-full bg-emerald-500/5 border border-emerald-500/20 text-emerald-500/50 hover:text-emerald-400 hover:border-emerald-400 hover:bg-emerald-400/10 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all duration-500 group">
                     <Github className="w-6 h-6 group-hover:scale-110 transition-transform duration-500" />
                  </a>
               </Magnetic>
               <Magnetic>
                  <a href="mailto:arbizualdoalberto@gmail.com" className="w-14 h-14 flex items-center justify-center rounded-full bg-emerald-500/5 border border-emerald-500/20 text-emerald-500/50 hover:text-emerald-400 hover:border-emerald-400 hover:bg-emerald-400/10 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all duration-500 group">
                     <Mail className="w-6 h-6 group-hover:scale-110 transition-transform duration-500" />
                  </a>
               </Magnetic>
            </div>

            <div className="pt-32 flex flex-col items-center gap-4">
               <div className="text-[10px] font-mono text-slate-700 tracking-[0.6em] uppercase">
                  Antigravity Studio &copy; 2026 | All Signals Encrypted
               </div>
               <div className="w-12 h-[1px] bg-emerald-500/20"></div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
