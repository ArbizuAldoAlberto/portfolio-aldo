import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, ShieldCheck, Terminal } from 'lucide-react';

export default async function SpeakingBriefingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEs = locale === 'es';

  const briefings = [
    {
      code: 'BRIEF-01',
      duration: '45 min · Executive & Engineering Review',
      title: isEs
        ? 'Arquitectura Offline-First con SQLite WAL y Sincronización Idempotente'
        : 'Offline-First Architecture with SQLite WAL & Idempotent Sync',
      summary: isEs
        ? 'Diseño de colas locales tolerantes a desconexiones totales en campo (0% 4G), resolución determinista de conflictos y respaldo WAL verificado.'
        : 'Designing zero-drop local persistence queues for 0% cellular zones, deterministic conflict resolution, and verifiable WAL recovery.',
      topics: ['SQLite WAL', 'Idempotency-Key', 'React Native / PWA', 'SYS-03 AgroMarket'],
    },
    {
      code: 'BRIEF-02',
      duration: '45 min · Security & Compliance Workshop',
      title: isEs
        ? 'Blindaje Multi-Tenant: Auditoría Automatizada de 60/60 Políticas PostgreSQL RLS'
        : 'Multi-Tenant Hardening: 60/60 Automated PostgreSQL RLS Verification',
      summary: isEs
        ? 'Eliminación de fugas entre tenants, reglas `TO authenticated`, Edge 4-Layer Shielding (HMAC + 429 + 413 + Kill-Switch) y pruebas de intrusión reproducibles.'
        : 'Eliminating cross-tenant leaks with strict RLS scopes, 4-layer API edge shielding, and reproducible adversarial test suites.',
      topics: ['PostgreSQL RLS', 'OWASP MASVS', 'Edge 4-Layer Shield', 'SYS-02 SentinelOS'],
    },
    {
      code: 'BRIEF-03',
      duration: '45 min · Quantitative Systems Briefing',
      title: isEs
        ? 'Paridad 1:1 Backtest/Live & Ejecución Algorítmica Pessimistic SL-First'
        : '1:1 Backtest/Live Parity & Pessimistic SL-First Algorithmic Execution',
      summary: isEs
        ? 'Ingesta por WebSocket sub-10ms en Binance Futures, evaluación conservadora OHLC, descuentos reales de Taker/Funding y adopción en caliente de posiciones.'
        : 'Sub-10ms WebSocket streaming, conservative OHLC execution modeling, taker/funding accounting, and deterministic position supervision.',
      topics: ['WebSockets <10ms', 'Pessimistic SL-First', 'Chandelier Trailing', 'SYS-01 TitanFlow'],
    },
    {
      code: 'BRIEF-04',
      duration: '60 min · Industrial Hardware & Thermal Audit',
      title: isEs
        ? 'Termografía FLIR Calibrada, Relevamiento LiDAR y Manufactura Paramétrica (ab3d-forge)'
        : 'Calibrated FLIR Thermography, LiDAR Field Telemetry & Parametric CAD',
      summary: isEs
        ? 'Protocolos de inspección termográfica en instalaciones agroindustriales y modelado paramétrico Blender headless para repuestos funcionales.'
        : 'Industrial thermal inspection workflows for grain storage and electrical panels paired with headless parametric CAD manufacturing.',
      topics: ['FLIR Ironbow', 'LiDAR ToF', 'Blender Headless', 'SYS-07 / SYS-08'],
    },
  ];

  return (
    <main className="min-h-screen bg-[#060709] text-[#F2F0EA] pt-28 pb-20 px-4 sm:px-6 lg:px-8 font-mono">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#8A93A6] hover:text-[#D4AF37] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {isEs ? 'Volver al Hub' : 'Back to Hub'}
          </Link>
        </div>

        <header className="border-b border-[#1B202B] pb-8 mb-12">
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#D4AF37] font-bold mb-3">
            <Terminal className="w-3.5 h-3.5" />
            // TECHNICAL BRIEFINGS, WORKSHOPS &amp; ARCHITECTURE REVIEWS
          </div>
          <h1 className="font-sans text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] text-[#F2F0EA] mb-4">
            {isEs
              ? 'Technical Briefings & Sesiones de Arquitectura'
              : 'Technical Briefings & Architecture Workshops'}
          </h1>
          <p className="font-sans text-base text-[#C2C8D4] max-w-3xl leading-relaxed">
            {isEs
              ? 'Sesiones técnicas privadas para equipos de ingeniería, CTOs y directorios industriales sobre arquitecturas reales en producción (sin material genérico).'
              : 'Private engineering briefings and hands-on architecture sessions for CTOs, VPs of Engineering, and industrial operations teams.'}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {briefings.map((b) => (
            <article
              key={b.code}
              className="p-6 sm:p-8 rounded-[2px] border border-[#1B202B] bg-[#0B0D12] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-[10px] uppercase tracking-widest mb-3">
                  <span className="text-[#FF4F00] font-bold">{b.code}</span>
                  <span className="text-[#00E599]">{b.duration}</span>
                </div>
                <h2 className="font-sans text-xl font-bold text-[#F2F0EA] mb-3 leading-snug">
                  {b.title}
                </h2>
                <p className="font-sans text-sm text-[#C2C8D4] leading-relaxed mb-5">{b.summary}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[#1B202B]">
                {b.topics.map((topic) => (
                  <span
                    key={topic}
                    className="px-2 py-0.5 rounded-[2px] border border-[#1B202B] bg-[#060709] text-[10px] text-[#8A93A6]"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <section className="p-6 sm:p-8 rounded-[2px] border border-[#D4AF37]/40 bg-[#0B0D12] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4AF37] font-bold mb-1">
              <ShieldCheck className="w-4 h-4" />
              {isEs ? 'SOLICITAR WORKSHOP PRIVADO / REVIEW' : 'REQUEST PRIVATE BRIEFING / WORKSHOP'}
            </div>
            <p className="font-sans text-sm text-[#C2C8D4]">
              {isEs
                ? 'Disponible en modalidad remota internacional (GMT-3) o auditoría técnica presencial en Argentina.'
                : 'Available for remote global engineering teams or on-site technical audits in Argentina.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href={`/${locale}#contacto`}
              className="px-5 py-3 rounded-[2px] bg-[#FF4F00] hover:bg-[#D4AF37] text-[#07080A] font-extrabold font-bold text-xs uppercase tracking-wider"
            >
              {isEs ? 'Coordinar Sesión' : 'Book Briefing'}
            </Link>
            <a
              href="https://wa.me/5492314489197?text=Hola%20Aldo,%20deseo%20coordinar%20un%20Technical%20Briefing%20para%20nuestro%20equipo."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-5 py-3 rounded-[2px] border border-[#1B202B] bg-[#060709] hover:border-[#00E599] text-[#F2F0EA] font-bold text-xs uppercase tracking-wider"
            >
              WhatsApp Directo <ArrowUpRight className="w-3.5 h-3.5 text-[#00E599]" />
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
