"use client";

import { motion } from "framer-motion";
import { Smartphone, Bot, Zap, ExternalLink, Code2 } from "lucide-react";
import { soundEngine } from "../system/SoundEngine";
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
        ? "Boilerplate de producción para apps móviles que deben funcionar sin internet. SQLite con WAL, Expo EAS y Zustand auto-sync asíncrono."
        : "Production boilerplate for Offline-First mobile apps. SQLite WAL mode, Expo EAS bare workflow, and async background sync.",
      url: "https://arbizualdo.gumroad.com/l/offline-starter",
      icon: Smartphone,
      color: "emerald",
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
      color: "purple",
    },
    {
      title: "TitanFlow Alerts Lite",
      price: "$14",
      tag: isEs ? "SCRIPT PYTHON QUANT" : "PYTHON QUANT SCRIPT",
      description: isEs
        ? "Monitoreo en tiempo real de spreads de arbitraje en Binance Spot/Futures mediante WebSockets de baja latencia con notificaciones Telegram."
        : "Real-time basis & funding spread monitor on Binance Spot/Futures via low-latency WebSockets with instant Telegram alerts.",
      url: "https://arbizualdo.gumroad.com/l/titan-alerts",
      icon: Zap,
      color: "amber",
    },
  ];

  return (
    <section id="store" className="py-24 sm:py-36 px-4 sm:px-6 lg:px-8 border-b border-white/10 max-w-7xl mx-auto">
      {/* Encabezado */}
      <div className="mb-16 sm:mb-20 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 font-mono text-xs text-emerald-400 mb-4">
          <Code2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{isEs ? "RECURSOS DE CÓDIGO // GUMROAD STORE" : "CODE RESOURCES // GUMROAD STORE"}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-sans font-bold text-white tracking-tight mb-4">
          Digital Store & Boilerplates
        </h2>
        <p className="text-slate-300 font-sans text-sm sm:text-base max-w-2xl leading-relaxed">
          {isEs
            ? "Acelera tu desarrollo con mis plantillas y herramientas de producción listas para usar. Código limpio, documentado, tipado en TypeScript/Python y optimizado para el mundo real."
            : "Accelerate your engineering with production-ready templates and tools. Clean, documented code typed in TypeScript/Python and built for real-world constraints."}
        </p>
      </div>

      {/* Grid de Productos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {KITS.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="p-6 sm:p-8 rounded-2xl bg-black/60 border border-white/10 hover:border-emerald-500/50 transition-all flex flex-col justify-between group shadow-xl"
            >
              <div>
                {/* Header de la Card */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-black/80 border border-white/15 flex items-center justify-center text-emerald-400 group-hover:text-emerald-300 group-hover:border-emerald-500/40 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full font-bold">
                    {item.tag}
                  </span>
                </div>

                {/* Título y Precio */}
                <h3 className="text-xl sm:text-2xl font-sans font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-baseline gap-1.5 mb-4">
                  <span className="font-mono text-3xl font-black text-white">{item.price}</span>
                  <span className="font-mono text-xs text-slate-400">USD</span>
                </div>

                {/* Descripción */}
                <p className="font-sans text-xs sm:text-sm text-slate-300 leading-relaxed mb-8">
                  {item.description}
                </p>
              </div>

              {/* Botón de Compra en Gumroad */}
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => soundEngine.playHover()}
                onClick={() => soundEngine.playClick()}
                className="w-full py-3.5 px-4 rounded-xl bg-white/10 hover:bg-emerald-400 hover:text-slate-950 border border-white/15 hover:border-transparent text-white font-mono text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
              >
                <span>{isEs ? "Adquirir en Gumroad" : "Buy on Gumroad"}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
