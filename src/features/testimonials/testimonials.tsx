import { Star } from "lucide-react";

import { Section, SectionHeading } from "@/components/layout/section";
import { Reveal } from "@/components/motion";
import { getContentRepository } from "@/lib/data/repository";
import { pick } from "@/lib/data/types";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveText } from "@/lib/i18n/resolve";

/** Traveller testimonials. */
export async function Testimonials({ locale }: { locale: Locale }) {
  const repo = getContentRepository();
  const [items, dict] = await Promise.all([
    repo.getTestimonials(),
    getDictionary(locale),
  ]);

  return (
    <div className="bg-navy">
      <Section id="testimonials">
        <SectionHeading
          tone="onDark"
          eyebrow={resolveText(dict, "sections.testimonials.eyebrow")}
          title={resolveText(dict, "sections.testimonials.title")}
          description={resolveText(dict, "sections.testimonials.description")}
        />
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {items.map((item, i) => (
          <Reveal key={item.id} delay={0.05 * i}>
            <figure className="h-full rounded-xl bg-card p-6 shadow-soft">
              <div className="flex gap-0.5" aria-hidden="true">
                {Array.from({ length: item.rating }).map((_, idx) => (
                  <Star key={idx} className="size-4 fill-sunset text-sunset" />
                ))}
              </div>
              <blockquote className="mt-4 text-fluid-base text-foreground">
                &ldquo;{pick(item.quote, locale)}&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-semibold text-foreground">
                  {item.author}
                </span>
                <span className="text-muted-foreground"> · {item.location}</span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
    </div>
  );
}
