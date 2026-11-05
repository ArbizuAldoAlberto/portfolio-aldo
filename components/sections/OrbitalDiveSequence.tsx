"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

export interface WebantiState {
  frame: number;
  frameCount: number;
  progress: number;
  ready: boolean;
  theme: string;
  loaded: number;
  scrollTo: (target: number | string | HTMLElement) => void;
}

declare global {
  interface Window {
    __webanti: WebantiState;
  }
}

const FRAME_COUNT = 240;
const KEYFRAME_STRIDE = 8;
const BATCH_CONCURRENCY = 12;
const MAX_ORBIT_KM = 400;

interface BeatRange {
  el: HTMLElement;
  start: number;
  end: number;
}

function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}

function formatCount(value: number, format: string | null): string {
  const rounded = Math.round(value);
  if (format === "es") {
    return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  return String(rounded);
}

export default function OrbitalDiveSequence() {
  const t = useTranslations("OrbitalUI");
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const readoutRef = useRef<HTMLSpanElement | null>(null);
  const fillRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const diveSection = sectionRef.current;
    const depthReadout = readoutRef.current;
    const depthFill = fillRef.current;

    if (!canvas || !diveSection) return;

    let cancelled = false;
    let isMobile = window.innerWidth < 768;

    const beatEls = Array.from(diveSection.querySelectorAll<HTMLElement>("[data-beat]"));
    const beats: BeatRange[] = beatEls.map((el) => {
      const raw = el.getAttribute("data-beat") ?? "0,1";
      const [s, e] = raw.split(",").map((v) => parseFloat(v.trim()));
      return {
        el,
        start: Number.isFinite(s) ? s : 0,
        end: Number.isFinite(e) ? e : 1,
      };
    });

    const theme = document.documentElement.getAttribute("data-theme") || "v1";

    const state: WebantiState = {
      frame: 1,
      frameCount: FRAME_COUNT,
      progress: 0,
      ready: true,
      theme,
      loaded: 0,
      scrollTo: (target) => {
        if (typeof target === "number") {
          window.scrollTo(0, target);
        } else if (typeof target === "string") {
          const el = document.querySelector<HTMLElement>(target);
          if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY;
            window.scrollTo(0, top);
          }
        } else if (target instanceof HTMLElement) {
          const top = target.getBoundingClientRect().top + window.scrollY;
          window.scrollTo(0, top);
        }
        ScrollTrigger.update();
        updateFromScroll();
      },
    };
    window.__webanti = state;

    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
    const frames: Array<HTMLImageElement | null> = new Array(FRAME_COUNT + 1).fill(null);
    const bitmaps: Array<ImageBitmap | null> = new Array(FRAME_COUNT + 1).fill(null);
    const loadingFlags: boolean[] = new Array(FRAME_COUNT + 1).fill(false);

    let lastDrawnFrame = -1;
    let lastDrawnSourceIndex = -1;
    let canvasWidth = 0;
    let canvasHeight = 0;

    function frameUrl(index: number): string {
      const folder = isMobile ? "mobile" : "desktop";
      const padded = String(index).padStart(4, "0");
      return `/media/frames/${folder}/f_${padded}.webp`;
    }

    function drawProceduralOrbitalFallback(targetIndex: number): void {
      if (!ctx || !canvasWidth || !canvasHeight) return;
      const p = clamp((targetIndex - 1) / (FRAME_COUNT - 1), 0, 1);
      const cx = canvasWidth * 0.5;
      const cy = canvasHeight * (0.48 - p * 0.06);
      const maxR = Math.max(canvasWidth, canvasHeight) * 0.68;

      const grad = ctx.createRadialGradient(cx, cy, canvasWidth * 0.03, cx, canvasHeight * 0.5, maxR);
      grad.addColorStop(0, p < 0.5 ? "#0b3842" : "#0e483e");
      grad.addColorStop(0.42, "#061524");
      grad.addColorStop(1, "#04070d");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Anillos orbitales procedurales sincronizados con el frame
      ctx.save();
      ctx.translate(cx, cy);
      for (let rIdx = 1; rIdx <= 4; rIdx++) {
        const radius = Math.min(canvasWidth, canvasHeight) * (0.12 * rIdx + p * 0.08);
        ctx.beginPath();
        ctx.ellipse(
          0,
          0,
          radius,
          radius * (0.42 + 0.08 * Math.cos(p * Math.PI + rIdx)),
          p * 1.4 + rIdx * 0.45,
          0,
          Math.PI * 2,
        );
        ctx.strokeStyle = rIdx % 2 === 0 ? "rgba(94, 242, 224, 0.24)" : "rgba(52, 211, 153, 0.28)";
        ctx.lineWidth = Math.max(1, canvasWidth * 0.0012);
        ctx.stroke();
      }
      ctx.restore();
    }

    function findNearestLoaded(
      target: number,
    ): { source: CanvasImageSource; width: number; height: number; index: number } | null {
      const pick = (
        idx: number,
      ): { source: CanvasImageSource; width: number; height: number; index: number } | null => {
        const bmp = bitmaps[idx];
        if (bmp && bmp.width > 0) {
          return { source: bmp, width: bmp.width, height: bmp.height, index: idx };
        }
        const img = frames[idx];
        if (img && img.complete && img.naturalWidth > 0) {
          return { source: img, width: img.naturalWidth, height: img.naturalHeight, index: idx };
        }
        return null;
      };

      const direct = pick(target);
      if (direct) return direct;

      for (let delta = 1; delta <= FRAME_COUNT; delta++) {
        const prev = target - delta;
        if (prev >= 1) {
          const hitPrev = pick(prev);
          if (hitPrev) return hitPrev;
        }
        const next = target + delta;
        if (next <= FRAME_COUNT) {
          const hitNext = pick(next);
          if (hitNext) return hitNext;
        }
      }
      return null;
    }

    function drawFrame(targetIndex: number): void {
      if (!ctx || !canvasWidth || !canvasHeight) return;
      const clamped = clamp(targetIndex, 1, FRAME_COUNT);
      if (clamped === lastDrawnFrame && lastDrawnSourceIndex === clamped) {
        return;
      }

      const nearest = findNearestLoaded(clamped);
      if (!nearest) {
        drawProceduralOrbitalFallback(clamped);
        lastDrawnFrame = clamped;
        lastDrawnSourceIndex = -1;
        return;
      }

      if (nearest.index === lastDrawnSourceIndex && lastDrawnFrame !== -1) {
        lastDrawnFrame = clamped;
        return;
      }

      const iw = nearest.width;
      const ih = nearest.height;
      if (!iw || !ih) return;

      const scale = Math.max(canvasWidth / iw, canvasHeight / ih);
      const sw = canvasWidth / scale;
      const sh = canvasHeight / scale;
      const sx = (iw - sw) * 0.5;
      const sy = (ih - sh) * 0.5;

      ctx.drawImage(nearest.source, sx, sy, sw, sh, 0, 0, canvasWidth, canvasHeight);
      lastDrawnFrame = clamped;
      lastDrawnSourceIndex = nearest.index;
    }

    function resizeCanvas(): void {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.round((rect.width || window.innerWidth) * dpr));
      const h = Math.max(1, Math.round((rect.height || window.innerHeight) * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        canvasWidth = w;
        canvasHeight = h;
        lastDrawnFrame = -1;
        lastDrawnSourceIndex = -1;
        drawFrame(state.frame);
      }
    }

    function updateBeats(progress: number): void {
      for (const beat of beats) {
        const span = Math.max(0.01, beat.end - beat.start);
        const fade = span * 0.22;
        let opacity = 0;
        let yPx = 18;

        if (progress >= beat.start && progress <= beat.end) {
          if (progress < beat.start + fade) {
            const r = (progress - beat.start) / fade;
            opacity = r;
            yPx = (1 - r) * 18;
          } else if (progress > beat.end - fade) {
            const r = (beat.end - progress) / fade;
            opacity = r;
            yPx = -(1 - r) * 18;
          } else {
            opacity = 1;
            yPx = 0;
          }
        } else if (progress > beat.end) {
          yPx = -18;
        }

        const isActive = opacity > 0.05;
        const isCenterDesktop = beat.el.classList.contains("beat--center") && window.innerWidth > 768;
        const xTranslate = isCenterDesktop ? "-50%" : "0px";
        beat.el.classList.toggle("is-active", isActive);
        beat.el.setAttribute("data-active", isActive ? "true" : "false");
        beat.el.style.opacity = opacity.toFixed(3);
        beat.el.style.transform = `translate3d(${xTranslate}, ${yPx.toFixed(1)}px, 0)`;
      }
    }

    function updateDepth(progress: number): void {
      const km = Math.round(progress * MAX_ORBIT_KM);
      if (depthReadout) {
        depthReadout.textContent = String(km);
      }
      if (depthFill) {
        depthFill.style.setProperty("--depth-progress", progress.toFixed(4));
        depthFill.style.transformOrigin = "top center";
        depthFill.style.transform = `scaleY(${progress.toFixed(4)})`;
      }
    }

    function applyProgress(rawProgress: number): void {
      const progress = clamp(rawProgress, 0, 1);
      const targetFrame = clamp(Math.round(1 + progress * (FRAME_COUNT - 1)), 1, FRAME_COUNT);
      state.progress = progress;
      state.frame = targetFrame;
      state.theme = document.documentElement.getAttribute("data-theme") || "v1";
      drawFrame(targetFrame);
      updateDepth(progress);
      updateBeats(progress);
    }

    function computeScrollProgress(): number {
      if (!diveSection) return 0;
      const rect = diveSection.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const scrollable = Math.max(1, rect.height - vh);
      return clamp(-rect.top / scrollable, 0, 1);
    }

    function updateFromScroll(): void {
      applyProgress(computeScrollProgress());
    }

    function loadSingleFrame(index: number): Promise<void> {
      if (cancelled || index < 1 || index > FRAME_COUNT) return Promise.resolve();
      if (frames[index] || bitmaps[index] || loadingFlags[index]) return Promise.resolve();
      loadingFlags[index] = true;

      return new Promise((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          if (cancelled) {
            resolve();
            return;
          }
          frames[index] = img;
          const finalize = () => {
            state.loaded += 1;
            if (!state.ready || index === state.frame || Math.abs(index - state.frame) <= KEYFRAME_STRIDE) {
              state.ready = true;
              lastDrawnSourceIndex = -1;
              drawFrame(state.frame);
            }
            resolve();
          };
          if (typeof window.createImageBitmap === "function") {
            window
              .createImageBitmap(img)
              .then((bmp) => {
                if (!cancelled) bitmaps[index] = bmp;
                finalize();
              })
              .catch(() => {
                finalize();
              });
          } else {
            finalize();
          }
        };
        img.onerror = () => {
          loadingFlags[index] = false;
          resolve();
        };
        img.src = frameUrl(index);
      });
    }

    async function preloadAllFrames(): Promise<void> {
      await loadSingleFrame(1);
      if (cancelled) return;
      state.ready = true;
      drawFrame(state.frame);

      const keyframes: number[] = [];
      for (let i = 1; i <= FRAME_COUNT; i += KEYFRAME_STRIDE) {
        if (!frames[i]) keyframes.push(i);
      }
      if (!frames[FRAME_COUNT]) keyframes.push(FRAME_COUNT);

      for (let i = 0; i < keyframes.length; i += BATCH_CONCURRENCY) {
        if (cancelled) return;
        const chunk = keyframes.slice(i, i + BATCH_CONCURRENCY);
        await Promise.all(chunk.map((idx) => loadSingleFrame(idx)));
        drawFrame(state.frame);
      }

      const remaining: number[] = [];
      for (let i = 1; i <= FRAME_COUNT; i++) {
        if (!frames[i] && !loadingFlags[i]) remaining.push(i);
      }
      for (let i = 0; i < remaining.length; i += BATCH_CONCURRENCY) {
        if (cancelled) return;
        const chunk = remaining.slice(i, i + BATCH_CONCURRENCY);
        await Promise.all(chunk.map((idx) => loadSingleFrame(idx)));
      }
      drawFrame(state.frame);
    }

    // Inicialización síncrona del canvas
    resizeCanvas();
    drawProceduralOrbitalFallback(1);
    applyProgress(computeScrollProgress());
    state.ready = true;
    void preloadAllFrames();

    const trigger = ScrollTrigger.create({
      trigger: diveSection,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        applyProgress(self.progress);
      },
    });

    const onScroll = () => {
      updateFromScroll();
    };

    const onResize = () => {
      const nextMobile = window.innerWidth < 768;
      if (nextMobile !== isMobile) {
        isMobile = nextMobile;
      }
      resizeCanvas();
      updateFromScroll();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    // Inicializar interacciones magnéticas, inclinación 3D, flotación ±6px, contadores y partículas
    const magnetics = Array.from(document.querySelectorAll<HTMLElement>("[data-magnetic]"));
    magnetics.forEach((btn) => {
      btn.addEventListener("pointermove", (e: PointerEvent) => {
        const rect = btn.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const relX = e.clientX - rect.left;
        const relY = e.clientY - rect.top;
        const normX = (relX / rect.width - 0.5) * 2;
        const normY = (relY / rect.height - 0.5) * 2;
        btn.style.setProperty("--mx", `${((relX / rect.width) * 100).toFixed(1)}%`);
        btn.style.setProperty("--my", `${((relY / rect.height) * 100).toFixed(1)}%`);
        btn.style.transform = `translate3d(${(normX * 6).toFixed(2)}px, ${(normY * 4).toFixed(2)}px, 0)`;
      });
      btn.addEventListener("pointerleave", () => {
        btn.style.transform = "translate3d(0, 0, 0)";
      });
    });

    const tiltCards = Array.from(document.querySelectorAll<HTMLElement>("[data-tilt]"));
    tiltCards.forEach((card) => {
      card.addEventListener("pointermove", (e: PointerEvent) => {
        const rect = card.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rotY = (px - 0.5) * 10;
        const rotX = (0.5 - py) * 8;
        card.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
        card.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
        card.style.transform = `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
      });
    });

    const floatImgs = Array.from(document.querySelectorAll<HTMLElement>("img[data-float]"));
    const floatTweens = floatImgs.map((img, idx) =>
      gsap.to(img, {
        y: 6,
        duration: 2.8 + (idx % 3) * 0.35,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: idx * 0.25,
      }),
    );

    const countEls = Array.from(document.querySelectorAll<HTMLElement>("[data-count]"));
    const triggerCounter = (el: HTMLElement, immediate = false): void => {
      const target = parseFloat(el.getAttribute("data-count") ?? "0");
      const fmt = el.getAttribute("data-format");
      if (!Number.isFinite(target)) return;
      if (immediate || el.dataset.counted === "done") {
        el.dataset.counted = "done";
        el.textContent = formatCount(target, fmt);
        return;
      }
      if (el.dataset.counted === "running") return;
      el.dataset.counted = "running";
      const proxy = { val: 0 };
      gsap.to(proxy, {
        val: target,
        duration: 0.9,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = formatCount(proxy.val, fmt);
        },
        onComplete: () => {
          el.dataset.counted = "done";
          el.textContent = formatCount(target, fmt);
        },
      });
    };

    if ("IntersectionObserver" in window) {
      const countObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              triggerCounter(entry.target as HTMLElement);
              countObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 },
      );
      countEls.forEach((el) => countObserver.observe(el));
    } else {
      countEls.forEach((el) => triggerCounter(el, true));
    }

    const syncCountsOnScroll = () => {
      const vh = window.innerHeight || 800;
      countEls.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.92) {
          triggerCounter(el, true);
        }
      });
    };
    window.addEventListener("scroll", syncCountsOnScroll, { passive: true });

    // Partículas ambientales discretas en [data-particles]
    const particleHost = document.querySelector<HTMLElement>("[data-particles]");
    if (particleHost && particleHost.childElementCount === 0) {
      for (let i = 0; i < 16; i++) {
        const dot = document.createElement("span");
        dot.className = "particle";
        dot.style.left = `${(i * 6.3 + 4) % 94}%`;
        dot.style.top = `${(i * 13.7 + 8) % 88}%`;
        particleHost.appendChild(dot);
      }
    }

    return () => {
      cancelled = true;
      trigger.kill();
      floatTweens.forEach((tw) => tw.kill());
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", syncCountsOnScroll);
    };
  }, []);

  return (
    <section
      id="inmersion"
      ref={sectionRef}
      className="dive"
      data-section="dive"
      aria-label={t("diveAria")}
    >
      <div className="seq-sticky">
        <canvas
          id="seq-canvas"
          ref={canvasRef}
          role="img"
          aria-label={t("diveCanvasAria")}
        />
        <div className="edge-fuse edge-fuse--top" aria-hidden="true" />
        <div className="edge-fuse edge-fuse--bottom" aria-hidden="true" />

        <div className="depth-gauge" aria-hidden="true">
          <span className="depth-value" ref={readoutRef} data-depth-readout>
            0
          </span>
          <span className="depth-unit">{t("diveDepthUnit")}</span>
          <span className="depth-track">
            <span className="depth-fill" ref={fillRef} data-depth-fill />
          </span>
        </div>

        <div className="beats">
          <article className="beat" data-beat="0.06,0.30">
            <h2 className="beat-title">{t("beat1Title")}</h2>
            <p className="beat-copy">{t("beat1Copy")}</p>
          </article>

          <article className="beat beat--right" data-beat="0.36,0.62">
            <h2 className="beat-title">{t("beat2Title")}</h2>
            <p className="beat-copy">{t("beat2Copy")}</p>
          </article>

          <article className="beat beat--center" data-beat="0.70,0.97">
            <h2 className="beat-title">{t("beat3Title")}</h2>
            <p className="beat-copy">{t("beat3Copy")}</p>
          </article>
        </div>
      </div>
    </section>
  );
}
