"use client";

import { DestinationCard } from "@/features/destinations/destination-card";
import { PackageCard } from "@/features/packages/package-card";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { pick, type Destination, type Package } from "@/lib/data/types";
import type { Locale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { useWishlist } from "@/stores/wishlist-store";

/** Renders the saved destinations + packages from the wishlist store. */
export function WishlistView({
  locale,
  destinations,
  packages,
}: {
  locale: Locale;
  destinations: Destination[];
  packages: Package[];
}) {
  const { t } = useI18n();
  const mounted = useHasMounted();
  const items = useWishlist((s) => s.items);

  if (!mounted) {
    return (
      <p className="mt-10 text-center text-muted-foreground">
        {t("common.loading")}…
      </p>
    );
  }

  const savedDest = destinations.filter((d) =>
    items.some((i) => i.kind === "destination" && i.slug === d.slug),
  );
  const savedPkg = packages.filter((p) =>
    items.some((i) => i.kind === "package" && i.slug === p.slug),
  );

  if (savedDest.length === 0 && savedPkg.length === 0) {
    return (
      <p className="mt-10 text-center text-muted-foreground">
        {t("wishlist.empty")}
      </p>
    );
  }

  const fromLabel = t("sections.labels.from");
  const nightsLabel = t("sections.labels.nights");
  const ctaLabel = t("sections.packages.cta");

  return (
    <div className="mt-10 space-y-8">
      {savedDest.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {savedDest.map((d) => (
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
      {savedPkg.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {savedPkg.map((p) => (
            <PackageCard
              key={p.id}
              href={`/${locale}/packages/${p.slug}`}
              title={pick(p.title, locale)}
              tierLabel={t(`tiers.${p.tier}`)}
              nights={p.nights}
              nightsLabel={nightsLabel}
              priceFrom={p.priceFrom}
              currency={p.currency}
              fromLabel={fromLabel}
              ctaLabel={ctaLabel}
              image={p.image}
              inclusions={pick(p.inclusions, locale)}
              locale={locale}
            />
          ))}
        </div>
      )}
    </div>
  );
}
