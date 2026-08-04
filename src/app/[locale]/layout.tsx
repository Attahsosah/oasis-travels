import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import "../globals.css";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { siteConfig, themeStyle } from "@/config/site";
import { AuroraBackground } from "@/components/layout/aurora-background";
import { FloatingDesignerCta } from "@/components/layout/floating-designer-cta";
import { FlightPath } from "@/components/layout/flight-path";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { TransitionOverlay } from "@/features/transitions/transition-overlay";
import { TransitionProvider } from "@/features/transitions/transition-provider";
import {
  getDirection,
  isLocale,
  locales,
  type Locale,
} from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { I18nProvider } from "@/lib/i18n/provider";
import { getSiteSettings } from "@/lib/settings";
import { getSessionUser } from "@/lib/supabase/auth";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: siteConfig.theme.navy,
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dict = await getDictionary(locale);
  const meta = dict.meta as {
    title: string;
    titleTemplate: string;
    description: string;
  };

  const languages = Object.fromEntries(
    locales.map((l) => [l, `/${l}`]),
  );

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: meta.title,
      template: meta.titleTemplate,
    },
    description: meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: { ...languages, "x-default": `/${locale}` },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      locale,
      type: "website",
      url: `/${locale}`,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);
  const common = dict.common as { skipToContent: string };
  const user = await getSessionUser();
  const settings = await getSiteSettings();

  return (
    <html
      lang={locale}
      dir={getDirection(locale as Locale)}
      className={`${inter.variable} ${fraunces.variable}`}
    >
      <body
        className="min-h-dvh bg-background text-foreground antialiased"
        style={themeStyle()}
      >
        <AuroraBackground />
        <FlightPath />
        <I18nProvider locale={locale as Locale} dictionary={dict}>
          <TransitionProvider>
            <SmoothScroll />
            <a
              href="#main"
              className="sr-only rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
            >
              {common.skipToContent}
            </a>
            <Header authed={Boolean(user)} />
            <main id="main">{children}</main>
            <Footer />
            <FloatingDesignerCta
              locale={locale}
              whatsappNumber={settings.whatsapp}
            />
            <TransitionOverlay />
          </TransitionProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
