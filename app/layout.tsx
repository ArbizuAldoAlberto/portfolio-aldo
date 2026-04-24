import type { Metadata } from 'next'
import { Cormorant_Garamond, JetBrains_Mono, Space_Mono } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({ 
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-cormorant'
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains'
})

const space = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space'
})

export const metadata: Metadata = {
  title: 'Aldo Arbizu | React Native Developer & Product Engineer — Argentina',
  description: 'Freelance developer especializado en apps mobile Offline-First, automatización n8n y SaaS multi-tenant. Disponible para proyectos remotos en Latam y global. Antigravity Studio.',
  openGraph: {
    title: 'Aldo Arbizu — Product Engineer & Mobile Developer',
    description: 'Construyo software que funciona donde otros fallan. React Native · Firebase · n8n · SaaS Architecture.',
    type: 'website'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${cormorant.variable} ${jetbrains.variable} ${space.variable} scroll-smooth`}>
      <body className="bg-[var(--color-space-black)] text-[var(--color-mist-gray)] font-mono antialiased selection:bg-[var(--color-orbital-teal)]/30">
        {children}
      </body>
    </html>
  )
}
