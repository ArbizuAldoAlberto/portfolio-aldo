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
  systemId: "titanflow" | "agromarket" | "sentinel" | "aureus" | "nexus-sre";
}

const DIAGRAM_DATA: Record<
  "titanflow" | "agromarket" | "sentinel" | "aureus" | "nexus-sre",
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
  aureus: {
    title: "WEALTH OS // RUNWAY & ASSET ALLOCATION LEDGER",
    nodes: [
      { label: "Multi-Asset Engine", sub: "Cripto, FX & Real Estate", color: "amber" },
      { label: "Risk Curve Monte Carlo", sub: "Preservación estricta", color: "teal" },
      { label: "Liquid Runway Gauge", sub: "Proyección 36 meses", tag: "CORE", color: "emerald" },
      { label: "Zero-Trust Local Store", sub: "Sin intermediarios", color: "amber" },
    ],
  },
  "nexus-sre": {
    title: "SRE CLUSTER // ZERO-DOWNTIME L7 FAILOVER",
    nodes: [
      { label: "Anycast Edge Router", sub: "Inspección de cabecera", color: "teal" },
      { label: "Layer-7 Health Watchdog", sub: "Polling cada 2s", tag: "SRE", color: "amber" },
      { label: "Dynamic Proxy Reroute", sub: "Conmutación en 42ms", color: "emerald" },
      { label: "Self-Healing PM2 Cluster", sub: "Auto-reinicio y purge", color: "teal" },
    ],
  },
};

export function ArchitectureDiagram({ systemId }: ArchitectureDiagramProps) {
  const { reducedMotion } = useMotionPreferences();
  const data = DIAGRAM_DATA[systemId];

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#070B12] border border-white/[0.08] hover:border-[#D4AF37]/40 transition-colors font-mono text-xs overflow-hidden">
      {/* Header del diagrama */}
      <div className="flex items-center justify-between mb-4 border-b border-white/[0.08] pb-2.5">
        <span className="text-[10px] text-[#94A3B8] tracking-wider uppercase">
          {data.title}
        </span>
        <span className="text-[10px] text-[#D4AF37] font-bold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
          ARQUITECTURA EN VIVO
        </span>
      </div>

      {/* Nodos de Arquitectura con Conexión SVG Auto-Dibujada */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative">
        {data.nodes.map((node, i) => {
          const isLast = i === data.nodes.length - 1;
          const colorClasses =
            node.color === "emerald"
              ? "border-[#D4AF37]/40 text-[#D4AF37] bg-[#D4AF37]/10"
              : node.color === "amber"
              ? "border-[#E09F5A]/40 text-[#E09F5A] bg-[#E09F5A]/10"
              : "border-white/[0.14] text-[#F8FAFC] bg-white/[0.04]";

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
                <div className="text-[#F8FAFC] font-bold text-xs leading-tight mb-1">{node.label}</div>
                <div className="text-[10px] text-[#94A3B8] leading-tight">{node.sub}</div>
              </div>

              {/* Flecha indicadora en desktop */}
              {!isLast && (
                <div className="hidden sm:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 text-[#D4AF37]/60 text-xs">
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
