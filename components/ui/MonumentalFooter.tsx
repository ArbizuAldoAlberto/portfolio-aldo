"use client";

import React, { useState, useEffect } from "react";
import { Copy, Check, MapPin, Clock, Mail, ExternalLink } from "lucide-react";
import { soundEngine } from "../system/SoundEngine";
import { useLocale } from "next-intl";

export function MonumentalFooter() {
  const locale = useLocale();
  const isEs = locale === "es";
  const [copied, setCopied] = useState<boolean>(false);
  const [localTime, setLocalTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString(isEs ? "es-AR" : "en-US", {
        timeZone: "America/Argentina/Buenos_Aires",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      setLocalTime(timeStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [isEs]);

  const handleCopyEmail = () => {
    soundEngine.playClick();
    navigator.clipboard.writeText("arbizualdoalberto@gmail.com");
    setCopied(true);
    soundEngine.playSuccess();
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <footer id="contacto" className="py-24 sm:py-36 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
      {/* Contenedor Monumental */}
      <div className="p-8 sm:p-14 lg:p-18 rounded-3xl bg-black/60 border border-emerald-500/30 shadow-2xl relative overflow-hidden mb-16">
        {/* Glow de fondo */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span>
              {isEs
                ? "DISPONIBLE PARA CONTRATOS B2B & ARQUITECTURA OFFLINE-FIRST"
                : "AVAILABLE FOR B2B & OFFLINE-FIRST ARCHITECTURES"}
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>BOLÍVAR, ARG (UTC-3):</span>
            <span className="text-white font-bold tabular-nums">{localTime || "--:--:--"}</span>
          </div>
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-sans font-bold text-white tracking-tight leading-[1.1] max-w-4xl mb-6">
          {isEs
            ? "¿Construimos un sistema que resista la prueba del mundo real?"
            : "Shall we build a system that withstands real-world constraints?"}
        </h2>

        <p className="text-slate-300 font-sans text-sm sm:text-base max-w-2xl mb-10 leading-relaxed">
          {isEs
            ? "Ya sea una aplicación móvil para zonas rurales sin señal, un algoritmo que opere con rigor matemático o una infraestructura crítica: hablemos de arquitectura, requerimientos y plazos."
            : "Whether it is an Offline-First mobile app for zero-signal rural areas, a mathematical quant execution algorithm, or mission-critical software: let's discuss architecture and timeline."}
        </p>

        {/* Email Gigante Interactivo con Copy to Clipboard */}
        <div className="pt-2 pb-8">
          <button
            onClick={handleCopyEmail}
            onMouseEnter={() => soundEngine.playHover()}
            className="group w-full text-left p-6 sm:p-8 rounded-2xl bg-black/80 border border-white/15 hover:border-emerald-500/60 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl"
          >
            <div>
              <span className="font-mono text-[11px] text-emerald-400 uppercase font-bold block mb-1">
                {isEs ? "// CLICK PARA COPIAR CORREO PERSONAL DE CONTACTO:" : "// CLICK TO COPY DIRECT CONTACT EMAIL:"}
              </span>
              <span className="text-xl sm:text-3xl md:text-4xl font-mono font-bold text-white group-hover:text-emerald-300 transition-colors break-all">
                arbizualdoalberto@gmail.com
              </span>
            </div>

            <div
              className={`px-6 py-3.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                copied
                  ? "bg-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(52,211,153,0.35)]"
                  : "bg-white/10 text-white group-hover:bg-emerald-400 group-hover:text-slate-950"
              }`}
            >
              {copied ? (
                <>
                  <Check size={16} />
                  <span>{isEs ? "¡COPIADO AL PORTAPAPELES!" : "COPIED TO CLIPBOARD!"}</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  <span>{isEs ? "COPIAR EMAIL" : "COPY EMAIL"}</span>
                </>
              )}
            </div>
          </button>
        </div>

        {/* Enlaces de Acción: Enviar Email & Visitar Arbizu Labs */}
        <div className="flex flex-wrap gap-4 items-center">
          <a
            href="mailto:arbizualdoalberto@gmail.com"
            onMouseEnter={() => soundEngine.playHover()}
            onClick={() => soundEngine.playClick()}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-400 text-slate-950 font-mono text-xs font-bold hover:bg-emerald-300 transition-colors shadow-[0_0_20px_rgba(52,211,153,0.3)]"
          >
            <Mail className="w-4 h-4" />
            <span>{isEs ? "Redactar Correo Directo" : "Compose Direct Email"}</span>
          </a>

          <a
            href="https://arbizulabs.com"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => soundEngine.playHover()}
            onClick={() => soundEngine.playClick()}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 border border-white/15 text-white font-mono text-xs font-semibold hover:border-emerald-400 hover:bg-white/15 transition-colors"
          >
            <span>{isEs ? "Visitar Arbizu Labs (Estudio Corporativo)" : "Visit Arbizu Labs (Corporate Studio)"}</span>
            <ExternalLink className="w-4 h-4 text-emerald-400" />
          </a>
        </div>
      </div>

      {/* Marquee del Stack Tecnológico */}
      <div className="mb-14 overflow-hidden border-y border-white/10 py-4 select-none opacity-80 hover:opacity-100 transition-opacity">
        <div className="flex whitespace-nowrap gap-8 animate-marquee font-mono text-xs text-slate-300 uppercase font-medium">
          {[
            "React Native",
            "Next.js 16",
            "SQLite WAL",
            "Supabase RLS",
            "Three.js / WebGL",
            "TypeScript",
            "Python Quant",
            "Binance Futures API",
            "Kelly Criterion",
            "LoRaWAN IoT",
            "n8n Automation",
            "OWASP MASVS",
            "Arbizu Labs",
          ].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2">
              <span className="text-emerald-400">✦</span>
              <span>{item}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Barra Inferior de Metadatos */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300">San Carlos de Bolívar, Buenos Aires, Argentina</span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://arbizulabs.com"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => soundEngine.playHover()}
            className="hover:text-white transition-colors text-emerald-400 font-bold"
          >
            arbizulabs.com ↗
          </a>
          <a
            href="https://github.com/ArbizuAldoAlberto"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => soundEngine.playHover()}
            className="hover:text-white transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            <span>GitHub</span>
          </a>
          <a
            href="https://www.linkedin.com/in/aldo-alberto-arbizu/"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => soundEngine.playHover()}
            className="hover:text-white transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                clipRule="evenodd"
              />
            </svg>
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
