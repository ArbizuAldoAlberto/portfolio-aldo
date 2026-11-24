"use client";

import { useState, useEffect } from "react";
import { Check, X, Copy, MessageSquare, ShieldCheck } from "lucide-react";
import { useLocale } from "next-intl";

interface ServiceItem {
  title: string;
  price: string;
  tag: string;
  features: string[];
  highlight: boolean;
}

const getCoordinates = (isEs: boolean) => [
  {
    id: "mp",
    label: isEs ? "Mercado Pago (Alias Oficial)" : "Mercado Pago (Official Alias)",
    value: "aldoarbizu",
    sub: isEs ? "Titular: Aldo Alberto Arbizu · CUIT 20-38362060-1" : "Beneficiary: Aldo Alberto Arbizu · Tax ID 20-38362060-1",
  },
  {
    id: "galicia",
    label: isEs ? "Banco Galicia (Alias)" : "Banco Galicia (Alias)",
    value: "ALDO.ARBIZU.GALICIA",
    sub: isEs ? "Cuenta Corriente / Caja de Ahorro Corporativa" : "Corporate Checking & Business Account",
  },
  {
    id: "cbu",
    label: isEs ? "CBU Unificado (Transferencia Bancaria)" : "Unified CBU (Bank Wire Transfer)",
    value: "0070149130004016919618",
    sub: isEs ? "Acreditación inmediata 24/7 (COELSA)" : "Instant 24/7 settlement (COELSA Clearing)",
  },
  {
    id: "web3",
    label: "Web3 / Cripto (USDT · USDC — Base L2 / ERC-20)",
    value: "0xb73ca1C37e9aA57F3051A0E8381Ca9CBA772A718",
    sub: isEs ? "Liquidación internacional sin intermediarios" : "Direct borderless settlement with zero intermediaries",
  },
];

export default function ServicesSection() {
  const locale = useLocale();
  const isEs = locale === "es";
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
    setCopiedId(id);
    setTimeout(() => setCopiedId((prev) => (prev === id ? null : prev)), 2200);
  };

  const SERVICES: ServiceItem[] = [
    {
      title: "Mobile Offline-First",
      price: isEs ? "Desde USD 3,000" : "From USD 3,000",
      tag: "MOBILE ARCHITECTURES",
      features: isEs
        ? [
            "React Native + SQLite WAL embebido",
            "Sincronización asíncrona bidireccional",
            "Seguridad bajo estándar OWASP MASVS",
            "Alto contraste operativo bajo sol directo",
          ]
        : [
            "React Native + Embedded SQLite WAL",
            "Bidirectional asynchronous cloud sync",
            "Security hardened under OWASP MASVS",
            "High-contrast UX for direct outdoor sunlight",
          ],
      highlight: false,
    },
    {
      title: isEs ? "SaaS & Plataformas Críticas" : "SaaS & Critical Platforms",
      price: isEs ? "Desde USD 5,000" : "From USD 5,000",
      tag: "FULLSTACK B2B",
      features: isEs
        ? [
            "Next.js 16 + PostgreSQL / Supabase RLS 60/60",
            "Pasarelas híbridas (MercadoPago / Galicia / Base L2)",
            "Telemetría operativa y auditoría criptográfica",
            "Entrega llave en mano con código propietario",
          ]
        : [
            "Next.js 16 + PostgreSQL / Supabase 60/60 RLS",
            "Hybrid checkout (Bank / Stripe / Crypto L2)",
            "Operational telemetry and SHA-256 audit trail",
            "Turnkey handoff with full source ownership",
          ],
      highlight: true,
    },
    {
      title: isEs ? "Automatización n8n + IA" : "n8n + AI Automation",
      price: isEs ? "Desde USD 800" : "From USD 800",
      tag: "AI & AUTOMATION",
      features: isEs
        ? [
            "Flujos n8n comerciales desatendidos 24/7",
            "Integración con Gemini, Claude o modelos locales",
            "Calificación de leads y alertas en Telegram / WhatsApp",
            "Reducción medible de horas operativas",
          ]
        : [
            "Unattended 24/7 n8n commercial workflows",
            "Integration with Gemini, Claude, or local LLMs",
            "Automated lead scoring & Telegram alerts",
            "Direct reduction in manual operational hours",
          ],
      highlight: false,
    },
  ];

  return (
    <section id="servicios" className="py-8 sm:py-10 bg-[#060709] border-t border-[#1B202B]" data-section="cta">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[#1B202B] pb-4">
          <div>
            <span className="font-mono text-[11px] text-[#D4AF37] font-semibold uppercase tracking-[0.14em] block mb-2">
              {isEs ? "INVERSIÓN & ALCANCE" : "B2B INVESTMENT & SCOPE"}
            </span>
            <h2 className="text-2xl sm:text-4xl font-sans font-bold text-[#F6F7F9] tracking-tight">
              {isEs ? "Arquitectura de Software Corporativa" : "Enterprise Software Architecture"}
            </h2>
          </div>
          <p className="text-[#8A93A6] font-sans text-xs sm:text-sm max-w-xl leading-relaxed">
            {isEs
              ? "Consultoría e ingeniería a medida vía Arbizu Labs. Alcance cerrado, código auditado y contratos transparentes."
              : "Engineering consultancy and delivery via Arbizu Labs. Fixed scope, documented codebases, and full source ownership."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SERVICES.map((service, i) => (
            <article
              key={i}
              className={`p-5 rounded-[2px] border flex flex-col justify-between transition-colors ${
                service.highlight
                  ? "bg-[#11151D] border-[#D4AF37]"
                  : "bg-[#0B0D12] border-[#1B202B] hover:border-[#D4AF37]/60"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                    {service.tag}
                  </span>
                  {service.highlight && (
                    <span className="px-2 py-0.5 rounded-[2px] bg-[#D4AF37] text-[#060709] font-mono text-[10px] font-extrabold uppercase tracking-wider">
                      {isEs ? "RECOMENDADO" : "RECOMMENDED"}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-sans font-bold text-[#F6F7F9] mb-1.5">{service.title}</h3>
                <div className="font-mono text-2xl font-bold text-[#F2F0EA] mb-3.5 tabular-nums">{service.price}</div>
                <ul className="space-y-1.5 font-sans text-xs sm:text-sm text-[#C2C8D4] mb-4">
                  {service.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 shrink-0 mt-0.5 text-[#D4AF37]" strokeWidth={1.75} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => setSelectedService(service)}
                className={`w-full py-3 px-4 min-h-[44px] rounded-[2px] font-mono text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer ${
                  service.highlight
                    ? "bg-[#D4AF37] hover:bg-[#F2F0EA] text-[#060709]"
                    : "bg-[#060709] border border-[#2A3140] text-[#F2F0EA] hover:border-[#D4AF37]"
                }`}
              >
                {isEs ? "Consultar Disponibilidad" : "Check Availability"}
              </button>
            </article>
          ))}
        </div>
      </div>

      {selectedService && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85"
          role="dialog"
          aria-modal="true"
          aria-labelledby="b2b-scope-title"
          onClick={() => setSelectedService(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl rounded-[2px] bg-[#0B0D12] border border-[#D4AF37] p-6 sm:p-8 text-left"
          >
            <button
              type="button"
              onClick={() => setSelectedService(null)}
              aria-label={isEs ? "Cerrar consola B2B" : "Close B2B console"}
              className="absolute top-5 right-5 w-9 h-9 rounded-[2px] bg-[#060709] border border-[#1B202B] flex items-center justify-center text-[#C2C8D4] hover:text-[#F6F7F9] hover:border-[#D4AF37] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="inline-flex items-center gap-2 font-mono text-[11px] text-[#D4AF37] uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" strokeWidth={1.5} />
              <span>{selectedService.tag} · ARBIZU LABS B2B</span>
            </div>

            <h3 id="b2b-scope-title" className="text-2xl font-sans font-bold text-[#F6F7F9]">
              {selectedService.title}{" "}
              <span className="text-[#D4AF37] font-mono text-xl">({selectedService.price})</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#C2C8D4] mt-2 mb-5">
              {isEs
                ? "Reserva de sprint técnico o transferencia directa con facturación oficial:"
                : "Sprint reservation or direct wire/crypto settlement with official invoicing:"}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {getCoordinates(isEs).map((coord) => {
                const isCopied = copiedId === coord.id;
                return (
                  <div
                    key={coord.id}
                    className="p-3.5 rounded-[2px] bg-[#060709] border border-[#1B202B] flex flex-col justify-between gap-2"
                  >
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-wider text-[#D4AF37] font-bold">
                        {coord.label}
                      </div>
                      <div className="font-mono text-xs sm:text-sm text-[#F6F7F9] font-bold break-all mt-1">
                        {coord.value}
                      </div>
                      <div className="text-[11px] text-[#8A93A6] mt-0.5">{coord.sub}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(coord.id, coord.value)}
                      className={`mt-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-[2px] font-mono text-xs font-bold transition-colors cursor-pointer ${
                        isCopied
                          ? "bg-[#D4AF37] text-[#060709]"
                          : "bg-[#0B0D12] text-[#F2F0EA] hover:border-[#D4AF37] border border-[#1B202B]"
                      }`}
                    >
                      <Copy className="w-3.5 h-3.5" strokeWidth={1.5} />
                      <span>{isCopied ? "COPIADO" : isEs ? "COPIAR" : "COPY"}</span>
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <a
                href={`https://wa.me/5492314489197?text=${encodeURIComponent(
                  isEs
                    ? `Hola Aldo, quiero consultar disponibilidad e iniciar el paquete B2B "${selectedService.title}" (${selectedService.price}).`
                    : `Hello Aldo, I would like to inquire about availability and initiate the B2B package "${selectedService.title}" (${selectedService.price}).`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-[2px] bg-[#D4AF37] hover:bg-[#F2F0EA] text-[#060709] font-mono text-xs font-extrabold uppercase tracking-wider transition-colors"
              >
                <MessageSquare className="w-4 h-4" strokeWidth={1.5} />
                <span>{isEs ? "WhatsApp Directo (+54 9 2314 489197)" : "Direct WhatsApp (+54 9 2314 489197)"}</span>
              </a>
              <button
                type="button"
                onClick={() => setSelectedService(null)}
                className="w-full sm:w-auto py-3.5 px-5 rounded-[2px] bg-[#060709] border border-[#1B202B] font-mono text-xs text-[#C2C8D4] hover:text-[#F6F7F9] cursor-pointer"
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
