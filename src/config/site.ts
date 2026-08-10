import type { CSSProperties } from "react";

/**
 * Single source of truth for everything that changes per client. For Kazeline
 * Agency (Bujumbura, Burundi): a full-service agency — flights, visas,
 * hotels, tours — operating primarily in French.
 */

export interface SiteContact {
  email: string;
  phone: string;
  address: string;
  hours: string;
  /** Digits only, international format. Also set NEXT_PUBLIC_WHATSAPP_NUMBER. */
  whatsapp: string;
}

export interface SiteSocials {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  tripadvisor?: string;
}

export interface SiteTheme {
  primary: string;
  navy: string;
  turquoise: string;
  sunset: string;
  sand: string;
  ocean: string;
}

export interface SiteFeatures {
  wishlist: boolean;
  booking: boolean;
  designers: boolean;
}

export interface ServiceItem {
  key: string;
  icon: "plane" | "bed" | "compass" | "visa";
}

export interface SiteConfig {
  name: string;
  tagline: string;
  logo?: string;
  /** Set when the logo image already contains the brand name (wordmark), so the
   *  chrome shouldn't render the name text next to it. */
  logoIncludesName?: boolean;
  defaultCurrency: string;
  contact: SiteContact;
  socials: SiteSocials;
  theme: SiteTheme;
  features: SiteFeatures;
  services: ServiceItem[];
}

export const siteConfig: SiteConfig = {
  name: "Kazeline Agency",
  tagline: "Votre agence de voyage de confiance à Bujumbura.",
  logo: "/logo-kazeline.png",
  logoIncludesName: true,
  defaultCurrency: "USD",
  contact: {
    email: "",
    phone: "",
    address: "Bujumbura, Burundi",
    hours: "",
    whatsapp: "25761369539",
  },
  socials: {
    instagram: "https://www.instagram.com/kazeline_agency/",
  },
  theme: {
    primary: "#E85D00", // Kazeline orange — buttons, links, primary UI
    navy: "#1C1917", // warm near-black — headings / dark bands (was deep blue)
    turquoise: "#FF7A1A", // bright orange — eyebrows / accents on dark
    sunset: "#F59E1E", // amber — warm secondary accent
    sand: "#FAF0E6", // warm linen — soft neutral background
    ocean: "#F86000", // vivid logo orange — decorative fills / gradients
  },
  features: {
    wishlist: true,
    booking: true,
    designers: false,
  },
  services: [
    { key: "flights", icon: "plane" },
    { key: "visa", icon: "visa" },
    { key: "stays", icon: "bed" },
    { key: "tours", icon: "compass" },
  ],
};

/** CSS-variable overrides applied to <body> so `theme` re-colours the UI. */
export function themeStyle(theme: SiteTheme = siteConfig.theme): CSSProperties {
  return {
    "--primary": theme.primary,
    "--accent": theme.turquoise,
    "--ring": theme.turquoise,
    "--secondary": theme.sand,
    "--secondary-foreground": theme.navy,
    "--color-ocean": theme.ocean,
    "--color-navy": theme.navy,
    "--color-turquoise": theme.turquoise,
    "--color-sunset": theme.sunset,
    "--color-sand": theme.sand,
  } as CSSProperties;
}
