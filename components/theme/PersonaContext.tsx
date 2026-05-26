'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'

export type PersonaType = 'dev' | 'founder' | 'gentleman'

interface PersonaContextProps {
  persona: PersonaType
  setPersona: (p: PersonaType) => void
}

const PersonaContext = createContext<PersonaContextProps | undefined>(undefined)

export function PersonaProvider({ children }: { children: React.ReactNode }) {
  // Default to founder mode
  const [persona, setPersonaState] = useState<PersonaType>('founder')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('nexus_persona') as PersonaType
    if (saved && ['dev', 'founder', 'gentleman'].includes(saved)) {
      setPersonaState(saved)
      document.documentElement.setAttribute('data-persona', saved)
    } else {
      document.documentElement.setAttribute('data-persona', 'founder')
    }
    setMounted(true)
  }, [])

  const setPersona = (newPersona: PersonaType) => {
    setPersonaState(newPersona)
    localStorage.setItem('nexus_persona', newPersona)
    document.documentElement.setAttribute('data-persona', newPersona)

    // Trigger custom event for audio tick feedback if SoundManager is active
    const event = new CustomEvent('persona-change', { detail: newPersona })
    window.dispatchEvent(event)
  }

  return (
    <PersonaContext.Provider value={{ persona: mounted ? persona : 'founder', setPersona }}>
      {children}
    </PersonaContext.Provider>
  )
}

export function usePersona() {
  const context = useContext(PersonaContext)
  if (!context) {
    throw new Error('usePersona must be used within a PersonaProvider')
  }
  return context
}
