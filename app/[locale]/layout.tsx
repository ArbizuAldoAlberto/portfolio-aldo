import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { JetBrains_Mono } from "next/font/google";
import { MotionPreferencesProvider } from "../../components/system/MotionPreferences";
import PremiumBackground from "../../components/theme/PremiumBackground";
import BackgroundEffects from "../../components/theme/BackgroundEffects";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { PersonaProvider } from "../../components/theme/PersonaContext";
import { SoundProvider } from "../../components/theme/SoundManager";
import Navigation from "../../components/ui/Navigation";
import FastTrackBar from "../../components/ui/FastTrackBar";
import { BootSequence } from "../../components/system/BootSequence";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "../../i18n/routing";
import { SmoothScroll } from "../../components/theme/SmoothScroll";
import Script from "next/script";
import SpotlightWrapper from "../../components/theme/SpotlightWrapper";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  preload: true,
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "Aldo Arbizu | Arbizu Labs",
    },
    title: "Aldo Alberto Arbizu — Staff SRE & Quantitative Systems Architect | High-Availability Infrastructure",
    description: "Portafolio de ingeniería de Aldo Arbizu. Staff Site Reliability Engineer, desarrollador de sistemas de trading algorítmico en Binance Futures y arquitecto de infraestructuras distribuidas de alta disponibilidad (Zero-Downtime).",
    keywords: [
      "Aldo Arbizu",
      "Staff SRE",
      "Site Reliability Engineer",
      "Quantitative Systems Developer",
      "Binance Futures API",
      "Kelly Criterion Automation",
      "Low-Latency WebSockets",
      "Distributed Systems Architect",
      "Zero-Downtime Infrastructure",
      "Layer-7 Failover",
      "Hetzner Cloud",
      "Kubernetes",
      "TypeScript",
      "Rust",
      "Go",
      "Base L2 Blockchain",
      "Offline-First Mobile",
      "Arbizu Labs"
    ],
    authors: [{ name: "Aldo Arbizu", url: "https://aldoarbizu.com" }],
    metadataBase: new URL("https://aldoarbizu.com"),
    icons: {
      icon: "/favicon-founder.svg",
      shortcut: "/favicon-founder.svg",
      apple: "/favicon-founder.svg",
    },
    alternates: {
      canonical: "/",
      languages: {
        es: "/es",
        en: "/en",
      },
    },
    openGraph: {
      title: "Aldo Alberto Arbizu — Staff SRE & Quantitative Systems Architect",
      description: "Infraestructuras distribuidas resilientes, ejecución algorítmica en Binance Futures y ecosistemas SaaS en producción activa.",
      url: "https://aldoarbizu.com",
      siteName: "Aldo Arbizu — Staff SRE & Quantitative Portfolio",
      type: "website",
      locale: locale,
      images: [
        {
          url: "/api/og?persona=founder",
          width: 1200,
          height: 630,
          alt: "Aldo Arbizu — Staff SRE & Quantitative Systems Architect",
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Aldo Alberto Arbizu — Staff SRE & Quantitative Systems Architect",
      description: "Sistemas distribuidos de alta disponibilidad y ejecución algorítmica de baja latencia.",
      images: ["/api/og?persona=founder"],
    },
  };
}

export default async function LocalizedLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) notFound();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${GeistSans.variable} ${jetbrains.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body
        className="bg-orbital-bg text-slate-200 font-sans antialiased selection:bg-orbital-emerald/30 selection:text-white relative"
        suppressHydrationWarning
      >
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}

        <NextIntlClientProvider messages={messages}>
          <MotionPreferencesProvider>
            <SmoothScroll>
              <SoundProvider>
                <PersonaProvider>
                  <BootSequence />
                  <FastTrackBar />
                  <Navigation />
                  <PremiumBackground />
                  <BackgroundEffects />
                  <SpotlightWrapper />
                  {children}
                  <Analytics />
                  <SpeedInsights />
                </PersonaProvider>
              </SoundProvider>
            </SmoothScroll>
          </MotionPreferencesProvider>
        </NextIntlClientProvider>

        {/* Schema.org Person JSON-LD for Google Rich Results */}
        <Script
          id="schema-person"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Aldo Alberto Arbizu",
              "jobTitle": "Staff Site Reliability Engineer & Quantitative Systems Architect",
              "url": "https://aldoarbizu.com",
              "sameAs": [
                "https://github.com/ArbizuAldoAlberto",
                "https://linkedin.com/in/aldoarbizu"
              ],
              "knowsAbout": [
                "Site Reliability Engineering",
                "Quantitative Trading",
                "Binance Futures API",
                "Kelly Criterion Risk Modeling",
                "Distributed Systems",
                "Layer-7 Failover",
                "Kubernetes",
                "TypeScript",
                "Rust",
                "Go",
                "Base L2 Blockchain"
              ]
            })
          }}
        />

        <Script id="service-worker-registration" strategy="lazyOnload">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').catch((err) => {
                  console.log('SW registration failed: ', err);
                });
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
