"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { TriangleAlert } from "lucide-react";

import en from "../../../messages/en.json";
import fr from "../../../messages/fr.json";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

const dicts = { en, fr } as const;

/**
 * Segment-level error boundary. Self-contained strings (no provider
 * dependency) so it stays reliable even when the tree that provides i18n is
 * what failed.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const segment = pathname.split("/")[1] ?? "";
  const locale = isLocale(segment) ? segment : defaultLocale;
  const d = dicts[locale].error;

  useEffect(() => {
    // Surface for observability; replace with a real logger in later phases.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-5 px-6 py-32 text-center">
      <TriangleAlert className="size-10 text-sunset" aria-hidden="true" />
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
  );
}
