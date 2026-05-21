'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react'

type CursorState = 'default' | 'drag' | 'click' | 'text' | 'hidden'

interface CursorContextProps {
  cursorState: CursorState
  setCursorState: (state: CursorState) => void
}

const CursorContext = createContext<CursorContextProps | undefined>(undefined)

export function CursorProvider({ children }: { children: ReactNode }) {
  const [cursorState, setCursorState] = useState<CursorState>('default')

  return (
    <CursorContext.Provider value={{ cursorState, setCursorState }}>
      {children}
    </CursorContext.Provider>
  )
}

export function useCursor() {
  const context = useContext(CursorContext)
  if (context === undefined) {
    throw new Error('useCursor must be used within a CursorProvider')
  }
  return context
}
