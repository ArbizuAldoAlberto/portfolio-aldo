"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, X, Copy, MessageSquare, ShieldCheck } from "lucide-react";
import { soundEngine } from "./system/SoundEngine";
import { useTacticalAudio } from "./audio/useTacticalAudio";
import { useLocale } from "next-intl";

interface ServiceItem {
  title: string;
  price: string;
  tag: string;
  features: string[];
  highlight: boolean;
  accent: string;
}

const B2B_COORDINATES = [
  {
    id: "mp",
    label: "Mercado Pago (Alias Oficial)",
    value: "aldoarbizu",
    sub: "Titular: Aldo Alberto Arbizu · CUIT 20-38362060-1",
  },
  {
    id: "galicia",
    label: "Banco Galicia (Alias)",
    value: "ALDO.ARBIZU.GALICIA",
    sub: "Cuenta Corriente / Caja de Ahorro Corporativa",
  },
  {
    id: "cbu",
    label: "CBU Unificado (Transferencia Bancaria)",
    value: "0070149130004016919618",
    sub: "Acreditación inmediata 24/7 (COELSA)",
  },
  {
    id: "web3",
    label: "Web3 / Cripto (USDT · USDC — Base L2 / ERC-20)",
    value: "0x71C95911E9a5D330f4D621842EC243EE1343292e",
    sub: "Liquidación internacional sin intermediarios",
  },
];

export default function ServicesSection() {
  const locale = useLocale();
  const isEs = locale === "es";
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { playHoverTick, playModeSwitch } = useTacticalAudio();

  useEffect(() => {
    if (!selectedService) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedService(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedService]);

  const handleCopy = async (id: string, val: string) => {
    try {
      await navigator.clipboard.writeText(val);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = val;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    soundEngine.playClick();
    playModeSwitch("pbr");
    setCopiedId(id);
    setTimeout(() => setCopiedId((prev) => (prev === id ? null : prev)), 2200);
  };

  const handleCardPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    card.style.setProperty("--mouse-x", `${(e.clientX - rect.left).toFixed(0)}px`);
    card.style.setProperty("--mouse-y", `${(e.clientY - rect.top).toFixed(0)}px`);
  };

  const SERVICES = [
    {
      title: "Mobile Offline-First",
      price: isEs ? "Desde USD 3,000" : "From USD 3,000",
      tag: "MOBILE SPECIALIZED",
      features: isEs
        ? [
            "React Native + SQLite WAL embebido",
            "Sincronización asíncrona bidireccional",
            "Seguridad bajo OWASP MASVS",
            "Diseño para visibilidad bajo sol de campo",
          ]
        : [
            "React Native + Embedded SQLite WAL",
            "Bidirectional asynchronous cloud sync",
            "Security hardened under OWASP MASVS",
            "High-contrast UX for direct outdoor sunlight",
          ],
      highlight: false,
      accent: "emerald",
    },
    {
      title: isEs ? "SaaS & Plataformas Web" : "SaaS & Web Platforms",
      price: isEs ? "Desde USD 5,000" : "From USD 5,000",
      tag: "FULLSTACK ARCHITECTURE",
      features: isEs
        ? [
            "Next.js 16 (App Router) + PostgreSQL / Supabase",
            "Pasarelas de cobro (Stripe / Crypto L2)",
            "Dashboards reactivos y métricas en vivo",
            "Optimización de velocidad y SEO Awwwards-grade",
          ]
        : [
            "Next.js 16 (App Router) + PostgreSQL / Supabase",
            "Payment gateways (Stripe / Crypto L2 Escrow)",
            "Reactive dashboards and live telemetry",
            "Awwwards-grade speed & SEO optimization",
          ],
      highlight: true,
      accent: "emerald",
    },
    {
      title: isEs ? "Automatización n8n + AI" : "n8n + AI Automation",
      price: isEs ? "Desde USD 800" : "From USD 800",
      tag: "AI & AUTOMATION",
      features: isEs
        ? [
            "Flujos n8n comerciales desatendidos 24/7",
            "Integración con Gemini, Claude o modelos locales",
            "Scoring de leads y alertas en Telegram / WhatsApp",
            "Reducción directa de horas operativas",
          ]
        : [
            "Unattended 24/7 n8n commercial workflows",
            "Integration with Gemini, Claude, or local LLMs",
            "Automated lead scoring & Telegram alerts",
            "Direct reduction in manual operational hours",
          ],
      highlight: false,
      accent: "amber",
    },
  ];

  return (
    <section id="servicios" className="cta" data-section="cta">
      <div className="section-inner">
        <div className="mb-14 sm:mb-18 text-center sm:text-left">
          <span className="font-mono text-xs text-[#D4AF37] font-semibold uppercase tracking-widest block mb-2">
            {isEs ? "// INVERSIÓN Y ALCANCE B2B" : "// B2B INVESTMENT & SCOPE"}
          </span>
          <h2 className="text-3xl sm:text-5xl font-sans font-bold text-[#F8FAFC] tracking-tight">
            {isEs ? "Arquitectura de Software Corporativa." : "Enterprise Software Architecture."}
          </h2>
          <p className="text-[#94A3B8] font-sans text-sm sm:text-base max-w-2xl mt-4 leading-relaxed">
            {isEs ? (
              <>
                Servicios de consultoría y desarrollo a través de <strong className="text-[#F8FAFC]">Arbizu Labs</strong>. Alcance cerrado, código
                documentado y contratos transparentes.
              </>
            ) : (
              <>
                Engineering consultancy and software delivery via <strong className="text-[#F8FAFC]">Arbizu Labs</strong>. Fixed scope, documented
                codebases, and transparent contracts.
              </>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {SERVICES.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              onPointerEnter={playHoverTick}
              onPointerMove={handleCardPointerMove}
              className={`group p-6 sm:p-8 rounded-2xl border flex flex-col justify-between relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.65)] ${
                service.highlight
                  ? "bg-[#070B12]/90 border-[#D4AF37]/55 shadow-[0_0_25px_rgba(212,175,55,0.16)]"
                  : "bg-[#070B12]/75 border-white/[0.08] hover:border-[#D4AF37]/40"
              }`}
            >
              {/* Halo especular reactivo al puntero */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    "radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(212, 175, 55, 0.14), transparent 72%)",
                }}
              />
              {/* Mechanical Corner Brackets */}
              <span className="card-bracket card-bracket--tl" aria-hidden="true" />
              <span className="card-bracket card-bracket--tr" aria-hidden="true" />
              <span className="card-bracket card-bracket--bl" aria-hidden="true" />
              <span className="card-bracket card-bracket--br" aria-hidden="true" />

              {service.highlight && (
                <div className="absolute top-3 right-6 px-3 py-1 rounded-lg bg-[#D4AF37] text-[#070B12] font-mono text-[10px] font-bold uppercase tracking-wider shadow-md z-10">
                  {isEs ? "MÁS SOLICITADO" : "MOST POPULAR"}
                </div>
              )}

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#070B12] border border-[#D4AF37]/35 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                      <circle cx="12" cy="12" r="9" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="2 3" />
                      <polygon points="12,5 18,12 12,19 6,12" stroke="#D4AF37" strokeWidth="1.5" />
                      <circle cx="12" cy="12" r="2" fill="#D4AF37" />
                    </svg>
                  </div>
                  <span className="font-mono text-xs font-bold uppercase text-[#D4AF37]">
                    {service.tag}
                  </span>
                </div>
                <h3 className="text-2xl font-sans font-bold text-[#F8FAFC] mt-2 mb-2">{service.title}</h3>
                <div className="font-mono text-3xl font-bold text-[#F8FAFC] mb-6">{service.price}</div>
                <ul className="space-y-3 font-sans text-xs sm:text-sm text-[#94A3B8] mb-8">
                  {service.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Check
                        className="w-4 h-4 shrink-0 mt-0.5 text-[#D4AF37]"
                        strokeWidth={1.5}
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                data-magnetic
                onMouseEnter={() => {
                  soundEngine.playHover();
                  playHoverTick();
                }}
                onClick={() => {
                  soundEngine.playClick();
                  playModeSwitch("xray");
                  setSelectedService(service);
                }}
                className="relative z-10 btn-magnetic w-full cursor-pointer"
              >
                <span className="btn-label">{isEs ? "CONSULTAR DISPONIBILIDAD" : "CHECK AVAILABILITY"}</span>
                <span className="btn-glow" aria-hidden="true" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Consola Modal Interactiva de Alcance Técnico & Facturación B2B */}
      {selectedService && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="b2b-scope-title"
          onClick={() => setSelectedService(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl rounded-2xl bg-[#070B12] border border-[#D4AF37]/40 p-6 sm:p-8 shadow-[0_24px_90px_rgba(0,0,0,0.9)] text-left"
          >
            <button
              type="button"
              onClick={() => setSelectedService(null)}
              aria-label={isEs ? "Cerrar consola B2B" : "Close B2B console"}
              className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#D4AF37]/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 font-mono text-[11px] text-[#D4AF37] mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" strokeWidth={1.5} />
              <span>{selectedService.tag} · ARBIZU LABS B2B</span>
            </div>

            <h3 id="b2b-scope-title" className="text-2xl sm:text-3xl font-sans font-bold text-[#F8FAFC]">
              {selectedService.title}{" "}
              <span className="text-[#D4AF37] font-mono text-xl sm:text-2xl">({selectedService.price})</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-2 mb-5">
              {isEs
                ? "Reserva de sprint técnico o transferencia directa con facturación oficial (Anticipo 50% para inicio de arquitectura):"
                : "Sprint reservation or direct wire/crypto settlement with official invoicing (50% deposit to kick off architecture):"}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {B2B_COORDINATES.map((coord) => {
                const isCopied = copiedId === coord.id;
                return (
                  <div
                    key={coord.id}
                    className="p-3.5 rounded-2xl bg-[#070B12] border border-white/[0.08] hover:border-[#D4AF37]/40 transition-colors flex flex-col justify-between gap-2"
                  >
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-wider text-[#D4AF37] font-bold">
                        {coord.label}
                      </div>
                      <div className="font-mono text-xs sm:text-sm text-[#F8FAFC] font-bold break-all mt-1">
                        {coord.value}
                      </div>
                      <div className="text-[11px] text-[#94A3B8] mt-0.5">{coord.sub}</div>
                    </div>
                    <button
                      type="button"
                      onMouseEnter={playHoverTick}
                      onClick={() => handleCopy(coord.id, coord.value)}
                      className={`mt-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-mono text-xs font-bold transition-all ${
                        isCopied
                          ? "bg-[#D4AF37] text-[#070B12]"
                          : "bg-white/[0.06] text-[#F8FAFC] hover:bg-[#D4AF37]/20 border border-white/[0.12]"
                      }`}
                    >
                      <Copy className="w-3.5 h-3.5" strokeWidth={1.5} />
                      <span>{isCopied ? "COPIADO ✓" : isEs ? "COPIAR COORDENADA" : "COPY COORDINATE"}</span>
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <a
                href={`https://wa.me/5492314489197?text=${encodeURIComponent(
                  `Hola Aldo, quiero consultar disponibilidad e iniciar el paquete B2B "${selectedService.title}" (${selectedService.price}).`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={playHoverTick}
                className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-[#D4AF37] text-[#070B12] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#E09F5A] transition-colors"
              >
                <MessageSquare className="w-4 h-4" strokeWidth={1.5} />
                <span>{isEs ? "WhatsApp Directo (+54 9 2314 489197)" : "Direct WhatsApp (+54 9 2314 489197)"}</span>
              </a>
              <button
                type="button"
                onClick={() => setSelectedService(null)}
                className="w-full sm:w-auto py-3.5 px-5 rounded-xl bg-white/5 border border-white/15 font-mono text-xs text-[#94A3B8] hover:text-[#F8FAFC]"
              >
                {isEs ? "Cerrar" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
