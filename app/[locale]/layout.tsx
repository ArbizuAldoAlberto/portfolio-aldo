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
    title: t("title"),
    description: t("description"),
    keywords: [
      "Aldo Arbizu",
      "React Native Developer",
      "Product Engineer",
      "Offline-First",
      "SQLite WAL Expo",
      "Arbizu Labs",
      "SaaS Architect Argentina",
      "AgTech Developer",
      "B2B Software Development",
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
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: "https://aldoarbizu.com",
      siteName: "Aldo Arbizu Portfolio",
      type: "website",
      locale: locale,
    },
    twitter: {
      card: "summary_large_image",
      title: t("twitterTitle"),
      description: t("twitterDescription"),
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
