"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import type { ReactNode } from "react";

import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries";

type TranslateFn = (path: string, fallback?: string) => string;

interface I18nContextValue {
  locale: Locale;
  dictionary: Dictionary;
  t: TranslateFn;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function resolve(dictionary: Dictionary, path: string): string | undefined {
  const value = path
    .split(".")
    .reduce<string | Dictionary | undefined>((acc, key) => {
      if (acc && typeof acc === "object") return acc[key];
      return undefined;
    }, dictionary);
  return typeof value === "string" ? value : undefined;
}

interface I18nProviderProps {
  locale: Locale;
  dictionary: Dictionary;
  children: ReactNode;
}

/**
 * Provides the active locale and its dictionary to Client Components.
 * Server Components read the dictionary directly via `getDictionary`; this
 * bridges the same data to interactive components (nav, switcher, forms).
 */
export function I18nProvider({
  locale,
  dictionary,
  children,
}: I18nProviderProps) {
  const t = useCallback<TranslateFn>(
    (path, fallback) => resolve(dictionary, path) ?? fallback ?? path,
    [dictionary],
  );

  const value = useMemo<I18nContextValue>(
    () => ({ locale, dictionary, t }),
    [locale, dictionary, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return ctx;
}
