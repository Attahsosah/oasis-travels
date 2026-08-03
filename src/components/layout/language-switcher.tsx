"use client";

import { usePathname, useRouter } from "next/navigation";

import {
  LOCALE_COOKIE,
  localeNames,
  locales,
  type Locale,
} from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils/cn";

/**
 * Swaps the locale prefix of the current path, preserving the rest of the
 * route, persists the choice in a cookie, and navigates. Rendered as an
 * accessible segmented control.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(next: Locale) {
    if (next === locale) return;
    const segments = pathname.split("/");
    segments[1] = next; // segments[0] is the leading empty string
    const nextPath = segments.join("/") || `/${next}`;
    document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
    router.push(nextPath);
  }

  return (
    <div
      role="group"
      aria-label={t("languageSwitcher.label")}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-border bg-card/60 p-0.5",
        className,
      )}
    >
      {locales.map((l) => {
        const active = l === locale;
        return (
          <button
            key={l}
            type="button"
            onClick={() => switchTo(l)}
            aria-current={active ? "true" : undefined}
            title={localeNames[l]}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}
