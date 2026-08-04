import type { CSSProperties } from "react";

/**
 * Single source of truth for everything that changes per client. For Oasis
 * Travel Agency (Bujumbura, Burundi): a full-service agency — flights, visas,
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
  defaultCurrency: string;
  contact: SiteContact;
  socials: SiteSocials;
  theme: SiteTheme;
  features: SiteFeatures;
  services: ServiceItem[];
}

export const siteConfig: SiteConfig = {
  name: "Oasis Travel Agency",
  tagline: "Votre partenaire voyage de confiance à Bujumbura.",
  logo: "/logo-circle.png",
  defaultCurrency: "USD",
  contact: {
    email: "",
    phone: "",
    address: "Bujumbura, Burundi",
    hours: "",
    whatsapp: "25761369539",
  },
  socials: {
    instagram: "https://www.instagram.com/oasis_travel.agency/",
  },
  theme: {
    primary: "#2477B3", // Oasis blue
    navy: "#123C5E", // deep blue — headings / dark bands
    turquoise: "#38B6E0", // cyan — the OTRAV lettering
    sunset: "#F2B138", // gold sun
    sand: "#F1E7CE", // soft warm neutral
    ocean: "#2477B3",
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
    "--color-ocean": theme.ocean,
    "--color-navy": theme.navy,
    "--color-turquoise": theme.turquoise,
    "--color-sunset": theme.sunset,
    "--color-sand": theme.sand,
  } as CSSProperties;
}
