import { Section, SectionHeading } from "@/components/layout/section";
import { Marquee } from "@/components/motion";
import { getContentRepository } from "@/lib/data/repository";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveText } from "@/lib/i18n/resolve";

/**
 * Partner marks. Monochrome by default, colouring on hover. Representative
 * names (no real brand endorsement) rendered as type marks in lieu of logos.
 */
export async function OurPartners({ locale }: { locale: Locale }) {
  const repo = getContentRepository();
  const [items, dict] = await Promise.all([
    repo.getPartners(),
    getDictionary(locale),
  ]);

  return (
    <Section id="partners">
      <SectionHeading
        eyebrow={resolveText(dict, "sections.partners.eyebrow")}
        title={resolveText(dict, "sections.partners.title")}
        description={resolveText(dict, "sections.partners.description")}
      />
      <div className="mt-12">
        <Marquee>
          {items.map((p) => (
            <span
              key={p.id}
              className="whitespace-nowrap font-display text-xl font-semibold text-muted-foreground transition-colors hover:text-navy"
            >
              {p.name}
            </span>
          ))}
        </Marquee>
      </div>
    </Section>
  );
}
