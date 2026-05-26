'use client'
import React, { createContext, useContext, useState, useEffect, useRef } from 'react'

interface SoundContextProps {
  isMuted: boolean
  toggleMute: () => void
  playTick: () => void
  playClick: () => void
  playBoot: () => void
  playSuccess: () => void
}

const SoundContext = createContext<SoundContextProps | undefined>(undefined)

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(true)
  const audioCtxRef = useRef<AudioContext | null>(null)
  
  // Ambient oscillators & gain nodes refs
  const osc1Ref = useRef<OscillatorNode | null>(null)
  const osc2Ref = useRef<OscillatorNode | null>(null)
  const ambientGainRef = useRef<GainNode | null>(null)

  // Initialize Audio Context on user interaction
  const initAudio = () => {
    if (!audioCtxRef.current) {
      // Create audio context
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      const ctx = new AudioContextClass()
      audioCtxRef.current = ctx

      // Start ambient synth drone pad
      startAmbientDrone(ctx)
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume()
    }
  }

  const startAmbientDrone = (ctx: AudioContext) => {
    // We create a low drone (detuned triangle waves for a smooth retro-futurism feel)
    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const filter = ctx.createBiquadFilter()
    const gain = ctx.createGain()

    osc1.type = 'triangle'
    osc1.frequency.setValueAtTime(55, ctx.currentTime) // A1 note
    
    osc2.type = 'sawtooth'
    osc2.frequency.setValueAtTime(55.3, ctx.currentTime) // Detuned for chorus effect
    
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(120, ctx.currentTime)
    filter.Q.setValueAtTime(5, ctx.currentTime)

    gain.gain.setValueAtTime(isMuted ? 0 : 0.05, ctx.currentTime)

    // Connect nodes
    osc1.connect(filter)
    osc2.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    osc1.start()
    osc2.start()

    // Store refs to control mute and stop on unmount
    osc1Ref.current = osc1
    osc2Ref.current = osc2
    ambientGainRef.current = gain

    // Modulate filter frequency slowly with LFO (synthesized LFO)
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    lfo.frequency.setValueAtTime(0.08, ctx.currentTime) // Slow sweep (12 seconds per wave)
    lfoGain.gain.setValueAtTime(30, ctx.currentTime) // Sweep range
    lfo.connect(lfoGain)
    lfoGain.connect(filter.frequency)
    lfo.start()
  }

  // Toggle Mute
  const toggleMute = () => {
    const nextMute = !isMuted
    setIsMuted(nextMute)
    
    if (nextMute) {
      if (ambientGainRef.current && audioCtxRef.current) {
        ambientGainRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 0.5)
      }
    } else {
      initAudio()
      if (ambientGainRef.current && audioCtxRef.current) {
        ambientGainRef.current.gain.linearRampToValueAtTime(0.04, audioCtxRef.current.currentTime + 0.8)
      }
    }
  }

  // 1. Play Short high-frequency digital tick (button hovers)
  const playTick = () => {
    if (isMuted || !audioCtxRef.current) return
    const ctx = audioCtxRef.current
    if (ctx.state === 'suspended') return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(1800, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05)

    gain.gain.setValueAtTime(0.015, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.06)
  }

  // 2. Play digital click selection (button clicks)
  const playClick = () => {
    if (isMuted || !audioCtxRef.current) return
    const ctx = audioCtxRef.current
    if (ctx.state === 'suspended') return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(600, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.08)

    gain.gain.setValueAtTime(0.04, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.09)
  }

  // 3. Play telemetry diagnostic ascending sound (terminal boot-up)
  const playBoot = () => {
    if (isMuted || !audioCtxRef.current) return
    const ctx = audioCtxRef.current
    if (ctx.state === 'suspended') return

    const now = ctx.currentTime
    const notes = [220, 330, 440, 660, 880] // Harmonic progression

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + idx * 0.08)

      gain.gain.setValueAtTime(0, now)
      gain.gain.linearRampToValueAtTime(0.02, now + idx * 0.08 + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.15)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now + idx * 0.08)
      osc.stop(now + idx * 0.08 + 0.2)
    })
  }

  // 4. Play transaction success digital chime (checkout/telemetry pass)
  const playSuccess = () => {
    if (isMuted || !audioCtxRef.current) return
    const ctx = audioCtxRef.current
    if (ctx.state === 'suspended') return

    const now = ctx.currentTime
    
    // Low frequency notification sweep
    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const gain = ctx.createGain()

    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(523.25, now) // C5 note
    osc1.frequency.setValueAtTime(659.25, now + 0.1) // E5 note

    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(783.99, now) // G5 note
    osc2.frequency.setValueAtTime(1046.50, now + 0.1) // C6 note

    gain.gain.setValueAtTime(0.03, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4)

    osc1.connect(gain)
    osc2.connect(gain)
    gain.connect(ctx.destination)

    osc1.start(now)
    osc2.start(now)
    osc1.stop(now + 0.4)
    osc2.stop(now + 0.4)
  }

  // Subscribe to custom event triggered by Persona Switcher
  useEffect(() => {
    const handlePersonaChange = () => {
      playBoot()
    }
    window.addEventListener('persona-change', handlePersonaChange)
    return () => {
      window.removeEventListener('persona-change', handlePersonaChange)
      
      // Stop oscillators on cleanup
      if (osc1Ref.current) osc1Ref.current.stop()
      if (osc2Ref.current) osc2Ref.current.stop()
    }
  }, [isMuted])

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute, playTick, playClick, playBoot, playSuccess }}>
      {/* Click proxy to enable audio context on first click */}
      <div onClick={initAudio} className="contents">
        {children}
      </div>
    </SoundContext.Provider>
  )
}

export function useSound() {
  const context = useContext(SoundContext)
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider')
  }
  return context
}
