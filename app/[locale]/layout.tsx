import type { Metadata } from 'next'
import { Cormorant_Garamond, JetBrains_Mono, Space_Mono } from 'next/font/google'
import SpotlightWrapper from '../../components/theme/SpotlightWrapper'
import NoiseOverlay from '../../components/theme/NoiseOverlay'
import CustomCursor from '../../components/theme/CustomCursor'
import { CursorProvider } from '../../components/theme/CursorContext'
import { PersonaProvider } from '../../components/theme/PersonaContext'
import { SoundProvider } from '../../components/theme/SoundManager'
import AudioToggle from '../../components/ui/AudioToggle'
import Navigation from '../../components/ui/Navigation'
import Preloader from '../../components/ui/Preloader'
import '../globals.css'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '../../i18n/routing'
import { SmoothScroll } from '../../components/theme/SmoothScroll'

export async function generateMetadata({ paramz }) {
  return { title: 'Aldo Arbizu' }
}

export default async function RootLayout({ children, params }) {
  const { locale } = await params;
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body className='bg-[var(--color-space-black)] text-[var(--color-mist-gray)] autialiased cursor-none'>
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
