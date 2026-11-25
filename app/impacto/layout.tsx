import type { Metadata } from "next";
import Script from "next/script";
import { GeistSans } from "geist/font/sans";
import { JetBrains_Mono } from "next/font/google";
import "../globals.css";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Impacto Social & Preservación 3D | Aldo Alberto Arbizu — Archivo Cívico",
  description:
    "Programas comunitarios documentados en Bolívar, Buenos Aires: preservación médica e infantil con impresión 3D solidaria (Hellbot Magna 2) y red gratuita PawHero con 0% comisión.",
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
      "Programas reales de asistencia inmediata, fabricación 3D solidaria y adopción animal sin intermediarios.",
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
      data-impacto-theme="light"
      className={`${GeistSans.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
              var t=localStorage.getItem("aldo_impacto_luminance");
              if(t!=="light"&&t!=="dark"){t="light";}
              document.documentElement.setAttribute("data-impacto-theme",t);
              document.documentElement.style.colorScheme=t;
              var l=localStorage.getItem("aldo_impacto_locale");
              if(l==="en"||l==="es"){document.documentElement.lang=l;}
            }catch(e){}})();`,
          }}
        />
      </head>
      <body
        data-impacto="true"
        className="font-sans antialiased overflow-x-clip"
        style={{ backgroundColor: "var(--impacto-bg)", color: "var(--impacto-ink)" }}
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
                "Asistencia Comunitaria Directa",
                "Fabricación 3D Solidaria Hellbot Magna 2",
                "Red PawHero (0% Comisión)"
              ]
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
