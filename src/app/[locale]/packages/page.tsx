import { notFound } from "next/navigation";

import { Section, SectionHeading } from "@/components/layout/section";
import {
  PackagesBrowser,
  type BrowseItem,
} from "@/features/packages/packages-browser";
import { getContentRepository } from "@/lib/data/repository";
import { pick } from "@/lib/data/types";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveText } from "@/lib/i18n/resolve";

export default async function PackagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const repo = getContentRepository();
  const [packages, dict] = await Promise.all([
    repo.getPackages(),
    getDictionary(locale),
  ]);
  const fromLabel = resolveText(dict, "sections.labels.from");
  const nightsLabel = resolveText(dict, "sections.labels.nights");
  const ctaLabel = resolveText(dict, "sections.packages.cta");

  const items: BrowseItem[] = packages.map((p) => ({
    id: p.id,
    tier: p.tier,
    nights: p.nights,
    card: {
      href: `/${locale}/packages/${p.slug}`,
      title: pick(p.title, locale),
      tierLabel: resolveText(dict, `tiers.${p.tier}`),
      nights: p.nights,
      nightsLabel,
      priceFrom: p.priceFrom,
      currency: p.currency,
      fromLabel,
      ctaLabel,
      image: p.image,
      inclusions: pick(p.inclusions, locale),
      locale,
    },
  }));

  return (
    <Section className="pt-32">
      <SectionHeading
        align="left"
        eyebrow={resolveText(dict, "detail.packagesEyebrow")}
        title={resolveText(dict, "detail.packagesTitle")}
        description={resolveText(dict, "detail.packagesDescription")}
      />
      <PackagesBrowser items={items} />
    </Section>
  );
}
