import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, JetBrains_Mono, Space_Mono, Inter } from 'next/font/google'
import './globals.css'
import SmoothScroll from '../components/SmoothScroll'
import CustomCursor from '../components/CustomCursor'
import GrainOverlay from '../components/GrainOverlay'

const cormorant = Cormorant_Garamond({ 
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-cormorant'
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
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
  title: 'Antigravity Studio | by Aldo Arbizu',
  description: 'Ingeniería Mobile & Arquitecturas Offline-First para el Futuro del Agro. Desarrollo de ecosistemas resilientes y soluciones AgTech.',
  keywords: ['Antigravity Studio', 'Aldo Arbizu', 'AgTech', 'Offline-First', 'React Native', 'Agricultura de Precisión', 'Geo-Tracking', 'Sentinel Project'],
  authors: [{ name: 'Aldo Arbizu', url: 'https://github.com/ArbizuAldoAlberto' }],
  creator: 'Aldo Arbizu',
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://antigravity.studio',
    title: 'Antigravity Studio | AgTech Engineering',
    description: 'Conectamos el trabajo duro del lote con la administración en la nube.',
    siteName: 'Antigravity Studio'
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
    <html lang="es" className={`${cormorant.variable} ${jetbrains.variable} ${space.variable} ${inter.variable}`}>
      <body className="bg-[var(--color-space-black)] text-[var(--color-mist-gray)] font-inter antialiased selection:bg-[#1D9E75]/30">
        <GrainOverlay />
        <CustomCursor />
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  )
}
