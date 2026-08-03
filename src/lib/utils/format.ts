import type { Locale } from "@/lib/i18n/config";

/** Locale-aware currency formatting (no decimals for headline pricing). */
export function formatPrice(
  amount: number,
  currency: string,
  locale: Locale,
): string {
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
