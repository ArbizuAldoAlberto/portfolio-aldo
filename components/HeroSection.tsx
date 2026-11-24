"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { AldoArbizuMonogram } from "./ui/SovereignBrandMark";

export default function HeroSection() {
  const locale = useLocale();
  const isEs = locale === "es";
  const t = useTranslations("OrbitalUI");

  return (
    <section
      className="relative bg-[#060709] border-b border-[#1B202B] pt-20 pb-8 sm:pt-24 sm:pb-10 overflow-x-clip"
      data-section="hero"
      aria-labelledby="hero-title"
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-[#1B202B] bg-[#0B0D12] p-5 sm:p-7">
          {/* Encabezado Editorial Sobrio */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-3 mb-5 border-b border-[#1B202B] font-mono text-[11px] uppercase tracking-[0.14em] tabular-nums">
            <div className="flex items-center gap-3">
              <AldoArbizuMonogram className="w-6 h-6 shrink-0" />
              <span className="text-[#C2C8D4] font-semibold">
                {isEs
                  ? "Aldo Alberto Arbizu · Arquitecto de Sistemas & Fundador"
                  : "Aldo Alberto Arbizu · Principal Systems Architect"}
              </span>
            </div>
            <div className="text-[#D4AF37] font-semibold">
              {isEs ? "San Carlos de Bolívar · Alta Disponibilidad" : "High Availability · Deterministic Systems"}
            </div>
          </div>

          {/* Grilla Editorial 7:5 — 1 CTA Primario Inequívoco + Sec + Enlace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            <div className="lg:col-span-7 text-left space-y-4">
              <h1
                id="hero-title"
                className="font-sans font-extrabold text-3xl sm:text-5xl lg:text-[3.25rem] leading-[1.04] tracking-[-0.035em] text-[#F6F7F9]"
              >
                <span className="block">{t("heroTitleLine1")}</span>
                <span className="block text-[#D4AF37]">{t("heroTitleLine2")}</span>
              </h1>

              <p className="font-sans text-sm sm:text-base text-[#C2C8D4] leading-relaxed max-w-2xl">
                <strong className="text-[#F2F0EA]">{t("heroLedeLead")}</strong> {t("heroLedeBody")}
              </p>

              {/* Máximo 3 acciones en primer viewport, 1 botón primario dominante */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <a
                  href="#proyectos"
                  className="inline-flex items-center gap-2 px-6 py-3.5 min-h-[44px] rounded-[2px] bg-[#D4AF37] hover:bg-[#F2F0EA] text-[#060709] font-mono text-xs font-extrabold uppercase tracking-wider transition-colors"
                >
                  <span>{isEs ? "Ver Casos en Producción" : "Explore Case Studies"}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </a>

                <a
                  href="#contacto"
                  className="inline-flex items-center gap-2 px-5 py-3.5 min-h-[44px] rounded-[2px] border border-[#2A3140] bg-[#060709] hover:border-[#D4AF37] text-[#F2F0EA] font-mono text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  <span>{isEs ? "Contacto Directo" : "Direct Contact"}</span>
                </a>

                <a
                  href="https://arbizulabs.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2 py-2 font-mono text-xs font-semibold text-[#D4AF37] hover:text-[#F2F0EA] underline underline-offset-4 transition-colors"
                >
                  <span>{isEs ? "Estudio B2B Arbizu Labs" : "Arbizu Labs B2B"}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Columna Derecha: Fotografía Editorial Real Nano Banana (LCP Priorizado) */}
            <div className="lg:col-span-5">
              <figure className="border border-[#1B202B] bg-[#060709] overflow-hidden">
                <img
                  src="/assets/brand-v2/aldo-editorial-architecture.webp"
                  alt={
                    isEs
                      ? "Mesa de ingeniería de sistemas e instrumentación de precisión — Aldo Alberto Arbizu"
                      : "Systems architecture workbench and precision instruments — Aldo Alberto Arbizu"
                  }
                  width={1280}
                  height={720}
                  className="w-full aspect-[16/10] object-cover block"
                  loading="eager"
                  fetchPriority="high"
                />
                <figcaption className="px-3.5 py-2.5 border-t border-[#1B202B] font-mono text-[10px] uppercase tracking-widest text-[#8A93A6] flex items-center justify-between">
                  <span>{isEs ? "INGENIERÍA DE PRODUCCIÓN · BARE-METAL + CAMPO" : "PRODUCTION ENGINEERING · BARE-METAL + FIELD"}</span>
                  <span className="text-[#D4AF37]">60/60 RLS</span>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
