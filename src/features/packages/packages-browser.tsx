"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { PackageCard } from "@/features/packages/package-card";
import type { Locale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils/cn";

type Tier = "comfort" | "premium" | "ultra";
type Length = "all" | "short" | "mid" | "long";

export interface BrowseItem {
  id: string;
  tier: Tier;
  nights: number;
  card: {
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
  };
}

const TIERS: (Tier | "all")[] = ["all", "comfort", "premium", "ultra"];
const LENGTHS: Length[] = ["all", "short", "mid", "long"];

function inLength(nights: number, band: Length) {
  if (band === "short") return nights <= 4;
  if (band === "mid") return nights === 5 || nights === 6;
  if (band === "long") return nights >= 7;
  return true;
}

/** Packages list with style + length filters and a spring reflow on change. */
export function PackagesBrowser({ items }: { items: BrowseItem[] }) {
  const { t } = useI18n();
  const [tier, setTier] = useState<Tier | "all">("all");
  const [length, setLength] = useState<Length>("all");

  const filtered = useMemo(
    () =>
      items.filter(
        (it) =>
          (tier === "all" || it.tier === tier) && inLength(it.nights, length),
      ),
    [items, tier, length],
  );

  const chip = (active: boolean) =>
    cn(
      "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
      active
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border bg-card text-muted-foreground hover:text-foreground",
    );

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("sections.browse.styleLabel")}
          </span>
          {TIERS.map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setTier(val)}
              aria-pressed={tier === val}
              className={chip(tier === val)}
            >
              {val === "all" ? t("sections.browse.all") : t(`tiers.${val}`)}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("sections.browse.nightsLabel")}
          </span>
          {LENGTHS.map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setLength(val)}
              aria-pressed={length === val}
              className={chip(length === val)}
            >
              {t(`sections.browse.${val}`)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-muted-foreground">
          {t("sections.browse.empty")}
        </p>
      ) : (
        <motion.div
          layout
          className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((it) => (
              <motion.div
                key={it.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ type: "spring", duration: 0.45, bounce: 0.2 }}
              >
                <PackageCard {...it.card} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
