import { Section } from "@/components/layout/section";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveText } from "@/lib/i18n/resolve";

/** Shared legal/policy page. Content lives in the `legal` dictionary namespace. */
export async function LegalPage({
  locale,
  slug,
}: {
  locale: Locale;
  slug: "privacy" | "terms" | "cookies";
}) {
  const dict = await getDictionary(locale);

  return (
    <Section className="max-w-3xl pt-32">
      <h1 className="font-display text-fluid-2xl text-navy">
        {resolveText(dict, `legal.${slug}.title`)}
      </h1>
      <p className="mt-6 whitespace-pre-line text-muted-foreground">
        {resolveText(dict, `legal.${slug}.body`)}
      </p>
    </Section>
  );
}
