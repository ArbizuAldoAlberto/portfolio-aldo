"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { soundEngine } from "./system/SoundEngine";
import type { Hero3DSceneProps } from "./Hero3DScene";

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!navigator.webdriver) {
        setMount3D(true);
      }
      const sp = new URLSearchParams(window.location.search);
      const wb = sp.get("workbench");
      if (wb === "chromatic" || wb === "wireframe" || wb === "xray") {
        setRenderMode(wb);
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
        <div className="edge-fuse edge-fuse--top" aria-hidden="true" />
        <div className="edge-fuse edge-fuse--bottom" aria-hidden="true" />
      </div>

      <div className="hero-content">
        <h1 id="hero-title" className="hero-title" data-split>
          <span className="line">{t("heroTitleLine1")}</span>
          <span className="line">{t("heroTitleLine2")}</span>
        </h1>

        <p className="hero-lede">
          <strong>{t("heroLedeLead")}</strong> {t("heroLedeBody")}
        </p>

        <div className="hero-actions">
          <a
            href="#proyectos"
            data-magnetic
            onMouseEnter={() => soundEngine.playHover()}
            onClick={() => soundEngine.playClick()}
            className="btn-magnetic"
          >
            <span className="btn-label">
              <span>{t("heroCtaPrimary")}</span>
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-white/10 border border-white/20 group-hover:scale-110 group-hover:border-emerald-400 group-hover:text-emerald-400 transition-all duration-200">
                <ArrowUpRight className="w-3.5 h-3.5 drop-shadow-[0_0_6px_currentColor]" />
              </span>
            </span>
            <span className="btn-glow" aria-hidden="true" />
          </a>

          <a
            href="#inmersion"
            onMouseEnter={() => soundEngine.playHover()}
            onClick={() => soundEngine.playClick()}
            className="link-quiet"
          >
            {t("heroCtaSecondary")}
          </a>
        </div>
      </div>

      {/* Workbench HUD acoplado al borde inferior (fuera del 55%x55% central del video) */}
      <div className="hero-workbench-dock" role="group" aria-label={t("workbenchLabel")}>
        <span className="hero-workbench-label">{t("workbenchLabel")}</span>
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            setRenderMode("chromatic");
          }}
          className={`hero-workbench-btn${renderMode === "chromatic" ? " is-active" : ""}`}
        >
          {t("workbenchChromatic")}
        </button>
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            setRenderMode("wireframe");
          }}
          className={`hero-workbench-btn${renderMode === "wireframe" ? " is-active" : ""}`}
        >
          {t("workbenchWireframe")}
        </button>
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            setRenderMode("xray");
          }}
          className={`hero-workbench-btn${renderMode === "xray" ? " is-active" : ""}`}
        >
          {t("workbenchXray")}
        </button>
      </div>

      <div className="scroll-cue" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}
