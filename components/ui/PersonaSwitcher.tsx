'use client'
import { usePersona, PersonaType } from '../theme/PersonaContext'
import { useSound } from '../theme/SoundManager'
import { motion } from 'framer-motion'
import { Cpu, Users, Eye, LucideIcon } from 'lucide-react'

export default function PersonaSwitcher() {
  const { persona, setPersona } = usePersona()
  const { playTick, playClick } = useSound()

  const profiles: { id: PersonaType; label: string; icon: LucideIcon; desc: string }[] = [
    { 
      id: 'founder', 
      label: 'FOUNDER', 
      icon: Users,
      desc: 'Enfoque comercial, SaaS y métricas de negocio'
    },
    { 
      id: 'dev', 
      label: 'ENGINEER', 
      icon: Cpu,
      desc: 'Enfoque técnico, bases de datos y arquitectura'
    },
    { 
      id: 'gentleman', 
      label: 'GENTLEMAN', 
      icon: Eye,
      desc: 'Diseño minimalista y narrativa elegante'
    }
  ]

  return (
    <div className="flex flex-col items-center gap-1.5 pointer-events-auto">
      {/* Selector Capsule */}
      <div className="flex items-center gap-1 p-1 bg-[var(--color-deep-space)]/80 border border-[var(--color-space-border)] rounded-full backdrop-blur-xl shadow-2xl relative">
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
              className={`relative flex items-center gap-2 px-4 py-2 rounded-full font-space text-[10px] font-bold tracking-widest transition-colors cursor-pointer select-none ${
                isActive ? 'text-white' : 'text-[var(--color-mist-gray)]/50 hover:text-[var(--color-mist-gray)]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-persona"
                  className="absolute inset-0 bg-[var(--color-orbital-teal)] rounded-full shadow-[0_0_15px_var(--color-space-border)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Icon size={12} className={isActive ? 'text-black' : ''} style={{ color: isActive ? '#000000' : '' }} />
                <span className={isActive ? 'text-black' : ''}>{profile.label}</span>
              </span>
            </button>
          )
        })}
      </div>
      
    </div>
  )
}
