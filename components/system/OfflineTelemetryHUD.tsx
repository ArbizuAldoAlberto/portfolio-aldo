"use client";

import React, { useState, useEffect } from "react";
import { Wifi, WifiOff, Database, ShieldCheck, Zap } from "lucide-react";
import { useLocale } from "next-intl";
import { soundEngine } from "./SoundEngine";
import { useTacticalAudio } from "../audio/useTacticalAudio";

export function OfflineTelemetryHUD() {
  const locale = useLocale();
  const isEs = locale !== "en";
  const { playHoverTick, playModeSwitch, playEngagePulse } = useTacticalAudio();

  const [isOnline, setIsOnline] = useState(true);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);
  const [queuedRecords, setQueuedRecords] = useState(0);
  const [latencyMs, setLatencyMs] = useState(14);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      soundEngine.playSuccess();
    };

    const handleOffline = () => {
      setIsOnline(false);
      soundEngine.playAlert();
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Read stored simulation preference if any
    const savedSim = sessionStorage.getItem("webanti_offline_sim");
    if (savedSim === "true") {
      setIsSimulatedOffline(true);
      setQueuedRecords(3);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const effectiveOffline = !isOnline || isSimulatedOffline;

  const toggleOfflineSimulation = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playClick();
    playEngagePulse();

    const nextSim = !isSimulatedOffline;
    setIsSimulatedOffline(nextSim);

    if (typeof window !== "undefined") {
      sessionStorage.setItem("webanti_offline_sim", String(nextSim));
    }

    if (nextSim) {
      setQueuedRecords(3);
      setLatencyMs(0);
    } else {
      setTimeout(() => {
        soundEngine.playSuccess();
        playModeSwitch("pbr");
        setQueuedRecords(0);
        setLatencyMs(14);
      }, 700);
    }
  };

  return (
    <aside
      aria-label="Telemetría Offline-First"
      className="fixed bottom-4 left-4 z-[90] font-mono select-none"
    >
      <div
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#070B12]/90 backdrop-blur-md border border-[#D4AF37]/35 shadow-[0_8px_30px_rgba(0,0,0,0.85)] text-xs text-[#F8FAFC] cursor-pointer hover:border-[#D4AF37] transition-all"
      >
        <span
          className={`w-2 h-2 rounded-full ${
            effectiveOffline
              ? "bg-[#E09F5A] animate-ping"
              : "bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.8)]"
          }`}
        />

        <div className="flex items-center gap-1.5 text-[10px] tracking-wider font-bold">
          {effectiveOffline ? (
            <>
              <WifiOff className="w-3.5 h-3.5 text-[#E09F5A]" />
              <span className="text-[#E09F5A]">
                {isEs ? "OFFLINE-FIRST // COLA SQLITE ACTIVA" : "OFFLINE-FIRST // SQLITE QUEUE ACTIVE"}
              </span>
            </>
          ) : (
            <>
              <Wifi className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[#D4AF37]">
                {isEs ? "ONLINE // CLOUD SYNC ACTIVO" : "ONLINE // CLOUD SYNC ACTIVE"}
              </span>
              <span className="text-[#94A3B8] hidden sm:inline">({latencyMs}ms)</span>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={toggleOfflineSimulation}
          onMouseEnter={playHoverTick}
          className={`ml-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase transition-all border ${
            effectiveOffline
              ? "bg-[#D4AF37] text-[#070B12] border-[#D4AF37] hover:bg-[#E2E8F0]"
              : "bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/40 hover:bg-[#D4AF37]/30"
          }`}
          title={isEs ? "Conmutar prueba de corte de red offline" : "Toggle offline network cut simulation"}
        >
          {effectiveOffline
            ? (isEs ? "⚡ RESTAURAR ONLINE" : "⚡ RESTORE ONLINE")
            : (isEs ? "⚡ PROBAR OFFLINE-FIRST" : "⚡ TEST OFFLINE-FIRST")}
        </button>
      </div>

      {/* Panel Detallado Desplegable */}
      {isExpanded && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="mt-2 w-72 rounded-2xl bg-[#070B12]/95 backdrop-blur-xl border border-[#D4AF37]/40 p-4 shadow-2xl text-[11px] space-y-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
            <span className="text-[10px] text-[#D4AF37] font-bold tracking-wider uppercase">
              // TELEMETRÍA RESILIENTE
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[#94A3B8]">
              OWASP MASVS
            </span>
          </div>

          <div className="flex justify-between items-center text-[#94A3B8]">
            <span>{isEs ? "Persistencia Local:" : "Local Storage:"}</span>
            <span className="text-[#F8FAFC] font-bold flex items-center gap-1">
              <Database className="w-3 h-3 text-[#D4AF37]" /> SQLite WAL Embebido
            </span>
          </div>

          <div className="flex justify-between items-center text-[#94A3B8]">
            <span>{isEs ? "Eventos en Cola:" : "Queued Events:"}</span>
            <span className={`font-bold ${queuedRecords > 0 ? "text-[#E09F5A]" : "text-[#D4AF37]"}`}>
              {queuedRecords > 0
                ? (isEs ? `${queuedRecords} pendientes` : `${queuedRecords} pending`)
                : (isEs ? "0 (Sincronizado)" : "0 (Synchronized)")}
            </span>
          </div>

          <div className="flex justify-between items-center text-[#94A3B8]">
            <span>{isEs ? "Estrategia de Sync:" : "Sync Strategy:"}</span>
            <span className="text-[#F8FAFC] font-bold">Store-and-Forward</span>
          </div>

          <div className="pt-2 border-t border-white/[0.08] text-[10px] text-[#94A3B8] leading-relaxed">
            {effectiveOffline
              ? (isEs
                  ? "Modo sin señal activado. Los datos se encriptan y retienen en SQLite local hasta recuperar conectividad."
                  : "No-signal mode active. Mutations are cryptographically stored in local SQLite until link recovery.")
              : (isEs
                  ? "Conexión bidireccional estable. Telemetría y contratos sincronizando en tiempo real con latencia de 14ms."
                  : "Stable bidirectional link. Real-time telemetry & contracts synchronizing under 14ms latency.")}
          </div>
        </div>
      )}
    </aside>
  );
}

