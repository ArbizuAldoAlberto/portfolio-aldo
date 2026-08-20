"use client";

class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = true;
  private initialized: boolean = false;
  private listeners: Set<(muted: boolean) => void> = new Set();

  // Ambient Drone & Synthwave Nodes
  private ambientGain: GainNode | null = null;
  private ambientOscs: (OscillatorNode | GainNode)[] = [];
  private ambientTimer: any = null;
  private isAmbientActive: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nexus_sound_muted");
      if (saved !== null) {
        this.muted = saved === "true";
      }
    }
  }

  private initContext() {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
      this.initialized = true;
    } catch {
      // Graceful fallback
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public isAmbientPlaying(): boolean {
    return this.isAmbientActive && !this.muted;
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    if (typeof window !== "undefined") {
      localStorage.setItem("nexus_sound_muted", String(muted));
    }
    if (!muted) {
      this.initContext();
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
      this.playSwitch();
      this.startAmbient();
    } else {
      this.stopAmbient();
    }
    this.listeners.forEach((cb) => cb(this.muted));
  }

  public toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  public subscribe(cb: (muted: boolean) => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  // =========================================================================
  // MOTOR PROCEDURAL: DRONE / SYNTHWAVE AMBIENTAL AUDIBLE Y CÁLIDO (0 KB)
  // Genera un paisaje sonoro espacial continuo, armónico y audible
  // =========================================================================
  public startAmbient() {
    if (this.muted || this.isAmbientActive) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;

      // 1. Master Ambient Gain con Fade In nítido
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.exponentialRampToValueAtTime(0.12, now + 1.2); // Volumen cálido audible

      // 2. Filtro Analógico Lowpass Resonante (1400 Hz)
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1400, now);
      filter.Q.setValueAtTime(2.2, now);

      // 3. LFO para modulación suave del filtro (respiración espacial)
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.type = "sine";
      lfo.frequency.setValueAtTime(0.08, now); // Ciclo de 12 segundos
      lfoGain.gain.setValueAtTime(450, now);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start(now);

      // 4. Capas Armónicas (Acorde Espacial La Menor: 55Hz, 110Hz, 164.8Hz, 220Hz, 329.6Hz)
      const frequencies = [
        { freq: 55, type: "sine" as const, gain: 0.5, detune: 0 },
        { freq: 110, type: "triangle" as const, gain: 0.35, detune: -3 },
        { freq: 164.81, type: "sine" as const, gain: 0.3, detune: 4 },
        { freq: 220, type: "sawtooth" as const, gain: 0.15, detune: -5 },
        { freq: 329.63, type: "triangle" as const, gain: 0.18, detune: 6 },
      ];

      const nodes: (OscillatorNode | GainNode)[] = [lfo, lfoGain];

      frequencies.forEach(({ freq, type, gain: gVal, detune }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);
        osc.detune.setValueAtTime(detune, now);

        g.gain.setValueAtTime(gVal, now);

        osc.connect(g);
        g.connect(filter);
        osc.start(now);

        nodes.push(osc, g);
      });

      // 5. Pulsos de Arpegio Táctico / Synthwave Pulse
      const arpeggioInterval = setInterval(() => {
        if (!this.ctx || !this.isAmbientActive || this.muted || this.ctx.state !== "running") return;
        try {
          const t = this.ctx.currentTime;
          const arpNotes = [220, 261.63, 329.63, 440]; // Am7 notas
          const note = arpNotes[Math.floor(Math.random() * arpNotes.length)];

          const arpOsc = this.ctx.createOscillator();
          const arpGain = this.ctx.createGain();

          arpOsc.type = "sine";
          arpOsc.frequency.setValueAtTime(note, t);

          arpGain.gain.setValueAtTime(0.02, t);
          arpGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);

          arpOsc.connect(arpGain);
          arpGain.connect(filter);

          arpOsc.start(t);
          arpOsc.stop(t + 0.35);
        } catch {}
      }, 1200);

      this.ambientTimer = arpeggioInterval;

      filter.connect(masterGain);
      masterGain.connect(this.ctx.destination);

      this.ambientGain = masterGain;
      this.ambientOscs = nodes;
      this.isAmbientActive = true;
    } catch {
      // Graceful
    }
  }

  public stopAmbient() {
    if (this.ambientTimer) {
      clearInterval(this.ambientTimer);
      this.ambientTimer = null;
    }

    if (!this.isAmbientActive || !this.ctx || !this.ambientGain) {
      this.isAmbientActive = false;
      return;
    }

    try {
      const now = this.ctx.currentTime;
      this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now);
      this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

      setTimeout(() => {
        this.ambientOscs.forEach((node) => {
          try {
            if ("stop" in node) (node as OscillatorNode).stop();
            node.disconnect();
          } catch {}
        });
        this.ambientOscs = [];
        this.ambientGain = null;
        this.isAmbientActive = false;
      }, 850);
    } catch {
      this.isAmbientActive = false;
    }
  }

  // =========================================================================
  // MICRO-AUDIO TÁCTICO DE INTERFAZ
  // =========================================================================
  public playHover() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx || this.ctx.state !== "running") return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(840, this.ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    } catch {}
  }

  public playClick() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx || this.ctx.state !== "running") return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.045);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.045);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.045);
    } catch {}
  }

  public playSwitch() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx || this.ctx.state !== "running") return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.setValueAtTime(880, t + 0.04);

      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.08);
    } catch {}
  }

  public playSuccess() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx || this.ctx.state !== "running") return;

    try {
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((f, idx) => {
        if (!this.ctx) return;
        const start = this.ctx.currentTime + idx * 0.04;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(f, start);

        gain.gain.setValueAtTime(0.05, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.12);
      });
    } catch {}
  }
}

export const soundEngine = new SoundEngine();
