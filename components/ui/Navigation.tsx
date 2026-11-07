"use client";

import { useState, useEffect } from "react";
import { Volume2, VolumeX, Eye, EyeOff, ExternalLink } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "../../i18n/routing";
import { soundEngine } from "../system/SoundEngine";
import { useMotionPreferences } from "../system/MotionPreferences";

export default function Navigation() {
  const locale = useLocale();
  const t = useTranslations("OrbitalUI");
  const pathname = usePathname();
  const router = useRouter();
  const { reducedMotion, toggleReducedMotion } = useMotionPreferences();
  const [isMuted, setIsMuted] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTheme, setActiveTheme] = useState<"v1" | "v2">("v1");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isV2Path =
      pathname === "/v2" ||
      pathname.startsWith("/v2/") ||
      window.location.pathname.includes("/v2") ||
      window.location.search.includes("theme=v2");
    const nextTheme = isV2Path ? "v2" : "v1";
    setActiveTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    if (window.__webanti) {
      window.__webanti.theme = nextTheme;
    }
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 36);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMuted(soundEngine.isMuted());
    const unsub = soundEngine.subscribe((muted) => setIsMuted(muted));
    return unsub;
  }, []);

  if (pathname === "/compare" || pathname.startsWith("/compare/")) {
    return null;
  }

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

  const v1Href = `/${locale}`;
  const v2Href = `/${locale}/v2`;

  return (
    <>
      <a className="skip-link" href="#contenido">
        {t("skipToContent")}
      </a>
      <header
        className={`site-header${isScrolled ? " is-scrolled" : ""}`}
        data-header
        data-scrolled={isScrolled ? "true" : "false"}
      >
        {/* Brand & Orbital Mark */}
        <a
          href={activeTheme === "v2" ? v2Href : v1Href}
          onMouseEnter={() => soundEngine.playHover()}
          onClick={() => soundEngine.playClick()}
          className="brand"
          aria-label="Aldo Arbizu, inicio"
        >
          <svg className="brand-mark" viewBox="0 0 32 32" aria-hidden="true">
            <circle cx="16" cy="16" r="13.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
            <ellipse
              cx="16"
              cy="16"
              rx="13.5"
              ry="5.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.1"
              transform="rotate(-24 16 16)"
            />
            <circle cx="16" cy="16" r="2.4" fill="currentColor" />
          </svg>
          <span className="brand-word">ALDO ARBIZU</span>
        </a>

        {/* Navegación de Secciones */}
        <nav className="site-nav" aria-label="Secciones">
          <a href="#inmersion" onMouseEnter={() => soundEngine.playHover()} onClick={() => soundEngine.playClick()}>
            {t("navInmersion")}
          </a>
          <a href="#sobre-mi" onMouseEnter={() => soundEngine.playHover()} onClick={() => soundEngine.playClick()}>
            {t("navHybrid")}
          </a>
          <a href="#proyectos" onMouseEnter={() => soundEngine.playHover()} onClick={() => soundEngine.playClick()}>
            {t("navProjects")}
          </a>
          <a href="#servicios" onMouseEnter={() => soundEngine.playHover()} onClick={() => soundEngine.playClick()}>
            {t("navServices")}
          </a>
          <a href="#contacto" onMouseEnter={() => soundEngine.playHover()} onClick={() => soundEngine.playClick()}>
            {t("navContact")}
          </a>
        </nav>

        {/* Controles Derecha: Selector V1/V2 + Idioma + Audio + Arbizu Labs */}
        <div className="header-controls">
          <div className="theme-switch" data-theme-switch role="group" aria-label={t("themeSwitchAria")}>
            <a
              href={v1Href}
              data-theme-link="v1"
              className={activeTheme === "v1" ? "is-active" : ""}
              aria-current={activeTheme === "v1" ? "page" : undefined}
              onClick={() => {
                soundEngine.playClick();
                setActiveTheme("v1");
                document.documentElement.setAttribute("data-theme", "v1");
              }}
            >
              {t("themeV1")}
            </a>
            <a
              href={v2Href}
              data-theme-link="v2"
              className={activeTheme === "v2" ? "is-active" : ""}
              aria-current={activeTheme === "v2" ? "page" : undefined}
              onClick={() => {
                soundEngine.playClick();
                setActiveTheme("v2");
                document.documentElement.setAttribute("data-theme", "v2");
              }}
            >
              {t("themeV2")}
            </a>
          </div>

          <button
            type="button"
            onClick={toggleLanguage}
            onMouseEnter={() => soundEngine.playHover()}
            className="ctrl-btn"
            aria-label="Cambiar idioma ES / EN"
          >
            <span className={locale === "es" ? "text-emerald-300 font-bold" : "opacity-75"}>ES</span>
            <span className="opacity-40">/</span>
            <span className={locale === "en" ? "text-emerald-300 font-bold" : "opacity-75"}>EN</span>
          </button>

          <button
            type="button"
            onClick={handleSoundToggle}
            onMouseEnter={() => soundEngine.playHover()}
            className={`ctrl-btn !hidden sm:!inline-flex${!isMuted ? " ctrl-btn--active" : ""}`}
            aria-label={isMuted ? "Activar audio ambiental" : "Silenciar audio"}
          >
            {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
          </button>

          <button
            type="button"
            onClick={handleMotionToggle}
            onMouseEnter={() => soundEngine.playHover()}
            className={`ctrl-btn !hidden md:!inline-flex${reducedMotion ? " ctrl-btn--active" : ""}`}
            aria-label={reducedMotion ? "Movimiento reducido activo" : "Movimiento cinemático activo"}
          >
            {reducedMotion ? <EyeOff size={13} /> : <Eye size={13} />}
          </button>

          <a
            href="https://arbizulabs.com"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => soundEngine.playHover()}
            onClick={() => soundEngine.playClick()}
            className="ctrl-btn !hidden xl:!inline-flex"
          >
            <span>ARBIZU LABS</span>
            <ExternalLink size={11} />
          </a>
        </div>
      </header>
    </>
  );
}
