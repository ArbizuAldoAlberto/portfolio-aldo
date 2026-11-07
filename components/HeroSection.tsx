"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { soundEngine } from "./system/SoundEngine";
import { useTacticalAudio } from "./audio/useTacticalAudio";
import type { Hero3DSceneProps } from "./Hero3DScene";
import QuantumRaymarchGrid from "./ui/QuantumRaymarchGrid";

const Hero3DScene = dynamic<Hero3DSceneProps>(
  () => import("./Hero3DScene").then((mod) => mod.Hero3DScene),
  {
    ssr: false,
    loading: () => null,
  },
);

export default function HeroSection() {
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
      const wb = sp.get("workbench");
      if (wb === "pbr" || wb === "chromatic") {
        setRenderMode("chromatic");
      } else if (wb === "wireframe") {
        setRenderMode("wireframe");
      } else if (wb === "xray") {
        setRenderMode("xray");
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

      {/* Consola tipográfica anclada al tercio inferior para despejar el Retrato Escultórico 3D */}
      <div className="hero-content">
        <div className="relative z-10 mx-auto max-w-4xl rounded-3xl bg-[#070B12]/72 px-5 sm:px-8 py-4 sm:py-5 backdrop-blur-md border border-[#D4AF37]/25 shadow-[0_24px_80px_rgba(0,0,0,0.85)] flex flex-col items-center text-center mt-60 md:mt-72 mb-3 sm:mb-4">
          <h1 id="hero-title" className="hero-title !text-2xl sm:!text-4xl md:!text-5xl" data-split>
            <span className="line">{t("heroTitleLine1")}</span>
            <span className="line text-[#D4AF37]">{t("heroTitleLine2")}</span>
          </h1>

          <p className="hero-lede !mt-2 !text-xs sm:!text-sm">
            <strong className="text-[#E2E8F0]">{t("heroLedeLead")}</strong> {t("heroLedeBody")}
          </p>
        </div>

        <div className="hero-actions">
          <a
            href="#proyectos"
            data-magnetic
            onMouseEnter={() => {
              soundEngine.playHover();
              playHoverTick();
            }}
            onClick={() => soundEngine.playClick()}
            className="btn-magnetic border-[#D4AF37]/45"
          >
            <span className="btn-label">
              <span>{t("heroCtaPrimary")}</span>
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] group-hover:scale-110 transition-all duration-200">
                <ArrowUpRight className="w-3.5 h-3.5 drop-shadow-[0_0_6px_currentColor]" />
              </span>
            </span>
            <span className="btn-glow" aria-hidden="true" />
          </a>

          <a
            href="#inmersion"
            onMouseEnter={() => {
              soundEngine.playHover();
              playHoverTick();
            }}
            onClick={() => soundEngine.playClick()}
            className="link-quiet"
          >
            {t("heroCtaSecondary")}
          </a>
        </div>
      </div>

      {/* Workbench Escultórico 3D acoplado al borde inferior */}
      <div className="hero-workbench-dock flex scale-90 md:scale-100" role="group" aria-label="Retrato Escultórico 3D Workbench">
        <span className="hero-workbench-label text-[#D4AF37]">ESCULTURA 3D</span>
        <button
          type="button"
          data-workbench-mode="pbr"
          onMouseEnter={playHoverTick}
          onClick={() => {
            soundEngine.playClick();
            playModeSwitch("pbr");
            setRenderMode("chromatic");
          }}
          className={`hero-workbench-btn${renderMode === "chromatic" ? " is-active" : ""}`}
        >
          PBR Físico (Titanio &amp; Bronce)
        </button>
        <button
          type="button"
          data-workbench-mode="wireframe"
          onMouseEnter={playHoverTick}
          onClick={() => {
            soundEngine.playClick();
            playModeSwitch("wireframe");
            setRenderMode("wireframe");
          }}
          className={`hero-workbench-btn${renderMode === "wireframe" ? " is-active" : ""}`}
        >
          Wireframe CAD
        </button>
        <button
          type="button"
          data-workbench-mode="xray"
          onMouseEnter={playHoverTick}
          onClick={() => {
            soundEngine.playClick();
            playModeSwitch("xray");
            setRenderMode("xray");
          }}
          className={`hero-workbench-btn${renderMode === "xray" ? " is-active" : ""}`}
        >
          X-Ray Núcleo
        </button>
      </div>

      <div className="scroll-cue" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}
