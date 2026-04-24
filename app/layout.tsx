import type { Metadata } from 'next'
import { Syncopate, Inter } from 'next/font/google'
import './globals.css'

const syncopate = Syncopate({ 
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-syncopate'
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'ALDO ARBIZU | VISUAL EXPERIENCE',
  description: 'Product Engineer & 3D Designer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${syncopate.variable} ${inter.variable} scroll-smooth`}>
      <body className="bg-[var(--color-neon-bg)] text-white font-body antialiased selection:bg-[var(--color-magenta)]/30">
        {children}
      </body>
    </html>
  )
}
