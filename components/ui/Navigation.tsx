"use client";

import { useState, useEffect } from "react";
import { Volume2, VolumeX, Eye, EyeOff, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "../../i18n/routing";
import { soundEngine } from "../system/SoundEngine";
import { useMotionPreferences } from "../system/MotionPreferences";

export default function Navigation() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { reducedMotion, toggleReducedMotion } = useMotionPreferences();
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    setIsMuted(soundEngine.isMuted());
    const unsub = soundEngine.subscribe((muted) => setIsMuted(muted));
    return unsub;
  }, []);

  const toggleLanguage = () => {
    soundEngine.playClick();
    const nextLocale = locale === "es" ? "en" : "es";
    router.replace(pathname, { locale: nextLocale });
  };

  const handleSoundToggle = () => {
    const next = soundEngine.toggleMute();
    setIsMuted(next);
  };

  const handleMotionToggle = () => {
    soundEngine.playClick();
    toggleReducedMotion();
  };

  return (
    <header className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-6xl pointer-events-none">
      <div className="flex items-center justify-between gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-full bg-[#07070A]/90 backdrop-blur-2xl border border-white/15 shadow-[0_10px_35px_rgba(0,0,0,0.8)] pointer-events-auto transition-all">
        {/* Brand & Live Beacon */}
        <Link
          href="/"
          onMouseEnter={() => soundEngine.playHover()}
          onClick={() => soundEngine.playClick()}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors group shrink-0"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="font-mono text-xs font-bold text-white tracking-wider uppercase group-hover:text-emerald-300 transition-colors">
            ALDO ARBIZU
          </span>
        </Link>

        {/* Links de Navegación Rápida */}
        <nav className="hidden lg:flex items-center gap-1 font-mono text-xs text-slate-300">
          {[
            { label: locale === "es" ? "FACTOR HÍBRIDO" : "HYBRID EDGE", href: "#sobre-mi" },
            { label: locale === "es" ? "CASOS REALES" : "PROJECTS", href: "#proyectos" },
            { label: locale === "es" ? "TIENDA & CÓDIGO" : "STORE & CODE", href: "#store" },
            { label: locale === "es" ? "SERVICIOS" : "SERVICES", href: "#servicios" },
            { label: locale === "es" ? "CONTACTO" : "CONTACT", href: "#contacto" },
          ].map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              onMouseEnter={() => soundEngine.playHover()}
              onClick={() => soundEngine.playClick()}
              className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-all font-medium"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Controles: Web Corporativa + Accesibilidad + Audio + Idioma */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Botón directo a arbizulabs.com */}
          <a
            href="https://arbizulabs.com"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => soundEngine.playHover()}
            onClick={() => soundEngine.playClick()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/80 hover:bg-emerald-900/90 border border-emerald-500/40 text-emerald-300 hover:text-white font-mono text-[11px] font-bold transition-all shadow-md"
            title={locale === "es" ? "Visitar web corporativa: Arbizu Labs" : "Visit corporate studio: Arbizu Labs"}
          >
            <span>ARBIZU LABS</span>
            <ExternalLink size={11} className="text-emerald-400" />
          </a>

          {/* Toggle de Reduce Motion */}
          <button
            onClick={handleMotionToggle}
            onMouseEnter={() => soundEngine.playHover()}
            title={
              reducedMotion
                ? locale === "es"
                  ? "Animaciones Reducidas (Activo)"
                  : "Reduced Motion (Active)"
                : locale === "es"
                ? "Animaciones Cinemáticas (Activo)"
                : "Cinematic Motion (Active)"
            }
            className={`p-2 rounded-full border transition-all ${
              reducedMotion
                ? "bg-amber-950/80 border-amber-500/60 text-amber-300"
                : "bg-white/10 border-white/15 text-slate-300 hover:text-white hover:bg-white/20"
            }`}
          >
            {reducedMotion ? <EyeOff size={13} /> : <Eye size={13} />}
          </button>

          {/* Toggle de Sonido Sintetizado & Ambient Soundscape */}
          <button
            onClick={handleSoundToggle}
            onMouseEnter={() => soundEngine.playHover()}
            title={
              isMuted
                ? locale === "es"
                  ? "Activar Audio Espacial & Synthwave Ambient"
                  : "Enable Spatial & Synthwave Audio"
                : locale === "es"
                ? "Silenciar Audio"
                : "Mute Audio"
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-mono text-[11px] font-bold transition-all shadow-md ${
              !isMuted
                ? "bg-emerald-950/90 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.35)]"
                : "bg-white/10 border-white/15 text-slate-300 hover:text-white hover:bg-white/20"
            }`}
          >
            {isMuted ? (
              <>
                <VolumeX size={12} />
                <span className="hidden sm:inline">AUDIO OFF</span>
              </>
            ) : (
              <>
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 h-1.5 bg-emerald-400 animate-pulse" />
                  <span className="w-0.5 h-3 bg-emerald-400 animate-bounce" />
                  <span className="w-0.5 h-2 bg-emerald-400 animate-pulse" />
                </div>
                <span className="text-emerald-300 hidden sm:inline">SYNTH AMBIENT</span>
              </>
            )}
          </button>

          {/* Selector de Idioma */}
          <button
            onClick={toggleLanguage}
            onMouseEnter={() => soundEngine.playHover()}
            className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-full text-white text-xs font-mono tracking-wider transition-all flex items-center gap-1"
          >
            <span className={locale === "es" ? "text-emerald-400 font-bold" : "text-slate-400"}>ES</span>
            <span className="text-white/30">/</span>
            <span className={locale === "en" ? "text-emerald-400 font-bold" : "text-slate-400"}>EN</span>
          </button>
        </div>
      </div>
    </header>
  );
}