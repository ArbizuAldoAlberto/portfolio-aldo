"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { soundEngine } from "./system/SoundEngine";
import { useLocale } from "next-intl";

export default function ServicesSection() {
  const locale = useLocale();
  const isEs = locale === "es";

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
    <section id="servicios" className="py-24 sm:py-36 px-4 sm:px-6 lg:px-8 border-b border-white/10 max-w-7xl mx-auto">
      <div className="mb-16 sm:mb-20 text-center sm:text-left">
        <span className="font-mono text-xs text-emerald-400 font-semibold uppercase tracking-widest block mb-2">
          {isEs ? "// INVERSIÓN Y ALCANCE B2B" : "// B2B INVESTMENT & SCOPE"}
        </span>
        <h2 className="text-3xl sm:text-5xl font-sans font-bold text-white tracking-tight">
          {isEs ? "Arquitectura de Software Corporativa." : "Enterprise Software Architecture."}
        </h2>
        <p className="text-slate-300 font-sans text-sm sm:text-base max-w-2xl mt-4 leading-relaxed">
          {isEs ? (
            <>
              Servicios de consultoría y desarrollo a través de <strong>Arbizu Labs</strong>. Alcance cerrado, código
              documentado y contratos transparentes.
            </>
          ) : (
            <>
              Engineering consultancy and software delivery via <strong>Arbizu Labs</strong>. Fixed scope, documented
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
            className={`p-6 sm:p-8 rounded-2xl border flex flex-col justify-between relative shadow-xl ${
              service.highlight
                ? "bg-black/80 border-emerald-500/50 shadow-[0_0_25px_rgba(52,211,153,0.15)]"
                : "bg-black/60 border-white/10 hover:border-white/20"
            }`}
          >
            {service.highlight && (
              <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-emerald-400 text-slate-950 font-mono text-[10px] font-bold uppercase tracking-wider shadow-md">
                {isEs ? "MÁS SOLICITADO" : "MOST POPULAR"}
              </div>
            )}

            <div>
              <span
                className={`font-mono text-xs font-bold uppercase ${
                  service.accent === "amber" ? "text-amber-400" : "text-emerald-400"
                }`}
              >
                {service.tag}
              </span>
              <h3 className="text-2xl font-sans font-bold text-white mt-2 mb-2">{service.title}</h3>
              <div className="font-mono text-3xl font-bold text-white mb-6">{service.price}</div>
              <ul className="space-y-3 font-sans text-xs sm:text-sm text-slate-300 mb-8">
                {service.features.map((f, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <Check
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        service.accent === "amber" ? "text-amber-400" : "text-emerald-400"
                      }`}
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href="#contacto"
              onMouseEnter={() => soundEngine.playHover()}
              onClick={() => soundEngine.playClick()}
              className={`w-full py-3.5 rounded-xl text-center font-mono text-xs font-bold transition-all duration-300 shadow-md ${
                service.highlight
                  ? "bg-emerald-400 text-slate-950 hover:bg-emerald-300"
                  : "bg-white/10 border border-white/15 text-white hover:bg-white/20"
              }`}
            >
              {isEs ? "CONSULTAR DISPONIBILIDAD" : "CHECK AVAILABILITY"}
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
