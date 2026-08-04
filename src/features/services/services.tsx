import {
  BedDouble,
  Compass,
  FileCheck,
  MoveRight,
  Plane,
  type LucideIcon,
} from "lucide-react";

import { Section, SectionHeading } from "@/components/layout/section";
import { Reveal, TiltCard } from "@/components/motion";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveText } from "@/lib/i18n/resolve";

const ICONS: Record<string, LucideIcon> = {
  plane: Plane,
  bed: BedDouble,
  compass: Compass,
  visa: FileCheck,
};

/**
 * Services grid — one card per `siteConfig.services` entry, text from the
 * `sections.services` dictionary. Cards tilt in 3D toward the cursor.
 */
export async function Services({ locale }: { locale: Locale }) {
  const dict = await getDictionary(locale);

  return (
    <Section id="services">
      <SectionHeading
        eyebrow={resolveText(dict, "sections.services.eyebrow")}
        title={resolveText(dict, "sections.services.title")}
        description={resolveText(dict, "sections.services.description")}
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {siteConfig.services.map((service, i) => {
          const Icon = ICONS[service.icon] ?? Compass;
          const title = resolveText(
            dict,
            `sections.services.items.${service.key}.title`,
          );
          const wa = siteConfig.contact.whatsapp;
          const href =
            service.key === "flights"
              ? `/${locale}#flight-request`
              : wa
                ? `https://wa.me/${wa}?text=${encodeURIComponent(
                    resolveText(dict, "sections.services.whatsappText") + title,
                  )}`
                : `/${locale}#contact`;
          const external = href.startsWith("http");
          return (
            <Reveal key={service.key} delay={0.05 * i}>
              <TiltCard className="h-full">
                <a
                  href={href}
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-elevated"
                >
                  <span className="inline-flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:-translate-y-0.5">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-display text-fluid-lg font-semibold text-navy">
                    {title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">
                    {resolveText(
                      dict,
                      `sections.services.items.${service.key}.description`,
                    )}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    {resolveText(dict, "sections.services.cta")}
                    <MoveRight
                      className="size-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </a>
              </TiltCard>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
