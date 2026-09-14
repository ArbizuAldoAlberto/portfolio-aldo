"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, CheckCircle2, Zap, Server, RefreshCw, AlertTriangle } from "lucide-react";
import { soundEngine } from "../system/SoundEngine";

interface ClusterNode {
  id: string;
  name: string;
  role: string;
  region: string;
  status: "healthy" | "degraded" | "failed";
  load: number;
  latencyMs: number;
}

export function SreFailoverSandbox() {
  const [nodes, setNodes] = useState<ClusterNode[]>([
    {
      id: "node-1",
      name: "Hetzner-FSN1",
      role: "PRIMARY_L7_GATEWAY",
      region: "Germany (Nuernberg)",
      status: "healthy",
      load: 64,
      latencyMs: 14,
    },
    {
      id: "node-2",
      name: "Cloudflare-Edge-EZE",
      role: "SECONDARY_PROXY",
      region: "Buenos Aires (Anycast)",
      status: "healthy",
      load: 32,
      latencyMs: 22,
    },
    {
      id: "node-3",
      name: "Titan-Hot-Standby",
      role: "STATE_REPLICATOR",
      region: "Isolated Enclave",
      status: "healthy",
      load: 18,
      latencyMs: 8,
    },
  ]);

  const [rps, setRps] = useState<number>(1840);
  const [p99Latency, setP99Latency] = useState<number>(14.2);
  const [activeLog, setActiveLog] = useState<string>("SYSTEM_NORMAL // L7 Router distribuyendo carga sin degradación");
  const [isSimulatingFailover, setIsSimulatingFailover] = useState<boolean>(false);

  // Background slight jitter to feel alive
  useEffect(() => {
    const interval = setInterval(() => {
      setRps((prev) => Math.floor(prev + (Math.random() - 0.48) * 40));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const triggerNodeFailure = () => {
    try { soundEngine?.playClick(); } catch (e) {}
    setIsSimulatingFailover(true);
    setActiveLog("🚨 ALERTA CRÍTICA: Nodo Primario Hetzner-FSN1 no responde (Heartbeat timeout)");

    setNodes((prev) =>
      prev.map((n) =>
        n.id === "node-1"
          ? { ...n, status: "failed", load: 0, latencyMs: 999 }
          : n.id === "node-2"
          ? { ...n, load: 88, latencyMs: 26 }
          : { ...n, load: 45, latencyMs: 9 }
      )
    );
    setP99Latency(38.4);

    // Auto failover self-healing in 1.8s
    setTimeout(() => {
      setActiveLog("⚡ SRE FAILOVER AUTOMÁTICO: Tráfico desviado al 100% hacia Cloudflare & Standby (< 42ms)");
      setP99Latency(19.8);

      setTimeout(() => {
        setIsSimulatingFailover(false);
      }, 1000);
    }, 1800);
  };

  const resetCluster = () => {
    try { soundEngine?.playClick(); } catch (e) {}
    setNodes([
      {
        id: "node-1",
        name: "Hetzner-FSN1",
        role: "PRIMARY_L7_GATEWAY",
        region: "Germany (Nuernberg)",
        status: "healthy",
        load: 64,
        latencyMs: 14,
      },
      {
        id: "node-2",
        name: "Cloudflare-Edge-EZE",
        role: "SECONDARY_PROXY",
        region: "Buenos Aires (Anycast)",
        status: "healthy",
        load: 32,
        latencyMs: 22,
      },
      {
        id: "node-3",
        name: "Titan-Hot-Standby",
        role: "STATE_REPLICATOR",
        region: "Isolated Enclave",
        status: "healthy",
        load: 18,
        latencyMs: 8,
      },
    ]);
    setP99Latency(14.2);
    setActiveLog("🟢 RESTAURACIÓN COMPLETADA: Clúster en topología balanceada");
    setIsSimulatingFailover(false);
  };

  return (
    <div className="rounded-2xl bg-[#090A0F] border border-cyan-500/30 p-5 sm:p-6 font-mono text-xs text-slate-200 shadow-2xl relative overflow-hidden">
      {/* Terminal Titlebar */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-3 mb-4 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[11px] text-cyan-400 font-bold uppercase tracking-wider">
            NEXUS_SRE // HIGH_AVAILABILITY_SANDBOX
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <span>TOPOLOGÍA: MULTI-REGION L7</span>
          <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 font-bold">
            ZERO-DOWNTIME
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="p-3 rounded-xl bg-black/60 border border-white/5">
          <span className="text-[10px] text-slate-400 block mb-1">THROUGHPUT</span>
          <div className="text-white font-bold text-sm sm:text-base tabular-nums">
            {rps.toLocaleString()} <span className="text-[10px] text-slate-500 font-normal">req/s</span>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-black/60 border border-white/5">
          <span className="text-[10px] text-slate-400 block mb-1">P99 LATENCY</span>
          <div
            className={`font-bold text-sm sm:text-base tabular-nums ${
              p99Latency > 30 ? "text-amber-400" : "text-emerald-400"
            }`}
          >
            {p99Latency.toFixed(1)} <span className="text-[10px] text-slate-500 font-normal">ms</span>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-black/60 border border-white/5">
          <span className="text-[10px] text-slate-400 block mb-1">PACKET LOSS</span>
          <div className="text-emerald-400 font-bold text-sm sm:text-base tabular-nums">
            0.00% <span className="text-[10px] text-slate-500 font-normal">SLA 99.99%</span>
          </div>
        </div>
      </div>

      {/* Active Clustered Nodes */}
      <div className="space-y-2.5 mb-4">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">ESTADO DE NODOS DE BORDE:</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {nodes.map((node) => {
            const isFailed = node.status === "failed";
            const borderStyle = isFailed
              ? "border-red-500/60 bg-red-950/20 text-red-300"
              : "border-white/10 bg-black/40 text-slate-300";

            return (
              <motion.div
                key={node.id}
                layout
                className={`p-3 rounded-xl border ${borderStyle} transition-all relative overflow-hidden`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-[11px] truncate">{node.name}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isFailed ? "bg-red-500 animate-ping" : "bg-emerald-400"
                    }`}
                  />
                </div>
                <div className="text-[9px] text-slate-400 truncate mb-2">{node.region}</div>
                <div className="flex justify-between items-center text-[10px] pt-1.5 border-t border-white/5">
                  <span>Carga: {node.load}%</span>
                  <span>{isFailed ? "TIMEOUT" : `${node.latencyMs}ms`}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Telemetry Log */}
      <div className="p-2.5 rounded-lg bg-black/80 border border-white/10 mb-4 text-[10px] font-mono flex items-center gap-2 overflow-x-auto">
        <span className="text-cyan-400 font-bold shrink-0">&gt;&gt;</span>
        <span className={activeLog.includes("ALERTA") ? "text-red-400 font-semibold" : "text-slate-300"}>
          {activeLog}
        </span>
      </div>

      {/* Interactive Trigger Controls */}
      <div className="flex flex-wrap gap-3 items-center justify-between pt-1">
        <div className="flex gap-2">
          <button
            onClick={triggerNodeFailure}
            disabled={isSimulatingFailover || nodes[0].status === "failed"}
            className="px-3.5 py-2 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 font-bold text-[11px] flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(239,68,68,0.2)]"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Simular Caída Nodo Primario</span>
          </button>
          <button
            onClick={resetCluster}
            className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-[11px] flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restaurar Clúster</span>
          </button>
        </div>
        <span className="text-[10px] text-slate-500 hidden sm:inline font-mono">
          Failover determinista por Layer-7 Router
        </span>
      </div>
    </div>
  );
}
