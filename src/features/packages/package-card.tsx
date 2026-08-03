import { Check } from "lucide-react";

import { ImageWithFallback } from "@/components/layout/image-with-fallback";
import { TiltCard } from "@/components/motion";
import { TransitionLink } from "@/features/transitions/transition-link";
import type { Locale } from "@/lib/i18n/config";
import { formatPrice } from "@/lib/utils/format";

export interface PackageCardProps {
  href: string;
  title: string;
  tierLabel: string;
  nights: number;
  nightsLabel: string;
  priceFrom: number;
  currency: string;
  fromLabel: string;
  ctaLabel: string;
  image: string;
  inclusions: string[];
  locale: Locale;
}

/** Presentational package card (localized strings passed in). */
export function PackageCard({
  href,
  title,
  tierLabel,
  nights,
  nightsLabel,
  priceFrom,
  currency,
  fromLabel,
  ctaLabel,
  image,
  inclusions,
  locale,
}: PackageCardProps) {
  return (
    <TiltCard className="h-full">
      <div className="flex h-full flex-col overflow-hidden rounded-xl bg-card shadow-soft">
        <div className="relative aspect-[16/10]">
        <ImageWithFallback src={image} alt={title} />
        <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
          {tierLabel}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-fluid-lg font-semibold text-navy">
          {title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {nights} {nightsLabel}
        </p>
        <ul className="mt-4 space-y-2">
          {inclusions.slice(0, 3).map((inc, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-foreground"
            >
              <Check
                className="mt-0.5 size-4 shrink-0 text-turquoise"
                aria-hidden="true"
              />
              {inc}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-center justify-between pt-6">
          <p className="text-sm font-semibold text-foreground">
            {fromLabel} {formatPrice(priceFrom, currency, locale)}
          </p>
          <TransitionLink
            href={href}
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            {ctaLabel}
          </TransitionLink>
        </div>
      </div>
    </div>
    </TiltCard>
  );
}
