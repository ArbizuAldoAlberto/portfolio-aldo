"use client";

import { useState, useEffect } from "react";
import { ExternalLink, FileText } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "../../i18n/routing";
import { AldoArbizuMonogram } from "./SovereignBrandMark";

export default function Navigation() {
  const locale = useLocale();
  const t = useTranslations("OrbitalUI");
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.setAttribute("data-theme", "v1");
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 36);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname === "/compare" || pathname.startsWith("/compare/")) {
    return null;
  }

  const toggleLanguage = () => {
    if (typeof window !== "undefined") {
      const nextLocale = locale === "es" ? "en" : "es";
      const currentPath = window.location.pathname;
      const currentSearch = window.location.search;
      const currentHash = window.location.hash;
      let cleanPath = currentPath.replace(/^\/(es|en)(\/|$)/, "/");
      if (!cleanPath.startsWith("/")) cleanPath = "/" + cleanPath;
      const targetUrl = `/${nextLocale}${cleanPath === "/" ? "" : cleanPath}${currentSearch}${currentHash}`;
      window.location.href = targetUrl;
    }
  };

  const homeHref = `/${locale}`;
  const isEs = locale === "es";

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
        <a
          href={homeHref}
          className="brand flex items-center gap-2.5"
          aria-label="Aldo Arbizu, inicio"
        >
          <AldoArbizuMonogram className="w-8 h-8 shrink-0" />
          <div className="flex flex-col">
            <span className="brand-word tracking-[0.12em] text-[#F2F0EA] font-extrabold">ALDO ARBIZU</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#D4AF37]">PRINCIPAL ARCHITECT</span>
          </div>
        </a>

        <nav className="site-nav" aria-label="Navegación principal">
          <a href="#sobre-mi">{isEs ? "Trayectoria" : "Craft"}</a>
          <a href="#proyectos">{isEs ? "Casos" : "Cases"}</a>
          <a href="#servicios">{isEs ? "Servicios" : "Services"}</a>
          <a href="/impacto">{isEs ? "Impacto" : "Impact"}</a>
          <a href="#contacto">{isEs ? "Contacto" : "Contact"}</a>
        </nav>

        <div className="header-controls">
          <a
            href="/cv/cv-unificado-aldo-arbizu.pdf"
            download
            className="ctrl-btn !hidden lg:!inline-flex border-[#1B202B] text-[#C2C8D4] hover:border-[#D4AF37] hover:text-[#F2F0EA]"
          >
            <FileText size={12} className="text-[#D4AF37]" />
            <span>CV PDF</span>
          </a>

          <button
            type="button"
            onClick={toggleLanguage}
            className="ctrl-btn"
            aria-label="Cambiar idioma ES / EN"
          >
            <span className={locale === "es" ? "text-[#D4AF37] font-bold" : "opacity-75"}>ES</span>
            <span className="opacity-75 text-slate-400">/</span>
            <span className={locale === "en" ? "text-[#D4AF37] font-bold" : "opacity-75"}>EN</span>
          </button>

          <a
            href="https://arbizulabs.com"
            target="_blank"
            rel="noopener noreferrer"
            className="ctrl-btn !hidden sm:!inline-flex border-[#D4AF37]/40 text-[#D4AF37] hover:border-[#D4AF37]"
          >
            <span>Arbizu Labs</span>
            <ExternalLink size={11} />
          </a>
        </div>
      </header>
    </>
  );
}
