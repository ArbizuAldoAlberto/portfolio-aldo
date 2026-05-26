import type { Metadata } from 'next'
import { Cormorant_Garamond, JetBrains_Mono, Space_Mono } from 'next/font/google'
import SpotlightWrapper from '../components/theme/SpotlightWrapper'
import NoiseOverlay from '../components/theme/NoiseOverlay'
import CustomCursor from '../components/theme/CustomCursor'
import { CursorProvider } from '../components/theme/CursorContext'
import { PersonaProvider } from '../components/theme/PersonaContext'
import { SoundProvider } from '../components/theme/SoundManager'
import AudioToggle from '../components/ui/AudioToggle'
import Navigation from '../components/ui/Navigation'
import Preloader from '../components/ui/Preloader'
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
  title: 'Aldo Arbizu | Senior React Native Developer & Product Engineer — Hire Mobile Fullstack Expert',
  description: 'Product Engineer y Desarrollador Senior React Native especializado en arquitecturas móviles Offline-First (SQLite WAL) y automatizaciones inteligentes B2B. Resiliencia de software para la continuidad de su negocio. Antigravity Studio.',
  keywords: [
    'Aldo Arbizu', 'React Native Developer', 'Product Engineer', 'Offline-First', 'SQLite Expo',
    'Contratar React Native', 'Hire React Native Developer', 'SaaS Architect Argentina',
    'n8n automatización', 'Freelance Mobile Developer', 'Three.js Portfolio', 'Next.js 16',
    'Antigravity Studio', 'Desarrollador Senior Mobile', 'Desarrollo Offline-First',
    'B2B Software Development', 'Custom Mobile Apps', 'SaaS Developer Argentina',
    'Hire Fullstack Engineer', 'Contratar Desarrollador Mobile', 'Product Engineer B2B'
  ],
  authors: [{ name: 'Aldo Arbizu', url: 'https://aldoarbizu.com' }],
  metadataBase: new URL('https://aldoarbizu.com'),
  alternates: {
    canonical: '/'
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Aldo Arbizu — Product Engineer & Mobile Developer',
    description: 'Construyo software resiliente que funciona en el mundo real. React Native · Firebase · n8n · SaaS Architecture.',
    url: 'https://aldoarbizu.com',
    siteName: 'Aldo Arbizu Portfolio',
    type: 'website',
    locale: 'es_AR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aldo Arbizu — Product Engineer & Mobile Developer',
    description: 'React Native & SaaS Product Engineer. Software inmersivo, automatizaciones inteligentes y Offline-First.',
  }
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Aldo Alberto Arbizu",
  "url": "https://aldoarbizu.com",
  "jobTitle": "Product Engineer & Mobile Developer",
  "worksFor": {
    "@type": "Organization",
    "name": "Antigravity Studio"
  },
  "sameAs": [
    "https://github.com/ArbizuAldoAlberto",
    "https://linkedin.com/in/aldo-alberto-arbizu"
  ],
  "knowsAbout": [
    "React Native",
    "Expo Bare Workflow",
    "Firebase",
    "SQLite WAL",
    "Next.js",
    "Three.js",
    "n8n Automation",
    "SaaS Architecture",
    "Offline-First Systems",
    "Universal Commerce Protocol (UCP)",
    "Base L2 Payment Rails",
    "LangGraph Agentic Workflows"
  ],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "San Carlos de Bolívar",
    "addressRegion": "Buenos Aires",
    "addressCountry": "Argentina"
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${cormorant.variable} ${jetbrains.variable} ${space.variable} scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[var(--color-space-black)] text-[var(--color-mist-gray)] font-mono antialiased selection:bg-[var(--color-orbital-teal)]/30 cursor-none">
        <SoundProvider>
          <PersonaProvider>
            <CursorProvider>
              <Preloader />
              <Navigation />
              <NoiseOverlay />
              <CustomCursor />
              <SpotlightWrapper />
              <AudioToggle />
              {children}
            </CursorProvider>
          </PersonaProvider>
        </SoundProvider>
      </body>
    </html>
  )
}
