import { Section, SectionHeading } from "@/components/layout/section";
import { ImageWithFallback } from "@/components/layout/image-with-fallback";
import { Reveal } from "@/components/motion";
import { getContentRepository } from "@/lib/data/repository";
import { pick } from "@/lib/data/types";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveText } from "@/lib/i18n/resolve";

/** Popular experiences — signature moments. */
export async function PopularExperiences({ locale }: { locale: Locale }) {
  const repo = getContentRepository();
  const [items, dict] = await Promise.all([
    repo.getExperiences(),
    getDictionary(locale),
  ]);

  return (
    <Section id="experiences">
      <SectionHeading
        eyebrow={resolveText(dict, "sections.experiences.eyebrow")}
        title={resolveText(dict, "sections.experiences.title")}
        description={resolveText(dict, "sections.experiences.description")}
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((e, i) => (
          <Reveal key={e.id} delay={0.05 * i}>
            <div className="group relative aspect-[4/5] overflow-hidden rounded-xl">
              <ImageWithFallback
                src={e.image}
                alt={pick(e.title, locale)}
                sizes="(max-width: 768px) 100vw, 33vw"
                className="transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/75 to-transparent" />
              <p className="absolute bottom-4 left-4 right-4 font-display text-fluid-lg font-semibold text-white">
                {pick(e.title, locale)}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
