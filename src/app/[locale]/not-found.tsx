"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass } from "lucide-react";

import en from "../../../messages/en.json";
import fr from "../../../messages/fr.json";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

const dicts = { en, fr } as const;

/**
 * Locale-aware 404. Self-contained (reads the locale from the path and its own
 * bundled strings) so it renders correctly regardless of provider state.
 */
export default function NotFound() {
  const pathname = usePathname();
  const segment = pathname.split("/")[1] ?? "";
  const locale = isLocale(segment) ? segment : defaultLocale;
  const d = dicts[locale].notFound;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-5 px-6 py-32 text-center">
      <Compass className="size-10 text-primary" aria-hidden="true" />
      <h1 className="max-w-xl font-display text-fluid-2xl text-navy text-balance">
        {d.title}
      </h1>
      <p className="max-w-md text-fluid-base text-muted-foreground text-balance">
        {d.body}
      </p>
      <Link
        href={`/${locale}`}
        className="mt-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft"
      >
        {d.cta}
      </Link>
    </div>
  );
}
