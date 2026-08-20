"use client";

import HeroSection from "@/components/HeroSection";
import { ProjectsShowcase } from "@/components/ProjectsShowcase";
import DeveloperStore from "@/components/sections/DeveloperStore";
import ServicesSection from "@/components/ServicesSection";
import { MonumentalFooter } from "@/components/ui/MonumentalFooter";
import { Tractor, Smartphone, Shield, TrendingUp, Award, ExternalLink, Building2, CheckCircle2 } from "lucide-react";
import { useLocale } from "next-intl";

export default function LocalizedHome() {
  const locale = useLocale();
  const isEs = locale === "es";

  return (
    <main className="min-h-screen bg-orbital-bg text-slate-200 selection:bg-emerald-500/30 selection:text-white">
      {/* 1. HERO SECTION CON 3D PROCEDURAL "NÚCLEO AGTECH RESILIENTE" */}
      <HeroSection />

      {/* 2. EL FACTOR HÍBRIDO (BENTO GRID) */}
      <section id="sobre-mi" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-b border-white/10 max-w-7xl mx-auto">
        <div className="mb-16 text-center sm:text-left">
          <span className="font-mono text-xs text-emerald-400 font-semibold uppercase tracking-widest block mb-2">
            {isEs ? "// VENTAJA COMPETITIVA (THE HYBRID EDGE)" : "// COMPETITIVE ADVANTAGE (THE HYBRID EDGE)"}
          </span>
          <h2 className="text-3xl sm:text-5xl font-sans font-bold text-white tracking-tight">
            {isEs ? "La convergencia de cuatro mundos." : "The convergence of four worlds."}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Tractor,
              tag: isEs ? "EAS Del Valle (2011) · Drones & BPA" : "EAS Del Valle (2011) · Drones & GAP",
              title: isEs ? "AgTech & Campo Real" : "AgTech & Real Field",
              desc: isEs
                ? "Conocimiento de tambo, inseminación y manejo agronómico en primera persona. Traduzco variables agrícolas a software sin intermediarios."
                : "First-hand experience in livestock, genetics, and agronomic management. I translate field variables directly into resilient software.",
              color: "emerald",
            },
            {
              icon: Smartphone,
              tag: "React Native · SQLite WAL",
              title: isEs ? "Mobile Offline-First" : "Mobile Offline-First",
              desc: isEs
                ? "Apps con persistencia local y sincronización asíncrona. La falta de red en zonas rurales no es un bug: es la regla de diseño."
                : "Apps built with local persistence and asynchronous sync. Zero connectivity in remote areas is not a bug: it's the core design rule.",
              color: "emerald",
            },
            {
              icon: Shield,
              tag: isEs ? "Diplomatura UNGS · Cero Confianza" : "UNGS Diploma · Zero Trust",
              title: isEs ? "Ciberseguridad" : "Cybersecurity",
              desc: isEs
                ? "De la seguridad física al código. Cifrado asimétrico, control de coordenadas GPS y protección estricta de endpoints bajo OWASP MASVS."
                : "From physical security to resilient code. Asymmetric encryption, GPS coordinate integrity, and OWASP MASVS endpoint defense.",
              color: "amber",
            },
            {
              icon: TrendingUp,
              tag: isEs ? "+15% Ventas · 0% Desvío Arqueos" : "+15% Sales · 0% Cash Discrepancy",
              title: isEs ? "Acero Comercial" : "Commercial Backbone",
              desc: isEs
                ? "Gestión de inventarios de +800 ítems y liderazgo de ventas. Foco absoluto en soluciones que optimizan costos o aumentan el PnL."
                : "Inventory management of +800 SKUs and sales leadership. Laser focus on architectures that cut operational costs and grow PnL.",
              color: "emerald",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-6 sm:p-8 rounded-2xl bg-black/60 border border-white/10 hover:border-emerald-500/40 transition-all group flex flex-col"
            >
              <div className="w-12 h-12 rounded-xl bg-black/80 border border-white/15 text-emerald-400 flex items-center justify-center mb-6 group-hover:border-emerald-500/40 transition-colors">
                <item.icon className="w-6 h-6" />
              </div>
              <span className="font-mono text-[10px] text-emerald-400 font-semibold uppercase tracking-wider mb-2">
                {item.tag}
              </span>
              <h3 className="text-xl font-sans font-bold text-white mb-3">{item.title}</h3>
              <p className="text-slate-300 text-xs sm:text-sm font-sans leading-relaxed mt-auto">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SHOWCASE EDITORIAL VERTICAL DE PROYECTOS PRINCIPALES & LABS */}
      <ProjectsShowcase />

      {/* 4. DIGITAL STORE & BOILERPLATES (GUMROAD) */}
      <DeveloperStore />

      {/* 5. SERVICIOS Y PRICING B2B */}
      <ServicesSection />

      {/* 6. PRUEBA DE CONFIANZA & ESTUDIO CORPORATIVO ARBIZU LABS */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-b border-white/10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
          {/* Columna Izquierda: Formación Técnica Formal Verificable */}
          <div className="p-8 rounded-3xl bg-black/60 border border-white/10 flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs text-emerald-400 font-semibold uppercase tracking-widest block mb-2">
                {isEs ? "// ANTECEDENTES & EDUCACIÓN" : "// BACKGROUND & CREDENTIALS"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-sans font-bold text-white mb-6">
                {isEs ? "Formación técnica y certificaciones reales." : "Technical background & verified credentials."}
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
                    title: isEs ? "Técnico en Producción Agropecuaria" : "Agricultural Production Technician",
                  },
                  {
                    org: isEs ? "Licencias Oficiales" : "Official Licenses",
                    title: isEs
                      ? "Mapeo con Drones · Buenas Prácticas Agrícolas (BPA) · Manejo de Plagas"
                      : "Drone Mapping · Good Agricultural Practices (GAP) · Integrated Pest Management",
                  },
                ].map((b, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-black/80 border border-white/10">
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
              <span>{isEs ? "Titulación y certificaciones auditables." : "Auditable degrees and certifications."}</span>
            </div>
          </div>

          {/* Columna Derecha: Presentación Oficial de Arbizu Labs */}
          <div className="p-8 rounded-3xl bg-black/60 border border-emerald-500/30 flex flex-col justify-between relative overflow-hidden shadow-2xl">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 font-bold uppercase">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <span>{isEs ? "ESTUDIO CORPORATIVO // ARBIZU LABS" : "CORPORATE STUDIO // ARBIZU LABS"}</span>
                </div>
                <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-bold">
                  SOFTWARE HOUSE
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-sans font-bold text-white mb-4">Arbizu Labs</h3>

              <p className="font-sans text-sm text-slate-300 leading-relaxed mb-6">
                {isEs ? (
                  <>
                    <strong className="text-white">Arbizu Labs</strong> es mi estudio de software y consultoría técnica
                    corporativa, especializado en el diseño y construcción de arquitecturas críticas: aplicaciones
                    móviles Offline-First, automatización de flujos con agentes de IA y sistemas que no fallan en
                    entornos hostiles.
                  </>
                ) : (
                  <>
                    <strong className="text-white">Arbizu Labs</strong> is my corporate software studio and technical
                    consultancy, specialized in designing and building mission-critical architectures: Offline-First
                    mobile apps, AI-agent automations, and resilient systems built to withstand extreme environments.
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
              className="inline-flex items-center justify-center gap-2 w-full py-4 px-6 rounded-xl bg-emerald-400 text-slate-950 font-mono text-xs font-bold hover:bg-emerald-300 transition-colors shadow-[0_0_20px_rgba(52,211,153,0.3)]"
            >
              <span>{isEs ? "Conoce Más en ArbizuLabs.com" : "Learn More at ArbizuLabs.com"}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* 7. FOOTER MONUMENTAL CON COPY-TO-CLIPBOARD Y RELOJ UTC-3 */}
      <MonumentalFooter />
    </main>
  );
}
