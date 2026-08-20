"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Wifi, WifiOff, Smartphone, QrCode, Lock } from "lucide-react";
import { soundEngine } from "../system/SoundEngine";

export function SentinelWidget() {
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
      className="rounded-2xl bg-[#0F0D14] border border-amber-500/40 p-5 font-mono text-xs text-slate-200 shadow-2xl relative overflow-hidden"
    >
      {/* Header estilo dispositivo táctico nocturno */}
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-amber-400" />
          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
            SENTINEL // TACTICAL_NIGHT_OPS
          </span>
        </div>
        <button
          onClick={handleToggleNetwork}
          onMouseEnter={() => soundEngine.playHover()}
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all flex items-center gap-1.5 ${
            isOfflineSim
              ? "bg-red-950/80 border-red-500/60 text-red-400 animate-pulse"
              : "bg-emerald-950/80 border-emerald-500/40 text-emerald-400"
          }`}
        >
          {isOfflineSim ? <WifiOff size={12} /> : <Wifi size={12} />}
          <span>{isOfflineSim ? "SIN SEÑAL (SIMULADA)" : "RED ONLINE"}</span>
        </button>
      </div>

      {/* Simulación de Radar Táctico */}
      <div className="mb-4 p-4 rounded-xl bg-black/80 border border-white/10 flex items-center gap-4">
        {/* Radar Circular */}
        <div className="relative w-20 h-20 rounded-full border border-amber-500/40 bg-[#0B0910] flex items-center justify-center shrink-0 overflow-hidden">
          {/* Anillos concéntricos */}
          <div className="absolute inset-2 rounded-full border border-amber-500/20" />
          <div className="absolute inset-5 rounded-full border border-amber-500/20" />
          <div className="absolute w-full h-px bg-amber-500/20" />
          <div className="absolute h-full w-px bg-amber-500/20" />

          {/* Haz giratorio del radar */}
          <div
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{
              transform: `rotate(${radarDegree}deg)`,
              background:
                "conic-gradient(from 0deg, transparent 270deg, rgba(245, 158, 11, 0.4) 360deg)",
            }}
          />

          {/* Checkpoint detectado */}
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-white font-bold text-xs">
            <QrCode className="w-3.5 h-3.5 text-amber-400" />
            <span>POSTE PERIMETRAL #04</span>
          </div>
          <span className="text-[10px] text-emerald-400 block font-bold">QR ESCANEADO EN PENUMBRAS</span>
          <span className="text-[10px] text-orbital-muted block">
            GPS: -36.2314, -61.1102 (Firma Criptográfica)
          </span>
        </div>
      </div>

      {/* Estado del Encolado SQLite WAL */}
      <div className="p-3 rounded-xl bg-black/60 border border-white/10 mb-4">
        <div className="flex justify-between items-center text-[10px] mb-1.5">
          <span className="text-orbital-muted font-bold">PERSISTENCIA STORE-AND-FORWARD:</span>
          <span
            className={`font-bold ${
              queuedEvents > 0 ? "text-amber-400" : "text-emerald-400"
            }`}
          >
            {queuedEvents > 0
              ? `${queuedEvents} EVENTO(S) EN COLA SQLITE`
              : "TODO SINCRONIZADO ✓"}
          </span>
        </div>
        <div className="text-[11px] text-slate-300">
          {isOfflineSim
            ? "Reporte guardado en base de datos local SQLite WAL. Cero pérdida de datos."
            : "Conexión estable. Los reportes se transmiten en tiempo real."}
        </div>
      </div>

      {/* Botón de Interacción Táctica */}
      <button
        onClick={handleToggleNetwork}
        onMouseEnter={() => soundEngine.playHover()}
        className="w-full py-2.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-2"
      >
        <Lock className="w-3.5 h-3.5" />
        <span>{isOfflineSim ? "RESTAURAR RED & FORZAR SYNC" : "PROBAR CORTE DE RED OFFLINE-FIRST"}</span>
      </button>
    </div>
  );
}
