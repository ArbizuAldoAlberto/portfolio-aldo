"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, CheckCircle2, AlertTriangle, Cpu, Radio, Maximize2 } from "lucide-react";

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
  image?: string;
}

export default function ProjectCard({ project, index }: { project: ProjectData; index: number }) {
  const isLive = project.statusType === "live";
  const imageSrc = project.image || `/projects/${project.id}.png`;
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className="group relative rounded-2xl bg-orbital-card border border-orbital-border hover:border-emerald-500/50 transition-all duration-500 overflow-hidden flex flex-col h-full shadow-2xl hover:shadow-[0_0_35px_rgba(16,185,129,0.15)]"
    >
      {/* Top Accent Gradient */}
      <div
        className={`h-1 w-full ${
          isLive
            ? "bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500"
            : "bg-gradient-to-r from-amber-500 to-emerald-500"
        }`}
      />

      {/* Index Number Watermark */}
      <span className="absolute top-4 right-5 font-mono text-4xl font-bold text-white/[0.03] group-hover:text-emerald-400/[0.08] transition-colors pointer-events-none select-none z-10">
        0{index + 1}
      </span>

      {/* Real Project Screenshot Browser Mockup */}
      {!imgError && (
        <div className="relative border-b border-white/10 bg-black/70 overflow-hidden">
          {/* Fake Browser Titlebar */}
          <div className="flex items-center justify-between px-3 py-2 bg-black/90 border-b border-white/5 text-[10px] font-mono text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500/70" />
              <span className="w-2 h-2 rounded-full bg-amber-500/70" />
              <span className="w-2 h-2 rounded-full bg-emerald-500/70" />
              <span className="text-slate-500 text-[9px] ml-2 hidden sm:inline">
                https://{project.id}.aldoarbizu.com
              </span>
            </div>
            <div className="flex items-center gap-1 text-emerald-400 font-bold text-[9px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE · 200 OK</span>
            </div>
          </div>

          {/* Screenshot Viewport */}
          <div className="relative aspect-[16/10] overflow-hidden bg-[#06080e]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt={`${project.title} Interface`}
              loading="lazy"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
            />
            {/* Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      )}

      <div className="p-6 sm:p-7 flex flex-col flex-1">
        {/* Category & Status Badge */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="font-mono text-xs text-emerald-400 font-semibold uppercase tracking-wider">
            {project.category}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold uppercase tracking-wider ${
              isLive
                ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30"
                : "bg-amber-950/80 text-amber-400 border border-amber-500/30"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isLive ? "bg-emerald-400" : "bg-amber-400"}`} />
            {project.statusBadge}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-2xl sm:text-3xl font-sans font-bold text-white mb-5 group-hover:text-emerald-300 transition-colors">
          {project.title}
        </h3>

        {/* Problem / Solution Diagnostic */}
        <div className="space-y-3.5 mb-6 text-sm font-sans flex-1">
          <div className="p-3.5 rounded-xl bg-black/50 border border-white/5">
            <div className="flex items-center gap-1.5 text-amber-400 font-mono text-xs font-semibold uppercase mb-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Problema Operativo</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">{project.problem}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-black/50 border border-white/5">
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-xs font-semibold uppercase mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Solución de Ingeniería</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">{project.solution}</p>
          </div>
        </div>

        {/* Impact Metric */}
        <div className="mb-6 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 flex items-center gap-2.5">
          <Cpu className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-mono text-xs text-emerald-300 font-medium">{project.impactMetric}</span>
        </div>

        {/* Tech Stack Pills */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-1.5">
            {project.stack.map((tech, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 font-mono text-[11px] text-slate-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* 1-Click Launch CTA */}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold tracking-wider hover:bg-emerald-400 hover:text-slate-950 transition-all duration-300 group/btn shadow-[0_0_15px_rgba(16,185,129,0.15)]"
          >
            <span>ACCEDER AL SISTEMA EN VIVO</span>
            <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </a>
        )}
      </div>
    </motion.div>
  );
}
