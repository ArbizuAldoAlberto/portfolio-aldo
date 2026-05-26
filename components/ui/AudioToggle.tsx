'use client'
import { useSound } from '../theme/SoundManager'
import { Volume2, VolumeX } from 'lucide-react'

export default function AudioToggle() {
  const { isMuted, toggleMute, playTick } = useSound()

  return (
    <button
      onClick={toggleMute}
      onMouseEnter={playTick}
      className="fixed bottom-6 left-6 z-[99] p-3 rounded-full bg-[var(--color-deep-space)]/90 border border-[var(--color-space-border)] backdrop-blur-xl shadow-2xl flex items-center justify-center cursor-pointer select-none transition-all duration-300 hover:border-[var(--color-orbital-teal)]/30 hover:scale-105 active:scale-95 group text-white pointer-events-auto"
      title={isMuted ? 'Activar sonido cinemático' : 'Silenciar sonido'}
    >
      <div className="flex items-center gap-2">
        {/* Equalizer animation */}
        {!isMuted ? (
          <div className="flex items-end gap-[2px] h-3 w-4">
            <span className="w-[2px] bg-[var(--color-orbital-teal)] rounded-full animate-eq1" style={{ height: '30%', animation: 'eq 0.8s ease-in-out infinite alternate' }}></span>
            <span className="w-[2px] bg-[var(--color-orbital-teal)] rounded-full animate-eq2" style={{ height: '60%', animation: 'eq 0.5s ease-in-out infinite alternate 0.1s' }}></span>
            <span className="w-[2px] bg-[var(--color-orbital-teal)] rounded-full animate-eq3" style={{ height: '40%', animation: 'eq 0.7s ease-in-out infinite alternate 0.2s' }}></span>
            <span className="w-[2px] bg-[var(--color-orbital-teal)] rounded-full animate-eq4" style={{ height: '90%', animation: 'eq 0.4s ease-in-out infinite alternate 0.15s' }}></span>
          </div>
        ) : (
          <div className="flex items-end gap-[2px] h-3 w-4 opacity-30">
            <span className="w-[2px] h-1.5 bg-[var(--color-mist-gray)] rounded-full"></span>
            <span className="w-[2px] h-3 bg-[var(--color-mist-gray)] rounded-full"></span>
            <span className="w-[2px] h-2 bg-[var(--color-mist-gray)] rounded-full"></span>
            <span className="w-[2px] h-1 bg-[var(--color-mist-gray)] rounded-full"></span>
          </div>
        )}

        <div className="text-[10px] font-space font-bold tracking-widest text-[var(--color-mist-gray)] uppercase group-hover:text-white transition-colors flex items-center gap-1.5">
          {isMuted ? (
            <>
              <VolumeX size={12} className="text-red-400" />
              <span>SOUND OFF</span>
            </>
          ) : (
            <>
              <Volume2 size={12} className="text-green-400" />
              <span>SOUND ON</span>
            </>
          )}
        </div>
      </div>
      
      {/* Keyframe injection for equalizer */}
      <style jsx global>{`
        @keyframes eq {
          0% { height: 15%; }
          100% { height: 100%; }
        }
      `}</style>
    </button>
  )
}
