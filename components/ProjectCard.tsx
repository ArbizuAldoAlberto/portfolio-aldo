"use client";

import { motion } from "framer-motion";
import { ExternalLink, CheckCircle2, AlertTriangle, Cpu } from "lucide-react";

export interface ProjectData {
  id: string;
  title: string;
  category: string;
  statusBadge: string;
  statusType: "live" | "prototype" | "saas";
  stack: string[];
  problem: string;
  solution: string;
  impactMetric: string;
  liveUrl?: string;
}

export default function ProjectCard({ project, index }: { project: ProjectData; index: number }) {
  const isLive = project.statusType === "live";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className="group relative rounded-2xl bg-orbital-card border border-orbital-border hover:border-orbital-emerald/40 transition-all duration-500 overflow-hidden flex flex-col h-full shadow-lg hover:shadow-emerald-card"
    >
      <div className={`h-1 w-full ${isLive ? "bg-gradient-to-r from-emerald-500 to-teal-400" : "bg-gradient-to-r from-amber-500 to-emerald-500"}`} />
      <span className="absolute top-4 right-5 font-mono text-4xl font-bold text-white/[0.03] group-hover:text-orbital-emerald/[0.07] transition-colors pointer-events-none select-none">0{index + 1}</span>

      <div className="p-6 sm:p-8 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="font-mono text-xs text-orbital-emerald font-semibold uppercase tracking-wider">{project.category}</span>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold uppercase tracking-wider ${isLive ? "bg-emerald-950/70 text-emerald-400 border border-emerald-500/30" : "bg-amber-950/70 text-amber-400 border border-amber-500/30"}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${isLive ? "bg-emerald-400" : "bg-amber-400"}`} />
            {project.statusBadge}
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-sans font-bold text-white mb-6 group-hover:text-emerald-300 transition-colors">{project.title}</h3>

        <div className="space-y-4 mb-6 text-sm font-sans flex-1">
          <div className="p-3.5 rounded-xl bg-orbital-bg/80 border border-orbital-border/50">
            <div className="flex items-center gap-1.5 text-orbital-amber font-mono text-xs font-semibold uppercase mb-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Problema Operativo</span>
            </div>
            <p className="text-orbital-muted leading-relaxed text-xs sm:text-sm">{project.problem}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-orbital-bg/80 border border-orbital-border/50">
            <div className="flex items-center gap-1.5 text-orbital-emerald font-mono text-xs font-semibold uppercase mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Solución de Ingeniería</span>
            </div>
            <p className="text-orbital-muted leading-relaxed text-xs sm:text-sm">{project.solution}</p>
          </div>
        </div>

        <div className="mb-6 p-3 rounded-xl bg-orbital-emerald-glow border border-orbital-emerald/20 flex items-center gap-2.5">
          <Cpu className="w-4 h-4 text-orbital-emerald shrink-0" />
          <span className="font-mono text-xs text-emerald-300 font-medium">{project.impactMetric}</span>
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap gap-1.5">
            {project.stack.map((tech, i) => (
              <span key={i} className="px-2.5 py-1 rounded-md bg-orbital-subtle border border-orbital-border font-mono text-[11px] text-slate-300">{tech}</span>
            ))}
          </div>
        </div>

        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-orbital-subtle border border-orbital-border text-white font-mono text-xs font-semibold tracking-wider hover:bg-orbital-emerald hover:text-black hover:border-orbital-emerald transition-all duration-300 group/btn">
            <span>ACCEDER AL SISTEMA EN VIVO</span>
            <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </a>
        )}
      </div>
    </motion.div>
  );
}
