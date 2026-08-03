import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";

import { ImageWithFallback } from "@/components/layout/image-with-fallback";
import { Section, SectionHeading } from "@/components/layout/section";
import { Reveal } from "@/components/motion";
import { PackageCard } from "@/features/packages/package-card";
import { TransitionLink } from "@/features/transitions/transition-link";
import { WishlistButton } from "@/features/wishlist/wishlist-button";
import { getContentRepository } from "@/lib/data/repository";
import { pick } from "@/lib/data/types";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveText } from "@/lib/i18n/resolve";
import {
  JsonLd,
  breadcrumbLd,
  touristDestinationLd,
} from "@/lib/seo/json-ld";
import { formatPrice } from "@/lib/utils/format";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateStaticParams() {
  const destinations = await getContentRepository().getDestinations();
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const d = await getContentRepository().getDestinationBySlug(slug);
  if (!d) return {};
  return { title: d.name, description: pick(d.summary, locale) };
}

export default async function DestinationDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const repo = getContentRepository();
  const [destination, allPackages, dict] = await Promise.all([
    repo.getDestinationBySlug(slug),
    repo.getPackages(),
    getDictionary(locale),
  ]);
  if (!destination) notFound();

  const related = allPackages.filter((p) => p.destinationSlug === slug);
  const fromLabel = resolveText(dict, "sections.labels.from");
  const nightsLabel = resolveText(dict, "sections.labels.nights");
  const ctaLabel = resolveText(dict, "sections.packages.cta");
  const url = `${siteUrl}/${locale}/destinations/${destination.slug}`;

  return (
    <>
      <JsonLd
        data={touristDestinationLd({
          name: destination.name,
          description: pick(destination.summary, locale),
          image: destination.image,
          url,
        })}
      />
      <JsonLd
        data={breadcrumbLd([
          {
            name: resolveText(dict, "detail.backToDestinations"),
            url: `${siteUrl}/${locale}/destinations`,
          },
          { name: destination.name, url },
        ])}
      />
      <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        <ImageWithFallback
          src={destination.image}
          alt={destination.name}
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/30 to-navy/10" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-6 pb-10 text-white">
          <TransitionLink
            href={`/${locale}/destinations`}
            className="text-sm text-white/80 transition-colors hover:text-white"
          >
            ← {resolveText(dict, "detail.backToDestinations")}
          </TransitionLink>
          <h1 className="mt-3 font-display text-fluid-3xl font-semibold text-balance">
            {destination.name}
          </h1>
          <p className="mt-2 flex items-center gap-1.5 text-white/85">
            <MapPin className="size-4" aria-hidden="true" />
            {destination.country} · {destination.region}
          </p>
        </div>
      </section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="font-display text-fluid-xl text-navy">
              {resolveText(dict, "detail.overview")}
            </h2>
            <p className="mt-3 text-fluid-base text-muted-foreground">
              {pick(destination.summary, locale)}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {destination.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-secondary px-3 py-1 text-sm capitalize text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-soft">
            <p className="text-sm text-muted-foreground">{fromLabel}</p>
            <p className="font-display text-fluid-2xl font-semibold text-navy">
              {formatPrice(destination.priceFrom, destination.currency, locale)}
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <TransitionLink
                href={`/${locale}/booking?destination=${destination.slug}`}
                className="rounded-full bg-primary px-6 py-3 text-center text-sm font-semibold text-primary-foreground"
              >
                {resolveText(dict, "detail.startBooking")}
              </TransitionLink>
              <WishlistButton
                kind="destination"
                slug={destination.slug}
                className="justify-center"
              />
            </div>
          </aside>
        </div>
      </Section>

      {related.length > 0 && (
        <Section className="pt-0">
          <SectionHeading
            align="left"
            title={resolveText(dict, "detail.relatedPackages")}
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={0.05 * i}>
                <PackageCard
                  href={`/${locale}/packages/${p.slug}`}
                  title={pick(p.title, locale)}
                  tierLabel={resolveText(dict, `tiers.${p.tier}`)}
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
              </Reveal>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
