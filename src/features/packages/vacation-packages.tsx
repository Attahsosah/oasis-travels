import { Section, SectionHeading } from "@/components/layout/section";
import { Reveal } from "@/components/motion";
import { PackageCard } from "@/features/packages/package-card";
import { getContentRepository } from "@/lib/data/repository";
import { pick } from "@/lib/data/types";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveText } from "@/lib/i18n/resolve";

/** Curated ready-made packages. */
export async function VacationPackages({ locale }: { locale: Locale }) {
  const repo = getContentRepository();
  const [items, dict] = await Promise.all([
    repo.getPackages(),
    getDictionary(locale),
  ]);

  const fromLabel = resolveText(dict, "sections.labels.from");
  const nightsLabel = resolveText(dict, "sections.labels.nights");
  const ctaLabel = resolveText(dict, "sections.packages.cta");

  return (
    <Section id="packages">
      <SectionHeading
        eyebrow={resolveText(dict, "sections.packages.eyebrow")}
        title={resolveText(dict, "sections.packages.title")}
        description={resolveText(dict, "sections.packages.description")}
      />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p, i) => (
          <Reveal key={p.id} delay={0.05 * i}>
            <PackageCard
              href={`/${locale}/packages/${p.slug}`}
              title={pick(p.title, locale)}
              tierLabel={resolveText(dict, `tiers.${p.tier}`)}
              nights={p.nights}
              nightsLabel={nightsLabel}
              priceFrom={p.priceFrom}
              currency={p.currency}
              fromLabel={fromLabel}
              ctaLabel={ctaLabel}
              image={p.image}
              inclusions={pick(p.inclusions, locale)}
              locale={locale}
            />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
