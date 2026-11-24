"use client";

import { useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import { ProjectsShowcase } from "@/components/ProjectsShowcase";
import DeveloperStore from "@/components/sections/DeveloperStore";
import ServicesSection from "@/components/ServicesSection";
import { MonumentalFooter } from "@/components/ui/MonumentalFooter";
import {
  Tractor,
  Smartphone,
  Shield,
  TrendingUp,
  Award,
  ExternalLink,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export interface LocalizedHomeProps {
  forceTheme?: "v1" | "v2";
}

export default function LocalizedHome({ forceTheme }: LocalizedHomeProps = {}) {
  const locale = useLocale();
  const t = useTranslations("OrbitalUI");
  const isEs = locale === "es";

  useEffect(() => {
    if (typeof window === "undefined") return;
    const themeVal = forceTheme === "v2" ? "v2" : "v1";
    document.documentElement.setAttribute("data-theme", themeVal);
  }, [forceTheme]);

  const hybridArtifacts = [
    {
      icon: Tractor,
      tag: t("artifact1Tag"),
      title: t("artifact1Title"),
      desc: t("artifact1Desc"),
    },
    {
      icon: Smartphone,
      tag: t("artifact2Tag"),
      title: t("artifact2Title"),
      desc: t("artifact2Desc"),
    },
    {
      icon: Shield,
      tag: t("artifact3Tag"),
      title: t("artifact3Title"),
      desc: t("artifact3Desc"),
    },
    {
      icon: TrendingUp,
      tag: t("artifact4Tag"),
      title: t("artifact4Title"),
      desc: t("artifact4Desc"),
    },
  ];

  return (
    <main id="contenido" className="min-h-screen bg-[#060709] text-[#F2F0EA] selection:bg-[#D4AF37]/30 selection:text-white">
      {/* 1. HERO EDITORIAL OBSIDIANA */}
      <HeroSection />

      {/* 2. EL FACTOR HÍBRIDO · FOTOGRAFÍA EDITORIAL + 4 PILARES DE INGENIERÍA */}
      <section
        id="sobre-mi"
        className="py-10 sm:py-12 bg-[#060709] border-b border-[#1B202B]"
        data-section="artifacts"
        aria-labelledby="artefactos-title"
      >
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[#1B202B] pb-4">
            <div>
              <span className="font-mono text-[11px] text-[#D4AF37] font-semibold uppercase tracking-[0.14em] block mb-2">
                {t("artifactsTag")}
              </span>
              <h2 id="artefactos-title" className="text-2xl sm:text-4xl font-sans font-bold text-[#F6F7F9] tracking-tight">
                {t("artifactsTitle")}
              </h2>
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#8A93A6] max-w-xl leading-relaxed">
              {isEs
                ? "Cuatro disciplinas de hardware y software operando juntas desde la manga ganadera y los perímetros sin red hasta mercados financieros de baja latencia."
                : "Four physical and software disciplines operating together from rural fields to low-latency markets."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <figure className="lg:col-span-5 border border-[#1B202B] bg-[#0B0D12] overflow-hidden">
              <img
                src="/assets/brand-v2/aldo-craft-four-worlds.webp"
                alt={
                  isEs
                    ? "Artefactos físicos de hardware embebido, campo agropecuario, llave criptográfica y bitácora técnica"
                    : "Physical artifacts spanning embedded hardware, agriculture, cryptographic keys, and technical notebook"
                }
                width={1280}
                height={720}
                className="w-full aspect-[16/10] object-cover block"
                loading="lazy"
              />
              <figcaption className="px-4 py-2 border-t border-[#1B202B] font-mono text-[10px] uppercase tracking-widest text-[#8A93A6] flex items-center justify-between">
                <span>BIT-TO-ATOM // 4 DISCIPLINAS EN PRODUCCIÓN</span>
                <span className="text-[#D4AF37]">WAL + RLS</span>
              </figcaption>
            </figure>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 border border-[#1B202B] bg-[#0B0D12]">
              {hybridArtifacts.map((item, i) => (
                <article
                  key={i}
                  className="p-4 border-b border-[#1B202B] sm:odd:border-r flex flex-col justify-between gap-2.5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="w-9 h-9 rounded-[2px] bg-[#060709] border border-[#1B202B] flex items-center justify-center text-[#D4AF37]">
                      <item.icon className="w-4 h-4" strokeWidth={1.5} />
                    </div>
                    <span className="font-mono text-[10px] font-bold tracking-wider text-[#D4AF37] uppercase">
                      {item.tag}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-sans text-lg font-bold text-[#F6F7F9] mb-1.5">{item.title}</h3>
                    <p className="font-sans text-xs sm:text-sm text-[#C2C8D4] leading-relaxed">{item.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. SHOWCASE DE CASOS EN PRODUCCIÓN & SANDBOX SRE */}
      <ProjectsShowcase />

      {/* 4. DIGITAL STORE & BOILERPLATES */}
      <DeveloperStore />

      {/* 5. SERVICIOS Y PRICING B2B */}
      <ServicesSection />

      {/* 6. GARANTÍAS VERIFICABLES & ESTUDIO ARBIZU LABS */}
      <section className="py-10 sm:py-12 bg-[#060709] border-t border-[#1B202B]">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <div className="p-5 rounded-[2px] bg-[#0B0D12] border border-[#1B202B] flex flex-col justify-between">
              <div>
                <span className="font-mono text-[11px] text-[#D4AF37] font-semibold uppercase tracking-[0.14em] block mb-1.5">
                  {isEs ? "ESTÁNDARES DE PRODUCCIÓN" : "PRODUCTION STANDARDS"}
                </span>
                <h2 className="text-2xl sm:text-3xl font-sans font-bold text-[#F6F7F9] mb-4">
                  {isEs ? "Garantías técnicas verificables en vivo." : "Live verifiable engineering guarantees."}
                </h2>
                <div className="space-y-2">
                  {[
                    {
                      org: "Architecture Certification // v3.1.0",
                      title: isEs
                        ? "Aislamiento 60/60 PostgreSQL RLS · Persistencia Atómica SQLite WAL"
                        : "60/60 PostgreSQL RLS Isolation · SQLite WAL Atomic Persistence",
                    },
                    {
                      org: "Quantitative Execution Engine (SYS-01)",
                      title: isEs
                        ? "Telemetría WebSocket Sub-10ms · Pessimistic SL-First · Hard Cap 1.50%"
                        : "Sub-10ms WebSocket Telemetry · Pessimistic SL-First · 1.50% Hard Cap",
                    },
                    {
                      org: "Zero-Trust & Edge Shielding (SYS-02 / SYS-05)",
                      title: isEs
                        ? "Seguridad Móvil OWASP MASVS · Atestación Criptográfica Base L2"
                        : "OWASP MASVS Mobile Security · Base L2 Cryptographic Attestation",
                    },
                    {
                      org: isEs ? "Licencias Operativas de Campo" : "Field Operational Licenses",
                      title: isEs
                        ? "Relevamiento con Drones GIS · Termografía FLIR · Auditoría Industrial"
                        : "GIS Drone Telemetry · Calibrated FLIR Thermography · Field Audits",
                    },
                  ].map((b, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 p-2.5 rounded-[2px] bg-[#060709] border border-[#1B202B]"
                    >
                      <Award className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-mono text-[11px] text-[#D4AF37] font-bold">{b.org}</div>
                        <div className="font-sans text-xs sm:text-sm text-[#F2F0EA] font-medium">{b.title}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-3.5 border-t border-[#1B202B] mt-3.5 flex items-center gap-2 text-xs font-mono text-[#8A93A6]">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                <span>{isEs ? "Titulación y certificaciones auditables." : "Auditable degrees and certifications."}</span>
              </div>
            </div>

            <div className="p-5 rounded-[2px] bg-[#0B0D12] border border-[#1B202B] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 font-mono text-xs text-[#D4AF37] font-bold uppercase">
                    <Building2 className="w-4 h-4 text-[#D4AF37]" />
                    <span>{isEs ? "ESTUDIO B2B // ARBIZU LABS" : "CORPORATE STUDIO // ARBIZU LABS"}</span>
                  </div>
                  <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-[2px] bg-[#060709] text-[#D4AF37] border border-[#1B202B] font-bold">
                    SOFTWARE HOUSE
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-sans font-bold text-[#F6F7F9] mb-3">Arbizu Labs</h3>

                <p className="font-sans text-sm text-[#C2C8D4] leading-relaxed mb-4">
                  {isEs ? (
                    <>
                      <strong className="text-[#F6F7F9]">Arbizu Labs</strong> es mi estudio de software y consultoría
                      técnica corporativa, especializado en sistemas offline-first, plataformas B2B, hardware embebido y
                      automatización de procesos en producción real.
                    </>
                  ) : (
                    <>
                      <strong className="text-[#F6F7F9]">Arbizu Labs</strong> is my corporate software studio focused
                      on offline-first mobile apps, B2B platforms, embedded hardware, and deterministic production
                      systems.
                    </>
                  )}
                </p>

                <div className="space-y-2 mb-5">
                  {[
                    isEs
                      ? "Desarrollo de software a medida para empresas y productores."
                      : "Custom software engineering for enterprise and field operations.",
                    isEs
                      ? "Persistencia local SQLite WAL y sincronización resiliente en nube."
                      : "Local SQLite WAL persistence with resilient asynchronous cloud sync.",
                    isEs
                      ? "Auditorías técnicas, seguridad OWASP/RLS y automatizaciones n8n."
                      : "Technical audits, OWASP/RLS hardening, and n8n workflow automation.",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm font-sans text-[#C2C8D4]">
                      <span className="text-[#D4AF37] font-bold">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href="https://arbizulabs.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-5 min-h-[44px] rounded-[2px] bg-[#D4AF37] hover:bg-[#F2F0EA] text-[#060709] font-mono text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <span>{isEs ? "Visitar ArbizuLabs.com" : "Visit ArbizuLabs.com"}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER CONTACTO */}
      <MonumentalFooter />
    </main>
  );
}
