"use client";

import { useEffect } from "react";

import "./globals.css";
import en from "../../messages/en.json";
import fr from "../../messages/fr.json";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

const dicts = { en, fr } as const;

/**
 * Global error boundary — catches failures in the root layout itself, so it
 * provides its own <html>/<body>. Self-contained and locale-best-effort
 * (reads the leading path segment where available).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const segment =
    typeof window !== "undefined"
      ? (window.location.pathname.split("/")[1] ?? "")
      : "";
  const locale = isLocale(segment) ? segment : defaultLocale;
  const d = dicts[locale].error;

  return (
    <html lang={locale}>
      <body className="bg-background text-foreground antialiased">
        <div className="flex min-h-dvh flex-col items-center justify-center gap-5 px-6 py-32 text-center">
          <h1 className="max-w-xl font-display text-fluid-2xl text-navy text-balance">
            {d.title}
          </h1>
          <p className="max-w-md text-fluid-base text-muted-foreground text-balance">
            {d.body}
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft"
          >
            {d.retry}
          </button>
        </div>
      </body>
    </html>
  );
}
