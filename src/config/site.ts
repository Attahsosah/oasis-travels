import type { CSSProperties } from "react";

/**
 * Single source of truth for everything that changes per client when this
 * template is adapted for a new travel agency. Reskinning a site should mean
 * editing this file (plus content in the DB/seed and env), not hunting through
 * components. `theme` values are applied as CSS variables on <body> in the
 * locale layout, so changing a handful of hex values re-colours the UI.
 */

export interface SiteContact {
  email: string;
  phone: string;
  address: string;
  hours: string;
  /** Digits only, international format (e.g. "25765827295"). WhatsApp button
   *  actually reads NEXT_PUBLIC_WHATSAPP_NUMBER at build time; this mirrors it
   *  for a future contact block. */
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
  /** Primary brand colour — CTAs, links, focus. */
  primary: string;
  /** Deep brand colour — headings, dark bands. */
  navy: string;
  /** Cool accent. */
  turquoise: string;
  /** Warm accent. */
  sunset: string;
  /** Soft neutral (secondary surfaces). */
  sand: string;
  /** Deep brand blue used by brand utilities. */
  ocean: string;
}

export interface SiteFeatures {
  wishlist: boolean;
  booking: boolean;
  designers: boolean;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  defaultCurrency: string;
  contact: SiteContact;
  socials: SiteSocials;
  theme: SiteTheme;
  features: SiteFeatures;
}

export const siteConfig: SiteConfig = {
  name: "Azure Horizons",
  tagline: "Cinematic journeys, thoughtfully arranged.",
  defaultCurrency: "USD",
  contact: {
    email: "hello@azurehorizons.com",
    phone: "",
    address: "",
    hours: "",
    whatsapp: "",
  },
  socials: {},
  theme: {
    primary: "#0b6ea8",
    navy: "#0a1c33",
    turquoise: "#22b8ab",
    sunset: "#ff6b3d",
    sand: "#e9dcc9",
    ocean: "#0b6ea8",
  },
  features: {
    wishlist: true,
    booking: true,
    designers: true,
  },
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
