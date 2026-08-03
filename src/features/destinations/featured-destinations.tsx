import { Section, SectionHeading } from "@/components/layout/section";
import { Reveal } from "@/components/motion";
import { DestinationCard } from "@/features/destinations/destination-card";
import { getContentRepository } from "@/lib/data/repository";
import { pick } from "@/lib/data/types";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveText } from "@/lib/i18n/resolve";

/** Curated highlights — the featured subset of destinations. */
export async function FeaturedDestinations({ locale }: { locale: Locale }) {
  const repo = getContentRepository();
  const [items, dict] = await Promise.all([
    repo.getFeaturedDestinations(),
    getDictionary(locale),
  ]);
  const fromLabel = resolveText(dict, "sections.labels.from");

  return (
    <Section id="destinations">
      <SectionHeading
        eyebrow={resolveText(dict, "sections.featured.eyebrow")}
        title={resolveText(dict, "sections.featured.title")}
        description={resolveText(dict, "sections.featured.description")}
      />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((d, i) => (
          <Reveal key={d.id} delay={0.05 * i}>
            <DestinationCard
              href={`/${locale}/destinations/${d.slug}`}
              name={d.name}
              country={d.country}
              summary={pick(d.summary, locale)}
              image={d.image}
              priceFrom={d.priceFrom}
              currency={d.currency}
              fromLabel={fromLabel}
              locale={locale}
            />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
