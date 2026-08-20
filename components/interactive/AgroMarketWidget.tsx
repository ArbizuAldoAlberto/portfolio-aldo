"use client";

import React, { useRef, useEffect, useState } from "react";
import { Tractor, Thermometer, MapPin, Layers } from "lucide-react";
import { soundEngine } from "../system/SoundEngine";

export function AgroMarketWidget() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [probeTemp, setProbeTemp] = useState<number>(24.8);
  const [activeCaravana, setActiveCaravana] = useState<string>("8492");
  const [weightKg, setWeightKg] = useState<number>(418);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = 280);
    const height = (canvas.height = 100);

    // Dibujar mapa de calor FLIR base (simulación de silobolsa/lote)
    const drawHeatmap = (cursorX = 140, cursorY = 50) => {
      ctx.clearRect(0, 0, width, height);

      // Fondo oscuro
      ctx.fillStyle = "#0A0D0B";
      ctx.fillRect(0, 0, width, height);

      // Gradiente térmico FLIR
      const grad = ctx.createRadialGradient(cursorX, cursorY, 5, cursorX, cursorY, 65);
      grad.addColorStop(0, "rgba(239, 68, 68, 0.85)"); // Punto caliente (42°C)
      grad.addColorStop(0.35, "rgba(245, 158, 11, 0.65)");
      grad.addColorStop(0.7, "rgba(16, 185, 129, 0.45)");
      grad.addColorStop(1, "rgba(6, 78, 59, 0.05)");

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Líneas de cuadrícula de escaneo
      ctx.strokeStyle = "rgba(16, 185, 129, 0.15)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 25) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Cursor térmico
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cursorX, cursorY, 8, 0, Math.PI * 2);
      ctx.stroke();
    };

    drawHeatmap();

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

      const x = Math.max(10, Math.min(width - 10, (clientX - rect.left) * (width / rect.width)));
      const y = Math.max(10, Math.min(height - 10, (clientY - rect.top) * (height / rect.height)));

      drawHeatmap(x, y);

      // Calcular temperatura simulada según cercanía al centro
      const distFromHotspot = Math.hypot(x - 140, y - 50);
      const temp = Math.max(18.2, 41.5 - distFromHotspot * 0.22);
      setProbeTemp(Math.round(temp * 10) / 10);
    };

    canvas.addEventListener("mousemove", handlePointerMove);
    canvas.addEventListener("touchmove", handlePointerMove, { passive: true });

    return () => {
      canvas.removeEventListener("mousemove", handlePointerMove);
      canvas.removeEventListener("touchmove", handlePointerMove);
    };
  }, []);

  const handleNextCaravana = () => {
    soundEngine.playClick();
    const nextId = String(Math.floor(Math.random() * 8000) + 1000);
    const nextWeight = Math.floor(Math.random() * 80) + 380;
    setActiveCaravana(nextId);
    setWeightKg(nextWeight);
  };

  return (
    <div
      data-cursor="crosshair"
      className="rounded-2xl bg-[#0D120F] border border-emerald-500/40 p-5 font-mono text-xs text-slate-200 shadow-2xl relative overflow-hidden"
    >
      {/* Header estilo dispositivo de campo */}
      <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Tractor className="w-4 h-4 text-emerald-400" />
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
            AGROMARKET // MANGA_TABLET
          </span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900/70 border border-emerald-500/30 text-emerald-300 font-bold">
          OFFLINE-FIRST ACTIVO
        </span>
      </div>

      {/* Registro de Manga Táctil */}
      <div className="mb-4 p-3 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-orbital-muted block">CARAVANA GANADERA</span>
          <span className="text-white font-bold text-base">#{activeCaravana}</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-orbital-muted block">BALANZA EN MANGA</span>
          <span className="text-emerald-400 font-bold text-base">{weightKg} kg</span>
        </div>
        <button
          onClick={handleNextCaravana}
          onMouseEnter={() => soundEngine.playHover()}
          className="px-3 py-1.5 rounded-lg bg-emerald-500 text-black font-bold text-[10px] hover:bg-emerald-400 transition-all active:scale-95"
        >
          SIGUIENTE +
        </button>
      </div>

      {/* Sensor Térmico FLIR en Canvas Interactivo */}
      <div className="mb-4 p-3 rounded-xl bg-black/80 border border-white/10">
        <div className="flex justify-between items-center text-[10px] text-orbital-muted mb-2">
          <span className="flex items-center gap-1">
            <Thermometer className="w-3.5 h-3.5 text-amber-400" /> ESCÁNER TÉRMICO FLIR (SILOBOLSA)
          </span>
          <span
            className={`font-bold ${
              probeTemp > 35 ? "text-red-400 animate-pulse" : "text-emerald-400"
            }`}
          >
            SONDA: {probeTemp}°C
          </span>
        </div>
        <div className="rounded-lg overflow-hidden border border-emerald-500/30">
          <canvas ref={canvasRef} className="w-full h-24 block cursor-crosshair touch-none" />
        </div>
        <span className="text-[9px] text-orbital-muted mt-1.5 block text-center">
          Desliza el cursor / dedo sobre el mapa para censar temperatura
        </span>
      </div>

      {/* AgroPool Freight Matrix */}
      <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-[10px] flex items-center justify-between text-slate-300">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span>AGROPOOL: 3 PRODUCTORES CONSOLIDADOS</span>
        </div>
        <span className="text-emerald-400 font-bold">-22% FLETE</span>
      </div>
    </div>
  );
}
