import { Section, SectionHeading } from "@/components/layout/section";
import { ImageWithFallback } from "@/components/layout/image-with-fallback";
import { Reveal } from "@/components/motion";
import { TransitionLink } from "@/features/transitions/transition-link";
import { getContentRepository } from "@/lib/data/repository";
import { pick } from "@/lib/data/types";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveText } from "@/lib/i18n/resolve";

/** Travel categories — journeys grouped by mood. */
export async function TravelCategories({ locale }: { locale: Locale }) {
  const repo = getContentRepository();
  const [items, dict] = await Promise.all([
    repo.getCategories(),
    getDictionary(locale),
  ]);

  return (
    <Section id="categories">
      <SectionHeading
        eyebrow={resolveText(dict, "sections.categories.eyebrow")}
        title={resolveText(dict, "sections.categories.title")}
        description={resolveText(dict, "sections.categories.description")}
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c, i) => (
          <Reveal key={c.id} delay={0.05 * i}>
            <TransitionLink
              href={`/${locale}/destinations?category=${c.slug}`}
              className="group relative block aspect-[3/4] overflow-hidden rounded-xl"
            >
              <ImageWithFallback
                src={c.image}
                alt={pick(c.label, locale)}
                sizes="(max-width: 768px) 100vw, 33vw"
                className="transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <p className="font-display text-fluid-lg font-semibold">
                  {pick(c.label, locale)}
                </p>
                <p className="mt-1 text-sm text-white/85">
                  {pick(c.description, locale)}
                </p>
              </div>
            </TransitionLink>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
