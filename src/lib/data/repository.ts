import {
  categories,
  destinations,
  experiences,
  faqs,
  packages,
  partners,
  testimonials,
} from "@/lib/data/seed";
import type {
  Destination,
  Experience,
  Faq,
  Package,
  Partner,
  Testimonial,
  TravelCategory,
} from "@/lib/data/types";

/**
 * Typed content access. The app codes against this interface; the local
 * (seed-backed) adapter is used until a Supabase project is provisioned, at
 * which point a Supabase adapter implements the same interface and
 * `getContentRepository()` selects it based on env — no call-site changes.
 *
 * Methods are async to mirror the eventual network adapter.
 */
export interface ContentRepository {
  getDestinations(): Promise<Destination[]>;
  getFeaturedDestinations(): Promise<Destination[]>;
  getDestinationBySlug(slug: string): Promise<Destination | null>;
  getPackages(): Promise<Package[]>;
  getPackageBySlug(slug: string): Promise<Package | null>;
  getExperiences(): Promise<Experience[]>;
  getCategories(): Promise<TravelCategory[]>;
  getTestimonials(): Promise<Testimonial[]>;
  getPartners(): Promise<Partner[]>;
  getFaqs(): Promise<Faq[]>;
}

const localContentRepository: ContentRepository = {
  async getDestinations() {
    return destinations;
  },
  async getFeaturedDestinations() {
    return destinations.filter((d) => d.featured);
  },
  async getDestinationBySlug(slug) {
    return destinations.find((d) => d.slug === slug) ?? null;
  },
  async getPackages() {
    return packages;
  },
  async getPackageBySlug(slug) {
    return packages.find((p) => p.slug === slug) ?? null;
  },
  async getExperiences() {
    return experiences;
  },
  async getCategories() {
    return categories;
  },
  async getTestimonials() {
    return testimonials;
  },
  async getPartners() {
    return partners;
  },
  async getFaqs() {
    return faqs;
  },
};

/**
 * Returns the active content repository. When `NEXT_PUBLIC_SUPABASE_URL` is set
 * (Phase 7+), this will return the Supabase-backed adapter instead.
 */
export function getContentRepository(): ContentRepository {
  return localContentRepository;
}
