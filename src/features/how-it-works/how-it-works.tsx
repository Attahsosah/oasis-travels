import { Section, SectionHeading } from "@/components/layout/section";
import { Reveal } from "@/components/motion";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveText } from "@/lib/i18n/resolve";

const STEPS = ["one", "two", "three", "four"] as const;

/** Four-step "how it works" strip with numbered nodes on a connecting line. */
export async function HowItWorks({ locale }: { locale: Locale }) {
  const dict = await getDictionary(locale);

  return (
    <Section id="how-it-works">
      <SectionHeading
        eyebrow={resolveText(dict, "sections.howItWorks.eyebrow")}
        title={resolveText(dict, "sections.howItWorks.title")}
      />

      <div className="relative mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-6 hidden h-px bg-border lg:block"
        />
        {STEPS.map((key, i) => (
          <Reveal key={key} delay={0.06 * i}>
            <div className="relative">
              <span className="relative z-10 inline-flex size-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground shadow-soft">
                {i + 1}
              </span>
              <h3 className="mt-4 font-display text-fluid-lg font-semibold text-navy">
                {resolveText(dict, `sections.howItWorks.steps.${key}.title`)}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {resolveText(dict, `sections.howItWorks.steps.${key}.body`)}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
