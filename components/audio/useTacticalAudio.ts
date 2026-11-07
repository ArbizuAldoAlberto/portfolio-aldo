"use client";

import { useCallback, useRef } from "react";
import type { WorkbenchMode } from "../three/HalconWorkbench";

export function useTacticalAudio() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getContext = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) ctxRef.current = new AudioCtx();
    }
    if (ctxRef.current && ctxRef.current.state === "suspended") {
      ctxRef.current.resume().catch(() => {});
    }
    return ctxRef.current;
  }, []);

  // Micro-tick mecánico de precisión para hover (12ms, ultra sutil)
  const playHoverTick = useCallback(() => {
    const ctx = getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(2200, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.015);

    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.016);
  }, [getContext]);

  // Firma acústica diferenciada para cada modo táctico del Halcón Workbench
  const playModeSwitch = useCallback(
    (mode: WorkbenchMode) => {
      const ctx = getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      if (mode === "pbr") {
        // Anclaje mecánico cálido (440 Hz -> 880 Hz)
        osc1.type = "triangle";
        osc2.type = "sine";
        osc1.frequency.setValueAtTime(440, now);
        osc1.frequency.exponentialRampToValueAtTime(880, now + 0.09);
        osc2.frequency.setValueAtTime(220, now);
        osc2.frequency.exponentialRampToValueAtTime(440, now + 0.09);
      } else if (mode === "wireframe") {
        // Pulso vectorial CAD de alta precisión (1320 Hz -> 1760 Hz)
        osc1.type = "sine";
        osc2.type = "sine";
        osc1.frequency.setValueAtTime(1320, now);
        osc1.frequency.exponentialRampToValueAtTime(1760, now + 0.075);
        osc2.frequency.setValueAtTime(660, now);
        osc2.frequency.exponentialRampToValueAtTime(880, now + 0.075);
      } else {
        // Resonancia cuántica X-Ray (Barrido armónico 330 Hz -> 1320 Hz)
        osc1.type = "sine";
        osc2.type = "triangle";
        osc1.frequency.setValueAtTime(330, now);
        osc1.frequency.exponentialRampToValueAtTime(1320, now + 0.12);
        osc2.frequency.setValueAtTime(165, now);
        osc2.frequency.exponentialRampToValueAtTime(660, now + 0.12);
      }

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.055, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.14);
      osc2.stop(now + 0.14);
    },
    [getContext]
  );

  return { playHoverTick, playModeSwitch };
}
