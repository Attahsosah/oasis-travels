import Image from "next/image";
import { Compass } from "lucide-react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";

/**
 * Brand lockup used across the chrome: the client's logo image (from /public)
 * next to the brand name, or a compass icon + name when no logo is set. Text
 * colour is inherited from the parent.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight",
        className,
      )}
    >
      {siteConfig.logo ? (
        <Image
          src={siteConfig.logo}
          alt={siteConfig.name}
          width={48}
          height={48}
          priority
          className="h-11 w-auto"
        />
      ) : (
        <Compass className="size-5 text-primary" aria-hidden="true" />
      )}
      {/* Name is hidden on phones to keep the mobile navbar compact; the logo
          alone represents the brand there. */}
      <span className="hidden sm:inline">{siteConfig.name}</span>
    </span>
  );
}
