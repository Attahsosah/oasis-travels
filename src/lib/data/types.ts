import type { Locale } from "@/lib/i18n/config";

/**
 * Content model for Azure Horizons.
 *
 * Prose fields that differ per language are `Localized<string>` (`{ en, fr }`);
 * proper nouns (place names, brand names) stay single strings. This mirrors the
 * planned Supabase `i18n jsonb` columns, so the local seed and a future Supabase
 * adapter share one shape.
 */
export type Localized<T = string> = Record<Locale, T>;

export function pick<T>(value: Localized<T>, locale: Locale): T {
  return value[locale];
}

export type BudgetTier = "comfort" | "premium" | "ultra";

export interface Destination {
  id: string;
  slug: string;
  name: string;
  country: string;
  region: string;
  summary: Localized<string>;
  image: string;
  tags: string[];
  priceFrom: number;
  currency: string;
  featured: boolean;
}

export interface Package {
  id: string;
  slug: string;
  destinationSlug: string;
  title: Localized<string>;
  tier: BudgetTier;
  nights: number;
  priceFrom: number;
  currency: string;
  inclusions: Localized<string[]>;
  image: string;
}

export interface Experience {
  id: string;
  title: Localized<string>;
  category: string;
  image: string;
}

export interface TravelCategory {
  id: string;
  slug: string;
  label: Localized<string>;
  description: Localized<string>;
  image: string;
}

export interface Testimonial {
  id: string;
  author: string;
  location: string;
  rating: number;
  quote: Localized<string>;
}

export interface Partner {
  id: string;
  name: string;
  category: string;
}

export interface Faq {
  id: string;
  question: Localized<string>;
  answer: Localized<string>;
}
