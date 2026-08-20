"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, ShieldCheck, Zap, Terminal } from "lucide-react";
import { soundEngine } from "../system/SoundEngine";

export function TitanFlowWidget() {
  const [kellyFraction, setKellyFraction] = useState<number>(0.22);
  const [pnlValue, setPnlValue] = useState<number>(14820.45);
  const [recentOrder, setRecentOrder] = useState({
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
    setKellyFraction(f);
  };

  return (
    <div
      data-cursor="crosshair"
      className="rounded-2xl bg-[#090A0F] border border-emerald-500/40 p-5 font-mono text-xs text-slate-200 shadow-2xl relative overflow-hidden"
    >
      {/* Header estilo terminal de alta frecuencia */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          <span className="text-[10px] text-orbital-muted font-bold ml-1.5 uppercase">
            TITAN_CORE // QUANT_MONITOR
          </span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 font-bold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          CAPITAL REAL VIVO
        </span>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-xl bg-black/60 border border-white/5">
          <span className="text-[10px] text-orbital-muted block mb-1">PNL ACUMULADO (USDT)</span>
          <div className="text-emerald-400 font-bold text-base tabular-nums flex items-baseline gap-1">
            <span>+${pnlValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            <span className="text-[10px] text-emerald-500 font-semibold">▲</span>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-black/60 border border-white/5">
          <span className="text-[10px] text-orbital-muted block mb-1">CIRCUIT BREAKER</span>
          <div className="text-amber-400 font-bold text-sm flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>0% DRAWDOWN BREACH</span>
          </div>
        </div>
      </div>

      {/* Gráfico Sparkline PnL SVG Animado */}
      <div className="mb-4 p-3 rounded-xl bg-black/80 border border-white/5">
        <div className="flex justify-between text-[10px] text-orbital-muted mb-1">
          <span>CURVA DE EQUIDAD HISTÓRICA</span>
          <span className="text-emerald-400 font-bold">SHARPE RATIO: 2.14</span>
        </div>
        <svg viewBox="0 0 300 65" className="w-full h-14 overflow-visible">
          <defs>
            <linearGradient id="pnl-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path
            d="M 0 52 Q 40 46 80 40 T 160 30 T 220 18 T 300 8 L 300 65 L 0 65 Z"
            fill="url(#pnl-grad)"
          />
          <path
            d="M 0 52 Q 40 46 80 40 T 160 30 T 220 18 T 300 8"
            fill="none"
            stroke="#10B981"
            strokeWidth="2"
          />
          <circle cx="300" cy="8" r="3.5" fill="#10B981" className="animate-pulse" />
        </svg>
      </div>

      {/* Selector Interactivo de Kelly */}
      <div className="mb-4">
        <div className="flex justify-between text-[10px] text-slate-300 mb-1.5">
          <span className="font-bold">CONTROL KELLY FRACCIONAL (f*):</span>
          <span className="text-emerald-400 font-bold">{kellyFraction} (Óptimo)</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {[0.1, 0.22, 0.35, 0.5].map((f) => (
            <button
              key={f}
              onClick={() => handleKellyChange(f)}
              onMouseEnter={() => soundEngine.playHover()}
              className={`py-1 rounded text-[10px] font-bold border transition-all ${
                kellyFraction === f
                  ? "bg-emerald-500 text-black border-emerald-400 shadow-emerald-card"
                  : "bg-white/5 border-white/10 text-orbital-muted hover:text-white hover:bg-white/10"
              }`}
            >
              f* = {f}
            </button>
          ))}
        </div>
      </div>

      {/* Feed de Ejecución WebSocket */}
      <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-[10px] flex items-center justify-between text-slate-300">
        <div className="flex items-center gap-1.5">
          <Zap className="w-3 h-3 text-emerald-400" />
          <span>ÚLTIMA ORDEN:</span>
          <span className="text-white font-bold">{recentOrder.symbol} {recentOrder.side}</span>
        </div>
        <span className="text-emerald-400 font-bold">14ms WS OK</span>
      </div>
    </div>
  );
}
