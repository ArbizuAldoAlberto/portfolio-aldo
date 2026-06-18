'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { trackPersonaChange } from '../../lib/analytics'

export type PersonaType = 'engineer' | 'security' | 'agtech'

interface PersonaContextProps {
  persona: PersonaType
  setPersona: (p: PersonaType) => void
}

const PersonaContext = createContext<PersonaContextProps | undefined>(undefined)

export function PersonaProvider({ children }: { children: React.ReactNode }) {
  // Default to architect mode
  const [persona, setPersonaState] = useState<PersonaType>('engineer')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('nexus_persona') as PersonaType
    if (saved && ['engineer', 'security', 'agtech'].includes(saved)) {
      setPersonaState(saved)
      document.documentElement.setAttribute('data-persona', saved)
    } else {
      document.documentElement.setAttribute('data-persona', 'engineer')
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    // Find all links containing 'icon' in rel
    let links = document.querySelectorAll("link[rel*='icon']")
    
    if (links.length === 0) {
      const defaultLink = document.createElement('link')
      defaultLink.rel = 'icon'
      defaultLink.type = 'image/svg+xml'
      document.head.appendChild(defaultLink)
      links = document.querySelectorAll("link[rel*='icon']")
    }

    const iconPath = `/favicon-${persona}.svg`
    
    links.forEach(link => {
      const htmlLink = link as HTMLLinkElement
      htmlLink.href = iconPath
      htmlLink.type = 'image/svg+xml'
    })
    
    // Update document title dynamically based on active persona (GAP PORT-1)
    const titleMap = {
      engineer: '[ARCHITECT] Aldo Arbizu | Offline-First & React Native',
      security: '[SECURITY] Aldo Arbizu | B2B Operations Auditor',
      'agtech': '[FIELD-ENG] Aldo Arbizu | AgTech & Logistics Systems'
    }
    document.title = titleMap[persona] || 'Aldo Arbizu'
    
    console.log(`[NEXUS TELEMETRY] Persona updated dynamically: ${persona} (${iconPath})`)
  }, [persona, mounted])

  const setPersona = (newPersona: PersonaType) => {
    setPersonaState(newPersona)
    localStorage.setItem('nexus_persona', newPersona)
    document.documentElement.setAttribute('data-persona', newPersona)

    // Trigger custom event for audio tick feedback if SoundManager is active
    const event = new CustomEvent('persona-change', { detail: newPersona })
    window.dispatchEvent(event)

    trackPersonaChange(newPersona)
  }

  return (
    <PersonaContext.Provider value={{ persona: mounted ? persona : 'engineer', setPersona }}>
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
