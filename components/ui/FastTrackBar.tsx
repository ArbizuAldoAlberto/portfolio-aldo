"use client";

import React, { useState, useEffect } from "react";
import { FileText, Calendar, ArrowRight, X } from "lucide-react";
import { useLocale } from "next-intl";

export default function FastTrackBar() {
  const [dismissed, setDismissed] = useState(false);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const locale = useLocale();
  const isEs = locale === "es";

  useEffect(() => {
    const onScroll = () => {
      setScrolledPastHero(window.scrollY > window.innerHeight * 0.85);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (dismissed || !scrolledPastHero) return null;

  return (
    <aside
      aria-label="Recruiter Fast-Track"
      className="fixed bottom-6 left-6 z-40 hidden xl:flex items-center gap-3 px-4 py-2.5 rounded-[10px] bg-[#061423]/90 backdrop-blur-xl border border-emerald-400/30 text-white font-mono text-xs shadow-2xl"
    >
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
      </span>

      <a
        href="/cv/cv-unificado-aldo-arbizu.pdf"
        download
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[7px] bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-[11px] font-bold transition-all"
      >
        <FileText className="w-3.5 h-3.5 text-cyan-400" />
        <span>{isEs ? "CV ATS (PDF)" : "ATS Resume"}</span>
      </a>

      <a
        href="https://arbizulabs.com/booking"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[7px] bg-emerald-400 text-slate-950 text-[11px] font-bold hover:bg-emerald-300 transition-all"
      >
        <Calendar className="w-3.5 h-3.5" />
        <span>{isEs ? "Agendar Entrevista" : "Book Interview"}</span>
        <ArrowRight className="w-3 h-3" />
      </a>

      <button
        onClick={() => setDismissed(true)}
        aria-label="Cerrar barra de reclutamiento"
        className="p-1 rounded text-slate-400 hover:text-white transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
}
