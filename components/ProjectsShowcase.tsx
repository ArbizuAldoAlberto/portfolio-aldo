"use client";

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
import { soundEngine } from "./system/SoundEngine";
import { useLocale } from "next-intl";

export function ProjectsShowcase() {
  const locale = useLocale();
  const isEs = locale === "es";

  return (
    <section id="proyectos" className="py-24 sm:py-36 px-4 sm:px-6 lg:px-8 border-b border-white/10 max-w-7xl mx-auto">
      {/* Encabezado Principal */}
      <div className="mb-20 sm:mb-28 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 font-mono text-xs text-emerald-400 mb-4">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>{isEs ? "PROYECTOS & CASOS DE ESTUDIO" : "PROJECTS & CASE STUDIES"}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-sans font-bold text-white tracking-tight max-w-4xl leading-[1.15]">
          {isEs
            ? "Software nacido de la experiencia real, no del escritorio."
            : "Software born from real-world adversity, not theory."}
        </h2>
        <p className="text-slate-300 font-sans text-sm sm:text-base max-w-2xl mt-4 leading-relaxed">
          {isEs
            ? "Cada sistema resuelve un dolor que viví en carne propia: desde la presión del capital en los mercados financieros, hasta el barro de la manga ganadera y las guardias de seguridad nocturnas."
            : "Every architecture solves a friction I experienced firsthand: from financial capital risk in quant trading, to direct livestock field operations and nighttime security patrols."}
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
        className="mb-28 p-6 sm:p-10 lg:p-12 rounded-3xl bg-black/60 border border-white/10 hover:border-emerald-500/40 transition-all duration-500 shadow-2xl relative overflow-hidden group"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-emerald-400 tracking-wider">[ 01 // 03 ]</span>
            <span className="font-mono text-xs text-slate-400 uppercase tracking-wider hidden sm:inline">
              {isEs ? "Trading Cuantitativo & Mitigación de Riesgo" : "Quantitative Trading & Risk Mitigation"}
            </span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 font-mono text-[11px] font-semibold text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span>{isEs ? "EN PRODUCCIÓN · OPERANDO CON CAPITAL REAL" : "IN PRODUCTION · REAL CAPITAL ACTIVE"}</span>
          </div>
        </div>

        {/* Contenido Split: Narrativa + Diagrama / Widget Interactivo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <div className="lg:col-span-6 space-y-6">
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold text-white tracking-tight group-hover:text-emerald-300 transition-colors">
              TitanFlow
            </h3>
            <p className="font-mono text-xs text-emerald-400 font-medium">
              {isEs
                ? "Bot algorítmico en Binance Futures con gestión matemática de riesgo (Criterio de Kelly & Circuit Breakers)"
                : "Algorithmic execution engine on Binance Futures with mathematical risk modeling (Kelly Criterion & Circuit Breakers)"}
            </p>

            {/* Historia de Origen Real */}
            <div className="p-5 rounded-2xl bg-black/80 border-l-4 border-emerald-400 border border-white/10 relative">
              <Quote className="w-6 h-6 text-emerald-400/20 absolute top-4 right-4" />
              <span className="font-mono text-[11px] text-emerald-400 uppercase tracking-wider font-semibold block mb-2">
                {isEs ? "// EL ORIGEN REAL" : "// THE REAL ORIGIN"}
              </span>
              <p className="text-slate-300 font-sans text-xs sm:text-sm leading-relaxed italic">
                {isEs
                  ? "“Durante mucho tiempo operé manualmente en los mercados financieros con estrategias que me permitieron subsistir con mis ahorros. Sin embargo, al depender directamente de ese capital para vivir, la presión psicológica era desgastante. Los fallos no venían de errores en la lectura del mercado, sino de la necesidad personal de ganar. Creé TitanFlow para eliminar mis propias emociones de la ecuación y delegar la ejecución en algoritmos matemáticos estrictos.”"
                  : "“For a long time, I traded financial markets manually using strategies that supported my living expenses. However, relying directly on that capital to live created immense emotional wear. Mistakes didn't stem from market analysis, but from the personal psychological pressure to win. I created TitanFlow to eliminate human emotions entirely from the equation and delegate execution to strict mathematical algorithms.”"}
              </p>
            </div>

            {/* Solución Técnica */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 font-mono text-xs text-white font-semibold uppercase">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>{isEs ? "Ingeniería & Solución Técnica" : "Engineering & Technical Architecture"}</span>
              </div>
              <p className="text-slate-300 font-sans text-xs sm:text-sm leading-relaxed">
                {isEs ? (
                  <>
                    Ejecución 24/7 sobre la API de Binance Futures mediante WebSockets concurrentes de baja latencia (14ms).
                    Dimensionamiento de lote dinámico vía <strong>Criterio de Kelly fraccional</strong>, circuit breakers
                    automáticos que congelan operaciones ante drawdowns anormales y cálculo de probabilidades sin sesgo.
                  </>
                ) : (
                  <>
                    24/7 execution on Binance Futures API using low-latency concurrent WebSockets (14ms). Dynamic position
                    sizing via <strong>fractional Kelly Criterion</strong>, automated circuit breakers that freeze trades
                    during abnormal drawdowns, and unbiased mathematical execution.
                  </>
                )}
              </p>
            </div>

            {/* Stack Tags */}
            <div className="pt-2">
              <span className="font-mono text-[10px] text-slate-400 uppercase block mb-2">Stack:</span>
              <div className="flex flex-wrap gap-2">
                {["Python", "TypeScript", "Node.js", "Binance Futures API", "Kelly Criterion", "CCXT", "Base L2"].map(
                  (tech, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 font-mono text-[11px] text-slate-300"
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
                onMouseEnter={() => soundEngine.playHover()}
                onClick={() => soundEngine.playClick()}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-400 text-slate-950 font-mono text-xs font-bold hover:bg-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-all"
              >
                <span>{isEs ? "Acceder a TitanFlow" : "Access TitanFlow"}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <span className="font-mono text-xs text-slate-300 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />{" "}
                {isEs ? "0% interferencia emocional" : "0% emotional interference"}
              </span>
            </div>
          </div>

          {/* Columna Derecha: Widget Interactivo + Diagrama de Pipeline */}
          <div className="lg:col-span-6 space-y-4">
            <TitanFlowWidget />
            <ArchitectureDiagram systemId="titanflow" />
          </div>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* PROYECTO 2: AGROMARKET PRO (PROTOTIPO EN CREACIÓN - AGTECH REAL) */}
      {/* ========================================================================= */}
      <motion.div
        data-cursor="view"
        data-cursor-label="AGROMARKET"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-28 p-6 sm:p-10 lg:p-12 rounded-3xl bg-black/60 border border-white/10 hover:border-emerald-500/40 transition-all duration-500 shadow-2xl relative overflow-hidden group"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-emerald-400 tracking-wider">[ 02 // 03 ]</span>
            <span className="font-mono text-xs text-slate-400 uppercase tracking-wider hidden sm:inline">
              {isEs ? "Logística Agropecuaria & Soluciones de Manga" : "Agricultural Logistics & Livestock Solutions"}
            </span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 font-mono text-[11px] font-semibold text-amber-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{isEs ? "PROTOTIPO EN CREACIÓN · VALIDACIÓN DE CAMPO" : "PROTOTYPE IN PROGRESS · FIELD VALIDATION"}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <div className="lg:col-span-6 space-y-6">
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold text-white tracking-tight group-hover:text-emerald-300 transition-colors">
              AgroMarket Pro
            </h3>
            <p className="font-mono text-xs text-emerald-400 font-medium">
              {isEs
                ? "Plataforma de optimización de fletes rurales (AgroPool) y control térmico FLIR para acopio"
                : "Rural freight pooling platform (AgroPool) and FLIR thermal monitoring for crop storage"}
            </p>

            {/* Historia de Origen Real */}
            <div className="p-5 rounded-2xl bg-black/80 border-l-4 border-amber-500 border border-white/10 relative">
              <Quote className="w-6 h-6 text-amber-500/20 absolute top-4 right-4" />
              <span className="font-mono text-[11px] text-amber-400 uppercase tracking-wider font-semibold block mb-2">
                {isEs ? "// EL ORIGEN REAL" : "// THE REAL ORIGIN"}
              </span>
              <p className="text-slate-300 font-sans text-xs sm:text-sm leading-relaxed italic">
                {isEs
                  ? "“Mi origen y formación siempre estuvo en el campo (EAS Del Valle). Conozco en persona el estrés de trabajar en la manga ganadera, donde todo debe ser rápido y dinámico para que los animales no se estresen ni se lastimen, y donde el software tradicional no sirve: pantallas que no se leen con el sol de frente, polvo, tierra en las manos y nula señal de internet. AgroMarket Pro nace para llevar soluciones tecnológicas prácticas a quienes trabajan en el barro.”"
                  : "“My roots and education are deeply tied to agriculture (EAS Del Valle). I know firsthand the physical stress of working in livestock chutes, where handling must be fast and dynamic so animals don't get hurt, and where generic software fails: unreadable screens under intense sunlight, dust, mud, and zero internet connectivity. AgroMarket Pro is engineered to bring practical tech to real operators in the mud.”"}
              </p>
            </div>

            {/* Solución Técnica */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 font-mono text-xs text-white font-semibold uppercase">
                <Tractor className="w-4 h-4 text-emerald-400" />
                <span>{isEs ? "Ingeniería & Solución de Campo" : "Engineering & Field Solution"}</span>
              </div>
              <p className="text-slate-300 font-sans text-xs sm:text-sm leading-relaxed">
                {isEs ? (
                  <>
                    Interfaz de contraste ultra-alto diseñada para visibilidad bajo sol directo. Arquitectura{" "}
                    <strong>Offline-First</strong> para registro ininterrumpido de pesaje y sanidad animal en manga.
                    Algoritmo <strong>“AgroPool”</strong> para consolidación inteligente de fletes compartidos y
                    simulador térmico en Canvas para detección temprana de focos en silobolsas.
                  </>
                ) : (
                  <>
                    Ultra-high contrast UI engineered for direct sunlight readability. <strong>Offline-First</strong>{" "}
                    architecture for uninterrupted livestock weighing and health logs. <strong>“AgroPool”</strong>{" "}
                    algorithm for shared rural freight pooling, and Canvas 2D thermal simulator for early hotspot
                    detection in silo bags.
                  </>
                )}
              </p>
            </div>

            {/* Stack Tags */}
            <div className="pt-2">
              <span className="font-mono text-[10px] text-slate-400 uppercase block mb-2">Stack:</span>
              <div className="flex flex-wrap gap-2">
                {["Next.js", "Canvas 2D / WebGL", "IoT LoRaWAN", "Supabase", "Gemini API", "Universal Cart"].map(
                  (tech, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 font-mono text-[11px] text-slate-300"
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
                href="https://agromarket.aldoarbizu.com"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => soundEngine.playHover()}
                onClick={() => soundEngine.playClick()}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-xs font-bold hover:bg-emerald-400 hover:text-slate-950 hover:border-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.25)] transition-all"
              >
                <span>{isEs ? "Ver Prototipo en Desarrollo" : "View Prototype in Progress"}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <span className="font-mono text-xs text-amber-400/90 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" /> {isEs ? "-22% costos logísticos" : "-22% logistics costs"}
              </span>
            </div>
          </div>

          {/* Columna Derecha: Widget Térmico FLIR + Diagrama */}
          <div className="lg:col-span-6 space-y-4">
            <AgroMarketWidget />
            <ArchitectureDiagram systemId="agromarket" />
          </div>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* PROYECTO 3: SENTINEL OS (PROTOTIPO EN DESARROLLO - SEGURIDAD Y RONDAS) */}
      {/* ========================================================================= */}
      <motion.div
        data-cursor="view"
        data-cursor-label="SENTINEL"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-28 p-6 sm:p-10 lg:p-12 rounded-3xl bg-black/60 border border-white/10 hover:border-amber-500/40 transition-all duration-500 shadow-2xl relative overflow-hidden group"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-amber-400 tracking-wider">[ 03 // 03 ]</span>
            <span className="font-mono text-xs text-slate-400 uppercase tracking-wider hidden sm:inline">
              {isEs ? "Seguridad Defensiva & Auditoría Offline-First" : "Defensive Security & Offline-First Auditing"}
            </span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 font-mono text-[11px] font-semibold text-amber-400">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {isEs
                ? "PROTOTIPO EN DESARROLLO · ARQUITECTURA OFFLINE-FIRST"
                : "PROTOTYPE IN PROGRESS · OFFLINE-FIRST ARCHITECTURE"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <div className="lg:col-span-6 space-y-6">
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold text-white tracking-tight group-hover:text-amber-300 transition-colors">
              Sentinel OS
            </h3>
            <p className="font-mono text-xs text-amber-400 font-medium">
              {isEs
                ? "Centro de despacho táctico móvil y auditoría inmutable de rondas de vigilancia"
                : "Tactical mobile dispatch center and tamper-proof security guard patrol logging"}
            </p>

            {/* Historia de Origen Real */}
            <div className="p-5 rounded-2xl bg-black/80 border-l-4 border-amber-500 border border-white/10 relative">
              <Quote className="w-6 h-6 text-amber-500/20 absolute top-4 right-4" />
              <span className="font-mono text-[11px] text-amber-400 uppercase tracking-wider font-semibold block mb-2">
                {isEs ? "// EL ORIGEN REAL" : "// THE REAL ORIGIN"}
              </span>
              <p className="text-slate-300 font-sans text-xs sm:text-sm leading-relaxed italic">
                {isEs
                  ? "“Trabajando en el servicio de seguridad nocturno sufrí en carne propia cómo fallaba la aplicación corporativa que nos daban: la cámara no leía los códigos QR en la oscuridad, la app se tildaba al perder señal en galpones o perímetros alejados, y los reportes de incidentes se borraban en lugar de guardarse. Creé Sentinel OS para darle a los vigiladores una herramienta que funcione siempre, protegiendo su trabajo con auditoría real.”"
                  : "“Working night security patrols, I experienced firsthand the failure of corporate guard apps: the camera couldn't read QR checkpoints in dark warehouses, the app froze upon losing signal along perimeter fences, and critical incident reports were lost instead of stored. I created Sentinel OS to provide guards with tools that never fail, backing up their work with auditable logs.”"}
              </p>
            </div>

            {/* Solución Técnica */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 font-mono text-xs text-white font-semibold uppercase">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>{isEs ? "Ingeniería & Resiliencia Táctica" : "Engineering & Tactical Resilience"}</span>
              </div>
              <p className="text-slate-300 font-sans text-xs sm:text-sm leading-relaxed">
                {isEs ? (
                  <>
                    Lectura adaptativa de QR con post-procesamiento de umbral para visión nocturna. Almacenamiento local en{" "}
                    <strong>SQLite WAL</strong> que encola hasta 10.000 eventos cifrados asimétricamente y sincroniza
                    automáticamente con el servidor al recuperar 1 bar de señal.
                  </>
                ) : (
                  <>
                    Adaptive QR barcode scanning with dynamic threshold post-processing for night vision. Local{" "}
                    <strong>SQLite WAL</strong> storage queuing up to 10,000 asymmetric-encrypted events that auto-sync
                    to cloud servers the second 1 bar of cellular signal is recovered.
                  </>
                )}
              </p>
            </div>

            {/* Stack Tags */}
            <div className="pt-2">
              <span className="font-mono text-[10px] text-slate-400 uppercase block mb-2">Stack:</span>
              <div className="flex flex-wrap gap-2">
                {["React Native", "Expo EAS", "SQLite WAL", "Firebase Security Rules", "Cifrado Asimétrico", "GPS Audit"].map(
                  (tech, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 font-mono text-[11px] text-slate-300"
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
                onMouseEnter={() => soundEngine.playHover()}
                onClick={() => soundEngine.playClick()}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono text-xs font-bold hover:bg-amber-400 hover:text-slate-950 hover:border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all"
              >
                <span>{isEs ? "Ver Prototipo Táctico" : "View Tactical Prototype"}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <span className="font-mono text-xs text-slate-300 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-amber-400" />{" "}
                {isEs ? "100% registros asegurados sin red" : "100% logs preserved off-grid"}
              </span>
            </div>
          </div>

          {/* Columna Derecha: Widget Radar + Diagrama */}
          <div className="lg:col-span-6 space-y-4">
            <SentinelWidget />
            <ArchitectureDiagram systemId="sentinel" />
          </div>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* SECCIÓN SECUNDARIA: LABORATORIO & CREACIONES AUXILIARES */}
      {/* ========================================================================= */}
      <div className="pt-8">
        <div className="mb-10 text-center sm:text-left">
          <span className="font-mono text-xs text-emerald-400 font-semibold uppercase tracking-widest block mb-1">
            {isEs ? "// EXPERIMENTOS & SAAS AUXILIARES" : "// EXPERIMENTS & AUXILIARY SAAS"}
          </span>
          <h3 className="text-2xl sm:text-3xl font-sans font-bold text-white tracking-tight">
            {isEs ? "Otros desarrollos de software especializado" : "Other specialized software creations"}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* SabioBosque */}
          <div className="p-6 rounded-2xl bg-black/60 border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] text-emerald-400 uppercase font-bold">
                  {isEs ? "E-Commerce & AI Legal" : "E-Commerce & Legal AI"}
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                  LIVE SAAS
                </span>
              </div>
              <h4 className="text-xl font-sans font-bold text-white mb-2">SabioBosque</h4>
              <p className="font-sans text-xs text-slate-300 leading-relaxed mb-4">
                {isEs
                  ? "Validación automatizada de stock y recetas médicas legales REPROCANN en el checkout mediante Gemini API y Universal Cart."
                  : "Automated stock verification and REPROCANN medical prescription compliance validation at checkout via Gemini API."}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-6">
                {["Next.js", "Zustand", "Supabase", "Gemini API"].map((t, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-black/60 text-[10px] font-mono text-slate-300">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <a
              href="https://sabiobosque.aldoarbizu.com"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => soundEngine.playHover()}
              onClick={() => soundEngine.playClick()}
              className="inline-flex items-center justify-center gap-1.5 py-3 rounded-xl bg-white/10 border border-white/15 text-xs font-mono font-bold text-white hover:bg-emerald-400 hover:text-slate-950 transition-colors"
            >
              <span>{isEs ? "Explorar SaaS" : "Explore SaaS"}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* PawHero */}
          <div className="p-6 rounded-2xl bg-black/60 border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] text-emerald-400 uppercase font-bold">
                  {isEs ? "Web3 & Hardware 3D" : "Web3 & 3D Hardware"}
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-500/30">
                  LABS PROTO
                </span>
              </div>
              <h4 className="text-xl font-sans font-bold text-white mb-2">PawHero</h4>
              <p className="font-sans text-xs text-slate-300 leading-relaxed mb-4">
                {isEs
                  ? "Trazabilidad de mascotas con chapas QR imprimibles en 3D (STL) a costo cero y emisión de Soulbound Tokens (SBT) en Base L2 para ONGs."
                  : "Pet traceability with 3D-printable QR tags (STL) and Soulbound Token (SBT) issuance on Base L2 for animal rescues."}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-6">
                {["React Native", "Base L2", "Three.js", "STL 3D Print"].map((t, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-black/60 text-[10px] font-mono text-slate-300">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <a
              href="https://pawhero.aldoarbizu.com"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => soundEngine.playHover()}
              onClick={() => soundEngine.playClick()}
              className="inline-flex items-center justify-center gap-1.5 py-3 rounded-xl bg-white/10 border border-white/15 text-xs font-mono font-bold text-white hover:bg-emerald-400 hover:text-slate-950 transition-colors"
            >
              <span>{isEs ? "Explorar Prototipo" : "Explore Prototype"}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Impresión 3D P2P */}
          <div className="p-6 rounded-2xl bg-black/60 border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] text-amber-400 uppercase font-bold">
                  {isEs ? "Makers & Web3" : "Makers & Web3"}
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30">
                  HARDWARE PROTO
                </span>
              </div>
              <h4 className="text-xl font-sans font-bold text-white mb-2">
                {isEs ? "Impresión 3D P2P" : "P2P 3D Printing"}
              </h4>
              <p className="font-sans text-xs text-slate-300 leading-relaxed mb-4">
                {isEs
                  ? "Plataforma de cotización instantánea de archivos STL de diseño 3D y red colaborativa de makers con escrow descentralizado."
                  : "Instant 3D STL slicing quotation platform and collaborative maker network with decentralized escrow."}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-6">
                {["Kotlin", "STL Slicer", "Base L2 Escrow", "Blender"].map((t, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-black/60 text-[10px] font-mono text-slate-300">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <a
              href="https://impresion3d.aldoarbizu.com"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => soundEngine.playHover()}
              onClick={() => soundEngine.playClick()}
              className="inline-flex items-center justify-center gap-1.5 py-3 rounded-xl bg-white/10 border border-white/15 text-xs font-mono font-bold text-white hover:bg-amber-400 hover:text-slate-950 transition-colors"
            >
              <span>{isEs ? "Explorar Proyecto" : "Explore Project"}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
