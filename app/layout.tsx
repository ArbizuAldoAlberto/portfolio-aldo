import type { Metadata } from 'next'
import { Cormorant_Garamond, JetBrains_Mono, Space_Mono } from 'next/font/google'
import SpotlightWrapper from '../components/theme/SpotlightWrapper'
import NoiseOverlay from '../components/theme/NoiseOverlay'
import CustomCursor from '../components/theme/CustomCursor'
import { CursorProvider } from '../components/theme/CursorContext'
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
  keywords: [
    'Aldo Arbizu', 'React Native Developer', 'Product Engineer', 'Offline-First', 'SQLite Expo',
    'n8n automatización', 'SaaS Multi-tenant', 'Desarrollador Argentina', 'Freelance Mobile Developer',
    'Three.js Portfolio', 'Next.js 16', 'Antigravity Studio'
  ],
  authors: [{ name: 'Aldo Arbizu', url: 'https://aldoarbizu.dev' }],
  metadataBase: new URL('https://aldoarbizu.dev'),
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
    description: 'Construyo software que funciona donde otros fallan. React Native · Firebase · n8n · SaaS Architecture.',
    url: 'https://aldoarbizu.dev',
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
  "url": "https://aldoarbizu.dev",
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
    "Expo",
    "Firebase",
    "SQLite",
    "Next.js",
    "Three.js",
    "n8n Automation",
    "SaaS Architecture",
    "Offline-First Systems"
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
        <CursorProvider>
          <NoiseOverlay />
          <CustomCursor />
          <SpotlightWrapper />
          {children}
        </CursorProvider>
      </body>
    </html>
  )
}
