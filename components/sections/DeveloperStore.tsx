"use client";

import { Smartphone, Bot, Zap, ExternalLink, Code2 } from "lucide-react";
import { useLocale } from "next-intl";

export default function DeveloperStore() {
  const locale = useLocale();
  const isEs = locale === "es";

  const KITS = [
    {
      title: "React Native Offline-First",
      price: "$29",
      tag: isEs ? "BOILERPLATE MÓVIL" : "MOBILE BOILERPLATE",
      description: isEs
        ? "Base de producción para apps móviles que operan sin internet. SQLite con WAL, Expo EAS y cola de sincronización asíncrona."
        : "Production boilerplate for Offline-First mobile apps. SQLite WAL mode, Expo EAS bare workflow, and async background sync.",
      url: "https://arbizualdo.gumroad.com/l/offline-starter",
      icon: Smartphone,
    },
    {
      title: "n8n CRM Lead Scoring",
      price: "$19",
      tag: isEs ? "FLUJO N8N & AI" : "N8N WORKFLOW & AI",
      description: isEs
        ? "Workflow n8n para captura y calificación de leads con Google Gemini AI, sincronización CRM y alertas en Telegram."
        : "Complete n8n workflow for lead capture & automated scoring with Google Gemini AI, CRM sync, and instant Telegram alerts.",
      url: "https://arbizualdo.gumroad.com/l/n8n-crm",
      icon: Bot,
    },
    {
      title: "TitanFlow Alerts Lite",
      price: "$14",
      tag: isEs ? "MONITOR PYTHON TELEGRAM" : "PYTHON TELEMETRY CLI",
      description: isEs
        ? "Monitor Python liviano sobre Binance API pública con alertas instantáneas por umbrales configurables en Telegram."
        : "Lightweight Python CLI monitor polling Binance public ticker feeds with instant upper/lower threshold alerts on Telegram.",
      url: "https://arbizualdo.gumroad.com/l/titan-alerts",
      icon: Zap,
    },
  ];

  return (
    <section id="store" className="py-8 sm:py-10 bg-[#060709] border-t border-[#1B202B]">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[#1B202B] pb-4">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[#D4AF37] mb-2">
              <Code2 className="w-3.5 h-3.5 text-[#D4AF37]" strokeWidth={1.5} />
              <span>{isEs ? "HERRAMIENTAS & BOILERPLATES" : "ENGINEERING BOILERPLATES"}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-sans font-bold text-[#F6F7F9] tracking-tight">
              Digital Store &amp; Kits Técnicos
            </h2>
          </div>
          <p className="text-[#8A93A6] font-sans text-xs sm:text-sm max-w-xl leading-relaxed">
            {isEs
              ? "Código tipado en TypeScript y Python listo para entornos sin red estable y despliegues en producción."
              : "Production-ready TypeScript and Python foundations engineered for unreliable networks."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {KITS.map((item, i) => {
            const Icon = item.icon;
            return (
              <article
                key={i}
                className="p-4 sm:p-5 rounded-[2px] bg-[#0B0D12] border border-[#1B202B] hover:border-[#D4AF37] transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-[2px] bg-[#060709] border border-[#1B202B] flex items-center justify-center text-[#D4AF37]">
                      <Icon className="w-4 h-4" strokeWidth={1.5} />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#C2C8D4] bg-[#060709] border border-[#1B202B] px-2.5 py-1 rounded-[2px]">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-sans font-bold text-[#F2F0EA] mb-1.5">
                    {item.title}
                  </h3>
                  <div className="flex items-baseline gap-1.5 mb-2.5">
                    <span className="font-mono text-2xl font-extrabold text-[#D4AF37] tabular-nums">{item.price}</span>
                    <span className="font-mono text-xs text-[#8A93A6]">USD</span>
                  </div>

                  <p className="font-sans text-xs sm:text-sm text-[#C2C8D4] leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 min-h-[44px] rounded-[2px] border border-[#2A3140] bg-[#060709] hover:border-[#D4AF37] hover:text-[#D4AF37] text-[#F2F0EA] font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  <span>{isEs ? "Ver en Gumroad" : "View on Gumroad"}</span>
                  <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
