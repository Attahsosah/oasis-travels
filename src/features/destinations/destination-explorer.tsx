"use client";

import { useMemo, useState } from "react";

import { Section, SectionHeading } from "@/components/layout/section";
import { DestinationCard } from "@/features/destinations/destination-card";
import { pick, type Destination } from "@/lib/data/types";
import type { Locale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils/cn";

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

/** Client-side tag filter over the full destination set (keeps the home page
 * static — URL-param filtering lives on the dedicated /destinations route). */
export function DestinationExplorer({
  locale,
  destinations,
}: {
  locale: Locale;
  destinations: Destination[];
}) {
  const { t } = useI18n();
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const tags = useMemo(
    () => Array.from(new Set(destinations.flatMap((d) => d.tags))),
    [destinations],
  );
  const filtered = activeTag
    ? destinations.filter((d) => d.tags.includes(activeTag))
    : destinations;
  const fromLabel = t("sections.labels.from");

  return (
    <Section id="explore" className="rounded-3xl bg-secondary/40">
      <SectionHeading
        eyebrow={t("sections.explorer.eyebrow")}
        title={t("sections.explorer.title")}
        description={t("sections.explorer.description")}
      />

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <FilterChip
          label={t("sections.explorer.all")}
          active={activeTag === null}
          onClick={() => setActiveTag(null)}
        />
        {tags.map((tag) => (
          <FilterChip
            key={tag}
            label={tag}
            active={activeTag === tag}
            onClick={() => setActiveTag(tag)}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-muted-foreground">
          {t("sections.explorer.empty")}
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => (
            <DestinationCard
              key={d.id}
              href={`/${locale}/destinations/${d.slug}`}
              name={d.name}
              country={d.country}
              summary={pick(d.summary, locale)}
              image={d.image}
              priceFrom={d.priceFrom}
              currency={d.currency}
              fromLabel={fromLabel}
              locale={locale}
            />
          ))}
        </div>
      )}
    </Section>
  );
}
