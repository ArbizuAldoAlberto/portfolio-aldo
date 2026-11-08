"use client";

import React, { useRef, useEffect, useState } from "react";
import { Tractor, Thermometer, MapPin, Layers } from "lucide-react";
import { useLocale } from "next-intl";
import { soundEngine } from "../system/SoundEngine";
import { useTacticalAudio } from "../audio/useTacticalAudio";

export function AgroMarketWidget() {
  const locale = useLocale();
  const isEs = locale !== "en";
  const { playHoverTick, playEngagePulse } = useTacticalAudio();
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

    // Dibujar mapa de calor FLIR base (simulación de silobolsa/lote en Bronce/Ámbar)
    const drawHeatmap = (cursorX = 140, cursorY = 50) => {
      ctx.clearRect(0, 0, width, height);

      // Fondo oscuro Obsidiana
      ctx.fillStyle = "#070B12";
      ctx.fillRect(0, 0, width, height);

      // Gradiente térmico FLIR (Warm Bronze / Solar Gold)
      const grad = ctx.createRadialGradient(cursorX, cursorY, 5, cursorX, cursorY, 65);
      grad.addColorStop(0, "rgba(224, 159, 90, 0.88)"); // Punto caliente
      grad.addColorStop(0.35, "rgba(212, 175, 55, 0.65)");
      grad.addColorStop(0.7, "rgba(148, 163, 184, 0.35)");
      grad.addColorStop(1, "rgba(7, 11, 18, 0.05)");

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Líneas de cuadrícula de escaneo
      ctx.strokeStyle = "rgba(212, 175, 55, 0.16)";
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
      ctx.strokeStyle = "#F8FAFC";
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
    playEngagePulse();
    const nextId = String(Math.floor(Math.random() * 8000) + 1000);
    const nextWeight = Math.floor(Math.random() * 80) + 380;
    setActiveCaravana(nextId);
    setWeightKg(nextWeight);
  };

  return (
    <div
      data-cursor="crosshair"
      className="rounded-2xl bg-[#070B12] border border-white/[0.08] hover:border-[#D4AF37]/40 transition-colors p-5 font-mono text-xs text-[#F8FAFC] shadow-2xl relative overflow-hidden"
    >
      {/* Header estilo dispositivo de campo */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Tractor className="w-4 h-4 text-[#D4AF37]" strokeWidth={1.5} />
          <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider">
            AGROMARKET // MANGA_TABLET
          </span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#D4AF37] font-bold">
          {isEs ? "OFFLINE-FIRST ACTIVO" : "OFFLINE-FIRST ACTIVE"}
        </span>
      </div>

      {/* Registro de Manga Táctil */}
      <div className="mb-4 p-3 rounded-xl bg-black/60 border border-white/[0.08] flex items-center justify-between">
        <div>
          <span className="text-[10px] text-[#94A3B8] block">{isEs ? "CARAVANA GANADERA" : "CATTLE EAR-TAG"}</span>
          <span className="text-[#F8FAFC] font-bold text-base">#{activeCaravana}</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-[#94A3B8] block">{isEs ? "BALANZA EN MANGA" : "CHUTE SCALE"}</span>
          <span className="text-[#D4AF37] font-bold text-base">{weightKg} kg</span>
        </div>
        <button
          type="button"
          onClick={handleNextCaravana}
          onMouseEnter={() => {
            soundEngine.playHover();
            playHoverTick();
          }}
          className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-[#070B12] font-bold text-[10px] hover:bg-[#E2E8F0] transition-all active:scale-95 cursor-pointer"
        >
          {isEs ? "SIGUIENTE +" : "NEXT +"}
        </button>
      </div>

      {/* Sensor Térmico FLIR en Canvas Interactivo */}
      <div className="mb-4 p-3 rounded-xl bg-black/80 border border-white/[0.08]">
        <div className="flex justify-between items-center text-[10px] text-[#94A3B8] mb-2">
          <span className="flex items-center gap-1">
            <Thermometer className="w-3.5 h-3.5 text-[#D4AF37]" strokeWidth={1.5} /> {isEs ? "ESCÁNER TÉRMICO FLIR (SILOBOLSA)" : "FLIR THERMAL SCANNER (GRAIN BAG)"}
          </span>
          <span
            className={`font-bold ${
              probeTemp > 35 ? "text-[#E09F5A] animate-pulse" : "text-[#D4AF37]"
            }`}
          >
            {isEs ? `SONDA: ${probeTemp}°C` : `PROBE: ${probeTemp}°C`}
          </span>
        </div>
        <div className="rounded-lg overflow-hidden border border-[#D4AF37]/30">
          <canvas ref={canvasRef} className="w-full h-24 block cursor-crosshair touch-none" />
        </div>
        <span className="text-[9px] text-[#94A3B8] mt-1.5 block text-center">
          {isEs ? "Desliza el cursor / dedo sobre el mapa para censar temperatura" : "Hover / drag across the thermal map to sample probe temp"}
        </span>
      </div>

      {/* AgroPool Freight Matrix */}
      <div className="p-2.5 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/25 text-[10px] flex items-center justify-between text-[#94A3B8]">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" strokeWidth={1.5} />
          <span className="text-[#F8FAFC]">
            {isEs ? "AGROPOOL: 3 PRODUCTORES CONSOLIDADOS" : "AGROPOOL: 3 CONSOLIDATED GROWERS"}
          </span>
        </div>
        <span className="text-[#D4AF37] font-bold">{isEs ? "-22% FLETE" : "-22% FREIGHT"}</span>
      </div>
    </div>
  );
}
