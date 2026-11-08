"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, ShieldCheck, Zap, Terminal } from "lucide-react";
import { useLocale } from "next-intl";
import { soundEngine } from "../system/SoundEngine";
import { useTacticalAudio } from "../audio/useTacticalAudio";

export function TitanFlowWidget() {
  const locale = useLocale();
  const isEs = locale !== "en";
  const { playHoverTick, playEngagePulse } = useTacticalAudio();
  const [kellyFraction, setKellyFraction] = useState<number>(0.22);
  const [pnlValue, setPnlValue] = useState<number>(14820.45);
  const [recentOrder] = useState({
    symbol: "BTCUSDT",
    side: "BUY",
    qty: "0.084",
    price: "96,420.50",
    time: "Ahora",
  });

  // Simulación sutil de micro-fluctuación de PnL en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.45) * 4.2;
      setPnlValue((prev) => Math.round((prev + delta) * 100) / 100);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  const handleKellyChange = (f: number) => {
    soundEngine.playClick();
    playEngagePulse();
    setKellyFraction(f);
  };

  return (
    <div
      data-cursor="crosshair"
      className="rounded-2xl bg-[#070B12] border border-white/[0.08] hover:border-[#D4AF37]/40 transition-colors p-5 font-mono text-xs text-[#F8FAFC] shadow-2xl relative overflow-hidden"
    >
      {/* Header estilo terminal de alta frecuencia */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#E09F5A]/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#E2E8F0]/80" />
          <span className="text-[10px] text-[#94A3B8] font-bold ml-1.5 uppercase">
            TITAN_CORE // QUANT_MONITOR
          </span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/40 font-bold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
          {isEs ? "CAPITAL REAL VIVO" : "LIVE REAL CAPITAL"}
        </span>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-xl bg-black/60 border border-white/[0.08]">
          <span className="text-[10px] text-[#94A3B8] block mb-1">
            {isEs ? "PNL ACUMULADO (USDT)" : "CUMULATIVE PNL (USDT)"}
          </span>
          <div className="text-[#D4AF37] font-bold text-base tabular-nums flex items-baseline gap-1">
            <span>+${pnlValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            <span className="text-[10px] text-[#E09F5A] font-semibold">▲</span>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-black/60 border border-white/[0.08]">
          <span className="text-[10px] text-[#94A3B8] block mb-1">CIRCUIT BREAKER</span>
          <div className="text-[#F8FAFC] font-bold text-sm flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" strokeWidth={1.5} />
            <span>0% DRAWDOWN BREACH</span>
          </div>
        </div>
      </div>

      {/* Gráfico Sparkline PnL SVG Animado */}
      <div className="mb-4 p-3 rounded-xl bg-black/80 border border-white/[0.08]">
        <div className="flex justify-between text-[10px] text-[#94A3B8] mb-1">
          <span>{isEs ? "CURVA DE EQUIDAD HISTÓRICA" : "HISTORICAL EQUITY CURVE"}</span>
          <span className="text-[#D4AF37] font-bold">SHARPE RATIO: 2.14</span>
        </div>
        <svg viewBox="0 0 300 65" className="w-full h-14 overflow-visible">
          <defs>
            <linearGradient id="pnl-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path
            d="M 0 52 Q 40 46 80 40 T 160 30 T 220 18 T 300 8 L 300 65 L 0 65 Z"
            fill="url(#pnl-grad)"
          />
          <path
            d="M 0 52 Q 40 46 80 40 T 160 30 T 220 18 T 300 8"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="1.5"
          />
          <circle cx="300" cy="8" r="3.5" fill="#D4AF37" className="animate-pulse" />
        </svg>
      </div>

      {/* Selector Interactivo de Kelly */}
      <div className="mb-4">
        <div className="flex justify-between text-[10px] text-[#94A3B8] mb-1.5">
          <span className="font-bold text-[#F8FAFC]">
            {isEs ? "CONTROL KELLY FRACCIONAL (f*):" : "FRACTIONAL KELLY CONTROL (f*):"}
          </span>
          <span className="text-[#D4AF37] font-bold">
            {kellyFraction} {isEs ? "(Óptimo)" : "(Optimal)"}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {[0.1, 0.22, 0.35, 0.5].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => handleKellyChange(f)}
              onMouseEnter={() => {
                soundEngine.playHover();
                playHoverTick();
              }}
              className={`py-1 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                kellyFraction === f
                  ? "bg-[#D4AF37] text-[#070B12] border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.3)]"
                  : "bg-white/5 border-white/[0.08] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#D4AF37]/40"
              }`}
            >
              f* = {f}
            </button>
          ))}
        </div>
      </div>

      {/* Feed de Ejecución WebSocket */}
      <div className="p-2.5 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/25 text-[10px] flex items-center justify-between text-[#94A3B8]">
        <div className="flex items-center gap-1.5">
          <Zap className="w-3 h-3 text-[#D4AF37]" strokeWidth={1.5} />
          <span>{isEs ? "ÚLTIMA ORDEN:" : "LAST ORDER:"}</span>
          <span className="text-[#F8FAFC] font-bold">{recentOrder.symbol} {recentOrder.side}</span>
        </div>
        <span className="text-[#D4AF37] font-bold">14ms WS OK</span>
      </div>
    </div>
  );
}
