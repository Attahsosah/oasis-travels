import Image from "next/image";
import { Compass } from "lucide-react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";

/**
 * Brand lockup used across the chrome.
 *
 * Two logo shapes are supported:
 *  - an icon/emblem (square) → rendered as a circle beside the brand name;
 *  - a full wordmark that already contains the name (`logoIncludesName`) →
 *    rendered at its natural aspect ratio with no adjacent name text.
 * Falls back to a compass icon + name when no logo is set. On phones the name
 * text is hidden to keep the navbar compact. Colour is inherited from parent.
 */
export function BrandMark({ className }: { className?: string }) {
  const wordmark = Boolean(siteConfig.logoIncludesName);

  return (
    <span
      className={cn(
        "flex items-center gap-2.5 font-display text-lg tracking-tight",
        className,
      )}
    >
      {siteConfig.logo ? (
        <Image
          src={siteConfig.logo}
          alt={siteConfig.name}
          width={wordmark ? 220 : 48}
          height={wordmark ? 126 : 48}
          priority
          className={
            wordmark
              ? "h-8 w-auto sm:h-10"
              : "h-8 w-8 rounded-full object-cover sm:h-11 sm:w-11"
          }
        />
      ) : (
        <Compass className="size-5 text-primary" aria-hidden="true" />
      )}
      {/* Skip the name entirely when the logo is a wordmark; otherwise show it
          from the sm breakpoint up (hidden on phones to keep the navbar slim). */}
      {!wordmark && (
        <span className="hidden font-semibold text-sunset sm:inline">
          {siteConfig.name}
        </span>
      )}
    </span>
  );
}
