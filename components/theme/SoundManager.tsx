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
  const isMutedRef = useRef(isMuted)

  useEffect(() => {
    isMutedRef.current = isMuted
  }, [isMuted])

  const audioCtxRef = useRef<AudioContext | null>(null)
  
  // Ambient oscillators & gain nodes refs
  const osc1Ref = useRef<OscillatorNode | null>(null)
  const osc2Ref = useRef<OscillatorNode | null>(null)
  const filterRef = useRef<BiquadFilterNode | null>(null)
  const ambientGainRef = useRef<GainNode | null>(null)
  const targetGainRef = useRef<number>(0.04)

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
    // Get saved persona
    const saved = localStorage.getItem('nexus_persona')
    const persona = (saved && ['engineer', 'security', 'agtech'].includes(saved)) ? saved : 'engineer'

    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const filter = ctx.createBiquadFilter()
    const gain = ctx.createGain()

    let osc1Type: OscillatorType = 'triangle'
    let osc2Type: OscillatorType = 'sawtooth'
    let freq1 = 110
    let freq2 = 110.6
    let gainVal = 0.04
    let filterFreq = 330

    if (persona === 'engineer') {
      osc1Type = 'sawtooth'
      osc2Type = 'sawtooth'
      freq1 = 82.4 // E2
      freq2 = 82.9
      gainVal = 0.04
      filterFreq = 247
    } else if (persona === 'agtech') {
      osc1Type = 'sine'
      osc2Type = 'sine'
      freq1 = 220 // A3
      freq2 = 220.6
      gainVal = 0.03
      filterFreq = 660
    } else { // security
      osc1Type = 'triangle'
      osc2Type = 'triangle'
      freq1 = 110 // A2
      freq2 = 110.6
      gainVal = 0.05
      filterFreq = 330
    }

    targetGainRef.current = gainVal

    osc1.type = osc1Type
    osc1.frequency.setValueAtTime(freq1, ctx.currentTime)
    
    osc2.type = osc2Type
    osc2.frequency.setValueAtTime(freq2, ctx.currentTime)
    
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(filterFreq, ctx.currentTime)
    filter.Q.setValueAtTime(5, ctx.currentTime)

    gain.gain.setValueAtTime(isMutedRef.current ? 0 : gainVal, ctx.currentTime)

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
    filterRef.current = filter
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

  // Live updates to the drone when the persona switches in real time
  const updateDronePersona = (persona: string) => {
    if (!audioCtxRef.current || !osc1Ref.current || !osc2Ref.current || !ambientGainRef.current) return
    const ctx = audioCtxRef.current
    const now = ctx.currentTime

    let osc1Type: OscillatorType = 'triangle'
    let osc2Type: OscillatorType = 'sawtooth'
    let freq1 = 110
    let freq2 = 110.6
    let gainVal = 0.04
    let filterFreq = 330

    if (persona === 'engineer') {
      osc1Type = 'sawtooth'
      osc2Type = 'sawtooth'
      freq1 = 82.4 // E2
      freq2 = 82.9
      gainVal = 0.04
      filterFreq = 247
    } else if (persona === 'agtech') {
      osc1Type = 'sine'
      osc2Type = 'sine'
      freq1 = 220 // A3
      freq2 = 220.6
      gainVal = 0.03
      filterFreq = 660
    } else { // security
      osc1Type = 'triangle'
      osc2Type = 'triangle'
      freq1 = 110 // A2
      freq2 = 110.6
      gainVal = 0.05
      filterFreq = 330
    }

    targetGainRef.current = gainVal

    // Set osc types
    osc1Ref.current.type = osc1Type
    osc2Ref.current.type = osc2Type

    // Transition frequencies smoothly
    osc1Ref.current.frequency.exponentialRampToValueAtTime(freq1, now + 0.8)
    osc2Ref.current.frequency.exponentialRampToValueAtTime(freq2, now + 0.8)

    // Transition filter frequency smoothly
    if (filterRef.current) {
      filterRef.current.frequency.exponentialRampToValueAtTime(filterFreq, now + 0.8)
    }

    // Transition volume (gain) if not muted
    if (!isMutedRef.current) {
      ambientGainRef.current.gain.linearRampToValueAtTime(gainVal, now + 0.8)
    }
  }

  // Toggle Mute
  const toggleMute = () => {
    const nextMute = !isMuted
    setIsMuted(nextMute)
    isMutedRef.current = nextMute
    
    if (nextMute) {
      if (ambientGainRef.current && audioCtxRef.current) {
        ambientGainRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 0.5)
      }
    } else {
      initAudio()
      if (ambientGainRef.current && audioCtxRef.current) {
        ambientGainRef.current.gain.linearRampToValueAtTime(targetGainRef.current, audioCtxRef.current.currentTime + 0.8)
      }
      // Play telemetry diagnostic immediately when unmuting
      setTimeout(() => {
        playBoot()
      }, 50)
    }
  }

  // 1. Play Short high-frequency digital tick (button hovers)
  const playTick = () => {
    if (isMutedRef.current || !audioCtxRef.current) return
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
    if (isMutedRef.current || !audioCtxRef.current) return
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
    if (isMutedRef.current || !audioCtxRef.current) return
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
    if (isMutedRef.current || !audioCtxRef.current) return
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
    const handlePersonaChange = (e: Event) => {
      const customEvent = e as CustomEvent
      const newPersona = customEvent.detail
      updateDronePersona(newPersona)
      playBoot()
    }
    window.addEventListener('persona-change', handlePersonaChange)
    return () => {
      window.removeEventListener('persona-change', handlePersonaChange)
    }
  }, [])

  // Stop oscillators ONLY on component unmount
  useEffect(() => {
    return () => {
      if (osc1Ref.current) {
        try { osc1Ref.current.stop() } catch (err) {}
      }
      if (osc2Ref.current) {
        try { osc2Ref.current.stop() } catch (err) {}
      }
    }
  }, [])

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
