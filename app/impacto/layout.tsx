import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "../globals.css";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  preload: true,
});

export const metadata: Metadata = {
  title: "Impacto Social & Preservación 3D | Aldo Alberto Arbizu — Archivo Cívico",
  description:
    "Filantropía de Transición, criptografía offline Ed25519, privacidad FLE:v2 (Ley 25.326), Preservación 3D solidaria con Hellbot Magna 2 y red PawHero (0% comisión).",
  metadataBase: new URL("https://aldoarbizu.com"),
  manifest: "/impacto-manifest.json",
  icons: {
    icon: [
      { url: "/impacto-icons/favicon.ico", sizes: "any" },
      { url: "/impacto-icons/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/impacto-icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  alternates: {
    canonical: "https://aldoarbizu.com/impacto",
  },
  openGraph: {
    title: "Impacto Social & Preservación 3D | Archivo Cívico — Aldo Arbizu",
    description:
      "Del apoyo inmediato (Fase 1 Ocre) a la reciprocidad comunitaria (Fase 2 Bosque) con trazabilidad verificable offline y preservación 3D solidaria.",
    url: "https://aldoarbizu.com/impacto",
    siteName: "Aldo Alberto Arbizu — Impacto Social",
    type: "website",
    locale: "es_AR",
    images: [
      {
        url: "https://aldoarbizu.com/impact/food_sovereignty.webp",
        width: 960,
        height: 644,
        alt: "Soberanía Alimentaria Comunitaria — Programa Filántropo Arbizu Labs",
      },
    ],
  },
};

export default function ImpactoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      data-impacto="true"
      className={`${GeistSans.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body
        data-impacto="true"
        className="bg-[#F6F3EC] text-[#1A1D1F] font-sans antialiased overflow-x-clip"
        suppressHydrationWarning
      >
        <Script
          id="schema-impacto-civic"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "@id": "https://aldoarbizu.com/impacto#webpage",
              "url": "https://aldoarbizu.com/impacto",
              "name": "Impacto Social & Preservación 3D — Archivo Cívico",
              "isPartOf": { "@id": "https://aldoarbizu.com/#person" },
              "about": [
                "Filantropía de Transición Offline-First",
                "Preservación 3D y Bioseguridad Pediátrica",
                "Red PawHero (Sin Fines de Lucro)"
              ]
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
