import { notFound } from "next/navigation";

import { Section, SectionHeading } from "@/components/layout/section";
import { Reveal } from "@/components/motion";
import { DestinationCard } from "@/features/destinations/destination-card";
import { getContentRepository } from "@/lib/data/repository";
import { pick } from "@/lib/data/types";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveText } from "@/lib/i18n/resolve";

export default async function DestinationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const repo = getContentRepository();
  const [destinations, dict] = await Promise.all([
    repo.getDestinations(),
    getDictionary(locale),
  ]);
  const fromLabel = resolveText(dict, "sections.labels.from");

  return (
    <Section className="pt-32">
      <SectionHeading
        align="left"
        eyebrow={resolveText(dict, "detail.destinationsEyebrow")}
        title={resolveText(dict, "detail.destinationsTitle")}
        description={resolveText(dict, "detail.destinationsDescription")}
      />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {destinations.map((d, i) => (
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
