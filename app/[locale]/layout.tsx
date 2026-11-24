import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { JetBrains_Mono } from "next/font/google";
import { MotionPreferencesProvider } from "../../components/system/MotionPreferences";
import Navigation from "../../components/ui/Navigation";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "../../i18n/routing";
import Script from "next/script";

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
  await getTranslations({ locale, namespace: "Metadata" });

  return {
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "Aldo Arbizu | Arbizu Labs",
    },
    title: "Aldo Alberto Arbizu — Staff SRE & Quantitative Systems Architect | High-Availability Infrastructure",
    description:
      "Portafolio de ingeniería de Aldo Arbizu. Staff Site Reliability Engineer, desarrollador de sistemas de trading algorítmico en Binance Futures y arquitecto de infraestructuras distribuidas de alta disponibilidad (Zero-Downtime).",
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
      "Arbizu Labs",
    ],
    authors: [{ name: "Aldo Arbizu", url: "https://aldoarbizu.com" }],
    metadataBase: new URL("https://aldoarbizu.com"),
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon.svg", type: "image/svg+xml" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
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
      description:
        "Infraestructuras distribuidas resilientes, ejecución algorítmica en Binance Futures y ecosistemas SaaS en producción activa.",
      url: "https://aldoarbizu.com",
      siteName: "Aldo Arbizu — Staff SRE & Quantitative Portfolio",
      type: "website",
      locale: locale,
      images: [
        {
          url: "https://aldoarbizu.com/assets/brand-v2/aldo-editorial-architecture.webp",
          width: 1200,
          height: 675,
          alt: "Aldo Arbizu — Staff SRE & Quantitative Systems Architect",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Aldo Alberto Arbizu — Staff SRE & Quantitative Systems Architect",
      description: "Sistemas distribuidos de alta disponibilidad y ejecución algorítmica de baja latencia.",
      images: ["https://aldoarbizu.com/assets/brand-v2/aldo-editorial-architecture.webp"],
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
  if (!routing.locales.includes(locale as "en" | "es" | "zh")) notFound();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      data-theme="v1"
      data-scroll-behavior="smooth"
      className={`${GeistSans.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preload" as="image" href="/assets/brand-v2/aldo-editorial-architecture.webp" fetchPriority="high" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
              var p=window.location.pathname||"";
              var s=window.location.search||"";
              var isV2=/\\/v2(\\/|$)/.test(p)||s.indexOf("theme=v2")!==-1;
              document.documentElement.setAttribute("data-theme",isV2?"v2":"v1");
            }catch(e){}})();`,
          }}
        />
      </head>
      <body className="bg-[#060709] text-[#F2F0EA] antialiased selection:bg-[#D4AF37]/30 selection:text-white relative" suppressHydrationWarning>
        {process.env.NEXT_PUBLIC_GA_ID &&
          !process.env.NEXT_PUBLIC_GA_ID.includes("YYYY") &&
          !process.env.NEXT_PUBLIC_GA_ID.includes("XXXX") && (
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
            <Navigation />
            {children}
          </MotionPreferencesProvider>
        </NextIntlClientProvider>

        {/* Schema.org Cross-Hub Graph JSON-LD (aldoarbizu.com <-> arbizulabs.com) */}
        <Script
          id="schema-person"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": "https://aldoarbizu.com/#person",
                  name: "Aldo Alberto Arbizu",
                  jobTitle: "Staff Site Reliability Engineer & Quantitative Systems Architect",
                  url: "https://aldoarbizu.com",
                  email: "arbizualdoalberto@gmail.com",
                  sameAs: [
                    "https://github.com/ArbizuAldoAlberto",
                    "https://www.linkedin.com/in/aldo-alberto-arbizu/",
                    "https://arbizulabs.com",
                  ],
                  worksFor: { "@id": "https://arbizulabs.com/#organization" },
                  founderOf: { "@id": "https://arbizulabs.com/#organization" },
                  knowsAbout: [
                    "Site Reliability Engineering",
                    "Quantitative Trading",
                    "Binance Futures API",
                    "Kelly Criterion Risk Modeling",
                    "Distributed Systems",
                    "Layer-7 Failover",
                    "Offline-First SQLite WAL",
                    "TypeScript",
                    "Rust",
                    "Go",
                    "Base L2 Blockchain",
                  ],
                },
                {
                  "@type": "Organization",
                  "@id": "https://arbizulabs.com/#organization",
                  name: "Arbizu Labs",
                  url: "https://arbizulabs.com",
                  email: "aldo@arbizulabs.com",
                  founder: { "@id": "https://aldoarbizu.com/#person" },
                },
                {
                  "@type": "SoftwareApplication",
                  name: "TitanFlow Quant Engine",
                  applicationCategory: "FinanceApplication",
                  operatingSystem: "Linux, Web",
                  url: "https://titanflow.aldoarbizu.com",
                  author: { "@id": "https://aldoarbizu.com/#person" },
                  publisher: { "@id": "https://arbizulabs.com/#organization" },
                },
                {
                  "@type": "SoftwareApplication",
                  name: "SentinelOS Dispatch",
                  applicationCategory: "SecurityApplication",
                  operatingSystem: "Android, iOS, Web",
                  url: "https://sentinelos.aldoarbizu.com",
                  author: { "@id": "https://aldoarbizu.com/#person" },
                  publisher: { "@id": "https://arbizulabs.com/#organization" },
                },
                {
                  "@type": "SoftwareApplication",
                  name: "AgroMarket Pro",
                  applicationCategory: "BusinessApplication",
                  operatingSystem: "Android, iOS, Web",
                  url: "https://agromarket.aldoarbizu.com",
                  author: { "@id": "https://aldoarbizu.com/#person" },
                  publisher: { "@id": "https://arbizulabs.com/#organization" },
                },
                {
                  "@type": "SoftwareApplication",
                  name: "NOMAD Tactical Hub",
                  applicationCategory: "UtilitiesApplication",
                  operatingSystem: "Android, PWA, Linux",
                  url: "https://nomadhub.aldoarbizu.com",
                  author: { "@id": "https://aldoarbizu.com/#person" },
                  publisher: { "@id": "https://arbizulabs.com/#organization" },
                },
              ],
            }),
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
