import type { MetadataRoute } from "next";

import { getContentRepository } from "@/lib/data/repository";
import { locales } from "@/lib/i18n/config";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const STATIC_PATHS = [
  "",
  "/destinations",
  "/packages",
  "/booking",
  "/sign-in",
  "/sign-up",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const repo = getContentRepository();
  const [destinations, packages] = await Promise.all([
    repo.getDestinations(),
    repo.getPackages(),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${siteUrl}/${locale}${path}`,
        changeFrequency: "weekly",
        priority: path === "" ? 1 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${siteUrl}/${l}${path}`]),
          ),
        },
      });
    }
    for (const d of destinations) {
      entries.push({
        url: `${siteUrl}/${locale}/destinations/${d.slug}`,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
    for (const p of packages) {
      entries.push({
        url: `${siteUrl}/${locale}/packages/${p.slug}`,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
