"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Wifi, WifiOff, Smartphone, QrCode, Lock } from "lucide-react";
import { soundEngine } from "../system/SoundEngine";
import { useTacticalAudio } from "../audio/useTacticalAudio";

export function SentinelWidget() {
  const { playHoverTick, playEngagePulse } = useTacticalAudio();
  const [isOfflineSim, setIsOfflineSim] = useState<boolean>(false);
  const [queuedEvents, setQueuedEvents] = useState<number>(0);
  const [radarDegree, setRadarDegree] = useState<number>(0);

  // Giro del haz del radar
  useEffect(() => {
    const interval = setInterval(() => {
      setRadarDegree((prev) => (prev + 4) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const handleToggleNetwork = () => {
    soundEngine.playClick();
    playEngagePulse();
    const nextState = !isOfflineSim;
    setIsOfflineSim(nextState);
    if (nextState) {
      setQueuedEvents((prev) => prev + 1);
    } else {
      setTimeout(() => {
        soundEngine.playSuccess();
        setQueuedEvents(0);
      }, 600);
    }
  };

  return (
    <div
      data-cursor="crosshair"
      className="rounded-2xl bg-[#070B12] border border-white/[0.08] hover:border-[#D4AF37]/40 transition-colors p-5 font-mono text-xs text-[#F8FAFC] shadow-2xl relative overflow-hidden"
    >
      {/* Header estilo dispositivo táctico nocturno */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-[#D4AF37]" strokeWidth={1.5} />
          <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider">
            SENTINEL // TACTICAL_NIGHT_OPS
          </span>
        </div>
        <button
          type="button"
          onClick={handleToggleNetwork}
          onMouseEnter={() => {
            soundEngine.playHover();
            playHoverTick();
          }}
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
            isOfflineSim
              ? "bg-[#E09F5A]/20 border-[#E09F5A]/60 text-[#E09F5A] animate-pulse"
              : "bg-[#D4AF37]/15 border-[#D4AF37]/40 text-[#D4AF37]"
          }`}
        >
          {isOfflineSim ? <WifiOff size={12} /> : <Wifi size={12} />}
          <span>{isOfflineSim ? "SIN SEÑAL (SIMULADA)" : "RED ONLINE"}</span>
        </button>
      </div>

      {/* Simulación de Radar Táctico */}
      <div className="mb-4 p-4 rounded-xl bg-black/80 border border-white/[0.08] flex items-center gap-4">
        {/* Radar Circular */}
        <div className="relative w-20 h-20 rounded-full border border-[#D4AF37]/40 bg-[#070B12] flex items-center justify-center shrink-0 overflow-hidden">
          {/* Anillos concéntricos */}
          <div className="absolute inset-2 rounded-full border border-[#D4AF37]/20" />
          <div className="absolute inset-5 rounded-full border border-[#D4AF37]/20" />
          <div className="absolute w-full h-px bg-[#D4AF37]/20" />
          <div className="absolute h-full w-px bg-[#D4AF37]/20" />

          {/* Haz giratorio del radar */}
          <div
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{
              transform: `rotate(${radarDegree}deg)`,
              background:
                "conic-gradient(from 0deg, transparent 270deg, rgba(212, 175, 55, 0.4) 360deg)",
            }}
          />

          {/* Checkpoint detectado */}
          <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[#F8FAFC] font-bold text-xs">
            <QrCode className="w-3.5 h-3.5 text-[#D4AF37]" strokeWidth={1.5} />
            <span>POSTE PERIMETRAL #04</span>
          </div>
          <span className="text-[10px] text-[#D4AF37] block font-bold">QR ESCANEADO EN PENUMBRAS</span>
          <span className="text-[10px] text-[#94A3B8] block">
            GPS: -36.2314, -61.1102 (Firma Criptográfica)
          </span>
        </div>
      </div>

      {/* Estado del Encolado SQLite WAL */}
      <div className="p-3 rounded-xl bg-black/60 border border-white/[0.08] mb-4">
        <div className="flex justify-between items-center text-[10px] mb-1.5">
          <span className="text-[#94A3B8] font-bold">PERSISTENCIA STORE-AND-FORWARD:</span>
          <span
            className={`font-bold ${
              queuedEvents > 0 ? "text-[#E09F5A]" : "text-[#D4AF37]"
            }`}
          >
            {queuedEvents > 0
              ? `${queuedEvents} EVENTO(S) EN COLA SQLITE`
              : "TODO SINCRONIZADO ✓"}
          </span>
        </div>
        <div className="text-[11px] text-[#94A3B8]">
          {isOfflineSim
            ? "Reporte guardado en base de datos local SQLite WAL. Cero pérdida de datos."
            : "Conexión estable. Los reportes se transmiten en tiempo real."}
        </div>
      </div>

      {/* Botón de Interacción Táctica */}
      <button
        type="button"
        onClick={handleToggleNetwork}
        onMouseEnter={() => {
          soundEngine.playHover();
          playHoverTick();
        }}
        className="w-full py-2.5 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] font-bold text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <Lock className="w-3.5 h-3.5" strokeWidth={1.5} />
        <span>{isOfflineSim ? "RESTAURAR RED & FORZAR SYNC" : "PROBAR CORTE DE RED OFFLINE-FIRST"}</span>
      </button>
    </div>
  );
}
