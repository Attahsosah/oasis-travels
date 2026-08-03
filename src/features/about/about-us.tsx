import { Section, SectionHeading } from "@/components/layout/section";
import { Reveal } from "@/components/motion";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveText } from "@/lib/i18n/resolve";

const STATS = ["years", "destinations", "journeys"] as const;

/** Company introduction — placed near the top so the brand is immediately clear. */
export async function AboutUs({ locale }: { locale: Locale }) {
  const dict = await getDictionary(locale);

  return (
    <Section id="about">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <SectionHeading
          align="left"
          eyebrow={resolveText(dict, "sections.about.eyebrow")}
          title={resolveText(dict, "sections.about.title")}
          description={resolveText(dict, "sections.about.body")}
        />

        <div className="grid grid-cols-3 gap-4 sm:gap-6">
          {STATS.map((key, i) => (
            <Reveal key={key} delay={0.05 * i}>
              <div className="rounded-2xl border border-border bg-card p-5 text-center">
                <p className="font-display text-fluid-2xl font-semibold text-navy">
                  {resolveText(dict, `sections.about.stats.${key}.value`)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {resolveText(dict, `sections.about.stats.${key}.label`)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
