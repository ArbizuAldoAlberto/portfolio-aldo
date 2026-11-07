"use client";

import { useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import OrbitalDiveSequence from "@/components/sections/OrbitalDiveSequence";
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
    const isV2 =
      forceTheme === "v2" ||
      window.location.pathname.includes("/v2") ||
      window.location.search.includes("theme=v2");
    const themeVal = isV2 ? "v2" : "v1";
    document.documentElement.setAttribute("data-theme", themeVal);
    if (window.__webanti) {
      window.__webanti.theme = themeVal;
    }
  }, [forceTheme]);

  const handleTiltMove = (e: React.PointerEvent<HTMLElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotY = (px - 0.5) * 10;
    const rotX = (0.5 - py) * 8;
    card.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
    card.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
    card.style.transform = `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
  };

  const handleTiltLeave = (e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  };

  const hybridArtifacts = [
    {
      icon: Tractor,
      asset: "/assets/3d/agtech-drone.webp",
      alt: t("artifact1Alt"),
      tag: t("artifact1Tag"),
      title: t("artifact1Title"),
      desc: t("artifact1Desc"),
    },
    {
      icon: Smartphone,
      asset: "/assets/3d/sqlite-vault.webp",
      alt: t("artifact2Alt"),
      tag: t("artifact2Tag"),
      title: t("artifact2Title"),
      desc: t("artifact2Desc"),
    },
    {
      icon: Shield,
      asset: "/assets/3d/zero-trust-shield.webp",
      alt: t("artifact3Alt"),
      tag: t("artifact3Tag"),
      title: t("artifact3Title"),
      desc: t("artifact3Desc"),
    },
    {
      icon: TrendingUp,
      asset: "/assets/3d/kelly-chronometer.webp",
      alt: t("artifact4Alt"),
      tag: t("artifact4Tag"),
      title: t("artifact4Title"),
      desc: t("artifact4Desc"),
    },
  ];

  return (
    <main id="contenido" className="min-h-screen selection:bg-emerald-500/30 selection:text-white">
      {/* 1. HERO SECTION CINEMÁTICO (VIDEO LOOP 6S + ESCENA 3D + VIÑETA PERIMETRAL) */}
      <HeroSection />

      {/* 2. MOTOR SCROLLYTELLING <CANVAS> DE 240 FOTOGRAMAS */}
      <OrbitalDiveSequence />

      {/* 3. EL FACTOR HÍBRIDO · 4 ACTIVOS 3D FLOTANTES */}
      <section
        id="sobre-mi"
        className="artifacts"
        data-section="artifacts"
        aria-labelledby="artefactos-title"
      >
        <div className="particles" data-particles aria-hidden="true" />
        <div className="section-inner">
          <div className="mb-12 text-center sm:text-left">
            <span className="font-mono text-xs text-emerald-400 font-semibold uppercase tracking-widest block mb-2">
              {t("artifactsTag")}
            </span>
            <h2 id="artefactos-title" className="section-title mb-0" data-reveal>
              {t("artifactsTitle")}
            </h2>
          </div>

          <div className="artifact-grid">
            {hybridArtifacts.map((item, i) => (
              <article
                key={i}
                className="artifact-card group relative"
                data-tilt
                onPointerMove={handleTiltMove}
                onPointerLeave={handleTiltLeave}
              >
                {/* Mechanical Corner Brackets */}
                <span className="card-bracket card-bracket--tl" aria-hidden="true" />
                <span className="card-bracket card-bracket--tr" aria-hidden="true" />
                <span className="card-bracket card-bracket--bl" aria-hidden="true" />
                <span className="card-bracket card-bracket--br" aria-hidden="true" />

                <div className="artifact-stage">
                  <img
                    data-float
                    src={item.asset}
                    alt={item.alt}
                    width={1000}
                    height={1000}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-cyan-500/10 border border-emerald-500/40 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.4),0_0_12px_rgba(52,211,153,0.25)] group-hover:border-emerald-400 group-hover:shadow-[0_0_20px_rgba(52,211,153,0.45)] group-hover:scale-105 transition-all duration-300">
                    <item.icon className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" />
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/40 border border-emerald-500/30 font-mono text-[10px] font-bold tracking-wider text-emerald-300 uppercase shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{item.tag}</span>
                  </div>
                </div>
                <h3 className="artifact-name">{item.title}</h3>
                <p className="artifact-copy">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SHOWCASE EDITORIAL VERTICAL DE PROYECTOS PRINCIPALES & LABS */}
      <ProjectsShowcase />

      {/* 5. DIGITAL STORE & BOILERPLATES (GUMROAD) */}
      <DeveloperStore />

      {/* 6. SERVICIOS Y PRICING B2B */}
      <ServicesSection />

      {/* 7. PRUEBA DE CONFIANZA & ESTUDIO CORPORATIVO ARBIZU LABS */}
      <section className="orbital-section py-20 sm:py-28">
        <div className="section-inner">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
            {/* Columna Izquierda: Formación Técnica Formal Verificable */}
            <div className="p-8 rounded-3xl bg-black/60 border border-white/10 flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs text-emerald-400 font-semibold uppercase tracking-widest block mb-2">
                  {isEs ? "// ANTECEDENTES & EDUCACIÓN" : "// BACKGROUND & CREDENTIALS"}
                </span>
                <h2 className="text-2xl sm:text-3xl font-sans font-bold text-white mb-6">
                  {isEs
                    ? "Formación técnica y certificaciones reales."
                    : "Technical background & verified credentials."}
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      org: "Coderhouse (2026)",
                      title: isEs
                        ? "Especialización Mobile React Native (CLI/Expo)"
                        : "React Native Mobile Specialization (CLI/Expo)",
                    },
                    {
                      org: "UNGS (2025)",
                      title: isEs
                        ? "Diplomatura en Gestión de la Ciberseguridad"
                        : "University Diploma in Cybersecurity Management",
                    },
                    {
                      org: "EAS Del Valle (2011)",
                      title: isEs
                        ? "Técnico en Producción Agropecuaria"
                        : "Agricultural Production Technician",
                    },
                    {
                      org: isEs ? "Licencias Oficiales" : "Official Licenses",
                      title: isEs
                        ? "Mapeo con Drones · Buenas Prácticas Agrícolas (BPA) · Manejo de Plagas"
                        : "Drone Mapping · Good Agricultural Practices (GAP) · Integrated Pest Management",
                    },
                  ].map((b, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-4 rounded-xl bg-black/80 border border-white/10"
                    >
                      <Award className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-mono text-xs text-emerald-400 font-bold">{b.org}</div>
                        <div className="font-sans text-sm text-white font-medium">{b.title}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-6 border-t border-white/10 mt-6 flex items-center gap-2 text-xs font-mono text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>
                  {isEs
                    ? "Titulación y certificaciones auditables."
                    : "Auditable degrees and certifications."}
                </span>
              </div>
            </div>

            {/* Columna Derecha: Presentación Oficial de Arbizu Labs */}
            <div className="p-8 rounded-3xl bg-black/60 border border-emerald-500/30 flex flex-col justify-between relative overflow-hidden shadow-2xl">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 font-bold uppercase">
                    <Building2 className="w-4 h-4 text-emerald-400" />
                    <span>
                      {isEs ? "ESTUDIO CORPORATIVO // ARBIZU LABS" : "CORPORATE STUDIO // ARBIZU LABS"}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-bold">
                    SOFTWARE HOUSE
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-sans font-bold text-white mb-4">Arbizu Labs</h3>

                <p className="font-sans text-sm text-slate-300 leading-relaxed mb-6">
                  {isEs ? (
                    <>
                      <strong className="text-white">Arbizu Labs</strong> es mi estudio de software y consultoría
                      técnica corporativa, especializado en el diseño y construcción de arquitecturas críticas:
                      aplicaciones móviles Offline-First, automatización de flujos con agentes de IA y sistemas que
                      no fallan en entornos hostiles.
                    </>
                  ) : (
                    <>
                      <strong className="text-white">Arbizu Labs</strong> is my corporate software studio and
                      technical consultancy, specialized in designing and building mission-critical architectures:
                      Offline-First mobile apps, AI-agent automations, and resilient systems built to withstand
                      extreme environments.
                    </>
                  )}
                </p>

                <div className="space-y-2.5 mb-8">
                  {[
                    isEs
                      ? "Desarrollo de software a medida para empresas y productores."
                      : "Custom software development for enterprise and agricultural operations.",
                    isEs
                      ? "Arquitectura de datos resiliente con persistencia local y sincronización en la nube."
                      : "Resilient data architecture with local persistence and asynchronous cloud sync.",
                    isEs
                      ? "Auditoría técnica, seguridad móvil y automatizaciones n8n."
                      : "Technical audit, mobile app security, and n8n workflow automations.",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs font-sans text-slate-300">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href="https://arbizulabs.com"
                target="_blank"
                rel="noopener noreferrer"
                data-magnetic
                className="btn-magnetic w-full"
              >
                <span className="btn-label">
                  <span>{isEs ? "Conoce Más en ArbizuLabs.com" : "Learn More at ArbizuLabs.com"}</span>
                  <ExternalLink className="w-4 h-4" />
                </span>
                <span className="btn-glow" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER MONUMENTAL CON COPY-TO-CLIPBOARD Y RELOJ UTC-3 */}
      <MonumentalFooter />
    </main>
  );
}
