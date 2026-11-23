"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Printer, Radio, HeartHandshake, BookOpen, CheckCircle2, Layers } from "lucide-react";

type PhaseView = "recovery" | "impact" | "preservation";

interface CauseItem {
  id: string;
  tag: string;
  title: string;
  description: string;
  image: string;
  width: number;
  height: number;
  progressPct: number;
  metrics: string;
}

const CAUSES: readonly CauseItem[] = [
  {
    id: "food-sovereignty",
    tag: "Nutrición",
    title: "Soberanía Alimentaria Comunitaria",
    description:
      "Nodos locales con vales firmados por Ed25519 para retirar bolsones frescos sin formularios humillantes ni colas visibles.",
    image: "/impact/food_sovereignty.webp",
    width: 960,
    height: 644,
    progressPct: 71,
    metrics: "1.240 personas asistidas · 2G USSD compatible",
  },
  {
    id: "healthcare-access",
    tag: "Salud Preventiva",
    title: "Clínicas Móviles y Bioseguridad Pediátrica",
    description:
      "Desinfección sin isopropanol, trazabilidad sanitaria y atención primaria en parajes rurales desconectados.",
    image: "/impact/healthcare_access.webp",
    width: 960,
    height: 644,
    progressPct: 52,
    metrics: "3.890 consultas registradas · FLE:v2 Ley 25.326",
  },
  {
    id: "education-tech",
    tag: "Educación & Oficio",
    title: "Aulas Solares y Fabricación Digital Solidaria",
    description:
      "Acceso a computación offline, alfabetización técnica y réplicas didácticas seguras fabricadas en PETG virgen.",
    image: "/impact/education_tech.webp",
    width: 960,
    height: 644,
    progressPct: 55,
    metrics: "560 estudiantes rurales · Modelo abierto .3MF",
  },
];

export default function ImpactoPortal() {
  const [phaseView, setPhaseView] = useState<PhaseView>("recovery");
  const [stabilityScore, setStabilityScore] = useState<number>(62);
  const [claimedCount, setClaimedCount] = useState<number>(0);
  const [pledgedUsd, setPledgedUsd] = useState<number>(10);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [simulationMatch, setSimulationMatch] = useState<boolean>(false);

  const isPhase2 = stabilityScore >= 80 || phaseView === "impact";

  const handleClaimAid = (label: string) => {
    setClaimedCount((c) => c + 1);
    setStabilityScore((s) => Math.min(100, s + 12));
    setFeedback(`Solicitud optimista registrada offline (${label}). Token Ed25519 en cola de sincronización.`);
  };

  const handleSimulateTransition = () => {
    setStabilityScore(86);
    setSimulationMatch(true);
    setPhaseView("impact");
    setFeedback(
      "Umbral alcanzado (86/100). Modo Reciprocidad activado con Fondo de Impacto Comunitario — Arbizu Labs (Simulación)."
    );
  };

  const handleSimulatePledge = (amount: number) => {
    setPledgedUsd((p) => p + amount);
    setPhaseView("impact");
    setFeedback(
      `Simulación registrada: $${amount} USD asignados a causas comunitarias (${Math.round(amount * 1.25)} raciones o ${amount * 25}g de filamento PETG).`
    );
  };

  return (
    <div className="min-h-screen bg-[#F6F3EC] text-[#1A1D1F] selection:bg-[#B45309]/20">
      {/* Navegación Editorial Sobria (Anillo 2) */}
      <header className="border-b border-[#D9D2C3] bg-[#FFFFFF]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/es"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-[4px] border border-[#D9D2C3] bg-[#F6F3EC] text-[#1A1D1F] hover:border-[#1A1D1F] text-xs font-mono font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>aldoarbizu.com</span>
            </Link>
            <span className="font-mono text-xs uppercase tracking-wider text-[#4B525A] truncate">
              Anillo 2 · Archivo Cívico Cálido
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="https://pawhero.aldoarbizu.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-[4px] border border-[#D9D2C3] bg-[#FFFFFF] text-[#1E4D3B] hover:border-[#1E4D3B] text-xs font-mono font-bold"
            >
              PawHero (0% Comisión)
            </a>
            <a
              href="https://santuario.aldoarbizu.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-[4px] border border-[#D9D2C3] bg-[#F6F3EC] text-[#4B525A] hover:text-[#1A1D1F] text-xs font-mono"
            >
              Santuario YO SOY
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
        {/* Encabezado Editorial & Selector Dual */}
        <section className="bg-[#FFFFFF] border border-[#D9D2C3] rounded-[6px] p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E6E0D3] pb-4">
            <span
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-[4px] font-mono text-xs font-bold uppercase ${
                isPhase2
                  ? "bg-[#E7F1EC] text-[#1E4D3B] border border-[#1E4D3B]"
                  : "bg-[#FEF3C7] text-[#92400E] border border-[#B45309]"
              }`}
            >
              <span>{isPhase2 ? "Fase 2 · Reciprocidad Activa" : "Fase 1 · Estabilización Digna"}</span>
            </span>
            <span className="font-mono text-xs text-[#4B525A]">
              Programa Filántropo · XState + Ed25519 + Ley 25.326
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-4">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1A1D1F] leading-tight">
                Impacto Social de Transición &amp; Preservación 3D Solidaria
              </h1>
              <p className="text-base text-[#4B525A] leading-relaxed">
                Arquitectura cívica diseñada para acompañar a una persona desde la urgencia alimentaria hasta la
                reciprocidad comunitaria, sin estigmas ni exposición de datos personales, combinando hardware abierto
                con infraestructura offline-first.
              </p>
            </div>

            <div className="lg:col-span-5 bg-[#F6F3EC] border border-[#D9D2C3] rounded-[6px] p-5 space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-xs uppercase text-[#4B525A] font-semibold">
                  Índice de Estabilidad Vital
                </span>
                <span
                  className="font-mono text-2xl font-extrabold"
                  style={{ color: isPhase2 ? "#1E4D3B" : "#B45309" }}
                >
                  {stabilityScore}/100
                </span>
              </div>
              <div className="w-full h-3 bg-[#FFFFFF] border border-[#D9D2C3] rounded-[3px] overflow-hidden">
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${stabilityScore}%`,
                    backgroundColor: isPhase2 ? "#1E4D3B" : "#B45309",
                  }}
                />
              </div>
              <p className="text-xs text-[#4B525A] leading-relaxed">
                {isPhase2
                  ? "Estabilidad superada (>= 80). El sistema habilita micro-aportes comunitarios y canje de filamento 3D."
                  : "Por debajo de 80 puntos la interfaz prioriza asistencia inmediata sin formularios complejos."}
              </p>
              <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-xs">
                <div className="bg-[#FFFFFF] border border-[#D9D2C3] p-2 rounded-[4px] text-center">
                  <div className="font-bold text-[#1A1D1F]">{claimedCount}</div>
                  <div className="text-[11px] text-[#4B525A]">Vales locales</div>
                </div>
                <div className="bg-[#FFFFFF] border border-[#D9D2C3] p-2 rounded-[4px] text-center">
                  <div className="font-bold text-[#1E4D3B]">${pledgedUsd}</div>
                  <div className="text-[11px] text-[#4B525A]">Simulado USD</div>
                </div>
                <div className="bg-[#FFFFFF] border border-[#D9D2C3] p-2 rounded-[4px] text-center">
                  <div className="font-bold text-[#B45309]">112/112</div>
                  <div className="text-[11px] text-[#4B525A]">Suite Core</div>
                </div>
              </div>
            </div>
          </div>

          {/* Selector de Vistas (Fitts >= 64px en botones de acción primaria) */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
            <button
              type="button"
              onClick={() => setPhaseView("recovery")}
              className={`min-h-[64px] px-4 py-3 rounded-[6px] border text-sm font-bold text-left transition-colors ${
                phaseView === "recovery"
                  ? "bg-[#B45309] border-[#92400E] text-[#FFFFFF]"
                  : "bg-[#F6F3EC] border-[#D9D2C3] text-[#1A1D1F] hover:border-[#B45309]"
              }`}
            >
              1. Estabilización
            </button>
            <button
              type="button"
              onClick={() => setPhaseView("impact")}
              className={`min-h-[64px] px-4 py-3 rounded-[6px] border text-sm font-bold text-left transition-colors ${
                phaseView === "impact"
                  ? "bg-[#1E4D3B] border-[#163B2D] text-[#FFFFFF]"
                  : "bg-[#F6F3EC] border-[#D9D2C3] text-[#1A1D1F] hover:border-[#1E4D3B]"
              }`}
            >
              2. Reciprocidad
            </button>
            <button
              type="button"
              onClick={() => setPhaseView("preservation")}
              className={`min-h-[64px] px-4 py-3 rounded-[6px] border text-sm font-bold text-left transition-colors ${
                phaseView === "preservation"
                  ? "bg-[#1A1D1F] border-[#1A1D1F] text-[#F6F3EC]"
                  : "bg-[#F6F3EC] border-[#D9D2C3] text-[#1A1D1F] hover:border-[#1A1D1F]"
              }`}
            >
              3. Preservación 3D
            </button>
            <button
              type="button"
              onClick={handleSimulateTransition}
              className="min-h-[64px] px-4 py-3 rounded-[6px] border border-[#1E4D3B] bg-[#E7F1EC] text-[#1E4D3B] hover:bg-[#1E4D3B] hover:text-[#FFFFFF] text-sm font-bold transition-colors"
            >
              Simular Transición 80+
            </button>
          </div>

          {feedback && (
            <div
              role="status"
              className="p-4 rounded-[6px] bg-[#E7F1EC] border border-[#1E4D3B] text-[#1E4D3B] text-sm font-medium flex items-center gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" strokeWidth={2} />
              <span>{feedback}</span>
            </div>
          )}

          {simulationMatch && (
            <div className="p-4 rounded-[6px] bg-[#FEF3C7] border border-[#B45309] text-[#78350F] text-sm font-semibold">
              Fondo de Impacto Comunitario — Arbizu Labs (Simulación): contrapartida 2x activa para prototipos de
              reciprocidad y filamento solidario.
            </div>
          )}
        </section>

        {/* Bloque Operativo Según Fase Seleccionada */}
        {phaseView === "recovery" && (
          <section aria-labelledby="sec-recovery" className="bg-[#FFFFFF] border border-[#D9D2C3] rounded-[6px] p-6 sm:p-8 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E6E0D3] pb-3">
              <h2 id="sec-recovery" className="text-xl font-bold text-[#1A1D1F]">
                Asistencia Inmediata de Fricción Cero (Ley de Fitts &gt;= 64px)
              </h2>
              <span className="font-mono text-xs text-[#92400E] bg-[#FEF3C7] border border-[#B45309] px-2.5 py-1 rounded-[4px]">
                Optimistic UI &lt; 100ms
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => handleClaimAid("Ración Nutricional Diaria")}
                className="min-h-[64px] p-5 rounded-[6px] bg-[#B45309] hover:bg-[#92400E] text-[#FFFFFF] text-left flex flex-col justify-between gap-2 transition-colors"
              >
                <span className="font-bold text-base">Soberanía Alimentaria</span>
                <span className="text-xs opacity-95">Vale Ed25519 en nodo local · Sin formularios</span>
              </button>
              <button
                type="button"
                onClick={() => handleClaimAid("Tarea Micro-Ingreso 15m")}
                className="min-h-[64px] p-5 rounded-[6px] bg-[#F6F3EC] hover:bg-[#EFEAE0] border border-[#D9D2C3] hover:border-[#B45309] text-[#1A1D1F] text-left flex flex-col justify-between gap-2 transition-colors"
              >
                <span className="font-bold text-base">Micro-Tareas Verificadas</span>
                <span className="text-xs text-[#4B525A]">Micro-ingresos digitales • Liquidación directa</span>
              </button>
              <button
                type="button"
                onClick={() => handleClaimAid("Punto Seguro Comunitario")}
                className="min-h-[64px] p-5 rounded-[6px] bg-[#F6F3EC] hover:bg-[#EFEAE0] border border-[#D9D2C3] hover:border-[#B45309] text-[#1A1D1F] text-left flex flex-col justify-between gap-2 transition-colors"
              >
                <span className="font-bold text-base">Puntos Seguros &amp; Refugio</span>
                <span className="text-xs text-[#4B525A]">Disponibilidad zonal con K-Anonymity 4h</span>
              </button>
            </div>
          </section>
        )}

        {phaseView === "impact" && (
          <section aria-labelledby="sec-impact" className="bg-[#FFFFFF] border border-[#D9D2C3] rounded-[6px] p-6 sm:p-8 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E6E0D3] pb-3">
              <h2 id="sec-impact" className="text-xl font-bold text-[#1A1D1F]">
                Simulador de Reciprocidad Comunitaria
              </h2>
              <span className="font-mono text-xs text-[#1E4D3B] bg-[#E7F1EC] border border-[#1E4D3B] px-2.5 py-1 rounded-[4px]">
                Fase 2 · Verde Bosque
              </span>
            </div>
            <p className="text-sm text-[#4B525A]">
              Simulación de canalización directa sin retención intermedia. Cada módulo muestra el equivalente en
              raciones alimentarias o gramos de filamento virgen para réplicas 3D sanitizadas.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[1, 5, 10, 25].map((usd) => (
                <button
                  key={usd}
                  type="button"
                  onClick={() => handleSimulatePledge(usd)}
                  className={`min-h-[64px] px-4 py-3 rounded-[6px] border font-mono text-sm font-bold flex flex-col items-center justify-center transition-colors ${
                    usd === 25
                      ? "bg-[#1E4D3B] hover:bg-[#163B2D] border-[#1E4D3B] text-[#FFFFFF]"
                      : "bg-[#F6F3EC] hover:bg-[#EFEAE0] border-[#D9D2C3] text-[#1A1D1F]"
                  }`}
                >
                  <span>${usd} USD</span>
                  <span className="text-[11px] font-normal opacity-85">{usd * 25}g PETG</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {phaseView === "preservation" && (
          <section aria-labelledby="sec-pres" className="bg-[#FFFFFF] border border-[#D9D2C3] rounded-[6px] p-6 sm:p-8 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E6E0D3] pb-3">
              <h2 id="sec-pres" className="text-xl font-bold text-[#1A1D1F]">
                Puente Preservación 3D · Hellbot Magna 2 Dual 300
              </h2>
              <span className="font-mono text-xs text-[#1A1D1F] bg-[#EFEAE0] border border-[#D9D2C3] px-2.5 py-1 rounded-[4px]">
                Protocolos 1.1 – 3.1
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-[#F6F3EC] border border-[#D9D2C3] rounded-[6px] p-4 space-y-2">
                <div className="font-mono text-xs font-bold text-[#B45309] uppercase">1. Escaneo &amp; Escala</div>
                <p className="text-[#4B525A] leading-relaxed">
                  Calibración estricta con cubo de 20x20 mm (&lt;= 1.50% desvío), polarización cruzada sin talco
                  abrasivo y empaquetado abierto <code>.3MF</code> &lt; 50 MB.
                </p>
              </div>
              <div className="bg-[#F6F3EC] border border-[#D9D2C3] rounded-[6px] p-4 space-y-2">
                <div className="font-mono text-xs font-bold text-[#1E4D3B] uppercase">2. Bioseguridad &amp; Triaje</div>
                <p className="text-[#4B525A] leading-relaxed">
                  Sanitización libre de alcohol isopropanol y detección pediátrica de piezas frágiles: las piezas
                  históricas pasan a museo aliado y se canjean por bobinas virgenes.
                </p>
              </div>
              <div className="bg-[#F6F3EC] border border-[#D9D2C3] rounded-[6px] p-4 space-y-2">
                <div className="font-mono text-xs font-bold text-[#1A1D1F] uppercase">3. Producción en Taller</div>
                <p className="text-[#4B525A] leading-relaxed">
                  Las réplicas estériles se imprimen en el taller <strong>Hellbot Magna 2</strong> de San Carlos de
                  Bolívar con grabado bajorrelieve y firma Ed25519 verificable.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Tarjetas Documentales con WebP Optimizadas (CLS = 0) */}
        <section aria-labelledby="sec-causes" className="space-y-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="sec-causes" className="text-2xl font-bold text-[#1A1D1F]">
              Programas de Campo Documentados
            </h2>
            <span className="font-mono text-xs text-[#4B525A]">
              WebP comprimido (&lt; 220 KB total) · CLS = 0
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CAUSES.map((cause) => (
              <article
                key={cause.id}
                className="bg-[#FFFFFF] border border-[#D9D2C3] rounded-[6px] overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[960/644] bg-[#EFEAE0] border-b border-[#D9D2C3] overflow-hidden">
                    <img
                      src={cause.image}
                      alt={cause.title}
                      width={cause.width}
                      height={cause.height}
                      className="w-full h-full object-cover block"
                      loading="eager"
                    />
                  </div>
                  <div className="p-5 space-y-2.5">
                    <span className="inline-block px-2.5 py-1 rounded-[3px] bg-[#E7F1EC] text-[#1E4D3B] border border-[#1E4D3B] font-mono text-[11px] font-bold uppercase">
                      {cause.tag}
                    </span>
                    <h3 className="text-lg font-bold text-[#1A1D1F] leading-snug">{cause.title}</h3>
                    <p className="text-sm text-[#4B525A] leading-relaxed">{cause.description}</p>
                  </div>
                </div>
                <div className="px-5 pb-5 pt-2 space-y-2">
                  <div className="w-full h-2 bg-[#EFEAE0] rounded-[2px] overflow-hidden border border-[#D9D2C3]">
                    <div
                      className="h-full bg-[#1E4D3B]"
                      style={{ width: `${cause.progressPct}%` }}
                    />
                  </div>
                  <div className="font-mono text-[11px] text-[#4B525A] font-semibold">{cause.metrics}</div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Arquitectura Criptográfica, 2G USSD y Sinergias Sociales (Anillo 2 -> Anillo 3) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#FFFFFF] border border-[#D9D2C3] rounded-[6px] p-6 space-y-4">
            <div className="flex items-center gap-2 text-[#1E4D3B] font-mono text-xs font-bold uppercase">
              <ShieldCheck className="w-4 h-4" strokeWidth={1.75} />
              <span>Criptografía Cívica &amp; Canal 2G Offline</span>
            </div>
            <h2 className="text-xl font-bold text-[#1A1D1F]">Privacidad sin Vigilancia (Ley 25.326)</h2>
            <ul className="space-y-2.5 text-sm text-[#4B525A]">
              <li className="flex items-start gap-2.5">
                <Layers className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#1A1D1F]">Firmas Ed25519 offline:</strong> verificación local de vales y
                  fichas 3D en dispositivos sin internet ni servidores centrales activos.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#1E4D3B] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#1A1D1F]">Cifrado FLE:v2 + Crypto-Shredding:</strong> borrado irrecuperable
                  destruyendo la clave por beneficiario y ofuscación K-Anonymity en ventanas de 4h.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Radio className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#1A1D1F]">Red 2G / USSD / SMS Headless:</strong> operación de emergencia sin
                  smartphones ni planes de datos móviles.
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-[#FFFFFF] border border-[#D9D2C3] rounded-[6px] p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#B45309] font-mono text-xs font-bold uppercase">
                <HeartHandshake className="w-4 h-4" strokeWidth={1.75} />
                <span>Red Sin Fines de Lucro · Arbizu Labs</span>
              </div>
              <h2 className="text-xl font-bold text-[#1A1D1F]">Sinergias Abiertas del Ecosistema</h2>
              <p className="text-sm text-[#4B525A] leading-relaxed">
                Separación estricta de anillos: este espacio agrupa únicamente iniciativas de impacto cívico,
                rescate solidario e infraestructura social gratuita, sin mezclar el catálogo B2B comercial.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <a
                href="https://pawhero.aldoarbizu.com"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[64px] px-4 py-3 rounded-[6px] border border-[#1E4D3B] bg-[#E7F1EC] hover:bg-[#1E4D3B] text-[#1E4D3B] hover:text-[#FFFFFF] flex items-center justify-between text-sm font-bold transition-colors"
              >
                <span className="inline-flex items-center gap-2">
                  <Printer className="w-4 h-4" />
                  <span>PawHero — Protección Animal &amp; Refugios</span>
                </span>
                <span className="font-mono text-xs">0% COMISIÓN</span>
              </a>

              <a
                href="https://santuario.aldoarbizu.com"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[64px] px-4 py-3 rounded-[6px] border border-[#D9D2C3] bg-[#F6F3EC] hover:border-[#1A1D1F] text-[#1A1D1F] flex items-center justify-between text-sm font-bold transition-colors"
              >
                <span className="inline-flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#4B525A]" />
                  <span>Anillo 3: Santuario YO SOY (Biblioteca Contemplativa)</span>
                </span>
                <span className="font-mono text-xs text-[#4B525A]">EXTERNO ↗</span>
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
