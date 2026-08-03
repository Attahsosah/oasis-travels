import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, MapPin } from "lucide-react";

import { ImageWithFallback } from "@/components/layout/image-with-fallback";
import { Section } from "@/components/layout/section";
import {
  ItineraryTimeline,
  type ItineraryDay,
} from "@/features/packages/itinerary-timeline";
import { TransitionLink } from "@/features/transitions/transition-link";
import { WishlistButton } from "@/features/wishlist/wishlist-button";
import { getContentRepository } from "@/lib/data/repository";
import { pick } from "@/lib/data/types";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveText } from "@/lib/i18n/resolve";
import { formatPrice } from "@/lib/utils/format";

type ItineraryCopy = {
  eyebrow: string;
  title: string;
  dayLabel: string;
  arrivalTitle: string;
  arrivalBody: string;
  departureTitle: string;
  departureBody: string;
  highlightBody: string;
  freeTitle: string;
  freeBody: string;
};

export async function generateStaticParams() {
  const packages = await getContentRepository().getPackages();
  return packages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const p = await getContentRepository().getPackageBySlug(slug);
  if (!p) return {};
  return { title: pick(p.title, locale) };
}

export default async function PackageDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const repo = getContentRepository();
  const [pkg, dict] = await Promise.all([
    repo.getPackageBySlug(slug),
    getDictionary(locale),
  ]);
  if (!pkg) notFound();

  const destination = await repo.getDestinationBySlug(pkg.destinationSlug);
  const fromLabel = resolveText(dict, "sections.labels.from");
  const nightsLabel = resolveText(dict, "sections.labels.nights");

  const detail = dict.detail as unknown as {
    itinerary: ItineraryCopy;
    goodToKnow: { title: string; items: string[] };
    glance: {
      title: string;
      nights: string;
      style: string;
      from: string;
      destination: string;
    };
  };
  const { itinerary, goodToKnow, glance } = detail;

  // Generate a day-by-day plan from nights + inclusions.
  const inclusions = pick(pkg.inclusions, locale);
  const totalDays = pkg.nights + 1;
  const itineraryDays: ItineraryDay[] = [];
  for (let d = 1; d <= totalDays; d++) {
    if (d === 1) {
      itineraryDays.push({
        day: d,
        title: `${itinerary.arrivalTitle} · ${destination?.name ?? pick(pkg.title, locale)}`,
        body: itinerary.arrivalBody,
      });
    } else if (d === totalDays) {
      itineraryDays.push({
        day: d,
        title: itinerary.departureTitle,
        body: itinerary.departureBody,
      });
    } else {
      const highlight = inclusions[d - 2];
      itineraryDays.push(
        highlight
          ? { day: d, title: highlight, body: itinerary.highlightBody }
          : { day: d, title: itinerary.freeTitle, body: itinerary.freeBody },
      );
    }
  }

  const facts = [
    { label: glance.nights, value: String(pkg.nights) },
    { label: glance.style, value: resolveText(dict, `tiers.${pkg.tier}`) },
    { label: glance.destination, value: destination?.name ?? "—" },
    {
      label: glance.from,
      value: formatPrice(pkg.priceFrom, pkg.currency, locale),
    },
  ];

  return (
    <>
      <section className="relative h-[55vh] min-h-[380px] w-full overflow-hidden">
        <ImageWithFallback
          src={pkg.image}
          alt={pick(pkg.title, locale)}
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/30 to-navy/10" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-6 pb-10 text-white">
          <TransitionLink
            href={`/${locale}/packages`}
            className="text-sm text-white/80 transition-colors hover:text-white"
          >
            ← {resolveText(dict, "detail.backToPackages")}
          </TransitionLink>
          <span className="mt-3 inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
            {resolveText(dict, `tiers.${pkg.tier}`)}
          </span>
          <h1 className="mt-3 font-display text-fluid-3xl font-semibold text-balance">
            {pick(pkg.title, locale)}
          </h1>
          <p className="mt-2 text-white/85">
            {pkg.nights} {nightsLabel}
          </p>
        </div>
      </section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="space-y-14 lg:col-span-2">
            {/* At a glance */}
            <div>
              <h2 className="sr-only">{glance.title}</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {facts.map((f) => (
                  <div
                    key={f.label}
                    className="rounded-xl border border-border bg-card p-4"
                  >
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {f.label}
                    </p>
                    <p className="mt-1 font-display text-fluid-lg font-semibold text-navy">
                      {f.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Day-by-day itinerary */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-turquoise">
                {itinerary.eyebrow}
              </p>
              <h2 className="mt-1 font-display text-fluid-2xl text-navy">
                {itinerary.title}
              </h2>
              <ItineraryTimeline
                items={itineraryDays}
                dayLabel={itinerary.dayLabel}
              />
            </div>

            {/* What's included */}
            <div>
              <h2 className="font-display text-fluid-xl text-navy">
                {resolveText(dict, "detail.included")}
              </h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {inclusions.map((inc, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <Check
                      className="mt-0.5 size-5 shrink-0 text-turquoise"
                      aria-hidden="true"
                    />
                    {inc}
                  </li>
                ))}
              </ul>
            </div>

            {/* Good to know */}
            <div>
              <h2 className="font-display text-fluid-xl text-navy">
                {goodToKnow.title}
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {goodToKnow.items.map((g, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-muted-foreground/50"
                    />
                    {g}
                  </li>
                ))}
              </ul>
            </div>

            {destination && (
              <TransitionLink
                href={`/${locale}/destinations/${destination.slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                <MapPin className="size-4" aria-hidden="true" />
                {resolveText(dict, "detail.viewDestination")} · {destination.name}
              </TransitionLink>
            )}
          </div>

          <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-soft lg:sticky lg:top-28">
            <p className="text-sm text-muted-foreground">{fromLabel}</p>
            <p className="font-display text-fluid-2xl font-semibold text-navy">
              {formatPrice(pkg.priceFrom, pkg.currency, locale)}
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <TransitionLink
                href={`/${locale}/booking?package=${pkg.slug}`}
                className="rounded-full bg-primary px-6 py-3 text-center text-sm font-semibold text-primary-foreground"
              >
                {resolveText(dict, "detail.startBooking")}
              </TransitionLink>
              <WishlistButton
                kind="package"
                slug={pkg.slug}
                className="justify-center"
              />
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
