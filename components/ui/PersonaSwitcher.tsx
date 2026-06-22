'use client'
import { usePersona, PersonaType } from '../theme/PersonaContext'
import { useSound } from '../theme/SoundManager'
import { motion } from 'framer-motion'
import { Cpu, Shield, Compass, LucideIcon } from 'lucide-react'

export default function PersonaSwitcher() {
  const { persona, setPersona } = usePersona()
  const { playTick, playClick } = useSound()

  const profiles: { id: PersonaType; label: string; icon: LucideIcon; desc: string }[] = [
    { 
      id: 'engineer', 
      label: 'ENGINEER', 
      icon: Cpu,
      desc: 'React Native, Offline-first, Local DB sync'
    },
    { 
      id: 'security', 
      label: 'SECURITY', 
      icon: Shield,
      desc: 'B2B Security, OWASP Mobile, RLS audits'
    },
    { 
      id: 'agtech', 
      label: 'AGTECH', 
      icon: Compass,
      desc: 'AgTech, Logística remota, Hardware y Drones'
    }
  ]

  return (
    <div className="flex flex-col items-center gap-1.5 pointer-events-auto max-w-full">
      {/* Selector Capsule */}
      <div className="flex items-center gap-1 p-1 bg-[var(--color-deep-space)]/80 border border-[var(--color-space-border)] rounded-full backdrop-blur-xl shadow-2xl relative overflow-x-auto overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full sm:w-auto snap-x snap-mandatory">
        {profiles.map((profile) => {
          const Icon = profile.icon
          const isActive = persona === profile.id

          return (
            <button
              key={profile.id}
              aria-label={`Switch to ${profile.label} persona`}
              aria-current={isActive ? 'true' : 'false'}
              onClick={() => {
                playClick()
                setPersona(profile.id)
              }}
              onMouseEnter={playTick}
              className={`relative flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-space text-[9px] sm:text-[10px] font-bold tracking-widest transition-colors cursor-pointer select-none snap-center flex-shrink-0 ${
                isActive ? 'text-black' : 'text-[var(--color-mist-gray)]/60 hover:text-[var(--color-mist-gray)]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-persona-bg"
                  className="absolute inset-0 bg-[var(--color-orbital-teal)] rounded-full shadow-[0_0_15px_rgba(0,255,102,0.5)] z-0"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5 drop-shadow-md">
                <Icon size={12} className={isActive ? 'text-black' : 'text-current'} />
                <span className={isActive ? 'text-black font-extrabold' : ''}>{profile.label}</span>
              </span>
            </button>
          )
        })}
      </div>
      
    </div>
  )
}
