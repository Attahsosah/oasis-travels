import { Award, HeartHandshake, KeyRound, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Section, SectionHeading } from "@/components/layout/section";
import { Reveal } from "@/components/motion";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveText } from "@/lib/i18n/resolve";

const VALUES: { key: string; icon: LucideIcon }[] = [
  { key: "tailored", icon: Sparkles },
  { key: "access", icon: KeyRound },
  { key: "care", icon: HeartHandshake },
  { key: "expertise", icon: Award },
];

/** Value proposition — why Kazeline Agency. */
export async function WhyChooseUs({ locale }: { locale: Locale }) {
  const dict = await getDictionary(locale);

  return (
    <Section id="why">
      <SectionHeading
        eyebrow={resolveText(dict, "sections.whyus.eyebrow")}
        title={resolveText(dict, "sections.whyus.title")}
        description={resolveText(dict, "sections.whyus.description")}
      />
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map(({ key, icon: Icon }, i) => (
          <Reveal key={key} delay={0.05 * i}>
            <div>
              <div className="inline-flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-6" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-display text-fluid-lg font-semibold text-navy">
                {resolveText(dict, `sections.whyus.items.${key}.title`)}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {resolveText(dict, `sections.whyus.items.${key}.body`)}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
