import { notFound } from "next/navigation";

import { Section, SectionHeading } from "@/components/layout/section";
import { WishlistView } from "@/features/wishlist/wishlist-view";
import { getContentRepository } from "@/lib/data/repository";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveText } from "@/lib/i18n/resolve";

export default async function WishlistPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const repo = getContentRepository();
  const [destinations, packages, dict] = await Promise.all([
    repo.getDestinations(),
    repo.getPackages(),
    getDictionary(locale),
  ]);

  return (
    <Section className="pt-32">
      <SectionHeading
        align="left"
        eyebrow={resolveText(dict, "wishlist.eyebrow")}
        title={resolveText(dict, "wishlist.title")}
        description={resolveText(dict, "wishlist.description")}
      />
      <WishlistView
        locale={locale}
        destinations={destinations}
        packages={packages}
      />
    </Section>
  );
}
