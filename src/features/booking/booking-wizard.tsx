"use client";

import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check, Minus, PartyPopper, Plus } from "lucide-react";

import { Section } from "@/components/layout/section";
import { TransitionLink } from "@/features/transitions/transition-link";
import { createBooking } from "@/lib/actions/forms";
import { pick, type Destination, type Package } from "@/lib/data/types";
import type { Locale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/format";
import { budgetTiers } from "@/lib/validation/schemas";
import { useBookingDraft } from "@/stores/booking-store";

const STEP_KEYS = [
  "destination",
  "dates",
  "guests",
  "budget",
  "package",
  "review",
] as const;

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

const cardClass =
  "rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors";

export function BookingWizard({
  locale,
  destinations,
  packages,
}: {
  locale: Locale;
  destinations: Destination[];
  packages: Package[];
}) {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const draft = useBookingDraft();
  const [pending, startTransition] = useTransition();
  const [reference, setReference] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const applied = useRef(false);
  useEffect(() => {
    if (applied.current) return;
    applied.current = true;
    const p = searchParams.get("package");
    const d = searchParams.get("destination");
    if (p) {
      const pkg = packages.find((x) => x.slug === p);
      if (pkg)
        draft.set({
          packageSlug: pkg.slug,
          destinationSlug: pkg.destinationSlug,
        });
    } else if (d && destinations.some((x) => x.slug === d)) {
      draft.set({ destinationSlug: d });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const stepNum = clamp(
    Number(searchParams.get("step") ?? "1") || 1,
    1,
    STEP_KEYS.length,
  );
  const stepKey = STEP_KEYS[stepNum - 1]!;
  const destPackages = packages.filter(
    (p) => p.destinationSlug === draft.destinationSlug,
  );

  function isValid(n: number): boolean {
    switch (STEP_KEYS[n - 1]) {
      case "destination":
        return !!draft.destinationSlug;
      case "dates":
        return (
          !!draft.startDate &&
          !!draft.endDate &&
          draft.endDate > draft.startDate &&
          draft.startDate >= today
        );
      case "guests":
        return draft.guests >= 1 && draft.guests <= 12;
      case "budget":
        return !!draft.budgetTier;
      default:
        return true;
    }
  }

  function goTo(n: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("step", String(n));
    router.push(`${pathname}?${params.toString()}`);
  }

  function submit() {
    setError(false);
    startTransition(async () => {
      const res = await createBooking({
        destinationSlug: draft.destinationSlug,
        packageSlug: draft.packageSlug,
        startDate: draft.startDate,
        endDate: draft.endDate,
        guests: draft.guests,
        budgetTier: draft.budgetTier,
        customerName: draft.customerName,
        customerEmail: draft.customerEmail,
      });
      if (res.ok && res.reference) {
        setReference(res.reference);
        draft.reset();
      } else {
        setError(true);
      }
    });
  }

  if (reference) {
    return (
      <Section className="max-w-2xl pt-32 text-center">
        <PartyPopper
          className="mx-auto size-12 text-turquoise"
          aria-hidden="true"
        />
        <h1 className="mt-4 font-display text-fluid-2xl text-navy">
          {t("booking.successTitle")}
        </h1>
        <p className="mt-2 text-muted-foreground">{t("booking.successBody")}</p>
        <p className="mt-6 inline-block rounded-full bg-secondary px-5 py-2 font-mono text-sm font-semibold text-secondary-foreground">
          {t("booking.reference")}: {reference}
        </p>
        <div className="mt-8">
          <TransitionLink
            href={`/${locale}`}
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            {t("booking.done")}
          </TransitionLink>
        </div>
      </Section>
    );
  }

  const selectedDestination = destinations.find(
    (d) => d.slug === draft.destinationSlug,
  );
  const selectedPackage = packages.find((p) => p.slug === draft.packageSlug);

  return (
    <Section className="max-w-3xl pt-32">
      <h1 className="font-display text-fluid-2xl text-navy">
        {t("booking.title")}
      </h1>

      {/* Stepper */}
      <ol className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
        {STEP_KEYS.map((key, i) => {
          const n = i + 1;
          const active = n === stepNum;
          const complete = n < stepNum;
          return (
            <li key={key} className="flex items-center gap-2 text-sm">
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-full text-xs font-semibold",
                  active
                    ? "bg-primary text-primary-foreground"
                    : complete
                      ? "bg-turquoise text-navy"
                      : "bg-secondary text-muted-foreground",
                )}
              >
                {complete ? <Check className="size-3.5" /> : n}
              </span>
              <span
                className={cn(
                  active ? "font-semibold text-foreground" : "text-muted-foreground",
                )}
              >
                {t(`booking.steps.${key}`)}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="mt-10 min-h-[220px]">
        {stepKey === "destination" && (
          <div className="grid gap-3 sm:grid-cols-2">
            {destinations.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() =>
                  draft.set({
                    destinationSlug: d.slug,
                    packageSlug:
                      d.slug === draft.destinationSlug ? draft.packageSlug : null,
                  })
                }
                aria-pressed={draft.destinationSlug === d.slug}
                className={cn(
                  cardClass,
                  draft.destinationSlug === d.slug
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="block font-semibold text-foreground">
                  {d.name}
                </span>
                <span className="text-xs">{d.country}</span>
              </button>
            ))}
          </div>
        )}

        {stepKey === "dates" && (
          <div className="grid max-w-md gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium">
                {t("booking.startDate")}
              </span>
              <input
                type="date"
                min={today}
                value={draft.startDate ?? ""}
                onChange={(e) => draft.set({ startDate: e.target.value })}
                className="w-full rounded-xl border border-border bg-card px-4 py-3"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">
                {t("booking.endDate")}
              </span>
              <input
                type="date"
                min={draft.startDate ?? today}
                value={draft.endDate ?? ""}
                onChange={(e) => draft.set({ endDate: e.target.value })}
                className="w-full rounded-xl border border-border bg-card px-4 py-3"
              />
            </label>
          </div>
        )}

        {stepKey === "guests" && (
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="decrease"
              onClick={() => draft.set({ guests: clamp(draft.guests - 1, 1, 12) })}
              className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-card"
            >
              <Minus className="size-4" aria-hidden="true" />
            </button>
            <span className="w-12 text-center font-display text-fluid-xl text-navy">
              {draft.guests}
            </span>
            <button
              type="button"
              aria-label="increase"
              onClick={() => draft.set({ guests: clamp(draft.guests + 1, 1, 12) })}
              className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-card"
            >
              <Plus className="size-4" aria-hidden="true" />
            </button>
            <span className="ml-2 text-sm text-muted-foreground">
              {t("booking.guestsLabel")}
            </span>
          </div>
        )}

        {stepKey === "budget" && (
          <div className="grid gap-3 sm:grid-cols-3">
            {budgetTiers.map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => draft.set({ budgetTier: tier })}
                aria-pressed={draft.budgetTier === tier}
                className={cn(
                  cardClass,
                  "text-center",
                  draft.budgetTier === tier
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/50",
                )}
              >
                <span className="block font-display text-fluid-lg font-semibold text-navy">
                  {t(`tiers.${tier}`)}
                </span>
              </button>
            ))}
          </div>
        )}

        {stepKey === "package" && (
          <div className="grid gap-3">
            {destPackages.length === 0 ? (
              <p className="text-muted-foreground">{t("booking.noPackages")}</p>
            ) : (
              <>
                {destPackages.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => draft.set({ packageSlug: p.slug })}
                    aria-pressed={draft.packageSlug === p.slug}
                    className={cn(
                      cardClass,
                      "flex items-center justify-between",
                      draft.packageSlug === p.slug
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/50",
                    )}
                  >
                    <span className="font-semibold text-foreground">
                      {pick(p.title, locale)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {formatPrice(p.priceFrom, p.currency, locale)}
                    </span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => draft.set({ packageSlug: null })}
                  aria-pressed={draft.packageSlug === null}
                  className={cn(
                    cardClass,
                    draft.packageSlug === null
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/50",
                  )}
                >
                  {t("booking.noPreference")}
                </button>
              </>
            )}
          </div>
        )}

        {stepKey === "review" && (
          <div className="grid gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-sm font-medium">
                  {t("booking.name")}
                </span>
                <input
                  type="text"
                  value={draft.customerName}
                  onChange={(e) => draft.set({ customerName: e.target.value })}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium">
                  {t("booking.email")}
                </span>
                <input
                  type="email"
                  value={draft.customerEmail}
                  onChange={(e) => draft.set({ customerEmail: e.target.value })}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3"
                />
              </label>
            </div>

            <dl className="divide-y divide-border rounded-xl border border-border bg-card">
              <Row label={t("booking.steps.destination")}>
                {selectedDestination?.name ?? "—"}
              </Row>
              <Row label={t("booking.steps.dates")}>
                {draft.startDate} → {draft.endDate}
              </Row>
              <Row label={t("booking.steps.guests")}>{draft.guests}</Row>
              <Row label={t("booking.steps.budget")}>
                {draft.budgetTier ? t(`tiers.${draft.budgetTier}`) : "—"}
              </Row>
              <Row label={t("booking.steps.package")}>
                {selectedPackage
                  ? pick(selectedPackage.title, locale)
                  : t("booking.noPreference")}
              </Row>
            </dl>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-4 text-sm text-destructive">{t("booking.error")}</p>
      )}

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => goTo(stepNum - 1)}
          disabled={stepNum === 1}
          className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground disabled:opacity-40"
        >
          {t("booking.back")}
        </button>

        {stepKey === "review" ? (
          <button
            type="button"
            onClick={submit}
            disabled={
              pending ||
              draft.customerName.trim().length < 2 ||
              !/.+@.+\..+/.test(draft.customerEmail)
            }
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {pending ? t("booking.confirming") : t("booking.confirm")}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => goTo(stepNum + 1)}
            disabled={!isValid(stepNum)}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-40"
          >
            {t("booking.next")}
          </button>
        )}
      </div>
    </Section>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground">{children}</dd>
    </div>
  );
}
