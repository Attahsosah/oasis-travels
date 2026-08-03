import { notFound } from "next/navigation";

import { ImageWithFallback } from "@/components/layout/image-with-fallback";
import { Section, SectionHeading } from "@/components/layout/section";
import { Reveal, TiltCard } from "@/components/motion";
import { designers } from "@/lib/data/team";
import { pick } from "@/lib/data/types";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveText } from "@/lib/i18n/resolve";

export default async function DesignersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const languagesLabel = resolveText(dict, "sections.designers.languages");

  return (
    <Section className="pt-32">
      <SectionHeading
        align="left"
        eyebrow={resolveText(dict, "sections.designers.eyebrow")}
        title={resolveText(dict, "sections.designers.title")}
        description={resolveText(dict, "sections.designers.description")}
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {designers.map((d, i) => (
          <Reveal key={d.id} delay={0.05 * i}>
            <TiltCard className="h-full">
              <article className="group h-full overflow-hidden rounded-2xl border border-border bg-card">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <ImageWithFallback
                    src={d.image}
                    alt={d.name}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h2 className="font-display text-fluid-lg text-navy">
                    {d.name}
                  </h2>
                  <p className="text-sm font-medium text-turquoise">
                    {pick(d.role, locale)}
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {pick(d.bio, locale)}
                  </p>
                  <p className="mt-4 text-xs text-muted-foreground">
                    {languagesLabel}: {d.languages}
                  </p>
                </div>
              </article>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
