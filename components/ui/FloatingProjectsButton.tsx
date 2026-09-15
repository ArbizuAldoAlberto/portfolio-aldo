'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { MessageSquare, Cpu, Mail, ArrowUp, X, Sparkles } from 'lucide-react';
import { useLocale } from 'next-intl';
import { soundEngine } from '../system/SoundEngine';

export default function FloatingProjectsButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const locale = useLocale();
  const isEs = locale === 'es';

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      if (totalScroll > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (currentScroll / totalScroll) * 100)));
      }
      setVisible(currentScroll > 320);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    soundEngine.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <aside aria-label="Tactical Floating Dock" className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto select-none font-mono">
      
      {/* Expanded Speed-Dial Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-3 p-3 rounded-2xl bg-[#070b14]/95 backdrop-blur-2xl border border-emerald-500/40 shadow-[0_10px_35px_rgba(0,0,0,0.85)] flex flex-col gap-2 min-w-[250px]"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10 px-1 text-[10px]">
              <span className="font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                {isEs ? 'ACCESO DIRECTO' : 'FAST-TRACK'}
              </span>
              <span className="text-slate-400">
                {Math.round(scrollProgress)}% {isEs ? 'leído' : 'read'}
              </span>
            </div>

            {/* WhatsApp B2B Direct */}
            <a
              href="https://wa.me/5492314489197?text=Hola%20Aldo,%20vi%20tu%20portfolio%20aldoarbizu.com%20y%20deseo%20consultar%20por..."
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => soundEngine.playHover()}
              onClick={() => soundEngine.playClick()}
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/70 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-white group-hover:text-emerald-300 transition-colors">WhatsApp Direct</span>
                <span className="text-[9px] text-emerald-400/80 font-normal">&lt; 2h SLA · Aldo Arbizu</span>
              </div>
            </a>

            {/* Link to Production Projects (#proyectos) */}
            <a
              href="#proyectos"
              onClick={() => {
                soundEngine.playClick();
                setIsOpen(false);
              }}
              onMouseEnter={() => soundEngine.playHover()}
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                <Cpu className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-white group-hover:text-cyan-300 transition-colors">
                  {isEs ? 'Sistemas en Producción' : 'Production Systems'}
                </span>
                <span className="text-[9px] text-slate-400 font-normal">TitanFlow · AgroMarket · Sentinel</span>
              </div>
            </a>

            {/* Link to Contact Form (#contacto) */}
            <a
              href="#contacto"
              onClick={() => {
                soundEngine.playClick();
                setIsOpen(false);
              }}
              onMouseEnter={() => soundEngine.playHover()}
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-white group-hover:text-amber-300 transition-colors">
                  {isEs ? 'Cotizar Arquitectura' : 'Quote Architecture'}
                </span>
                <span className="text-[9px] text-slate-400 font-normal">{isEs ? 'Formulario & Cal.com' : 'Direct Proposal'}</span>
              </div>
            </a>

            {/* Scroll to Top */}
            <button
              onClick={() => {
                scrollToTop();
                setIsOpen(false);
              }}
              onMouseEnter={() => soundEngine.playHover()}
              className="flex items-center gap-2 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-[11px] transition-colors cursor-pointer"
            >
              <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 shrink-0">
                <ArrowUp className="w-3.5 h-3.5" />
              </div>
              <span>{isEs ? 'Volver al Inicio' : 'Back to Top'}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Trigger Button */}
      <motion.button
        onClick={() => {
          soundEngine.playClick();
          setIsOpen(!isOpen);
        }}
        onMouseEnter={() => soundEngine.playHover()}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-14 h-14 rounded-full bg-[#070b14] border border-emerald-500/40 text-white shadow-[0_0_25px_rgba(52,211,153,0.35)] flex items-center justify-center cursor-pointer transition-colors hover:border-emerald-400"
        aria-label="Abrir panel táctico flotante"
      >
        {/* SVG Circular Reading Progress Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 52 52">
          <circle
            cx="26"
            cy="26"
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="2.5"
          />
          <circle
            cx="26"
            cy="26"
            r={radius}
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-150 ease-out"
          />
        </svg>

        <div className="relative z-10 flex items-center justify-center">
          {isOpen ? (
            <X className="w-5 h-5 text-white" />
          ) : (
            <div className="relative">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          )}
        </div>
      </motion.button>
    </aside>
  );
}
