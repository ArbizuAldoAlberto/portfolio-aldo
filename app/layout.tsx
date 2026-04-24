import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, JetBrains_Mono, Space_Mono } from 'next/font/google'
import './globals.css'
import SmoothScroll from '../components/SmoothScroll'

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
  title: 'Aldo Arbizu | Product Engineer & 3D Designer',
  description: 'Portafolio Profesional de Aldo Arbizu. Especialista en Ingeniería Offline-First, Desarrollo Web3, Contratos Inteligentes y Diseño de Hardware/Piezas 3D.',
  keywords: ['Product Engineer', 'React Native', 'Offline-First', 'Web3', 'Smart Contracts', 'Impresión 3D', 'Drones', 'Automatización n8n'],
  authors: [{ name: 'Aldo Arbizu', url: 'https://github.com/ArbizuAldoAlberto' }],
  creator: 'Aldo Arbizu',
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://aldoarbizu.com',
    title: 'Aldo Arbizu | Engineering & Web3',
    description: 'Arquitecturas Offline-First, Web3 y Diseño 3D.',
    siteName: 'Aldo Arbizu Portfolio'
  }
}

export const viewport: Viewport = {
  themeColor: '#050505',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${cormorant.variable} ${jetbrains.variable} ${space.variable}`}>
      <body className="bg-[var(--color-space-black)] text-[var(--color-mist-gray)] font-mono antialiased selection:bg-[#1D9E75]/30">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  )
}
