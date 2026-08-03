import { MapPin } from "lucide-react";

import { ImageWithFallback } from "@/components/layout/image-with-fallback";
import { TiltCard } from "@/components/motion";
import { TransitionLink } from "@/features/transitions/transition-link";
import type { Locale } from "@/lib/i18n/config";
import { formatPrice } from "@/lib/utils/format";

export interface DestinationCardProps {
  href: string;
  name: string;
  country: string;
  summary: string;
  image: string;
  priceFrom: number;
  currency: string;
  fromLabel: string;
  locale: Locale;
  priority?: boolean;
}

/**
 * Presentational destination card (localized strings passed in, so it works in
 * both Server and Client parents). Photo with gradient scrim, name/country
 * overlay, summary, and headline price.
 */
export function DestinationCard({
  href,
  name,
  country,
  summary,
  image,
  priceFrom,
  currency,
  fromLabel,
  locale,
  priority,
}: DestinationCardProps) {
  return (
    <TiltCard className="h-full">
      <TransitionLink
        href={href}
        className="group block h-full overflow-hidden rounded-xl bg-card shadow-soft transition-shadow hover:shadow-elevated"
      >
      <div className="relative aspect-[4/3] overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={name}
          priority={priority}
          className="transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-navy/10 to-transparent" />
        <div className="absolute bottom-3 left-4 text-white">
          <p className="font-display text-fluid-lg font-semibold">{name}</p>
          <p className="flex items-center gap-1 text-sm text-white/85">
            <MapPin className="size-3.5" aria-hidden="true" />
            {country}
          </p>
        </div>
      </div>
      <div className="p-5">
        <p className="line-clamp-2 text-sm text-muted-foreground">{summary}</p>
        <p className="mt-3 text-sm font-semibold text-foreground">
          {fromLabel} {formatPrice(priceFrom, currency, locale)}
        </p>
      </div>
      </TransitionLink>
    </TiltCard>
  );
}
