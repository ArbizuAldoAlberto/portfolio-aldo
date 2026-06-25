'use client';
import { motion } from 'framer-motion';
import { ArrowRight, Smartphone, Bot, Zap, ExternalLink } from 'lucide-react';
import { useLocale } from 'next-intl';

export default function DeveloperStore() {
  const locale = useLocale();
  const isEs = locale === 'es';
  const isZh = locale === 'zh';

  const t = {
    title: isEs ? "Digital Store & Boilerplates" : isZh ? "数字商店与样板代码" : "Digital Store & Boilerplates",
    subtitle: isEs 
      ? "Acelera tu desarrollo con mis plantillas y herramientas de producción listas para usar. Código limpio, documentado y optimizado." 
      : isZh 
        ? "使用我开箱即用的生产级样板和工具加速您的开发。代码干净、文档齐全且经过优化。" 
        : "Speed up your development with my production-ready boilerplates and tools. Clean, documented, and optimized code.",
    buy: isEs ? "Adquirir en Gumroad" : isZh ? "在 Gumroad 购买" : "Get on Gumroad"
  };

  const kits = [
    {
      title: isEs ? "React Native Offline-First" : isZh ? "React Native 离线优先样板" : "React Native Offline-First",
      price: "$29",
      description: isEs 
        ? "Boilerplate de producción para apps móviles que deben funcionar sin internet. SQLite con WAL y Zustand auto-sync." 
        : isZh 
          ? "适用于必须在无网络环境下工作的移动应用的生产级样板。带有 WAL 的 SQLite 和 Zustand 自动同步。" 
          : "Production-ready boilerplate for mobile apps that must work offline. SQLite with WAL and Zustand auto-sync.",
      url: "https://arbizualdo.gumroad.com/l/offline-starter",
      icon: <Smartphone className="w-8 h-8 text-[#3BEACE]" />,
      badge: isEs ? "Boilerplate Móvil" : isZh ? "移动端样板" : "Mobile Boilerplate"
    },
    {
      title: isEs ? "n8n CRM Lead Scoring" : isZh ? "n8n CRM 销售线索评分" : "n8n CRM Lead Scoring",
      price: "$19",
      description: isEs 
        ? "Workflow n8n completo para captura y scoring de leads con Google Gemini AI, integraciones de CRM y alertas en Telegram." 
        : isZh 
          ? "完整的 n8n 工作流，用于使用 Google Gemini AI 捕获线索并进行评分，整合 CRM 并发送 Telegram 警报。" 
          : "Complete n8n workflow for lead capture and scoring using Google Gemini AI, CRM integrations, and Telegram alerts.",
      url: "https://arbizualdo.gumroad.com/l/n8n-crm",
      icon: <Bot className="w-8 h-8 text-purple-400" />,
      badge: isEs ? "Flujo n8n" : isZh ? "n8n 工作流" : "n8n Workflow"
    },
    {
      title: isEs ? "TitanFlow Alerts Lite" : isZh ? "TitanFlow 警报精简版" : "TitanFlow Alerts Lite",
      price: "$14",
      description: isEs 
        ? "Monitoreo en tiempo real de spreads de arbitraje en Binance Spot/Futures mediante WebSockets con notificaciones Telegram." 
        : isZh 
          ? "通过 WebSockets 实时监控 Binance 现货/期货套利点差，支持 Telegram 即时通知。" 
          : "Real-time monitoring of arbitrage spreads on Binance Spot/Futures via WebSockets with instant Telegram alerts.",
      url: "https://arbizualdo.gumroad.com/l/titan-alerts",
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      badge: isEs ? "Script Python" : isZh ? "Python 脚本" : "Python Script"
    }
  ];

  return (
    <section id="store" className="py-32 bg-[var(--color-space-black)] border-t border-[var(--color-space-border)] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--color-orbital-teal)]/5 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="mb-16 md:flex md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="font-space text-[var(--color-orbital-teal)] uppercase tracking-widest text-xs mb-4 block select-none">
              {isEs ? "RECURSOS DE CÓDIGO" : isZh ? "代码资源" : "CODE RESOURCES"}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white font-bold mb-6">
              {t.title}
            </h2>
            <p className="font-mono text-xs text-[var(--color-mist-gray)]/80 leading-relaxed">
              {t.subtitle}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {kits.map((k, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="glass-surface p-8 rounded-2xl flex flex-col justify-between hover:border-[var(--color-orbital-teal)]/30 transition-all duration-300 group bg-black/40 backdrop-blur-xl border border-white/5"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-black/50 rounded-xl border border-white/5">
                    {k.icon}
                  </div>
                  <span className="font-space text-[9px] uppercase tracking-widest text-[var(--color-orbital-teal)] bg-[var(--color-orbital-teal)]/10 px-3 py-1 rounded-full font-bold">
                    {k.badge}
                  </span>
                </div>
                <h3 className="font-serif text-2xl text-white font-bold mb-2">{k.title}</h3>
                <div className="flex items-baseline gap-1.5 mb-6">
                  <span className="font-space text-3xl font-black text-white">{k.price}</span>
                  <span className="font-mono text-[10px] text-[var(--color-mist-gray)]/60">USD</span>
                </div>
                <p className="font-mono text-xs text-[var(--color-mist-gray)]/80 leading-relaxed mb-8">
                  {k.description}
                </p>
              </div>
              
              <a 
                href={k.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full py-3 rounded-xl font-bold bg-white/5 hover:bg-[var(--color-orbital-teal)] border border-white/10 hover:border-transparent hover:text-black flex items-center justify-center gap-2 text-white text-xs transition duration-300 font-space tracking-widest"
              >
                <span>{t.buy}</span> 
                <ExternalLink size={12} />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
