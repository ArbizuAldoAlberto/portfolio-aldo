"use client";

import React from "react";
import { motion } from "framer-motion";
import { useMotionPreferences } from "../system/MotionPreferences";

interface DiagramNode {
  label: string;
  sub: string;
  tag?: string;
  color: "emerald" | "amber" | "teal";
}

interface ArchitectureDiagramProps {
  systemId: "titanflow" | "agromarket" | "sentinel";
}

const DIAGRAM_DATA: Record<
  "titanflow" | "agromarket" | "sentinel",
  { title: string; nodes: DiagramNode[] }
> = {
  titanflow: {
    title: "PIPELINE CUANTITATIVO // EJECUCIÓN DESATENDIDA",
    nodes: [
      { label: "Binance WS Stream", sub: "Baja latencia 14ms", color: "emerald" },
      { label: "Kelly & Risk Oracle", sub: "f* fraccional óptimo", color: "teal" },
      { label: "Circuit Breakers", sub: "0% margen breach", tag: "GATE", color: "amber" },
      { label: "Ejecución Local", sub: "Firma sin custodia", color: "emerald" },
    ],
  },
  agromarket: {
    title: "FLUJO DE CAMPO REAL // OFFLINE & LOGÍSTICA AGROPOOL",
    nodes: [
      { label: "Manga / Sensores", sub: "Caravanas RFID & Balanza", color: "emerald" },
      { label: "Persistencia Local", sub: "Registro sin red celular", color: "teal" },
      { label: "AgroPool Engine", sub: "Consolidación de fletes", tag: "AGTECH", color: "emerald" },
      { label: "Sync Asíncrono", sub: "Despacho optimizado", color: "amber" },
    ],
  },
  sentinel: {
    title: "ARQUITECTURA DE GUARDIA // STORE-AND-FORWARD INMUTABLE",
    nodes: [
      { label: "Escáner QR Nocturno", sub: "Compensación penumbras", color: "amber" },
      { label: "SQLite WAL Local", sub: "Encolado sin pérdida", tag: "CORE", color: "amber" },
      { label: "Firma Criptográfica", sub: "Anclaje GPS inmutable", color: "teal" },
      { label: "Sincronización Mesh", sub: "Disparo al detectar red", color: "emerald" },
    ],
  },
};

export function ArchitectureDiagram({ systemId }: ArchitectureDiagramProps) {
  const { reducedMotion } = useMotionPreferences();
  const data = DIAGRAM_DATA[systemId];

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs overflow-hidden">
      {/* Header del diagrama */}
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2.5">
        <span className="text-[10px] text-orbital-muted tracking-wider uppercase">
          {data.title}
        </span>
        <span className="text-[10px] text-orbital-emerald font-bold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-orbital-emerald animate-pulse" />
          ARQUITECTURA EN VIVO
        </span>
      </div>

      {/* Nodos de Arquitectura con Conexión SVG Auto-Dibujada */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative">
        {data.nodes.map((node, i) => {
          const isLast = i === data.nodes.length - 1;
          const colorClasses =
            node.color === "emerald"
              ? "border-emerald-500/40 text-emerald-400 bg-emerald-950/20"
              : node.color === "amber"
              ? "border-amber-500/40 text-amber-400 bg-amber-950/20"
              : "border-teal-500/40 text-teal-400 bg-teal-950/20";

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: reducedMotion ? 0.01 : 0.4,
                delay: reducedMotion ? 0 : i * 0.12,
              }}
              className={`p-3 rounded-xl border relative flex flex-col justify-between ${colorClasses}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] opacity-60 font-bold">0{i + 1}</span>
                {node.tag && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-white/10 uppercase">
                    {node.tag}
                  </span>
                )}
              </div>
              <div>
                <div className="text-white font-bold text-xs leading-tight mb-1">{node.label}</div>
                <div className="text-[10px] text-slate-400 leading-tight">{node.sub}</div>
              </div>

              {/* Flecha indicadora en desktop */}
              {!isLast && (
                <div className="hidden sm:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 text-white/30 text-xs">
                  →
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
