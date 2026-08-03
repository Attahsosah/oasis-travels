import "server-only";

import type { Locale } from "./config";

/**
 * A translation dictionary: arbitrarily nested namespaces of strings.
 * Resolved by dot-path at the leaves (e.g. `hero.title`).
 */
export type Dictionary = { [key: string]: string | Dictionary };

/**
 * Server-only dictionary loader. Dictionaries are code-split per locale and
 * loaded on the server, then handed to the client provider for hydration.
 * Never bundle every language into the client.
 */
const loaders: Record<Locale, () => Promise<Dictionary>> = {
  // JSON now includes an array value (detail.goodToKnow.items); cast through
  // unknown so the Dictionary type stays string-leaf while the array is read via
  // a local cast where it's used.
  en: () =>
    import("../../../messages/en.json").then(
      (m) => m.default as unknown as Dictionary,
    ),
  fr: () =>
    import("../../../messages/fr.json").then(
      (m) => m.default as unknown as Dictionary,
    ),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return loaders[locale]();
}
