"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { ArrowUpRight, ShieldCheck, Terminal, Layers, Sparkles, Activity } from "lucide-react";
import { useLocale } from "next-intl";
import { soundEngine } from "./system/SoundEngine";

const Hero3DScene = dynamic(() => import("./Hero3DScene").then((mod) => mod.Hero3DScene), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

export default function HeroSection() {
  const locale = useLocale();
  const isEs = locale === "es";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden bg-orbital-bg px-4 sm:px-6 lg:px-8 border-b border-white/10">
      {/* Fondo de Grilla Táctica */}
      <div
        className="absolute inset-0 z-0 opacity-25"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(16, 185, 129, 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(16, 185, 129, 0.12) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          animation: "grid-move 20s linear infinite",
        }}
      />

      {/* Escena 3D del Cubo de Metatrón Interactiva (Pointer Events Activo) */}
      <div className="absolute inset-0 z-0 pointer-events-auto opacity-90">
        <Hero3DScene />
      </div>

      {/* Viñeta de Profundidad Cinematográfica */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_15%,#0A0A0C_85%)] pointer-events-none z-[1]" />

      <div className="max-w-5xl mx-auto text-center relative z-10 py-16 sm:py-24 pointer-events-none">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col items-center">
          {/* Badge Superior */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md mb-8 pointer-events-auto shadow-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="font-mono text-xs font-medium tracking-wide text-emerald-400">
              {isEs ? "DISPONIBLE PARA CONTRATOS B2B & OFFLINE-FIRST" : "AVAILABLE FOR B2B & OFFLINE-FIRST CONTRACTS"}
            </span>
          </motion.div>

          {/* Titular Principal */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl md:text-7xl font-sans font-bold tracking-tight text-white max-w-4xl leading-[1.1] mb-6"
          >
            {isEs ? (
              <>
                Construyo software donde el Wi-Fi no llega y el fallo{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400">
                  no es una opción.
                </span>
              </>
            ) : (
              <>
                I build software where Wi-Fi doesn&apos;t reach and failure{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400">
                  is not an option.
                </span>
              </>
            )}
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-xl text-slate-300 font-sans max-w-2xl leading-relaxed mb-10"
          >
            {isEs ? (
              <>
                <strong className="text-white font-semibold">Ingeniero de Producto Híbrido.</strong> La intersección real
                entre agronomía de campo, desarrollo Mobile Offline-First, ciberseguridad defensiva y tracción comercial
                con métricas de acero.
              </>
            ) : (
              <>
                <strong className="text-white font-semibold">Hybrid Product Engineer.</strong> The real intersection
                between field agronomy, Offline-First mobile development, defensive cybersecurity, and hard commercial
                metrics.
              </>
            )}
          </motion.p>

          {/* Botones de Acción Primaria */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-8 pointer-events-auto"
          >
            <a
              href="#proyectos"
              onMouseEnter={() => soundEngine.playHover()}
              onClick={() => soundEngine.playClick()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-emerald-400 text-slate-950 font-mono text-sm font-bold tracking-wide hover:bg-emerald-300 shadow-[0_0_25px_rgba(52,211,153,0.35)] transition-all duration-300 group"
            >
              <span>{isEs ? "Ver Sistemas en Producción" : "View Production Systems"}</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
            <a
              href="#contacto"
              onMouseEnter={() => soundEngine.playHover()}
              onClick={() => soundEngine.playClick()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/10 border border-white/15 text-white font-mono text-sm font-medium hover:border-emerald-400 hover:bg-white/15 transition-all duration-300"
            >
              <span>{isEs ? "Cotizar Arquitectura" : "Quote Architecture"}</span>
            </a>
          </motion.div>

          {/* HUD de Telemetría 3D interactivo */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-[10px] font-mono text-slate-400 mb-10 pointer-events-auto"
          >
            <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>
              {isEs
                ? "NÚCLEO METATRÓN 3D // HAZ CLIC EN EL FONDO PARA DISPARAR PULSO CUÁNTICO"
                : "METATRON 3D CORE // CLICK BACKGROUND TO TRIGGER QUANTUM BURST"}
            </span>
          </motion.div>

          {/* Métricas de Acero */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 w-full max-w-3xl border-t border-white/10 pt-8 pointer-events-auto"
          >
            {[
              {
                label: isEs ? "PnL & Criterio Kelly" : "PnL & Kelly Criterion",
                val: isEs ? "Capital Real" : "Real Capital",
                icon: Terminal,
              },
              {
                label: isEs ? "Auditoría en Balances" : "Balance Audit",
                val: isEs ? "0% Desvío" : "0% Discrepancy",
                icon: ShieldCheck,
              },
              {
                label: isEs ? "Cumplimiento en Ventas" : "Sales Target Met",
                val: isEs ? "+15% Metas" : "+15% Target",
                icon: Layers,
              },
              {
                label: isEs ? "Formación de Campo" : "Field Background",
                val: "EAS Del Valle",
                icon: Terminal,
              },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="text-left p-3 rounded-xl bg-black/60 border border-white/10">
                  <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                    <Icon className="w-3.5 h-3.5" />
                    <span className="font-mono text-xs font-semibold text-white">{stat.val}</span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-400 leading-tight">{stat.label}</div>
                </div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
