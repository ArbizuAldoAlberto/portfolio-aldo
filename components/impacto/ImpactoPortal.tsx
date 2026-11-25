"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  HeartHandshake,
  Mail,
  MessageSquare,
  Moon,
  Printer,
  ShieldCheck,
  Sparkles,
  Sun,
} from "lucide-react";

type ImpactoTheme = "light" | "dark";
type ImpactoLocale = "es" | "en";
type SimStage = "relief" | "community" | "fabricated";

interface FieldProgram {
  id: string;
  image: string;
  badgeEs: string;
  badgeEn: string;
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
  impactEs: string;
  impactEn: string;
}

const PROGRAMS: FieldProgram[] = [
  {
    id: "bridge-3d",
    image: "/projects/impresion3d.png",
    badgeEs: "PUENTE 3D · HELLBOT MAGNA 2",
    badgeEn: "3D BRIDGE · HELLBOT MAGNA 2",
    titleEs: "Fabricación 3D Solidaria con Material Biocompatible (PETG)",
    titleEn: "Solidarity 3D Manufacturing in Safe PETG Filament",
    descEs:
      "Producción sin fines de lucro de soportes médicos, organizadores pediátricos, repuestos escolares y protectores ergonómicos sobre cama térmica de 300x300 mm para familias y cooperadoras.",
    descEn:
      "Zero-profit manufacturing of pediatric care holders, accessible school tools, and repair parts on our 300x300mm heated-bed printer for local families and schools.",
    impactEs: "Entrega directa gratuita · Cero ganancia comercial",
    impactEn: "Direct free delivery · Zero commercial markup",
  },
  {
    id: "pawhero",
    image: "/projects/pawhero.png",
    badgeEs: "PAWHERO · 0% COMISIÓN",
    badgeEn: "PAWHERO · 0% PLATFORM FEE",
    titleEs: "Red Comunitaria de Rescate y Adopción Animal",
    titleEn: "Community Pet Rescue & Shelter Support Network",
    descEs:
      "Plataforma gratuita para identificar mascotas perdidas mediante placas físicas simples y coordinar alertas vecinales. Cada aporte voluntario llega 100% íntegro a los refugios locales.",
    descEn:
      "Free public tool to locate lost pets using durable scan tags and neighborhood alerts. 100% of every voluntary contribution goes straight to animal shelters with zero fee.",
    impactEs: "0% comisión retenida · Acceso libre para refugios",
    impactEn: "0% fee retained · Always free for animal shelters",
  },
  {
    id: "food-network",
    image: "/impact/food_sovereignty.webp",
    badgeEs: "RED BARRIAL · BOLÍVAR",
    badgeEn: "NEIGHBORHOOD NETWORK · BOLÍVAR",
    titleEs: "Coordinación de Alimentos e Insumos Esenciales",
    titleEn: "Direct Food & Essential Supplies Coordination",
    descEs:
      "Conexión directa entre donantes, productores locales y comedores barriales mediante entregas verificadas mano a mano, eliminando gastos administrativos.",
    descEn:
      "Direct coordination between local growers, donors, and community kitchens with hand-to-hand delivery verification and zero administrative overhead.",
    impactEs: "Trazabilidad transparente · 100% entrega en destino",
    impactEn: "Clear delivery confirmation · Direct local impact",
  },
  {
    id: "pediatric-health",
    image: "/impact/healthcare_access.webp",
    badgeEs: "CUIDADO Y SALUD",
    badgeEn: "COMMUNITY HEALTH SUPPORT",
    titleEs: "Insumos Reutilizables y Cuidado Pediátrico",
    titleEn: "Reusable Aids & Pediatric Care Support",
    descEs:
      "Diseño rápido de bandejas lavables, cierres higiénicos y adaptadores simples que ayudan a cuidadores y salas de primeros auxilios en momentos de necesidad urgente.",
    descEn:
      "Rapid custom fabrication of washable trays, hygienic closures, and daily care adapters requested by family caregivers and neighborhood clinics.",
    impactEs: "Material PETG lavable · Respaldo técnico directo",
    impactEn: "Washable PETG material · Direct support",
  },
  {
    id: "open-tech",
    image: "/impact/education_tech.webp",
    badgeEs: "OFICIOS Y TECNOLOGÍA ABIERTA",
    badgeEn: "SKILLS & OPEN TECHNOLOGY",
    titleEs: "Alfabetización Técnica y Respaldo de Emergencia",
    titleEn: "Technical Literacy & Emergency Tooling",
    descEs:
      "Talleres prácticos de reparación, diseño 3D inicial y guías comunitarias listas para funcionar en escuelas rurales incluso sin conexión estable a internet.",
    descEn:
      "Hands-on workshops on repair, beginner 3D modeling, and offline educational resources prepared for rural schools.",
    impactEs: "Manuales abiertos · Sin licencias ni suscripciones",
    impactEn: "Open handbooks · Free community access",
  },
];

export default function ImpactoPortal() {
  const [theme, setTheme] = useState<ImpactoTheme>("light");
  const [locale, setLocale] = useState<ImpactoLocale>("es");
  const [simStage, setSimStage] = useState<SimStage>("relief");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedTheme = localStorage.getItem("aldo_impacto_luminance");
    const nextTheme: ImpactoTheme = savedTheme === "dark" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-impacto-theme", nextTheme);
    document.documentElement.style.colorScheme = nextTheme;

    const savedLocale = localStorage.getItem("aldo_impacto_locale");
    if (savedLocale === "en" || savedLocale === "es") {
      setLocale(savedLocale);
      document.documentElement.lang = savedLocale;
    }
  }, []);

  const toggleTheme = () => {
    const next: ImpactoTheme = theme === "light" ? "dark" : "light";
    setTheme(next);
    if (typeof window !== "undefined") {
      document.documentElement.setAttribute("data-impacto-theme", next);
      document.documentElement.style.colorScheme = next;
      try {
        localStorage.setItem("aldo_impacto_luminance", next);
      } catch {
        // ignore storage errors
      }
    }
  };

  const toggleLocale = () => {
    const next: ImpactoLocale = locale === "es" ? "en" : "es";
    setLocale(next);
    if (typeof window !== "undefined") {
      document.documentElement.lang = next;
      try {
        localStorage.setItem("aldo_impacto_locale", next);
      } catch {
        // ignore storage errors
      }
    }
  };

  const isEs = locale === "es";

  const allianceWaHref = `https://wa.me/5492314489197?text=${encodeURIComponent(
    isEs
      ? "Hola Aldo, te escribo desde aldoarbizu.com/impacto para proponer una alianza comunitaria o solicitar apoyo con impresión 3D / PawHero."
      : "Hello Aldo, I am reaching out from aldoarbizu.com/impacto regarding a community partnership or 3D solidarity / PawHero collaboration."
  )}`;

  return (
    <div
      data-impacto-root="true"
      style={{ backgroundColor: "var(--impacto-bg)", color: "var(--impacto-ink)" }}
      className="min-h-screen flex flex-col"
    >
      {/* Top Civic Header */}
      <header
        style={{
          backgroundColor: "var(--impacto-card)",
          borderColor: "var(--impacto-border)",
        }}
        className="sticky top-0 z-40 border-b px-4 sm:px-6 lg:px-10 py-3.5"
      >
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <a
              href="https://aldoarbizu.com"
              style={{
                borderColor: "var(--impacto-border)",
                backgroundColor: "var(--impacto-elevated)",
                color: "var(--impacto-ink)",
              }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[4px] border text-xs font-mono font-bold hover:opacity-90 transition-opacity"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>aldoarbizu.com</span>
            </a>
            <span
              style={{ color: "var(--impacto-green)" }}
              className="hidden sm:inline font-mono text-xs font-bold uppercase tracking-wider truncate"
            >
              {isEs ? "Archivo Cívico y Acción Comunitaria" : "Civic Impact & Community Archive"}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              data-testid="lang-toggle"
              onClick={toggleLocale}
              style={{
                borderColor: "var(--impacto-border)",
                backgroundColor: "var(--impacto-elevated)",
                color: "var(--impacto-ink)",
              }}
              className="px-3 py-1.5 rounded-[4px] border font-mono text-xs font-bold cursor-pointer"
              aria-label={isEs ? "Cambiar idioma a inglés" : "Switch language to Spanish"}
            >
              <span className={isEs ? "underline font-extrabold" : "opacity-70"}>ES</span>
              <span className="mx-1 opacity-50">/</span>
              <span className={!isEs ? "underline font-extrabold" : "opacity-70"}>EN</span>
            </button>

            <button
              type="button"
              data-testid="theme-toggle"
              onClick={toggleTheme}
              style={{
                borderColor: "var(--impacto-border)",
                backgroundColor: "var(--impacto-elevated)",
                color: "var(--impacto-ink)",
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border font-mono text-xs font-bold cursor-pointer"
              aria-label={isEs ? "Alternar modo claro u oscuro" : "Toggle light or dark mode"}
            >
              {theme === "light" ? (
                <>
                  <Moon className="w-3.5 h-3.5" />
                  <span>{isEs ? "Oscuro" : "Dark"}</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5" />
                  <span>{isEs ? "Claro" : "Light"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-10 py-12 space-y-14">
        {/* Hero */}
        <section className="space-y-5 border-b pb-10" style={{ borderColor: "var(--impacto-border)" }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-[#144D36] text-white font-mono text-xs font-bold uppercase tracking-wider">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>
              {isEs ? "INICIATIVA SOCIAL DIRECTA · BOLÍVAR, BS. AS." : "DIRECT COMMUNITY IMPACT · ARGENTINA"}
            </span>
          </div>

          <h1
            style={{ color: "var(--impacto-ink)" }}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08]"
          >
            {isEs ? "Programas de Campo Documentados" : "Documented Field Programs"}
          </h1>

          <p
            style={{ color: "var(--impacto-muted)" }}
            className="text-base sm:text-lg max-w-3xl leading-relaxed"
          >
            {isEs
              ? "Espacio dedicado exclusivamente a causas comunitarias sin fines de lucro: fabricación solidaria en impresión 3D para familias y escuelas, rescate animal gratuito con PawHero y coordinación transparente de ayuda directa."
              : "A dedicated space for non-profit local work: solidarity 3D printing for families and schools, fee-free pet rescue through PawHero, and transparent direct community aid."}
          </p>
        </section>

        {/* Flagship Pillar Cards: Puente 3D + PawHero */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            style={{
              backgroundColor: "var(--impacto-card)",
              borderColor: "var(--impacto-border)",
            }}
            className="rounded-[6px] border p-6 space-y-3"
          >
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider" style={{ color: "var(--impacto-ochre)" }}>
              <Printer className="w-4 h-4" />
              <span>{isEs ? "PILAR HARDWARE SOLIDARIO" : "SOLIDARITY HARDWARE PILLAR"}</span>
            </div>
            <h2 className="text-2xl font-bold">
              {isEs ? "Puente 3D (Hellbot Magna 2)" : "3D Bridge (Hellbot Magna 2)"}
            </h2>
            <p style={{ color: "var(--impacto-muted)" }} className="text-sm leading-relaxed">
              {isEs
                ? "Destinamos capacidad real de nuestra impresora 3D de gran formato (300x300 mm) y filamento PETG resistente para fabricar adaptadores, repuestos escolares e insumos comunitarios sin costo comercial."
                : "We allocate dedicated print capacity on our large-format 300x300mm printer using durable PETG filament to fabricate school repairs and assistive parts at zero commercial profit."}
            </p>
          </div>

          <div
            style={{
              backgroundColor: "var(--impacto-card)",
              borderColor: "var(--impacto-border)",
            }}
            className="rounded-[6px] border p-6 space-y-3"
          >
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider" style={{ color: "var(--impacto-green)" }}>
              <ShieldCheck className="w-4 h-4" />
              <span>{isEs ? "RED ABIERTA SIN LUCRO" : "NON-PROFIT OPEN NETWORK"}</span>
            </div>
            <h2 className="text-2xl font-bold">
              {isEs ? "PawHero (0% comisión)" : "PawHero (0% commission)"}
            </h2>
            <p style={{ color: "var(--impacto-muted)" }} className="text-sm leading-relaxed">
              {isEs
                ? "Herramienta comunitaria 100% gratuita para reunir mascotas perdidas con sus familias y canalizar aportes directos a refugios de animales. Arbizu Labs no retiene comisiones ni cobra por la plataforma."
                : "100% free community rescue platform helping reunite lost pets with their families while routing support directly to shelters with 0% commission taken."}
            </p>
          </div>
        </section>

        {/* Documented Causes Grid */}
        <section className="space-y-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold">
              {isEs ? "Frentes Activos en Comunidad" : "Active Community Initiatives"}
            </h2>
            <span style={{ color: "var(--impacto-muted)" }} className="font-mono text-xs">
              {isEs ? "5 líneas documentadas · Entrega verificable" : "5 documented streams · Direct delivery"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROGRAMS.map((item) => (
              <article
                key={item.id}
                style={{
                  backgroundColor: "var(--impacto-card)",
                  borderColor: "var(--impacto-border)",
                }}
                className="rounded-[6px] border overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/10] w-full overflow-hidden border-b" style={{ borderColor: "var(--impacto-border)" }}>
                    <img
                      src={item.image}
                      alt={isEs ? item.titleEs : item.titleEn}
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5 space-y-2.5">
                    <div
                      style={{ color: "var(--impacto-green)" }}
                      className="font-mono text-[11px] font-bold uppercase tracking-wider"
                    >
                      {isEs ? item.badgeEs : item.badgeEn}
                    </div>
                    <h3 className="text-lg font-bold leading-snug">
                      {isEs ? item.titleEs : item.titleEn}
                    </h3>
                    <p style={{ color: "var(--impacto-muted)" }} className="text-sm leading-relaxed">
                      {isEs ? item.descEs : item.descEn}
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    backgroundColor: "var(--impacto-elevated)",
                    borderColor: "var(--impacto-border)",
                    color: "var(--impacto-ink)",
                  }}
                  className="px-5 py-3 border-t font-mono text-xs font-semibold"
                >
                  {isEs ? item.impactEs : item.impactEn}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Clearly Separated Interactive Demo Simulator */}
        <section
          aria-labelledby="demo-sim-title"
          style={{
            backgroundColor: "var(--impacto-elevated)",
            borderColor: "var(--impacto-border)",
          }}
          className="rounded-[6px] border-2 border-dashed p-6 sm:p-8 space-y-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-[#8A4500] text-white font-mono text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isEs ? "DEMOSTRACIÓN INTERACTIVA · SIN TRANSACCIONES REALES" : "INTERACTIVE DEMO SIMULATOR · EDUCATIONAL ONLY"}</span>
            </div>
            <span style={{ color: "var(--impacto-muted)" }} className="font-mono text-xs">
              {isEs ? "Recorrido ilustrativo de cómo organizamos una ayuda" : "Step-by-step walk-through of local support"}
            </span>
          </div>

          <h2 id="demo-sim-title" className="text-2xl font-bold">
            {isEs ? "Simulador de Coordinación Paso a Paso" : "Step-by-Step Support Flow Simulator"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setSimStage("relief")}
              style={{
                borderColor: simStage === "relief" ? "#8A4500" : "var(--impacto-border)",
                backgroundColor: simStage === "relief" ? "#8A4500" : "var(--impacto-card)",
                color: simStage === "relief" ? "#FFFFFF" : "var(--impacto-ink)",
              }}
              className="p-4 rounded-[4px] border text-left cursor-pointer transition-colors"
            >
              <div className="font-mono text-xs font-bold uppercase">
                {isEs ? "1. Asistencia Inmediata" : "1. Immediate Relief"}
              </div>
              <div className="text-sm font-semibold mt-1">
                {isEs ? "Urgencia de barrio o familia" : "Urgent family or shelter need"}
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSimStage("community")}
              style={{
                borderColor: simStage === "community" ? "#144D36" : "var(--impacto-border)",
                backgroundColor: simStage === "community" ? "#144D36" : "var(--impacto-card)",
                color: simStage === "community" ? "#FFFFFF" : "var(--impacto-ink)",
              }}
              className="p-4 rounded-[4px] border text-left cursor-pointer transition-colors"
            >
              <div className="font-mono text-xs font-bold uppercase">
                {isEs ? "2. Red Comunitaria" : "2. Community Bridge"}
              </div>
              <div className="text-sm font-semibold mt-1">
                {isEs ? "Conexión con comedor o refugio" : "Verified match with local group"}
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSimStage("fabricated")}
              style={{
                borderColor: simStage === "fabricated" ? "#111317" : "var(--impacto-border)",
                backgroundColor: simStage === "fabricated" ? "#111317" : "var(--impacto-card)",
                color: simStage === "fabricated" ? "#FFFFFF" : "var(--impacto-ink)",
              }}
              className="p-4 rounded-[4px] border text-left cursor-pointer transition-colors"
            >
              <div className="font-mono text-xs font-bold uppercase">
                {isEs ? "3. Entrega y Registro" : "3. Hand-Off & Record"}
              </div>
              <div className="text-sm font-semibold mt-1">
                {isEs ? "Confirmación simple de recepción" : "Simple delivery confirmation"}
              </div>
            </button>
          </div>

          <div
            style={{
              backgroundColor: "var(--impacto-card)",
              borderColor: "var(--impacto-border)",
            }}
            className="p-4 rounded-[4px] border text-sm leading-relaxed"
          >
            {simStage === "relief" &&
              (isEs
                ? "Etapa 1 (Modo Demostración): Se recibe el pedido urgente de una familia, escuela o refugio y se prioriza sin burocracia."
                : "Stage 1 (Demo Mode): An urgent request from a local family, school, or shelter is logged directly with zero red tape.")}
            {simStage === "community" &&
              (isEs
                ? "Etapa 2 (Modo Demostración): Se asigna material disponible, impresión 3D solidaria en Hellbot Magna 2 o difusión abierta en la red PawHero (0% comisión)."
                : "Stage 2 (Demo Mode): Available supplies, Hellbot Magna 2 solidarity 3D print time, or fee-free PawHero outreach are matched to the need.")}
            {simStage === "fabricated" &&
              (isEs
                ? "Etapa 3 (Modo Demostración): Queda documentada la entrega real a los destinatarios, asegurando transparencia completa para vecinos y colaboradores."
                : "Stage 3 (Demo Mode): Final hand-off is recorded simply so local neighbors and partners can trust every effort reached its destination.")}
          </div>
        </section>

        {/* Community Alliances CTA */}
        <section
          style={{
            backgroundColor: "var(--impacto-card)",
            borderColor: "var(--impacto-border)",
          }}
          className="rounded-[6px] border p-6 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div className="space-y-2 max-w-2xl">
            <div style={{ color: "var(--impacto-green)" }} className="font-mono text-xs font-bold uppercase tracking-wider">
              {isEs ? "ALIANZAS COMUNITARIAS ABIERTAS" : "OPEN COMMUNITY PARTNERSHIPS"}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">
              {isEs
                ? "¿Representas una escuela, hospital, club o refugio?"
                : "Representing a school, community clinic, club, or shelter?"}
            </h2>
            <p style={{ color: "var(--impacto-muted)" }} className="text-sm leading-relaxed">
              {isEs
                ? "Coordinamos piezas impresas en 3D sin costo de ganancia, apoyo tecnológico abierto o difusión directa en PawHero (0% comisión). Conversación directa y transparente."
                : "We coordinate non-profit 3D printed parts, open civic tooling, or free PawHero shelter support directly with zero intermediaries."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <a
              href={allianceWaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-[4px] bg-[#144D36] text-white font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{isEs ? "Proponer Alianza por WhatsApp" : "Partner via WhatsApp"}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="mailto:aldo@arbizulabs.com?subject=Alianza%20Comunitaria%20Impacto"
              style={{
                borderColor: "var(--impacto-border)",
                backgroundColor: "var(--impacto-elevated)",
                color: "var(--impacto-ink)",
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-[4px] border font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              <Mail className="w-4 h-4" />
              <span>aldo@arbizulabs.com</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
