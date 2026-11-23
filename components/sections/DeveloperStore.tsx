"use client";

import { motion } from "framer-motion";
import { Smartphone, Bot, Zap, ExternalLink, Code2 } from "lucide-react";
import { soundEngine } from "../system/SoundEngine";
import { useTacticalAudio } from "../audio/useTacticalAudio";
import { useLocale } from "next-intl";

export default function DeveloperStore() {
  const locale = useLocale();
  const isEs = locale === "es";
  const { playHoverTick, playModeSwitch } = useTacticalAudio();

  const KITS = [
    {
      title: "React Native Offline-First",
      price: "$29",
      tag: isEs ? "BOILERPLATE MÓVIL" : "MOBILE BOILERPLATE",
      description: isEs
        ? "Boilerplate de producción para apps móviles que deben funcionar sin internet. SQLite con WAL, Expo EAS y Zustand auto-sync asíncrono."
        : "Production boilerplate for Offline-First mobile apps. SQLite WAL mode, Expo EAS bare workflow, and async background sync.",
      url: "https://arbizualdo.gumroad.com/l/offline-starter",
      icon: Smartphone,
    },
    {
      title: "n8n CRM Lead Scoring",
      price: "$19",
      tag: isEs ? "FLUJO N8N & AI" : "N8N WORKFLOW & AI",
      description: isEs
        ? "Workflow n8n completo para captura y scoring de leads con Google Gemini AI, integraciones de CRM y alertas en tiempo real en Telegram."
        : "Complete n8n workflow for lead capture & automated scoring with Google Gemini AI, CRM sync, and instant Telegram alerts.",
      url: "https://arbizualdo.gumroad.com/l/n8n-crm",
      icon: Bot,
    },
    {
      title: "TitanFlow Alerts Lite",
      price: "$14",
      tag: isEs ? "MONITOR PYTHON TELEGRAM" : "PYTHON TELEMETRY CLI",
      description: isEs
        ? "Script Python liviano para monitorear cotizaciones en Binance API con alertas instantáneas por umbrales configurables en Telegram."
        : "Lightweight Python CLI monitor polling Binance public ticker feeds with instant upper/lower threshold alerts on Telegram.",
      url: "https://arbizualdo.gumroad.com/l/titan-alerts",
      icon: Zap,
    },
  ];

  return (
    <section id="store" className="orbital-section py-20 sm:py-28">
      <div className="section-inner">
        <div className="mb-14 sm:mb-18 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] bg-[#0B0D12] border border-[#D4AF37]/40 font-mono text-xs text-[#D4AF37] mb-4">
            <Code2 className="w-3.5 h-3.5 text-[#D4AF37]" strokeWidth={1.5} />
            <span>{isEs ? "RECURSOS DE CÓDIGO // GUMROAD STORE" : "CODE RESOURCES // GUMROAD STORE"}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-sans font-bold text-[#F8FAFC] tracking-tight mb-4">
            Digital Store &amp; Boilerplates
          </h2>
          <p className="text-[#94A3B8] font-sans text-sm sm:text-base max-w-2xl leading-relaxed">
            {isEs
              ? "Acelera tu desarrollo con mis plantillas y herramientas de producción listas para usar. Código limpio, documentado, tipado en TypeScript/Python y optimizado para el mundo real."
              : "Accelerate your engineering with production-ready templates and tools. Clean, documented code typed in TypeScript/Python and built for real-world constraints."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {KITS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                onPointerEnter={playHoverTick}
                className="p-6 sm:p-8 rounded-[2px] bg-[#0B0D12] border border-[#1B202B] hover:border-[#D4AF37] transition-colors flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-11 h-11 rounded-[2px] bg-[#060709] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                      <Icon className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#D4AF37] bg-[#060709] border border-[#1B202B] px-2.5 py-1 rounded-[2px] font-bold">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-sans font-bold text-[#F2F0EA] mb-2 group-hover:text-[#FF4F00] transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-baseline gap-1.5 mb-4">
                    <span className="font-mono text-3xl font-extrabold text-[#F2F0EA]">{item.price}</span>
                    <span className="font-mono text-xs text-[#8A93A6]">USD</span>
                  </div>

                  <p className="font-sans text-xs sm:text-sm text-[#C2C8D4] leading-relaxed mb-8">
                    {item.description}
                  </p>
                </div>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => {
                    soundEngine.playHover();
                    playHoverTick();
                  }}
                  onClick={() => {
                    soundEngine.playClick();
                    playModeSwitch("pbr");
                  }}
                  className="w-full py-3.5 px-4 rounded-[2px] bg-[#FF4F00] hover:bg-[#D4AF37] text-[#060709] font-mono text-xs font-extrabold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  <span>{isEs ? "Adquirir en Gumroad" : "Buy on Gumroad"}</span>
                  <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
