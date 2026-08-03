"use client";

import { usePathname } from "next/navigation";
import { Compass } from "lucide-react";

import en from "../../../messages/en.json";
import fr from "../../../messages/fr.json";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

const dicts = { en, fr } as const;

/** Route-level loading state — a calm, centered brand spinner. */
export default function Loading() {
  const pathname = usePathname();
  const segment = pathname.split("/")[1] ?? "";
  const locale = isLocale(segment) ? segment : defaultLocale;
  const label = dicts[locale].common.loading;

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-dvh items-center justify-center"
    >
      <Compass
        className="size-8 animate-spin text-primary [animation-duration:1.6s]"
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
