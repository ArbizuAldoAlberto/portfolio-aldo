"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Shield, Cpu, Activity } from "lucide-react";
import { soundEngine } from "./SoundEngine";

const BOOT_LOGS = [
  { text: "INIT NEXUS KERNEL (x86_64-resilient)", icon: Terminal, delay: 0.1 },
  { text: "MOUNTING SQLITE WAL OFFLINE SUBSYSTEM", icon: Cpu, delay: 0.4 },
  { text: "CALIBRATING TITANFLOW RISK ENGINE (KELLY f*)", icon: Activity, delay: 0.8 },
  { text: "CONNECTING LORAWAN AGTECH TELEMETRY MESH", icon: Shield, delay: 1.2 },
  { text: "SYSTEM 100% OPERATIONAL · READY", icon: Terminal, delay: 1.5 },
];

export function BootSequence() {
  const [showBoot, setShowBoot] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [activeLogIndex, setActiveLogIndex] = useState<number>(0);

  useEffect(() => {
    // Solo mostrar en la primera visita de la sesión para no cansar al usuario/jurado
    const hasBooted = sessionStorage.getItem("nexus_boot_sequence_done");
    if (!hasBooted) {
      setShowBoot(true);
      document.body.style.overflow = "hidden";

      // Contador de progreso 0% -> 100% en ~1.8s
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => handleFinish(), 300);
            return 100;
          }
          const next = prev + Math.floor(Math.random() * 8) + 3;
          return next > 100 ? 100 : next;
        });
      }, 45);

      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    if (progress > 20 && activeLogIndex < 1) setActiveLogIndex(1);
    if (progress > 45 && activeLogIndex < 2) setActiveLogIndex(2);
    if (progress > 75 && activeLogIndex < 3) setActiveLogIndex(3);
    if (progress >= 95 && activeLogIndex < 4) setActiveLogIndex(4);
  }, [progress, activeLogIndex]);

  const handleFinish = () => {
    soundEngine.playSuccess();
    sessionStorage.setItem("nexus_boot_sequence_done", "true");
    setShowBoot(false);
    document.body.style.overflow = "";
  };

  const handleSkip = () => {
    handleFinish();
  };

  if (!showBoot) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
        exit={{
          clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
          transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
        }}
        className="fixed inset-0 z-[9999] bg-[#050508] text-slate-200 flex flex-col justify-between p-6 sm:p-12 font-mono select-none"
      >
        {/* Header de la secuencia */}
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-orbital-emerald animate-ping" />
            <span className="text-xs font-bold text-orbital-emerald tracking-widest uppercase">
              ARBIZU LABS // BOOT_SEQUENCE v4.2
            </span>
          </div>
          <button
            onClick={handleSkip}
            className="text-[11px] text-orbital-muted hover:text-white border border-white/10 px-3 py-1 rounded-full hover:border-orbital-emerald transition-colors"
          >
            [ ESC / SALTAR ]
          </button>
        </div>

        {/* Consola Central de Telemetría */}
        <div className="max-w-2xl mx-auto w-full my-auto space-y-4">
          <div className="space-y-2.5">
            {BOOT_LOGS.slice(0, activeLogIndex + 1).map((log, i) => {
              const Icon = log.icon;
              const isLatest = i === activeLogIndex;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-3 text-xs sm:text-sm"
                >
                  <span className="text-orbital-emerald font-bold">&gt;</span>
                  <Icon className="w-3.5 h-3.5 text-orbital-emerald shrink-0" />
                  <span className={isLatest ? "text-white font-semibold" : "text-orbital-muted"}>
                    {log.text}
                  </span>
                  {isLatest && <span className="w-2 h-4 bg-orbital-emerald animate-pulse inline-block ml-1" />}
                </motion.div>
              );
            })}
          </div>

          {/* Barra de Carga & Porcentaje Numérico */}
          <div className="pt-8 space-y-2">
            <div className="flex justify-between text-xs font-bold text-white tabular-nums">
              <span className="text-orbital-muted">CARGANDO RECURSOS CRÍTICOS...</span>
              <span className="text-orbital-emerald">{progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-orbital-emerald via-teal-300 to-amber-400"
                style={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
          </div>
        </div>

        {/* Footer de la secuencia */}
        <div className="flex justify-between items-center text-[10px] text-orbital-muted border-t border-white/10 pt-4">
          <span>LATAM · SAN CARLOS DE BOLÍVAR (UTC-3)</span>
          <span>ARQUITECTURA DE SOFTWARE RESILIENTE</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
