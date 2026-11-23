"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { soundEngine } from "./system/SoundEngine";
import { useTacticalAudio } from "./audio/useTacticalAudio";
import type { Hero3DSceneProps } from "./Hero3DScene";
import QuantumRaymarchGrid from "./ui/QuantumRaymarchGrid";
import { AldoArbizuMonogram } from "./ui/SovereignBrandMark";

const Hero3DScene = dynamic<Hero3DSceneProps>(
  () => import("./Hero3DScene").then((mod) => mod.Hero3DScene),
  {
    ssr: false,
    loading: () => null,
  },
);

export default function HeroSection() {
  const locale = useLocale();
  const isEs = locale === "es";
  const t = useTranslations("OrbitalUI");
  const [renderMode, setRenderMode] = useState<"chromatic" | "wireframe" | "xray">("chromatic");
  const [mount3D, setMount3D] = useState(false);
  const { playHoverTick, playModeSwitch } = useTacticalAudio();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      if (!sp.has("disable3d")) {
        setMount3D(true);
      }
      const savedMode = sessionStorage.getItem("webanti_workbench_mode");
      if (savedMode === "chromatic" || savedMode === "wireframe" || savedMode === "xray") {
        setRenderMode(savedMode);
      } else {
        const wb = sp.get("workbench");
        if (wb === "pbr" || wb === "chromatic") {
          setRenderMode("chromatic");
        } else if (wb === "wireframe") {
          setRenderMode("wireframe");
        } else if (wb === "xray") {
          setRenderMode("xray");
        }
      }
      const heroVideo = document.querySelector<HTMLVideoElement>("video[data-hero-video]");
      if (heroVideo) {
        if (window.innerWidth < 768) {
          heroVideo.setAttribute("poster", "/media/hero/hero-poster-mobile.webp");
        }
        heroVideo.muted = true;
        heroVideo.loop = true;
        heroVideo.playsInline = true;
        void heroVideo.play().catch(() => {});
      }
    }
  }, []);

  return (
    <section className="hero overflow-x-clip" data-section="hero" aria-labelledby="hero-title">
      <div className="hero-media">
        <video
          data-hero-video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          poster="/media/hero/hero-poster.webp"
          aria-hidden="true"
        >
          <source src="/media/hero/hero-loop.webm" type="video/webm" />
          <source src="/media/hero/hero-loop.mp4" type="video/mp4" />
        </video>

        {mount3D && (
          <div className="hero-3d-layer" aria-hidden="true">
            <Hero3DScene renderMode={renderMode} onRenderModeChange={setRenderMode} />
          </div>
        )}

        <div className="hero-shade" aria-hidden="true" />
        <QuantumRaymarchGrid opacity={0.18} />
        <div className="edge-fuse edge-fuse--top" aria-hidden="true" />
        <div className="edge-fuse edge-fuse--bottom" aria-hidden="true" />
      </div>

      {/* HUD Asimétrico de Consola Staff/Principal (Zero Cápsula Centrada) */}
      <div className="hero-content w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 w-full border border-[#1B202B] bg-[#060709] p-5 sm:p-8 text-left">
          {/* Barra Superior HUD Principal Architect */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-5 border-b border-[#1B202B] font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em] tabular-nums">
            <div className="flex items-center gap-3">
              <AldoArbizuMonogram className="w-7 h-7 shrink-0" />
              <span className="text-[#F2F0EA] font-bold">
                [ALDO ALBERTO ARBIZU // PRINCIPAL SYSTEMS ARCHITECT &amp; FOUNDER AT ARBIZU LABS]
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#00E599] font-bold">
              <span className="h-2 w-2 bg-[#00E599]" />
              <span>60 FPS · 0 VRAM LEAKS · 60/60 RLS</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-7 bg-[#0B0D12] p-4 sm:p-5 rounded-[2px] border border-[#1B202B] flex flex-col justify-between">
              <h1
                id="hero-title"
                className="font-sans font-extrabold text-2xl sm:text-4xl lg:text-[2.75rem] leading-[1.02] tracking-[-0.04em] text-[#F6F7F9] mb-3"
                data-split
              >
                <span className="block">{t("heroTitleLine1")}</span>
                <span className="block text-[#D4AF37]">{t("heroTitleLine2")}</span>
              </h1>
              <p className="font-mono text-xs sm:text-sm text-[#C2C8D4] leading-relaxed max-w-2xl">
                <strong className="text-[#F2F0EA]">{t("heroLedeLead")}</strong> {t("heroLedeBody")}
              </p>
            </div>

            {/* Ruteo Rápido por Perfil de Decisor */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-3 font-mono text-[11px]">
              <div className="relative border border-[#1B202B] bg-[#0B0D12] overflow-hidden">
                <img
                  src="/assets/brand-v2/aldo-editorial-architecture.webp"
                  alt="Estudio de arquitectura de sistemas distribuidos e instrumentación de hardware — Aldo Alberto Arbizu"
                  className="w-full h-44 sm:h-48 object-cover block"
                  loading="eager"
                />
                <div className="px-3 py-1.5 border-t border-[#1B202B] bg-[#060709] flex items-center justify-between text-[9px] uppercase tracking-widest text-[#C2C8D4]">
                  <span>DOSSIER ARCH // BARE-METAL + FIELD OPS</span>
                  <span className="text-[#D4AF37]">BOLÍVAR · ARG</span>
                </div>
              </div>
              <a
                href="#proyectos"
                onMouseEnter={() => {
                  soundEngine.playHover();
                  playHoverTick();
                }}
                onClick={() => soundEngine.playClick()}
                className="p-3 border border-[#1B202B] bg-[#0B0D12] hover:border-[#D4AF37] text-[#F6F7F9] flex items-center justify-between transition-colors"
              >
                <span className="font-bold text-[#D4AF37]">[FOR CTOs &amp; VPs OF ENGINEERING]</span>
                <span className="text-[#8A93A6]">→ {isEs ? "Failover & Benchmarks" : "Failover & Specs"}</span>
              </a>
              <a
                href="#inmersion"
                onMouseEnter={() => {
                  soundEngine.playHover();
                  playHoverTick();
                }}
                onClick={() => soundEngine.playClick()}
                className="p-3 border border-[#1B202B] bg-[#0B0D12] hover:border-[#00E599] text-[#F6F7F9] flex items-center justify-between transition-colors"
              >
                <span className="font-bold text-[#00E599]">[FOR QUANT &amp; FINTECH FOUNDERS]</span>
                <span className="text-[#8A93A6]">→ TitanFlow &lt;10ms</span>
              </a>
              <a
                href="https://arbizulabs.com"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => {
                  soundEngine.playHover();
                  playHoverTick();
                }}
                onClick={() => soundEngine.playClick()}
                className="p-3 border border-[#FF4F00]/60 bg-[#FF4F00]/10 hover:bg-[#FF4F00] text-[#F2F0EA] hover:text-[#060709] flex items-center justify-between font-bold transition-colors"
              >
                <span>[FOR B2B ENTERPRISE CLIENTS]</span>
                <span className="inline-flex items-center gap-1">
                  arbizulabs.com <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Workbench Servidor Cuántico Orbital // Controles WebGL */}
      <div className="hero-workbench-dock flex scale-90 md:scale-100" role="group" aria-label="Núcleo WebGL Workbench">
        <span className="hero-workbench-label text-[#D4AF37]">{t("workbenchLabel")}</span>
        <button
          type="button"
          data-workbench-mode="pbr"
          onMouseEnter={playHoverTick}
          onClick={() => {
            soundEngine.playClick();
            playModeSwitch("pbr");
            setRenderMode("chromatic");
            if (typeof window !== "undefined") sessionStorage.setItem("webanti_workbench_mode", "chromatic");
          }}
          className={`hero-workbench-btn${renderMode === "chromatic" ? " is-active" : ""}`}
        >
          [01 SOLID PBR]
        </button>
        <button
          type="button"
          data-workbench-mode="wireframe"
          onMouseEnter={playHoverTick}
          onClick={() => {
            soundEngine.playClick();
            playModeSwitch("wireframe");
            setRenderMode("wireframe");
            if (typeof window !== "undefined") sessionStorage.setItem("webanti_workbench_mode", "wireframe");
          }}
          className={`hero-workbench-btn${renderMode === "wireframe" ? " is-active" : ""}`}
        >
          [02 CAD WIREFRAME]
        </button>
        <button
          type="button"
          data-workbench-mode="xray"
          onMouseEnter={playHoverTick}
          onClick={() => {
            soundEngine.playClick();
            playModeSwitch("xray");
            setRenderMode("xray");
            if (typeof window !== "undefined") sessionStorage.setItem("webanti_workbench_mode", "xray");
          }}
          className={`hero-workbench-btn${renderMode === "xray" ? " is-active" : ""}`}
        >
          [03 THERMAL SHADER]
        </button>
      </div>

      <div className="scroll-cue" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}
