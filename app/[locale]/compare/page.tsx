"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";

export default function ChromaticComparatorPage() {
  const locale = useLocale();
  const t = useTranslations("OrbitalUI");

  const [mode, setMode] = useState<"split" | "side">("split");
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [splitPercent, setSplitPercent] = useState<number>(50);

  const frameV1Ref = useRef<HTMLIFrameElement | null>(null);
  const frameV2Ref = useRef<HTMLIFrameElement | null>(null);
  const syncingFromRef = useRef<"v1" | "v2" | null>(null);

  useEffect(() => {
    const f1 = frameV1Ref.current;
    const f2 = frameV2Ref.current;
    if (!f1 || !f2) return;

    const bindScrollSync = (
      sourceFrame: HTMLIFrameElement,
      targetFrame: HTMLIFrameElement,
      id: "v1" | "v2",
    ) => {
      const onLoad = () => {
        const win = sourceFrame.contentWindow;
        if (!win) return;
        win.addEventListener(
          "scroll",
          () => {
            if (syncingFromRef.current && syncingFromRef.current !== id) return;
            syncingFromRef.current = id;
            try {
              targetFrame.contentWindow?.scrollTo({
                top: win.scrollY,
                behavior: "instant" as ScrollBehavior,
              });
            } catch {
              // Ignorar si aún no está listo
            }
            requestAnimationFrame(() => {
              syncingFromRef.current = null;
            });
          },
          { passive: true },
        );
      };
      sourceFrame.addEventListener("load", onLoad);
      return () => sourceFrame.removeEventListener("load", onLoad);
    };

    const cleanup1 = bindScrollSync(f1, f2, "v1");
    const cleanup2 = bindScrollSync(f2, f1, "v2");
    return () => {
      cleanup1();
      cleanup2();
    };
  }, []);

  const handleJump = (ratio: number) => {
    [frameV1Ref.current, frameV2Ref.current].forEach((frame) => {
      const win = frame?.contentWindow;
      const doc = frame?.contentDocument?.documentElement;
      if (!win || !doc) return;
      const maxScroll = Math.max(0, doc.scrollHeight - win.innerHeight);
      win.scrollTo({ top: Math.round(maxScroll * ratio), behavior: "smooth" });
    });
  };

  const v1Url = `/${locale}?qa=1&force3d=1`;
  const v2Url = `/${locale}/v2?qa=1&force3d=1`;

  return (
    <div className="grid grid-rows-[auto_1fr] w-full h-screen bg-[#04070d] text-[#ecf8f8] overflow-x-clip">
      <header className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 bg-[#07111e] border-b border-emerald-400/25 z-20">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-bold tracking-wider uppercase text-white">
            {t("compareTitle")}
          </h1>
          <span className="text-xs text-slate-300 hidden sm:inline">
            {t("compareSubtitle")}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Modo Cortina / Lado a Lado */}
          <div
            className="inline-flex items-center gap-1 p-1 bg-[#04070d] border border-emerald-400/25 rounded-[10px]"
            role="group"
            aria-label="Modo de visualización"
          >
            <button
              type="button"
              onClick={() => setMode("split")}
              aria-pressed={mode === "split"}
              className={`px-3 py-1.5 rounded-[7px] text-xs font-semibold transition-colors ${
                mode === "split"
                  ? "bg-emerald-400/20 text-white border border-emerald-400/60"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              {t("compareSplit")}
            </button>
            <button
              type="button"
              onClick={() => setMode("side")}
              aria-pressed={mode === "side"}
              className={`px-3 py-1.5 rounded-[7px] text-xs font-semibold transition-colors ${
                mode === "side"
                  ? "bg-emerald-400/20 text-white border border-emerald-400/60"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              {t("compareSide")}
            </button>
            {mode === "split" && (
              <label className="inline-flex items-center gap-2 px-2 text-xs text-slate-300">
                <span>{t("compareCut")}</span>
                <input
                  type="range"
                  min={5}
                  max={95}
                  value={splitPercent}
                  onChange={(e) => setSplitPercent(Number(e.target.value))}
                  className="w-24 accent-emerald-400 cursor-pointer"
                  aria-label="Porcentaje de cortina V1 vs V2"
                />
              </label>
            )}
          </div>

          {/* Viewport Desktop / Mobile */}
          <div
            className="inline-flex items-center gap-1 p-1 bg-[#04070d] border border-emerald-400/25 rounded-[10px]"
            role="group"
            aria-label="Tamaño de viewport"
          >
            <button
              type="button"
              onClick={() => setViewport("desktop")}
              aria-pressed={viewport === "desktop"}
              className={`px-3 py-1.5 rounded-[7px] text-xs font-semibold transition-colors ${
                viewport === "desktop"
                  ? "bg-emerald-400/20 text-white border border-emerald-400/60"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              {t("compareDesktop")}
            </button>
            <button
              type="button"
              onClick={() => setViewport("mobile")}
              aria-pressed={viewport === "mobile"}
              className={`px-3 py-1.5 rounded-[7px] text-xs font-semibold transition-colors ${
                viewport === "mobile"
                  ? "bg-emerald-400/20 text-white border border-emerald-400/60"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              {t("compareMobile")}
            </button>
          </div>

          {/* Saltos Rápidos */}
          <div
            className="inline-flex items-center gap-1 p-1 bg-[#04070d] border border-emerald-400/25 rounded-[10px]"
            role="group"
            aria-label="Saltos rápidos de sección"
          >
            <button
              type="button"
              onClick={() => handleJump(0)}
              className="px-2.5 py-1.5 rounded-[7px] text-xs font-semibold text-slate-300 hover:text-white"
            >
              {t("compareJumpHero")}
            </button>
            <button
              type="button"
              onClick={() => handleJump(0.18)}
              className="px-2.5 py-1.5 rounded-[7px] text-xs font-semibold text-slate-300 hover:text-white"
            >
              {t("compareJumpDive")}
            </button>
            <button
              type="button"
              onClick={() => handleJump(0.45)}
              className="px-2.5 py-1.5 rounded-[7px] text-xs font-semibold text-slate-300 hover:text-white"
            >
              {t("compareJumpArtifacts")}
            </button>
            <button
              type="button"
              onClick={() => handleJump(0.65)}
              className="px-2.5 py-1.5 rounded-[7px] text-xs font-semibold text-slate-300 hover:text-white"
            >
              {t("compareJumpProjects")}
            </button>
          </div>

          {/* Enlaces directos */}
          <div className="inline-flex items-center gap-1 p-1 bg-[#04070d] border border-emerald-400/25 rounded-[10px]">
            <a
              href={`/${locale}`}
              className="px-2.5 py-1.5 rounded-[7px] text-xs font-semibold text-slate-300 hover:text-white"
            >
              {t("compareOpenV1")}
            </a>
            <a
              href={`/${locale}/v2`}
              className="px-2.5 py-1.5 rounded-[7px] text-xs font-semibold text-slate-300 hover:text-white"
            >
              {t("compareOpenV2")}
            </a>
          </div>
        </div>
      </header>

      <div className="relative w-full h-full flex items-center justify-center bg-[#04070d] overflow-clip">
        <div
          data-viewport={viewport}
          data-layout={mode}
          className={`relative transition-all duration-300 ${
            viewport === "mobile"
              ? mode === "side"
                ? "w-[min(820px,96vw)] h-[min(844px,calc(100vh-4.5rem))] border border-emerald-400/50 rounded-2xl overflow-clip shadow-2xl"
                : "w-[390px] h-[min(844px,calc(100vh-4.5rem))] border border-emerald-400/50 rounded-2xl overflow-clip shadow-2xl"
              : "w-full h-full"
          }`}
        >
          {mode === "split" ? (
            <div className="relative w-full h-full">
              {/* V1 Pane (Cortina izquierda) */}
              <div
                className="absolute inset-0 w-full h-full z-[2]"
                style={{ clipPath: `inset(0 calc(100% - ${splitPercent}%) 0 0)` }}
              >
                <span className="absolute bottom-4 left-4 z-10 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#04070d]/90 text-white border border-emerald-400/50 pointer-events-none">
                  V1 · Orbital Dark (#04070d)
                </span>
                <iframe
                  ref={frameV1Ref}
                  src={v1Url}
                  title="Versión V1 Orbital Dark"
                  className="w-full h-full border-0 block bg-[#04070d]"
                />
              </div>

              {/* V2 Pane (Fondo completo) */}
              <div className="absolute inset-0 w-full h-full z-[1]">
                <span className="absolute bottom-4 right-4 z-10 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#072a30]/90 text-white border border-teal-300/60 pointer-events-none">
                  V2 · Turquoise Perimeter (#072a30)
                </span>
                <iframe
                  ref={frameV2Ref}
                  src={v2Url}
                  title="Versión V2 Turquoise Perimeter"
                  className="w-full h-full border-0 block bg-[#072a30]"
                />
              </div>

              {/* Divisor vertical */}
              <div
                aria-hidden="true"
                className="absolute top-0 bottom-0 w-0.5 bg-emerald-400 z-[5] -translate-x-1/2 pointer-events-none shadow-[0_0_16px_rgba(52,211,153,0.85)]"
                style={{ left: `${splitPercent}%` }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-[10px] bg-[#061423] border border-emerald-400/60 text-white flex items-center justify-center text-sm font-bold shadow-2xl">
                  ⇄
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 w-full h-full">
              <div className="relative w-full h-full border-r border-emerald-400/50">
                <span className="absolute bottom-4 left-4 z-10 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#04070d]/90 text-white border border-emerald-400/50 pointer-events-none">
                  V1 · Orbital Dark (#04070d)
                </span>
                <iframe
                  ref={frameV1Ref}
                  src={v1Url}
                  title="Versión V1 Orbital Dark"
                  className="w-full h-full border-0 block bg-[#04070d]"
                />
              </div>
              <div className="relative w-full h-full">
                <span className="absolute bottom-4 right-4 z-10 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#072a30]/90 text-white border border-teal-300/60 pointer-events-none">
                  V2 · Turquoise Perimeter (#072a30)
                </span>
                <iframe
                  ref={frameV2Ref}
                  src={v2Url}
                  title="Versión V2 Turquoise Perimeter"
                  className="w-full h-full border-0 block bg-[#072a30]"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
