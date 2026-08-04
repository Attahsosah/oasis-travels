/**
 * Internationalization configuration — single source of truth.
 *
 * Sub-path routing (`/fr`, `/en`). Adding a language is a three-step change:
 * add the code here, add its display name + direction, and add a
 * `messages/{code}.json` dictionary. Everything else (routing, middleware,
 * static params, hreflang) derives from this file.
 */

export const locales = ["fr", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fr";

/** Human-readable names for the language switcher. */
export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
};

/** Text direction per locale — RTL-ready without further code changes. */
export const localeDirections: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  fr: "ltr",
};

/** Cookie key used to remember the visitor's chosen locale. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function getDirection(locale: Locale): "ltr" | "rtl" {
  return localeDirections[locale];
}
