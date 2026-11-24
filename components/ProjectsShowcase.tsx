"use client";

import { useState } from "react";
import {
  ExternalLink,
  ShieldCheck,
  Cpu,
  Tractor,
  Activity,
  CheckCircle,
} from "lucide-react";
import { ArchitectureDiagram } from "./interactive/ArchitectureDiagram";
import { TitanFlowWidget } from "./interactive/TitanFlowWidget";
import { AgroMarketWidget } from "./interactive/AgroMarketWidget";
import { SentinelWidget } from "./interactive/SentinelWidget";
import { SreFailoverSandbox } from "./interactive/SreFailoverSandbox";
import { useLocale, useTranslations } from "next-intl";
import { ProductDynastyBadge, type DynastySystemCode } from "./ui/SovereignBrandMark";

type LabCategory = "all" | "fintech" | "agtech" | "cybersec";
type FlagshipCaseId = "titanflow" | "agromarket" | "sentinel";

export function ProjectsShowcase() {
  const locale = useLocale();
  const t = useTranslations("OrbitalUI");
  const isEs = locale === "es";
  const [activeCategory, setActiveCategory] = useState<LabCategory>("all");
  const [activeCase, setActiveCase] = useState<FlagshipCaseId>("titanflow");

  const FLAGSHIP_CASES: Record<
    FlagshipCaseId,
    {
      code: DynastySystemCode;
      title: string;
      domain: string;
      status: string;
      tagline: string;
      origin: string;
      engineering: string;
      stack: string[];
      href: string;
      cta: string;
      metricNote: string;
      imgSrc: string;
      imgFallback: string;
      ventana2Src?: string;
      slotAttr: string;
      imgCaption: string;
    }
  > = {
    titanflow: {
      code: "SYS-01",
      title: "TitanFlow",
      domain: isEs ? "Trading Cuantitativo & Mitigación de Riesgo" : "Quantitative Trading & Risk Containment",
      status: isEs ? "EN PRODUCCIÓN · CAPITAL REAL" : "LIVE · REAL CAPITAL",
      tagline: isEs
        ? "Motor algorítmico en Binance Futures con gestión determinista de riesgo y telemetría SRE sub-10ms."
        : "Algorithmic Binance Futures execution engine with deterministic risk containment and sub-10ms telemetry.",
      origin: isEs
        ? "Creé TitanFlow para eliminar la fricción emocional humana del trading y delegar cada entrada, toma de ganancia y stop de protección en invariantes matemáticos verificables."
        : "Built to remove human emotional friction entirely and delegate execution, risk containment, and trailing exits to deterministic invariants.",
      engineering: isEs
        ? "Ejecución 24/7 por WebSockets concurrentes, persistencia SQLite WAL, validación Pessimistic SL-First y Hard Cap estricto de 1.50% de riesgo por operación."
        : "24/7 concurrent WebSocket execution, SQLite WAL persistence, Pessimistic SL-First evaluation, and strict 1.50% per-trade risk cap.",
      stack: ["TypeScript", "Python", "Node.js", "Binance Futures API", "SQLite WAL"],
      href: "https://titanflow.aldoarbizu.com",
      cta: isEs ? "Abrir Showcase SRE" : "Open SRE Showcase",
      metricNote: isEs ? "0% interferencia emocional" : "0% emotional override",
      imgSrc: "/assets/brand-v2/aldo-case-quant-sre.webp",
      imgFallback: "/assets/brand-v2/titan-sre-minimal.webp",
      slotAttr: "aldo-case-quant-sre",
      imgCaption: "INFRAESTRUCTURA BARE-METAL // HETZNER SRE",
    },
    agromarket: {
      code: "SYS-03",
      title: "AgroMarket Pro",
      domain: isEs ? "Logística Agropecuaria & Acopio Offline" : "Field AgTech & Offline Weighing",
      status: isEs ? "EN PRODUCCIÓN · 8 MÓDULOS" : "LIVE · 8 MODULES",
      tagline: isEs
        ? "Suite AgTech Offline-First para manga ganadera BLE, silobolsas, fletes AgroPool y auditorías FLIR."
        : "Offline-First AgTech suite for BLE livestock chutes, silo monitoring, freight pooling, and FLIR audits.",
      origin: isEs
        ? "Diseñada desde la experiencia real de la manga y el acopio rural, donde las aplicaciones cloud se congelan bajo el sol, el polvo y la ausencia total de cobertura 4G."
        : "Engineered from real chute and weighbridge workflows where cloud-only apps lock up under harsh sunlight and zero cellular coverage.",
      engineering: isEs
        ? "Interfaz Daylight Field 18.4:1 AAA con cola criptográfica local SQLite WAL, cálculo de márgenes por lote, sincronización diferida y cumplimiento SENASA 2026."
        : "High-contrast Daylight Field interface backed by SQLite WAL local queue, field margin computation, delayed sync, and traceability compliance.",
      stack: ["React Native", "Capacitor", "SQLite WAL", "FLIR Thermal", "BLE Chute"],
      href: "https://agromarket.aldoarbizu.com",
      cta: isEs ? "Abrir AgroMarket Pro" : "Open AgroMarket Pro",
      metricNote: isEs ? "8 módulos operativos offline" : "8 active offline modules",
      imgSrc: "/assets/brand-v2/aldo-case-agtech-field.webp",
      imgFallback: "/assets/brand-v2/aldo-craft-four-worlds.webp",
      slotAttr: "aldo-case-agtech-field",
      imgCaption: "TELEMETRÍA DE CAMPO // SILOBOLSAS & ACOPIO",
    },
    sentinel: {
      code: "SYS-02",
      title: "Sentinel OS",
      domain: isEs ? "Seguridad Defensiva & Rondas NFC Offline" : "Defensive Security & NFC Rounds",
      status: isEs ? "OFFLINE-FIRST · ZERO-TRUST" : "OFFLINE-FIRST · ZERO-TRUST",
      tagline: isEs
        ? "Despacho táctico multi-tenant y bitácora criptográfica inmutable para perímetros industriales sin señal."
        : "Multi-tenant physical security dispatch and tamper-proof cryptographic patrol logs in dead zones.",
      origin: isEs
        ? "Resuelve la clonación de checkpoints y pérdida de partes en plantas y depósitos alejados sin cobertura móvil mediante hardware NFC y persistencia local inmutable."
        : "Eliminates checkpoint spoofing and lost shift logs in dead-zone facilities using physical NFC tags and immutable local persistence.",
      engineering: isEs
        ? "Cadena Merkle y firmas HMAC-SHA256 encoladas en SQLite WAL cifrado, pánico silencioso anti-coacción y aislamiento Supabase RLS 60/60."
        : "Merkle hash chaining and HMAC-SHA256 logs queued in encrypted SQLite WAL, silent duress alert, and 60/60 RLS tenant isolation.",
      stack: ["React Native", "Expo EAS", "SQLite WAL", "HMAC-SHA256", "RLS 60/60"],
      href: "https://sentinelos.aldoarbizu.com",
      cta: isEs ? "Ver Plataforma SentinelOS" : "Open SentinelOS",
      metricNote: isEs ? "100% trazabilidad sin red" : "100% logs preserved offline",
      imgSrc: "/assets/brand-v2/sentinel-night-patrol.webp",
      imgFallback: "/assets/brand-v2/sentinel-night-patrol.webp",
      slotAttr: "lote-d1-sentinel-night-patrol",
      imgCaption: "OPERACIÓN NOCTURNA // PERÍMETRO & NFC",
    },
  };

  const AUX_PROJECTS = [
    {
      id: "nomad",
      category: "agtech" as const,
      domain: isEs ? "Off-Grid & Resiliencia" : "Off-Grid & Resilience",
      badge: "OMEGA v2.4",
      title: "NOMAD Tactical Hub",
      desc: isEs
        ? "Suite humanitaria offline: mapas vectoriales sin red, módem radio AFSK/Morse 800Hz, LoRa Meshtastic y bóveda USB Ark."
        : "Offline humanitarian suite: zero-network vector maps, AFSK/Morse radio modem, LoRa Meshtastic, and PAR2 USB vault.",
      tags: ["Kotlin", "Compose", "Room SQLite", "LoRa"],
      href: "https://nomadhub.aldoarbizu.com/",
      cta: isEs ? "Abrir NOMAD" : "Open NOMAD",
    },
    {
      id: "aeroshot",
      category: "agtech" as const,
      domain: "Agro Drones & GIS",
      badge: "SERVICIO $60K ARS",
      title: "AeroShot Drones",
      desc: isEs
        ? "Relevamiento aéreo 4K multiespectral, peritaje de siniestros agropecuarios y cartografía en Bolívar y la región."
        : "4K multispectral drone surveys, crop loss appraisal, and geospatial mapping in central Buenos Aires.",
      tags: ["GIS", "DJI Telemetry", "NDVI"],
      href: "https://aeroshot.aldoarbizu.com",
      cta: isEs ? "Explorar Servicio" : "Explore Service",
    },
    {
      id: "aureus",
      category: "fintech" as const,
      domain: "DeFi & Wealth OS",
      badge: "LIVE ERP",
      title: "Aureus Wealth OS",
      desc: isEs
        ? "Consolidación patrimonial multimoneda, NAV en tiempo real y ejecución Web3 en Base L2 con trazabilidad auditable."
        : "Multi-currency wealth consolidation, real-time NAV, and auditable Base L2 execution.",
      tags: ["Next.js 16", "Base L2", "Supabase"],
      href: "https://aureus.aldoarbizu.com",
      cta: isEs ? "Explorar ERP" : "Explore ERP",
    },
    {
      id: "impresion3d",
      category: "cybersec" as const,
      domain: "CAD & PETG/ASA",
      badge: "AB3D-FORGE",
      title: isEs ? "Manufactura 3D Industrial" : "Industrial 3D Manufacturing",
      desc: isEs
        ? "Fabricación bajo demanda en PETG y ASA resistente a UV e impactos para gabinetes rurales, soportes VESA y kits de taller."
        : "On-demand functional parts in UV/impact-resistant PETG & ASA for field enclosures and studio rigs.",
      tags: ["PETG/ASA", "Blender CAD", "ESCROW"],
      href: "https://impresion3d.aldoarbizu.com",
      cta: isEs ? "Explorar Manufactura" : "Explore Forge",
    },
    {
      id: "ecoconnect",
      category: "agtech" as const,
      domain: isEs ? "ESG & Satelital" : "ESG & Satellite",
      badge: "SENTINEL-2",
      title: "EcoConnect ESG",
      desc: isEs
        ? "Monitoreo de cobertura forestal con telemetría satelital Sentinel-2 (NDVI) y registro verificable."
        : "Forest canopy monitoring via Sentinel-2 NDVI satellite telemetry and tamper-proof records.",
      tags: ["Next.js", "Sentinel-2", "Base L2"],
      href: "https://ecoconnect.aldoarbizu.com",
      cta: isEs ? "Explorar Telemetría" : "Explore Telemetry",
    },
    {
      id: "habitat",
      category: "fintech" as const,
      domain: "PropTech & Web3",
      badge: "BASE L2 ESCROW",
      title: "Hábitat Smart Lease",
      desc: isEs
        ? "Generador descentralizado de contratos y depósito en garantía programable sobre Base L2."
        : "Decentralized smart lease generator and programmable escrow on Base L2.",
      tags: ["Solidity", "Base L2", "Next.js"],
      href: "https://habitat.aldoarbizu.com",
      cta: isEs ? "Explorar Smart Lease" : "Explore Smart Lease",
    },
  ];

  const filteredAuxProjects =
    activeCategory === "all"
      ? AUX_PROJECTS
      : AUX_PROJECTS.filter((p) => p.category === activeCategory);

  const currentCase = FLAGSHIP_CASES[activeCase];

  return (
    <section id="proyectos" className="py-10 sm:py-12 bg-[#060709]" data-section="depth">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* KPIs Reales Inmediatos (Cero 0 congelados) */}
        <dl className="grid grid-cols-2 lg:grid-cols-4 border border-[#1B202B] bg-[#0B0D12]">
          <div className="p-3.5 border-b lg:border-b-0 border-r border-[#1B202B]">
            <dt className="font-mono text-[10px] uppercase tracking-wider text-[#8A93A6] mb-1">
              {t("depthStat1Label")}
            </dt>
            <dd className="font-mono text-2xl sm:text-3xl font-extrabold text-[#F6F7F9] tabular-nums">
              10.000 <span className="text-xs font-semibold text-[#D4AF37]">{t("depthStat1Unit")}</span>
            </dd>
          </div>
          <div className="p-3.5 border-b lg:border-b-0 lg:border-r border-[#1B202B]">
            <dt className="font-mono text-[10px] uppercase tracking-wider text-[#8A93A6] mb-1">
              {t("depthStat2Label")}
            </dt>
            <dd className="font-mono text-2xl sm:text-3xl font-extrabold text-[#F6F7F9] tabular-nums">
              14 <span className="text-xs font-semibold text-[#D4AF37]">{t("depthStat2Unit")}</span>
            </dd>
          </div>
          <div className="p-3.5 border-r border-[#1B202B]">
            <dt className="font-mono text-[10px] uppercase tracking-wider text-[#8A93A6] mb-1">
              {t("depthStat3Label")}
            </dt>
            <dd className="font-mono text-2xl sm:text-3xl font-extrabold text-[#F6F7F9] tabular-nums">
              800 <span className="text-xs font-semibold text-[#D4AF37]">{t("depthStat3Unit")}</span>
            </dd>
          </div>
          <div className="p-3.5">
            <dt className="font-mono text-[10px] uppercase tracking-wider text-[#8A93A6] mb-1">
              {t("depthStat4Label")}
            </dt>
            <dd className="font-mono text-2xl sm:text-3xl font-extrabold text-[#F6F7F9] tabular-nums">
              8 <span className="text-xs font-semibold text-[#D4AF37]">{t("depthStat4Unit")}</span>
            </dd>
          </div>
        </dl>

        {/* Encabezado + Selector de los 3 Casos Insignia */}
        <div>
          <div className="mb-5 flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[#1B202B] pb-4">
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[#D4AF37] mb-2">
                <Activity className="w-3.5 h-3.5 text-[#D4AF37]" strokeWidth={1.5} />
                <span>{isEs ? "CASOS EN PRODUCCIÓN" : "PRODUCTION CASE STUDIES"}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-sans font-bold text-[#F6F7F9] tracking-tight">
                {isEs ? "Software nacido de la experiencia real, no del escritorio." : "Software born from real-world adversity."}
              </h2>
            </div>

            <div className="flex flex-wrap gap-2" role="tablist" aria-label={isEs ? "Casos principales" : "Flagship cases"}>
              {(
                [
                  { id: "titanflow", label: "TitanFlow Quant", code: "SYS-01" as DynastySystemCode },
                  { id: "agromarket", label: "AgroMarket Pro", code: "SYS-03" as DynastySystemCode },
                  { id: "sentinel", label: "Sentinel OS", code: "SYS-02" as DynastySystemCode },
                ] as const
              ).map((item) => {
                const selected = activeCase === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActiveCase(item.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 min-h-[40px] rounded-[2px] border font-mono text-xs font-bold transition-colors cursor-pointer ${
                      selected
                        ? "bg-[#D4AF37] text-[#060709] border-[#D4AF37]"
                        : "bg-[#0B0D12] text-[#C2C8D4] border-[#1B202B] hover:border-[#D4AF37]"
                    }`}
                  >
                    <ProductDynastyBadge code={item.code} className="w-5 h-5 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ficha Única Activa (Cero vacíos ocultos con opacity: 0) */}
          <article className="p-5 rounded-[2px] bg-[#0B0D12] border border-[#1B202B]">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-[#1B202B]">
              <div className="flex items-center gap-3">
                <ProductDynastyBadge code={currentCase.code} className="w-8 h-8 shrink-0" />
                <div>
                  <div className="font-mono text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
                    {currentCase.code} · {currentCase.domain}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-sans font-bold text-[#F6F7F9]">{currentCase.title}</h3>
                </div>
              </div>
              <span className="px-3 py-1 rounded-[2px] bg-[#060709] border border-[#1B202B] font-mono text-[10px] font-semibold text-[#D4AF37]">
                {currentCase.status}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-6 space-y-3.5">
                <p className="font-mono text-xs text-[#D4AF37] font-medium leading-relaxed">{currentCase.tagline}</p>

                <figure className="border border-[#1B202B] bg-[#060709] overflow-hidden" data-slot={currentCase.slotAttr}>
                  <img
                    src={currentCase.imgSrc}
                    data-ventana2-src={currentCase.ventana2Src}
                    alt={currentCase.title}
                    className="w-full aspect-[21/9] max-h-[200px] object-cover block"
                    loading="lazy"
                  />
                  <figcaption className="px-3 py-2 border-t border-[#1B202B] font-mono text-[10px] text-[#8A93A6] uppercase tracking-wider">
                    {currentCase.imgCaption}
                  </figcaption>
                </figure>

                <div className="p-4 rounded-[2px] bg-[#060709] border-l-2 border-[#D4AF37] border border-[#1B202B]">
                  <p className="text-[#C2C8D4] font-sans text-xs sm:text-sm leading-relaxed">{currentCase.origin}</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 font-mono text-xs text-[#F6F7F9] font-semibold uppercase">
                    {activeCase === "titanflow" ? (
                      <Cpu className="w-4 h-4 text-[#D4AF37]" />
                    ) : activeCase === "agromarket" ? (
                      <Tractor className="w-4 h-4 text-[#D4AF37]" />
                    ) : (
                      <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                    )}
                    <span>{isEs ? "Arquitectura en Producción" : "Production Architecture"}</span>
                  </div>
                  <p className="text-[#C2C8D4] font-sans text-xs sm:text-sm leading-relaxed">{currentCase.engineering}</p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {currentCase.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-[2px] bg-[#060709] border border-[#1B202B] font-mono text-[11px] text-[#C2C8D4]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="pt-2 flex flex-wrap gap-4 items-center">
                  <a
                    href={currentCase.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-[2px] bg-[#D4AF37] hover:bg-[#F2F0EA] text-[#060709] font-mono text-xs font-extrabold uppercase tracking-wider transition-colors"
                  >
                    <span>{currentCase.cta}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <span className="font-mono text-xs text-[#8A93A6] inline-flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                    {currentCase.metricNote}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-4">
                {activeCase === "titanflow" && <TitanFlowWidget />}
                {activeCase === "agromarket" && <AgroMarketWidget />}
                {activeCase === "sentinel" && <SentinelWidget />}
                <ArchitectureDiagram
                  systemId={activeCase === "titanflow" ? "titanflow" : activeCase === "agromarket" ? "agromarket" : "sentinel"}
                />
              </div>
            </div>
          </article>
        </div>

        {/* Grilla Compacta de Sistemas Auxiliares */}
        <div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-4 pb-3 border-b border-[#1B202B]">
            <div>
              <span className="font-mono text-[11px] text-[#D4AF37] font-semibold uppercase tracking-[0.14em] block mb-1">
                {isEs ? "ECOSISTEMA & HERRAMIENTAS DE CAMPO" : "ECOSYSTEM & FIELD SYSTEMS"}
              </span>
              <h3 className="text-xl sm:text-2xl font-sans font-bold text-[#F6F7F9]">
                {isEs ? "Otros desarrollos especializados" : "Additional specialized systems"}
              </h3>
            </div>

            <div role="tablist" aria-label={isEs ? "Filtrar por arquitectura" : "Filter"} className="flex flex-wrap gap-1.5">
              {(
                [
                  { id: "all", label: isEs ? "Todos (6)" : "All (6)" },
                  { id: "fintech", label: "FinTech" },
                  { id: "agtech", label: "AgTech / Off-Grid" },
                  { id: "cybersec", label: "3D & Hardware" },
                ] as const
              ).map((tab) => {
                const active = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveCategory(tab.id)}
                    className={`px-3 py-1.5 rounded-[2px] font-mono text-xs font-bold border transition-colors cursor-pointer ${
                      active
                        ? "bg-[#D4AF37] text-[#060709] border-[#D4AF37]"
                        : "bg-[#0B0D12] text-[#C2C8D4] border-[#1B202B] hover:border-[#D4AF37]"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredAuxProjects.map((proj) => (
              <div
                key={proj.id}
                className="p-4 rounded-[2px] bg-[#0B0D12] border border-[#1B202B] hover:border-[#D4AF37] transition-colors flex flex-col justify-between gap-2.5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <ProductDynastyBadge
                        code={
                          ({
                            aeroshot: "SYS-07",
                            impresion3d: "SYS-08",
                            ecoconnect: "SYS-10",
                            aureus: "SYS-11",
                            habitat: "SYS-09",
                            nomad: "SYS-04",
                          } as Record<string, DynastySystemCode>)[proj.id] ?? "SYS-04"
                        }
                        className="w-6 h-6 shrink-0"
                      />
                      <span className="font-mono text-[10px] uppercase font-bold text-[#D4AF37]">{proj.domain}</span>
                    </div>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded-[2px] border border-[#1B202B] bg-[#060709] text-[#C2C8D4]">
                      {proj.badge}
                    </span>
                  </div>
                  <h4 className="text-lg font-sans font-bold text-[#F6F7F9] mb-1">{proj.title}</h4>
                  <p className="font-sans text-xs text-[#C2C8D4] leading-relaxed mb-2.5">{proj.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {proj.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-[2px] bg-[#060709] border border-[#1B202B] text-[10px] font-mono text-[#8A93A6]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <a
                  href={proj.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 py-2 min-h-[36px] rounded-[2px] bg-[#060709] border border-[#2A3140] hover:border-[#D4AF37] hover:text-[#D4AF37] text-xs font-mono font-bold text-[#F2F0EA] transition-colors"
                >
                  <span>{proj.cta}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Simulador SRE Compacto */}
        <div className="p-5 rounded-[2px] bg-[#0B0D12] border border-[#1B202B]">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-[#1B202B]">
            <div>
              <span className="font-mono text-[11px] text-[#D4AF37] font-bold uppercase tracking-wider block mb-1">
                SRE FAILOVER SANDBOX
              </span>
              <h3 className="text-xl sm:text-2xl font-sans font-bold text-[#F6F7F9]">
                {isEs ? "Simulador de Resiliencia & Failover L7" : "Live SRE Resiliency & Failover Sandbox"}
              </h3>
            </div>
            <span className="px-3 py-1 rounded-[2px] bg-[#060709] border border-[#1B202B] font-mono text-[10px] font-semibold text-[#D4AF37]">
              ZERO-DOWNTIME ROUTING
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <div className="lg:col-span-6">
              <SreFailoverSandbox />
            </div>
            <div className="lg:col-span-6 space-y-3">
              <ArchitectureDiagram systemId="nexus-sre" />
              <p className="p-3 rounded-[2px] bg-[#060709] border border-[#1B202B] text-[#C2C8D4] font-sans text-xs leading-relaxed">
                {isEs
                  ? "En producción, las anomalías son detectadas por el Watchdog Autónomo y reencaminadas en Capa 7 con rollback determinista en menos de 60 segundos."
                  : "In production, anomalies trigger autonomous Watchdog detection and Layer-7 rerouting with deterministic rollback in under 60 seconds."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
