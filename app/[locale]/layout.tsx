import type { Metadata } from "next"
import { Cormorant_Garamond, JetBrains_Mono, Space_Mono } from "next/font/google"
import SpotlightWrapper from "../../components/theme/SpotlightWrapper"
import NoiseOverlay from "../../components/theme/NoiseOverlay"
import CustomCursor from "../../components/theme/CustomCursor"
import { CursorProvider } from "../../components/theme/CursorContext"
import { PersonaProvider } from "../../components/theme/PersonaContext"
import { SoundProvider } from "../../components/theme/SoundManager"
import AudioToggle from "../../components/ui/AudioToggle"
import Navigation from "../../components/ui/Navigation"
import Preloader from "../../components/ui/Preloader"
import "../globals.css"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { notFound } from "next/navigation"
import { routing } from "../../i18n/routing"
import { SmoothScroll } from "../../components/theme/SmoothScroll"

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-cormorant"
})

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains"
})

const space = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space"
})

export const metadata: Metadata = {
  title: "Aldo Arbizu | B2B Mobile & SaaS Architect — Senior React Native & Offline-First Expert",
  description: "Desarrollador Senior React Native y Product Engineer. Especialista en arquitecturas móviles Offline-First (SQLite WAL), automatizaciones de negocio con n8n, y cobros seguros (Stripe Elements / Web3 Base L2). Soluciones de software de grado comercial de Arbizu Labs.",
  keywords: [
    "Aldo Arbizu", "React Native Developer", "Product Engineer", "Offline-First", "SQLite WAL Expo",
    "Contratar React Native", "Hire React Native Developer", "SaaS Architect Argentina",
    "n8n automatización", "Freelance Mobile Developer", "Three.js Portfolio", "Next.js 16",
    "Arbizu Labs", "Desarrollador Senior Mobile", "Desarrollo Offline-First",
    "B2B Software Development", "Custom Mobile Apps", "SaaS Developer Argentina",
    "Hire Fullstack Engineer", "Contratar Desarrollador Mobile", "Product Engineer B2B",
    "Base L2 payment integration", "Stripe Developer", "Universal Commerce Protocol UCP"
  ],
  authors: [{ name: "Aldo Arbizu", url: "https://aldoarbizu.com" }],
  metadataBase: new URL("https://aldoarbizu.com"),
  icons: {
    icon: "/favicon-founder.svg",
    shortcut: "/favicon-founder.svg",
    apple: "/favicon-founder.svg",
  },
  alternates: {
    canonical: "/"
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Aldo Arbizu — Senior React Native & SaaS Product Engineer",
    description: "Especialista en aplicaciones móviles Offline-First (SQLite WAL), integraciones de pagos Web3/Stripe y flujos automatizados n8n.",
    url: "https://aldoarbizu.com",
    siteName: "Aldo Arbizu Portfolio",
    type: "website",
    locale: "es_AR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aldo Arbizu — B2B Mobile & SaaS Architect",
    description: "Software resiliente y de alto rendimiento. React Native, SQLite WAL, n8n y pasarelas de pago descentralizadas.",
  }
}

export default async function RootLayout({ children, params }: { children: React.ReactNode, params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) notFound();
  const messages = await getMessages();
  return (
    <html lang={locale} className={`${cormorant.variable} ${jetbrains.variable} ${space.variable} scroll-smooth`}>
      <body className="bg-[var(--color-space-black)] text-[var(--color-mist-gray)] font-mono antialiased selection:bg-[var(--color-orbital-teal)]/30 cursor-none relative">
        <NextIntlClientProvider messages={messages}>
          <SmoothScroll>
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
          </SmoothScroll>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
