"use client";

import React, { useState, useEffect } from "react";
import { Copy, Check, MapPin, Clock, Mail, ExternalLink } from "lucide-react";
import { soundEngine } from "../system/SoundEngine";
import { useTacticalAudio } from "../audio/useTacticalAudio";
import { useLocale } from "next-intl";

export function MonumentalFooter() {
  const locale = useLocale();
  const isEs = locale === "es";
  const [copied, setCopied] = useState<boolean>(false);
  const [localTime, setLocalTime] = useState<string>("");
  const { playHoverTick, playModeSwitch } = useTacticalAudio();

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
    playModeSwitch("pbr");
    navigator.clipboard.writeText("arbizualdoalberto@gmail.com");
    setCopied(true);
    soundEngine.playSuccess();
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <footer id="contacto" className="site-footer" data-section="footer">
      <div className="section-inner">
        {/* Contenedor Monumental */}
        <div className="p-8 sm:p-14 lg:p-18 rounded-2xl bg-[#070B12]/85 border border-white/[0.08] hover:border-[#D4AF37]/40 transition-colors shadow-[0_24px_80px_rgba(0,0,0,0.75)] relative overflow-hidden mb-14">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[10px] bg-[#070B12] border border-[#D4AF37]/40 text-[#D4AF37] font-mono text-xs font-bold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]" />
              </span>
              <span>
                {isEs
                  ? "DISPONIBLE PARA CONTRATOS B2B & ARQUITECTURA OFFLINE-FIRST"
                  : "AVAILABLE FOR B2B & OFFLINE-FIRST ARCHITECTURES"}
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs text-[#94A3B8]">
              <Clock className="w-4 h-4 text-[#D4AF37]" strokeWidth={1.5} />
              <span>BOLÍVAR, ARG (UTC-3):</span>
              <span className="text-[#F8FAFC] font-bold tabular-nums">{localTime || "--:--:--"}</span>
            </div>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-sans font-bold text-[#F8FAFC] tracking-tight leading-[1.1] max-w-4xl mb-6">
            {isEs
              ? "¿Construimos un sistema que resista la prueba del mundo real?"
              : "Shall we build a system that withstands real-world constraints?"}
          </h2>

          <p className="text-[#94A3B8] font-sans text-sm sm:text-base max-w-2xl mb-10 leading-relaxed">
            {isEs
              ? "Ya sea una aplicación móvil para zonas rurales sin señal, un algoritmo que opere con rigor matemático o una infraestructura crítica: hablemos de arquitectura, requerimientos y plazos."
              : "Whether it is an Offline-First mobile app for zero-signal rural areas, a mathematical quant execution algorithm, or mission-critical software: let's discuss architecture and timeline."}
          </p>

          {/* Email Gigante Interactivo con Copy to Clipboard */}
          <div className="pt-2 pb-8">
            <button
              onClick={handleCopyEmail}
              onMouseEnter={() => {
                soundEngine.playHover();
                playHoverTick();
              }}
              className="group w-full text-left p-6 sm:p-8 rounded-2xl bg-[#070B12] border border-white/[0.10] hover:border-[#D4AF37]/60 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl"
            >
              <div>
                <span className="font-mono text-[11px] text-[#D4AF37] uppercase font-bold block mb-1">
                  {isEs ? "// CLICK PARA COPIAR CORREO PERSONAL DE CONTACTO:" : "// CLICK TO COPY DIRECT CONTACT EMAIL:"}
                </span>
                <span className="text-xl sm:text-3xl md:text-4xl font-mono font-bold text-[#F8FAFC] group-hover:text-[#D4AF37] transition-colors break-all">
                  arbizualdoalberto@gmail.com
                </span>
              </div>

              <div
                className={`px-6 py-3.5 rounded-[10px] font-mono text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  copied
                    ? "bg-[#D4AF37] text-[#070B12] shadow-[0_0_20px_rgba(212,175,55,0.35)]"
                    : "bg-white/[0.08] text-[#F8FAFC] group-hover:bg-[#D4AF37] group-hover:text-[#070B12]"
                }`}
              >
                {copied ? (
                  <>
                    <Check size={16} strokeWidth={1.5} />
                    <span>{isEs ? "¡COPIADO AL PORTAPAPELES!" : "COPIED TO CLIPBOARD!"}</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} strokeWidth={1.5} />
                    <span>{isEs ? "COPIAR EMAIL" : "COPY EMAIL"}</span>
                  </>
                )}
              </div>
            </button>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <a
              href="mailto:arbizualdoalberto@gmail.com"
              data-magnetic
              onMouseEnter={() => {
                soundEngine.playHover();
                playHoverTick();
              }}
              onClick={() => {
                soundEngine.playClick();
                playModeSwitch("xray");
              }}
              className="btn-magnetic"
            >
              <span className="btn-label">
                <Mail className="w-4 h-4" strokeWidth={1.5} />
                <span>{isEs ? "Redactar Correo Directo" : "Compose Direct Email"}</span>
              </span>
              <span className="btn-glow" aria-hidden="true" />
            </a>

            <a
              href="https://arbizulabs.com"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => {
                soundEngine.playHover();
                playHoverTick();
              }}
              onClick={() => {
                soundEngine.playClick();
                playModeSwitch("pbr");
              }}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[10px] bg-white/[0.06] border border-white/[0.12] text-[#F8FAFC] font-mono text-xs font-semibold hover:border-[#D4AF37] hover:bg-white/[0.10] transition-colors"
            >
              <span>{isEs ? "Visitar Arbizu Labs (Estudio Corporativo)" : "Visit Arbizu Labs (Corporate Studio)"}</span>
              <ExternalLink className="w-4 h-4 text-[#D4AF37]" strokeWidth={1.5} />
            </a>
          </div>
        </div>

        {/* Marquee del Stack Tecnológico (sin bordes completos de 1px) */}
        <div className="mb-12 overflow-hidden py-4 select-none opacity-85 hover:opacity-100 transition-opacity">
          <div className="flex whitespace-nowrap gap-8 animate-marquee font-mono text-xs text-[#94A3B8] uppercase font-medium">
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
                <span className="text-[#D4AF37]">✦</span>
                <span>{item}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Barra Inferior de Metadatos */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-mono text-[#94A3B8]">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#D4AF37]" strokeWidth={1.5} />
            <span className="text-[#F8FAFC]">San Carlos de Bolívar, Buenos Aires, Argentina</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://arbizulabs.com"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => {
                soundEngine.playHover();
                playHoverTick();
              }}
              className="hover:text-[#F8FAFC] transition-colors text-[#D4AF37] font-bold"
            >
              arbizulabs.com ↗
            </a>
            <a
              href="https://github.com/ArbizuAldoAlberto"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => {
                soundEngine.playHover();
                playHoverTick();
              }}
              className="hover:text-[#F8FAFC] transition-colors flex items-center gap-1.5"
            >
              <span>GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/aldo-alberto-arbizu/"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => {
                soundEngine.playHover();
                playHoverTick();
              }}
              className="hover:text-[#F8FAFC] transition-colors flex items-center gap-1.5"
            >
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
