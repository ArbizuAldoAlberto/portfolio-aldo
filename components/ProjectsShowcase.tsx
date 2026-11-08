"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ExternalLink,
  ShieldCheck,
  Cpu,
  Tractor,
  Quote,
  Activity,
  CheckCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { ArchitectureDiagram } from "./interactive/ArchitectureDiagram";
import { TitanFlowWidget } from "./interactive/TitanFlowWidget";
import { AgroMarketWidget } from "./interactive/AgroMarketWidget";
import { SentinelWidget } from "./interactive/SentinelWidget";
import { SreFailoverSandbox } from "./interactive/SreFailoverSandbox";
import { soundEngine } from "./system/SoundEngine";
import { useTacticalAudio } from "./audio/useTacticalAudio";
import { useLocale, useTranslations } from "next-intl";

type LabCategory = "all" | "fintech" | "agtech" | "cybersec";

export function ProjectsShowcase() {
  const locale = useLocale();
  const t = useTranslations("OrbitalUI");
  const isEs = locale === "es";
  const [activeCategory, setActiveCategory] = useState<LabCategory>("all");
  const { playHoverTick, playModeSwitch } = useTacticalAudio();

  const handleCardPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x.toFixed(0)}px`);
    card.style.setProperty("--mouse-y", `${y.toFixed(0)}px`);
  };

  const AUX_PROJECTS = [
    {
      id: "sabiobosque",
      category: "cybersec" as const,
      domain: isEs ? "E-Commerce & AI Legal" : "E-Commerce & Legal AI",
      badge: "LIVE SAAS",
      title: "SabioBosque",
      desc: isEs
        ? "Validación automatizada de stock y recetas médicas legales REPROCANN en el checkout mediante Gemini API y Universal Cart."
        : "Automated stock verification and REPROCANN medical prescription compliance validation at checkout via Gemini API.",
      tags: ["Next.js", "Zustand", "Supabase", "Gemini API"],
      href: "https://sabiobosque.aldoarbizu.com",
      cta: isEs ? "Explorar SaaS" : "Explore SaaS",
    },
    {
      id: "aeroshot",
      category: "agtech" as const,
      domain: "Agro Drones & GIS",
      badge: isEs ? "SERVICIO $60K ARS" : "SERVICE $60K ARS",
      title: "AeroShot Drones",
      desc: isEs
        ? "Relevamiento aéreo 4K multiespectral, peritaje de siniestros agropecuarios (granizo/inundación) y cartografía en Bolívar y la región."
        : "4K multispectral drone surveys, agricultural crop loss appraisal, and geospatial mapping in Bolívar and central Buenos Aires.",
      tags: ["GIS WebGL", "DJI Telemetry", "NDVI Index", "Base L2"],
      href: "https://aeroshot.aldoarbizu.com",
      cta: isEs ? "Explorar Servicio Aéreo" : "Explore Aerial Service",
    },
    {
      id: "pawhero",
      category: "cybersec" as const,
      domain: isEs ? "Web3 & Hardware 3D" : "Web3 & 3D Hardware",
      badge: "LABS PROTO",
      title: "PawHero",
      desc: isEs
        ? "Trazabilidad de mascotas con chapas QR imprimibles en 3D (STL) a costo cero y emisión de Soulbound Tokens (SBT) en Base L2 para ONGs."
        : "Pet traceability with 3D-printable QR tags (STL) and Soulbound Token (SBT) issuance on Base L2 for animal rescues.",
      tags: ["React Native", "Base L2", "Three.js", "STL 3D Print"],
      href: "https://pawhero.aldoarbizu.com",
      cta: isEs ? "Explorar Prototipo" : "Explore Prototype",
    },
    {
      id: "impresion3d",
      category: "cybersec" as const,
      domain: "Makers & Web3",
      badge: "HARDWARE PROTO",
      title: isEs ? "Impresión 3D P2P" : "P2P 3D Printing",
      desc: isEs
        ? "Plataforma de cotización instantánea de archivos STL de diseño 3D y red colaborativa de makers con escrow descentralizado."
        : "Instant 3D STL slicing quotation platform and collaborative maker network with decentralized escrow.",
      tags: ["Kotlin", "STL Slicer", "Base L2 Escrow", "Blender"],
      href: "https://impresion3d.aldoarbizu.com",
      cta: isEs ? "Explorar Proyecto" : "Explore Project",
    },
    {
      id: "ecoconnect",
      category: "agtech" as const,
      domain: isEs ? "ESG & Satelital" : "ESG & Satellite",
      badge: "LIVE TELEMETRY",
      title: "EcoConnect ESG",
      desc: isEs
        ? "Registro y monitoreo de cobertura forestal con telemetría satelital Sentinel-2 (NDVI) y certificación inmutable on-chain."
        : "Forest canopy monitoring via Sentinel-2 (NDVI) satellite telemetry and tamper-proof environmental certification.",
      tags: ["Next.js", "Sentinel-2 API", "Base L2", "Three.js"],
      href: "https://ecoconnect.aldoarbizu.com",
      cta: isEs ? "Explorar Telemetría" : "Explore Telemetry",
    },
    {
      id: "aureus",
      category: "fintech" as const,
      domain: "DeFi & Wealth OS",
      badge: "LIVE ERP",
      title: "Aureus Wealth OS",
      desc: isEs
        ? "Sistema operativo patrimonial y ERP para Family Offices. Consolidación de tesorería multimoneda, NAV en tiempo real y ejecución Web3 en Base L2."
        : "Private wealth operating system & ERP for Family Offices. Multi-currency treasury consolidation, real-time NAV, and Base L2 Web3 execution.",
      tags: ["Next.js 16", "Base L2", "WASM", "Supabase"],
      href: "https://aureus.aldoarbizu.com",
      cta: isEs ? "Explorar ERP" : "Explore ERP",
    },
    {
      id: "habitat",
      category: "fintech" as const,
      domain: "PropTech & Web3",
      badge: "BASE L2 ESCROW",
      title: "Hábitat Smart Lease",
      desc: isEs
        ? "Generador descentralizado de contratos de alquiler y escrow en Base L2. Firma criptográfica personal_sign y depósito en garantía programable."
        : "Decentralized smart lease generator and escrow on Base L2. Cryptographic personal_sign validation and programmable security deposits.",
      tags: ["Solidity", "Base L2", "Next.js", "Ethers.js"],
      href: "https://habitat.aldoarbizu.com",
      cta: isEs ? "Explorar Smart Lease" : "Explore Smart Lease",
    },
    {
      id: "nomad",
      category: "agtech" as const,
      domain: isEs ? "Táctico & Off-Grid" : "Tactical & Off-Grid",
      badge: "LORA MESH",
      title: "Nomad Tactical Hub",
      desc: isEs
        ? "Consola de campo para comunicaciones malladas LoRa off-grid, mapas topográficos vectoriales sin internet y telemetría de batería solar."
        : "Off-grid tactical field console for LoRa mesh networks, offline vector topographic mapping, and solar power telemetry.",
      tags: ["React Native", "LoRaWAN", "SQLite WAL", "Offline GIS"],
      href: "https://nomadhub.aldoarbizu.com",
      cta: isEs ? "Explorar Hub Táctico" : "Explore Tactical Hub",
    },
  ];

  const filteredAuxProjects =
    activeCategory === "all"
      ? AUX_PROJECTS
      : AUX_PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <section id="proyectos" className="depth" data-section="depth">
      <div className="section-inner">
        <dl className="stats">
          <div className="stat">
            <dt>{t("depthStat1Label")}</dt>
            <dd>
              <span data-count="10000" data-format="es">0</span>
              <span className="stat-unit">{t("depthStat1Unit")}</span>
            </dd>
          </div>
          <div className="stat">
            <dt>{t("depthStat2Label")}</dt>
            <dd>
              <span data-count="14">0</span>
              <span className="stat-unit">{t("depthStat2Unit")}</span>
            </dd>
          </div>
          <div className="stat">
            <dt>{t("depthStat3Label")}</dt>
            <dd>
              <span data-count="800">0</span>
              <span className="stat-unit">{t("depthStat3Unit")}</span>
            </dd>
          </div>
          <div className="stat">
            <dt>{t("depthStat4Label")}</dt>
            <dd>
              <span data-count="8">0</span>
              <span className="stat-unit">{t("depthStat4Unit")}</span>
            </dd>
          </div>
        </dl>

        {/* Encabezado Principal */}
        <div className="mb-20 sm:mb-28 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 font-mono text-xs text-[#D4AF37] mb-4">
            <Activity className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" strokeWidth={1.5} />
            <span>{isEs ? "PROYECTOS & CASOS DE ESTUDIO" : "PROJECTS & CASE STUDIES"}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-sans font-bold text-[#F8FAFC] tracking-tight max-w-4xl leading-[1.15]">
            {isEs
              ? "Software nacido de la experiencia real, no del escritorio."
              : "Software born from real-world adversity, not theory."}
          </h2>
          <p className="text-[#94A3B8] font-sans text-sm sm:text-base max-w-2xl mt-4 leading-relaxed">
            {isEs
              ? "Cada sistema resuelve un dolor vivido en operaciones críticas: desde la presión del capital en los mercados financieros, hasta el barro de la manga ganadera y los perímetros industriales sin cobertura."
              : "Every architecture solves a friction experienced in critical operations: from financial capital risk in quant trading, to direct livestock field operations and remote industrial perimeters."}
          </p>
        </div>

        {/* ========================================================================= */}
        {/* PROYECTO 1: TITANFLOW (EN PRODUCCIÓN - CAPITAL REAL) */}
        {/* ========================================================================= */}
        <motion.div
          data-cursor="view"
          data-cursor-label="TITANFLOW"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-28 p-6 sm:p-10 lg:p-12 rounded-2xl bg-[#070B12]/85 border border-white/[0.08] hover:border-[#D4AF37]/40 transition-all duration-500 shadow-2xl relative overflow-hidden group"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-white/[0.08] pb-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-[#D4AF37] tracking-wider">[ 01 // 03 ]</span>
              <span className="font-mono text-xs text-[#94A3B8] uppercase tracking-wider hidden sm:inline">
                {isEs ? "Trading Cuantitativo & Mitigación de Riesgo" : "Quantitative Trading & Risk Mitigation"}
              </span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 font-mono text-[11px] font-semibold text-[#D4AF37]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]" />
              </span>
              <span>{isEs ? "EN PRODUCCIÓN · OPERANDO CON CAPITAL REAL" : "IN PRODUCTION · REAL CAPITAL ACTIVE"}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            <div className="lg:col-span-6 space-y-6">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold text-[#F8FAFC] tracking-tight group-hover:text-[#D4AF37] transition-colors">
                TitanFlow
              </h3>
              <p className="font-mono text-xs text-[#D4AF37] font-medium">
                {isEs
                  ? "Bot algorítmico en Binance Futures con gestión matemática de riesgo (Criterio de Kelly & Circuit Breakers)"
                  : "Algorithmic execution engine on Binance Futures with mathematical risk modeling (Kelly Criterion & Circuit Breakers)"}
              </p>

              {/* Historia de Origen Real */}
              <div className="p-5 rounded-2xl bg-black/80 border-l-4 border-[#D4AF37] border border-white/[0.08] relative">
                <Quote className="w-6 h-6 text-[#D4AF37]/20 absolute top-4 right-4" strokeWidth={1.5} />
                <span className="font-mono text-[11px] text-[#D4AF37] uppercase tracking-wider font-semibold block mb-2">
                  {isEs ? "// EL ORIGEN REAL" : "// THE REAL ORIGIN"}
                </span>
                <p className="text-[#94A3B8] font-sans text-xs sm:text-sm leading-relaxed">
                  {isEs
                    ? "“Durante mucho tiempo operé manualmente en los mercados financieros con estrategias que me permitieron subsistir con mis ahorros. Sin embargo, al depender directamente de ese capital para vivir, la presión psicológica era desgastante. Los fallos no venían de errores en la lectura del mercado, sino de la necesidad personal de ganar. Creé TitanFlow para eliminar mis propias emociones de la ecuación y delegar la ejecución en algoritmos matemáticos estrictos.”"
                    : "“For a long time, I traded financial markets manually using strategies that supported my living expenses. However, relying directly on that capital to live created immense emotional wear. Mistakes didn't stem from market analysis, but from the personal psychological pressure to win. I created TitanFlow to eliminate human emotions entirely from the equation and delegate execution to strict mathematical algorithms.”"}
                </p>
              </div>

              {/* Solución Técnica */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 font-mono text-xs text-[#F8FAFC] font-semibold uppercase">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.2)]">
                    <Cpu className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </span>
                  <span>{isEs ? "Ingeniería & Solución Técnica" : "Engineering & Technical Architecture"}</span>
                </div>
                <p className="text-[#94A3B8] font-sans text-xs sm:text-sm leading-relaxed">
                  {isEs ? (
                    <>
                      Ejecución 24/7 sobre la API de Binance Futures mediante WebSockets concurrentes de baja latencia (14ms).
                      Dimensionamiento de lote dinámico vía <strong className="text-[#F8FAFC]">Criterio de Kelly fraccional</strong>, circuit breakers
                      automáticos que congelan operaciones ante drawdowns anormales y cálculo de probabilidades sin sesgo.
                    </>
                  ) : (
                    <>
                      24/7 execution on Binance Futures API using low-latency concurrent WebSockets (14ms). Dynamic position
                      sizing via <strong className="text-[#F8FAFC]">fractional Kelly Criterion</strong>, automated circuit breakers that freeze trades
                      during abnormal drawdowns, and unbiased mathematical execution.
                    </>
                  )}
                </p>
              </div>

              {/* Stack Tags */}
              <div className="pt-2">
                <span className="font-mono text-[10px] text-[#94A3B8] uppercase block mb-2">Stack:</span>
                <div className="flex flex-wrap gap-2">
                  {["Python", "TypeScript", "Node.js", "Binance Futures API", "Kelly Criterion", "CCXT", "Base L2"].map(
                    (tech, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/[0.08] font-mono text-[11px] text-[#F8FAFC]"
                      >
                        {tech}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* CTA */}
              <div className="pt-3 flex flex-wrap gap-4 items-center">
                <a
                  href="https://titanflow.aldoarbizu.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => {
                    soundEngine.playHover();
                    playHoverTick();
                  }}
                  onClick={() => soundEngine.playClick()}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#D4AF37] text-[#070B12] font-mono text-xs font-bold hover:bg-[#E2E8F0] shadow-[0_0_20px_rgba(212,175,55,0.28)] transition-all"
                >
                  <span>{isEs ? "Acceder a TitanFlow" : "Access TitanFlow"}</span>
                  <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
                </a>
                <span className="font-mono text-xs text-[#94A3B8] flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#D4AF37]" strokeWidth={1.5} />{" "}
                  {isEs ? "0% interferencia emocional" : "0% emotional interference"}
                </span>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <TitanFlowWidget />
              <ArchitectureDiagram systemId="titanflow" />
            </div>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* PROYECTO 2: AGROMARKET PRO (AGTECH REAL) */}
        {/* ========================================================================= */}
        <motion.div
          data-cursor="view"
          data-cursor-label="AGROMARKET"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-28 p-6 sm:p-10 lg:p-12 rounded-2xl bg-[#070B12]/85 border border-white/[0.08] hover:border-[#D4AF37]/40 transition-all duration-500 shadow-2xl relative overflow-hidden group"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-white/[0.08] pb-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-[#D4AF37] tracking-wider">[ 02 // 03 ]</span>
              <span className="font-mono text-xs text-[#94A3B8] uppercase tracking-wider hidden sm:inline">
                {isEs ? "Logística Agropecuaria & Soluciones de Manga" : "Agricultural Logistics & Livestock Solutions"}
              </span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 font-mono text-[11px] font-semibold text-[#D4AF37]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]" />
              </span>
              <span>{isEs ? "EN PRODUCCIÓN · 8 HERRAMIENTAS ACTIVAS" : "IN PRODUCTION · 8 ACTIVE TOOLS"}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            <div className="lg:col-span-6 space-y-6">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold text-[#F8FAFC] tracking-tight group-hover:text-[#D4AF37] transition-colors">
                AgroMarket Pro
              </h3>
              <p className="font-mono text-xs text-[#D4AF37] font-medium">
                {isEs
                  ? "Plataforma AgTech completa: 8 herramientas en producción para ganadería, fletes y silobolsas"
                  : "Complete AgTech platform: 8 production-grade tools for livestock, freight pooling, and silo storage"}
              </p>

              {/* Historia de Origen Real */}
              <div className="p-5 rounded-2xl bg-black/80 border-l-4 border-[#D4AF37] border border-white/[0.08] relative">
                <Quote className="w-6 h-6 text-[#D4AF37]/20 absolute top-4 right-4" strokeWidth={1.5} />
                <span className="font-mono text-[11px] text-[#D4AF37] uppercase tracking-wider font-semibold block mb-2">
                  {isEs ? "// EL ORIGEN REAL" : "// THE REAL ORIGIN"}
                </span>
                <p className="text-[#94A3B8] font-sans text-xs sm:text-sm leading-relaxed">
                  {isEs
                    ? "“Mi origen y formación siempre estuvo en el campo (EAS Del Valle). Conozco en persona el estrés de trabajar en la manga ganadera, donde todo debe ser rápido y dinámico para que los animales no se estresen ni se lastimen, y donde el software tradicional no sirve: pantallas que no se leen con el sol de frente, polvo, tierra en las manos y nula señal de internet. AgroMarket Pro nace para llevar soluciones tecnológicas prácticas a quienes trabajan en el barro.”"
                    : "“My roots and education are deeply tied to agriculture (EAS Del Valle). I know firsthand the physical stress of working in livestock chutes, where handling must be fast and dynamic so animals don't get hurt, and where generic software fails: unreadable screens under intense sunlight, dust, mud, and zero internet connectivity. AgroMarket Pro is engineered to bring practical tech to real operators in the mud.”"}
                </p>
              </div>

              {/* Solución Técnica */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 font-mono text-xs text-[#F8FAFC] font-semibold uppercase">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.2)]">
                    <Tractor className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </span>
                  <span>{isEs ? "Ingeniería & Solución de Campo" : "Engineering & Field Solution"}</span>
                </div>
                <p className="text-[#94A3B8] font-sans text-xs sm:text-sm leading-relaxed">
                  {isEs ? (
                    <>
                      Interfaz de contraste ultra-alto diseñada para visibilidad bajo sol directo. 8 módulos operativos en producción:{" "}
                      <strong className="text-[#F8FAFC]">Manga BLE &amp; SENASA 2026</strong> para pesaje y trazabilidad ininterrumpida sin conexión,
                      cálculo de <strong className="text-[#F8FAFC]">Márgenes por Lote</strong>, consolidación de fletes <strong className="text-[#F8FAFC]">AgroPool</strong>,
                      telemetría de <strong className="text-[#F8FAFC]">Silobolsas FLIR</strong>, Asistente IA, cotizaciones en vivo y Fideicomiso Granario.
                    </>
                  ) : (
                    <>
                      Ultra-high contrast UI engineered for direct sunlight readability. 8 operational production modules:{" "}
                      <strong className="text-[#F8FAFC]">BLE Livestock Chute &amp; SENASA 2026</strong> for uninterrupted off-grid weighing and traceability,
                      <strong className="text-[#F8FAFC]">Field Margin Analysis</strong>, <strong className="text-[#F8FAFC]">AgroPool</strong> freight pooling,
                      <strong className="text-[#F8FAFC]">FLIR Silo Bag Telemetry</strong>, AI Field Assistant, live market quotes, and Grain Escrow.
                    </>
                  )}
                </p>
              </div>

              {/* Stack Tags */}
              <div className="pt-2">
                <span className="font-mono text-[10px] text-[#94A3B8] uppercase block mb-2">Stack:</span>
                <div className="flex flex-wrap gap-2">
                  {["Next.js", "Canvas 2D / WebGL", "IoT LoRaWAN", "Supabase", "Gemini API", "FLIR Thermal", "BLE Chute"].map(
                    (tech, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/[0.08] font-mono text-[11px] text-[#F8FAFC]"
                      >
                        {tech}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* CTA */}
              <div className="pt-3 flex flex-wrap gap-3 items-center">
                <a
                  href="https://agromarket.aldoarbizu.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => {
                    soundEngine.playHover();
                    playHoverTick();
                  }}
                  onClick={() => soundEngine.playClick()}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#D4AF37] text-[#070B12] font-mono text-xs font-bold hover:bg-[#E2E8F0] shadow-[0_0_20px_rgba(212,175,55,0.28)] transition-all"
                >
                  <span>{isEs ? "Acceder a AgroMarket Pro" : "Access AgroMarket Pro"}</span>
                  <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
                </a>
                <a
                  href="https://wa.me/5492314489197?text=Hola%20Aldo,%20deseo%20solicitar%20una%20Auditor%C3%ADa%20T%C3%A9rmica%20FLIR%20en%20Silobolsas%20para%20mi%20campo"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => {
                    soundEngine.playHover();
                    playHoverTick();
                  }}
                  onClick={() => soundEngine.playClick()}
                  className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-white/[0.04] text-[#F8FAFC] border border-white/[0.12] hover:border-[#D4AF37]/50 hover:text-[#D4AF37] font-mono text-xs font-semibold transition-all"
                >
                  <span>{isEs ? "Auditoría FLIR ($105k ARS)" : "FLIR Audit ($105k ARS)"}</span>
                </a>
                <span className="font-mono text-xs text-[#D4AF37] flex items-center gap-1.5 ml-1">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" strokeWidth={1.5} /> {isEs ? "8 Herramientas 100% Activas" : "8 Tools 100% Active"}
                </span>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <AgroMarketWidget />
              <ArchitectureDiagram systemId="agromarket" />
            </div>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* PROYECTO 3: SENTINEL OS (SEGURIDAD DEFENSIVA Y RONDAS OFFLINE-FIRST) */}
        {/* ========================================================================= */}
        <motion.div
          data-cursor="view"
          data-cursor-label="SENTINEL"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-28 p-6 sm:p-10 lg:p-12 rounded-2xl bg-[#070B12]/85 border border-white/[0.08] hover:border-[#D4AF37]/40 transition-all duration-500 shadow-2xl relative overflow-hidden group"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-white/[0.08] pb-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-[#D4AF37] tracking-wider">[ 03 // 03 ]</span>
              <span className="font-mono text-xs text-[#94A3B8] uppercase tracking-wider hidden sm:inline">
                {isEs ? "Seguridad Defensiva & Auditoría Offline-First" : "Defensive Security & Offline-First Auditing"}
              </span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 font-mono text-[11px] font-semibold text-[#D4AF37]">
              <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>
                {isEs
                  ? "ARQUITECTURA OFFLINE-FIRST · ZERO-TRUST"
                  : "OFFLINE-FIRST ARCHITECTURE · ZERO-TRUST"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            <div className="lg:col-span-6 space-y-6">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold text-[#F8FAFC] tracking-tight group-hover:text-[#D4AF37] transition-colors">
                Sentinel OS
              </h3>
              <p className="font-mono text-xs text-[#D4AF37] font-medium">
                {isEs
                  ? "Centro de despacho táctico móvil y auditoría inmutable de rondas perimetrales"
                  : "Tactical mobile dispatch center and tamper-proof perimeter audit logging"}
              </p>

              {/* Historia de Origen Real */}
              <div className="p-5 rounded-2xl bg-black/80 border-l-4 border-[#D4AF37] border border-white/[0.08] relative">
                <Quote className="w-6 h-6 text-[#D4AF37]/20 absolute top-4 right-4" strokeWidth={1.5} />
                <span className="font-mono text-[11px] text-[#D4AF37] uppercase tracking-wider font-semibold block mb-2">
                  {isEs ? "// EL ORIGEN REAL" : "// THE REAL ORIGIN"}
                </span>
                <p className="text-[#94A3B8] font-sans text-xs sm:text-sm leading-relaxed">
                  {isEs
                    ? "“En perímetros industriales y galpones alejados sin cobertura celular, las aplicaciones corporativas tradicionales colapsan: la cámara no lee códigos QR en baja luminosidad, la interfaz se bloquea al perder señal y los reportes de incidentes se pierden. Diseñé Sentinel OS para garantizar persistencia criptográfica local ininterrumpida en cualquier condición operativa.”"
                    : "“Across remote industrial perimeters and dark warehouses without cellular coverage, conventional apps fail: cameras struggle to read QR checkpoints in low light, interfaces freeze upon signal loss, and critical incident reports vanish. I engineered Sentinel OS to guarantee uninterrupted local cryptographic persistence under any field condition.”"}
                </p>
              </div>

              {/* Solución Técnica */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 font-mono text-xs text-[#F8FAFC] font-semibold uppercase">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.2)]">
                    <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </span>
                  <span>{isEs ? "Ingeniería & Resiliencia Táctica" : "Engineering & Tactical Resilience"}</span>
                </div>
                <p className="text-[#94A3B8] font-sans text-xs sm:text-sm leading-relaxed">
                  {isEs ? (
                    <>
                      Lectura adaptativa de QR con post-procesamiento de umbral para visión nocturna. Almacenamiento local en{" "}
                      <strong className="text-[#F8FAFC]">SQLite WAL</strong> que encola hasta 10.000 eventos cifrados asimétricamente y sincroniza
                      automáticamente con el servidor al recuperar 1 bar de señal.
                    </>
                  ) : (
                    <>
                      Adaptive QR barcode scanning with dynamic threshold post-processing for night vision. Local{" "}
                      <strong className="text-[#F8FAFC]">SQLite WAL</strong> storage queuing up to 10,000 asymmetric-encrypted events that auto-sync
                      to cloud servers the second 1 bar of cellular signal is recovered.
                    </>
                  )}
                </p>
              </div>

              {/* Stack Tags */}
              <div className="pt-2">
                <span className="font-mono text-[10px] text-[#94A3B8] uppercase block mb-2">Stack:</span>
                <div className="flex flex-wrap gap-2">
                  {["React Native", "Expo EAS", "SQLite WAL", "Firebase Security Rules", "Cifrado Asimétrico", "GPS Audit"].map(
                    (tech, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/[0.08] font-mono text-[11px] text-[#F8FAFC]"
                      >
                        {tech}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* CTA */}
              <div className="pt-3 flex flex-wrap gap-4 items-center">
                <a
                  href="https://sentinelos.aldoarbizu.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => {
                    soundEngine.playHover();
                    playHoverTick();
                  }}
                  onClick={() => soundEngine.playClick()}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#D4AF37] text-[#070B12] font-mono text-xs font-bold hover:bg-[#E2E8F0] shadow-[0_0_20px_rgba(212,175,55,0.28)] transition-all"
                >
                  <span>{isEs ? "Ver Prototipo Táctico" : "View Tactical Prototype"}</span>
                  <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
                </a>
                <span className="font-mono text-xs text-[#94A3B8] flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#D4AF37]" strokeWidth={1.5} />{" "}
                  {isEs ? "100% registros asegurados sin red" : "100% logs preserved off-grid"}
                </span>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <SentinelWidget />
              <ArchitectureDiagram systemId="sentinel" />
            </div>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* SECCIÓN SECUNDARIA: LABORATORIO & CREACIONES AUXILIARES (FILTRADO TÁCTICO) */}
        {/* ========================================================================= */}
        <div className="pt-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div className="text-center sm:text-left">
              <span className="font-mono text-xs text-[#D4AF37] font-semibold uppercase tracking-widest block mb-1">
                {isEs ? "// EXPERIMENTOS & SAAS AUXILIARES" : "// EXPERIMENTS & AUXILIARY SAAS"}
              </span>
              <h3 className="text-2xl sm:text-3xl font-sans font-bold text-[#F8FAFC] tracking-tight">
                {isEs ? "Otros desarrollos de software especializado" : "Other specialized software creations"}
              </h3>
            </div>

            {/* Pestañas de Filtrado Táctico por Arquitectura */}
            <div
              role="tablist"
              aria-label={isEs ? "Filtrar por arquitectura" : "Filter by architecture"}
              className="inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] backdrop-blur-md self-center lg:self-auto"
            >
              {(
                [
                  { id: "all", label: isEs ? "Todos (8)" : "All (8)", mode: "pbr" as const },
                  { id: "fintech", label: "FinTech / Quant", mode: "wireframe" as const },
                  { id: "agtech", label: "AgTech / Offline-First", mode: "xray" as const },
                  { id: "cybersec", label: "CyberSec / WebGL", mode: "pbr" as const },
                ] as const
              ).map((tab) => {
                const active = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onMouseEnter={playHoverTick}
                    onClick={() => {
                      soundEngine.playClick();
                      playModeSwitch(tab.mode);
                      setActiveCategory(tab.id);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      active
                        ? "bg-[#D4AF37] text-[#070B12] border border-[#D4AF37] shadow-[0_0_16px_rgba(212,175,55,0.28)]"
                        : "text-[#94A3B8] hover:text-[#F8FAFC] border border-transparent"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredAuxProjects.map((proj) => (
              <div
                key={proj.id}
                onPointerEnter={playHoverTick}
                onPointerMove={handleCardPointerMove}
                className="group relative p-6 rounded-2xl bg-[#070B12]/80 border border-white/[0.08] hover:border-[#D4AF37]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg"
              >
                {/* Halo de iluminación perimetral reactivo al puntero (--mouse-x, --mouse-y) */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "radial-gradient(280px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(212, 175, 55, 0.14), transparent 72%)",
                  }}
                />
                {/* Mechanical Corner Brackets */}
                <span className="card-bracket card-bracket--tl" aria-hidden="true" />
                <span className="card-bracket card-bracket--tr" aria-hidden="true" />
                <span className="card-bracket card-bracket--bl" aria-hidden="true" />
                <span className="card-bracket card-bracket--br" aria-hidden="true" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[10px] uppercase font-bold text-[#D4AF37]">
                      {proj.domain}
                    </span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded border bg-[#D4AF37]/10 text-[#E2E8F0] border-[#D4AF37]/30">
                      {proj.badge}
                    </span>
                  </div>
                  <h4 className="text-xl font-sans font-bold text-[#F8FAFC] mb-2 group-hover:text-[#D4AF37] transition-colors">
                    {proj.title}
                  </h4>
                  <p className="font-sans text-xs text-[#94A3B8] leading-relaxed mb-4">{proj.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {proj.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-black/70 border border-white/[0.08] text-[10px] font-mono text-[#94A3B8]"
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
                  onMouseEnter={() => {
                    soundEngine.playHover();
                    playHoverTick();
                  }}
                  onClick={() => soundEngine.playClick()}
                  className="relative z-10 inline-flex items-center justify-center gap-1.5 py-3 rounded-xl bg-white/[0.04] border border-white/[0.12] hover:bg-[#D4AF37] hover:text-[#070B12] hover:border-[#D4AF37] text-xs font-mono font-bold text-[#F8FAFC] transition-colors"
                >
                  <span>{proj.cta}</span>
                  <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECCIÓN INTERACTIVA SRE & HIGH-AVAILABILITY CLOUD LAB */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mt-24 p-6 sm:p-10 rounded-2xl bg-[#070B12]/85 border border-white/[0.08] hover:border-[#D4AF37]/40 transition-colors shadow-2xl relative overflow-hidden"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-white/[0.08] pb-6">
            <div>
              <span className="font-mono text-xs text-[#D4AF37] font-bold uppercase tracking-wider block mb-1">
                [ LIVE ARCHITECTURE SANDBOX ]
              </span>
              <h3 className="text-2xl sm:text-3xl font-sans font-bold text-[#F8FAFC] tracking-tight">
                {isEs ? "Simulador de Resiliencia & Failover SRE en Vivo" : "Live SRE Resiliency & Failover Simulator"}
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 font-mono text-[11px] font-semibold text-[#D4AF37]">
              TEST DE INFRAESTRUCTURA L7
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6">
              <SreFailoverSandbox />
            </div>
            <div className="lg:col-span-6 space-y-4">
              <ArchitectureDiagram systemId="nexus-sre" />
              <div className="p-4 rounded-xl bg-black/40 border border-white/[0.08] text-[#94A3B8] font-sans text-xs leading-relaxed">
                {isEs ? (
                  <p>
                    Demostración interactiva de tolerancia a fallos. En arquitecturas de misión crítica (trading cuantitativo, Web3 y portales empresariales), los incidentes son detectados por el <strong className="text-[#F8FAFC]">Watchdog Autónomo</strong> y mitigados en milisegundos mediante reencaminamiento de capa 7 sin provocar caídas de servicio.
                  </p>
                ) : (
                  <p>
                    Interactive fault-tolerance demonstration. Across mission-critical workloads (quantitative trading, Web3 and enterprise platforms), anomalies are detected by our <strong className="text-[#F8FAFC]">Autonomous Watchdog</strong> and rerouted at Layer 7 in milliseconds with zero downtime.
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
