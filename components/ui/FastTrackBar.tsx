"use client";

import React, { useState } from "react";
import { FileText, Calendar, Zap, ArrowRight, X } from "lucide-react";
import { useLocale } from "next-intl";

export default function FastTrackBar() {
  const [visible, setVisible] = useState(true);
  const locale = useLocale();
  const isEs = locale === "es";

  if (!visible) return null;

  return (
    <aside aria-label="Recruiter Fast-Track" className="w-full bg-[#070b14] border-b border-emerald-500/30 text-white font-mono text-xs relative z-50 py-2.5 px-4 sm:px-8 shadow-[0_4px_25px_rgba(0,0,0,0.6)]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Status Badge */}
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-bold text-emerald-400 tracking-wider">
            {isEs
              ? "DISPONIBILIDAD INMEDIATA: STAFF SRE // QUANTITATIVE SYSTEMS LEAD"
              : "IMMEDIATE HIRE: STAFF SRE // QUANTITATIVE SYSTEMS LEAD"}
          </span>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* 1-Click ATS Resume */}
          <a
            href="/cv/cv-unificado-aldo-arbizu.pdf"
            download
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-[11px] font-bold transition-all hover:border-emerald-500/40"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isEs ? "CV Ejecutivo ATS (PDF)" : "Executive ATS Resume (PDF)"}</span>
          </a>

          {/* Schedule Technical Interview */}
          <a
            href="https://arbizulabs.com/booking"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-[11px] font-bold hover:bg-emerald-400 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{isEs ? "Agendar Entrevista Técnica" : "Book Technical Interview"}</span>
            <ArrowRight className="w-3 h-3" />
          </a>

          {/* Close button */}
          <button
            onClick={() => setVisible(false)}
            aria-label="Cerrar barra de reclutamiento"
            className="p-1 rounded text-slate-400 hover:text-white transition-colors ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
