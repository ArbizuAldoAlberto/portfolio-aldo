"use client";

import React, { useState, useEffect } from "react";
import { Copy, Check, MapPin, Clock, Mail, ExternalLink } from "lucide-react";
import { useLocale } from "next-intl";
import { AldoArbizuMonogram, ArbizuLabsMark } from "./SovereignBrandMark";

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
    navigator.clipboard.writeText("arbizualdoalberto@gmail.com").catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <footer id="contacto" className="py-10 bg-[#060709] border-t border-[#1B202B]" data-section="footer">
      <div id="contact" className="scroll-mt-24" />
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-5 sm:p-7 rounded-[2px] bg-[#0B0D12] border border-[#1B202B] mb-5">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-[#1B202B]">
            <div className="inline-flex items-center gap-3 text-[#D4AF37] font-mono text-xs font-bold">
              <AldoArbizuMonogram className="w-6 h-6 shrink-0" />
              <span>PRINCIPAL ARCHITECT · OFFLINE-FIRST &amp; QUANT SYSTEMS</span>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs text-[#8A93A6]">
              <Clock className="w-4 h-4 text-[#D4AF37]" strokeWidth={1.5} />
              <span>BOLÍVAR, ARG (UTC-3):</span>
              <span className="text-[#F6F7F9] font-bold tabular-nums">{localTime || "--:--:--"}</span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-sans font-bold text-[#F6F7F9] tracking-tight leading-[1.15] max-w-3xl mb-3">
            {isEs
              ? "¿Construimos un sistema que resista la prueba del mundo real?"
              : "Shall we build a system that withstands real-world constraints?"}
          </h2>

          <p className="text-[#C2C8D4] font-sans text-sm max-w-2xl mb-4 leading-relaxed">
            {isEs
              ? "Aplicaciones móviles offline-first, plataformas críticas o motores algorítmicos deterministas: hablemos de arquitectura, alcance y plazos reales."
              : "Offline-First mobile applications, critical B2B platforms, or deterministic engines: let's discuss architecture and concrete milestones."}
          </p>

          <div className="space-y-3 mb-4">
            <button
              type="button"
              onClick={handleCopyEmail}
              className="group w-full text-left p-3.5 rounded-[2px] bg-[#060709] border border-[#1B202B] hover:border-[#D4AF37] transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer"
            >
              <div>
                <span className="font-mono text-[10px] text-[#D4AF37] uppercase font-bold block mb-1">
                  {isEs ? "CONTACTO DIRECTO / ENGINEERING (CLICK PARA COPIAR)" : "DIRECT CONTACT / ENGINEERING (CLICK TO COPY)"}
                </span>
                <span className="text-lg sm:text-2xl font-mono font-bold text-[#F6F7F9] group-hover:text-[#D4AF37] transition-colors break-all">
                  arbizualdoalberto@gmail.com
                </span>
              </div>

              <div
                className={`px-4 py-2.5 rounded-[2px] font-mono text-xs font-bold transition-colors flex items-center gap-2 shrink-0 ${
                  copied
                    ? "bg-[#D4AF37] text-[#060709]"
                    : "bg-[#11151D] text-[#F2F0EA] border border-[#2A3140] group-hover:border-[#D4AF37]"
                }`}
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
                <span>{copied ? (isEs ? "COPIADO" : "COPIED") : isEs ? "COPIAR EMAIL" : "COPY EMAIL"}</span>
              </div>
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-[2px] bg-[#060709] border border-[#1B202B] font-mono text-xs">
              <div className="flex items-center gap-2 text-[#C2C8D4]">
                <span className="text-[#8A93A6] uppercase">
                  {isEs ? "Canal B2B Arbizu Labs:" : "Corporate B2B:"}
                </span>
                <a href="mailto:aldo@arbizulabs.com" className="text-[#F6F7F9] font-bold hover:text-[#D4AF37]">
                  aldo@arbizulabs.com
                </a>
              </div>
              <span className="text-[#8A93A6]">WhatsApp: +54 9 2314 489197</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <a
              href="mailto:arbizualdoalberto@gmail.com"
              className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-[2px] bg-[#D4AF37] hover:bg-[#F2F0EA] text-[#060709] font-mono text-xs font-extrabold uppercase tracking-wider transition-colors"
            >
              <Mail className="w-4 h-4" strokeWidth={1.5} />
              <span>{isEs ? "Redactar Correo Directo" : "Compose Direct Email"}</span>
            </a>

            <a
              href="https://arbizulabs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-[2px] bg-[#060709] border border-[#2A3140] hover:border-[#D4AF37] text-[#F2F0EA] font-mono text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              <ArbizuLabsMark className="w-4 h-4 shrink-0" />
              <span>{isEs ? "Visitar Arbizu Labs (Hub B2B)" : "Visit Arbizu Labs"}</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
            </a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#8A93A6]">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#D4AF37]" strokeWidth={1.5} />
            <span className="text-[#C2C8D4]">San Carlos de Bolívar, Buenos Aires, Argentina</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5">
            <a href="/impacto" className="hover:text-[#F6F7F9] transition-colors">
              {isEs ? "Impacto Social (/impacto)" : "Civic Impact (/impacto)"}
            </a>
            <a
              href="https://arbizulabs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#F6F7F9] text-[#D4AF37] font-bold transition-colors"
            >
              arbizulabs.com ↗
            </a>
            <a
              href="https://github.com/ArbizuAldoAlberto"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#F6F7F9] transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/aldo-alberto-arbizu/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#F6F7F9] transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
