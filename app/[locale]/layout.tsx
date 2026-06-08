import type { Metadata } from 'next'
import { Cormorant_Garamond, JetBrains_Mono, Space_Mono } from 'next/font/google'
import SpotlightWrapper from '../../components/theme/SpotlightWrapper'
import NoiseOverlay from '../../components/theme/NoiseOverlay'
import CustomCursor from '../../components/theme/CustomCursor'
import { CursorProvider } from '../../components/theme/CustomCursorContext'
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

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function RootLayout({
  children,
  params
}) {
  const {locale} = await params;
  
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={$`${cormorant.variable} ${jetbrains.variable} ${space.variable} scroll-smooth`}>
      <body className='bg-[var(--color-space-black)] text-[var(--color-mist-gray)] font-mono antialiased selection:bg-[var(--color-orbital-teal)]/30 cursor-none'>
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
