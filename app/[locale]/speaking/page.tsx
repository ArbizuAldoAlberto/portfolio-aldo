'use client';
import Link from 'next/link';
import { Calendar, Video, BookOpen, ArrowLeft, Mic } from 'lucide-react';
import GlitchText from '../../../components/ui/GlitchText';

export default function SpeakingPage() {
  const engagements = [
    {
      title: "Offline-First DeFi: Building Bots That Survive Network Failures",
      event: "ETH Buenos Aires 2026",
      date: "October 15, 2026",
      location: "Buenos Aires, Argentina",
      type: "Talk & Demo",
      description: "How to design transactional queues using SQLite WAL and WebSocket handlers to prevent slippage and trade failures in low-connectivity zones."
    },
    {
      title: "Multi-Chain Portfolio Tracking with The Graph",
      event: "Devcon 8",
      date: "November 20, 2026",
      location: "Bangkok, Thailand",
      type: "Technical Workshop",
      description: "Hands-on guide on subgraphs, handling blockchain reorganizations, and synchronizing user portfolio ledger balances in real-time."
    },
    {
      title: "SQLite WAL for High-Frequency Crypto Trading",
      event: "Web3 Summit 2025",
      date: "August 12, 2025",
      location: "Remote",
      type: "Virtual Keynote",
      description: "Analyzing the performance thresholds of on-device SQLite databases in streaming order book telemetry feeds."
    },
    {
      title: "Offline-First Architecture for Mobile Apps",
      event: "React Native Conf 2025",
      date: "May 05, 2025",
      location: "Online",
      type: "Panel Discussion",
      description: "Best practices for Zustand state persistence, local sync conflicts resolution, and optimizing native JS bridges."
    }
  ];

  return (
    <div className="min-h-screen bg-[#050508] text-slate-100 py-24 px-6 relative font-sans">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:30px_30px] opacity-20 pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-[var(--color-orbital-teal)] transition mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> BACK TO NODE
        </Link>

        <div className="flex items-center gap-4 mb-12 border-b border-zinc-900 pb-8">
          <Mic className="w-12 h-12 text-[var(--color-orbital-teal)]" />
          <div>
            <h1 className="text-4xl font-serif font-bold text-white tracking-tight">
              <GlitchText speed={120} text="Speaking & Workshops" className="text-white" />
            </h1>
            <p className="text-zinc-500 font-mono text-xs mt-1 uppercase tracking-widest">Thought leadership, tech talks and hands-on workshops</p>
          </div>
        </div>

        <section className="space-y-8 mb-16">
          {engagements.map((eng, idx) => (
            <div 
              key={idx} 
              className="p-8 rounded-2xl bg-zinc-950/60 border border-zinc-900 hover:border-zinc-800 transition flex flex-col md:flex-row md:items-start justify-between gap-6"
            >
              <div className="space-y-3 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-zinc-900 border border-zinc-850 text-[var(--color-orbital-teal)] font-bold uppercase tracking-wider">
                    {eng.type}
                  </span>
                  <span className="text-xs font-mono text-zinc-500">{eng.date}</span>
                </div>
                <h3 className="text-xl font-bold text-white leading-snug">{eng.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{eng.description}</p>
              </div>

              <div className="text-right md:min-w-[200px] font-mono text-xs space-y-1 text-zinc-500">
                <div className="text-white font-bold">{eng.event}</div>
                <div>{eng.location}</div>
              </div>
            </div>
          ))}
        </section>

        {/* Call to action */}
        <section className="p-8 rounded-2xl bg-zinc-950 border border-zinc-900 text-center">
          <h3 className="text-lg font-bold text-white mb-2">Book Me for Your Event</h3>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            I speak globally on offline-first architecture, mobile performance optimization, n8n automations, and DeFi systems.
          </p>
          <a 
            href="mailto:arbizualdoalberto@gmail.com"
            className="inline-block py-3 px-8 rounded bg-transparent border border-[var(--color-orbital-teal)]/30 hover:border-[var(--color-orbital-teal)] text-white hover:text-black hover:bg-[var(--color-orbital-teal)] font-mono tracking-widest text-xs font-bold transition-all"
          >
            CONTACT SPEAKER NODE
          </a>
        </section>
      </div>
    </div>
  );
}
