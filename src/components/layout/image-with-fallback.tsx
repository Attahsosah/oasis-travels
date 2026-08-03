"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils/cn";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * `next/image` (fill) with a graceful brand-gradient fallback if the remote
 * photo fails to load. Keeps the UI intact even if a specific Unsplash URL
 * needs swapping. Parent must be `relative` and sized.
 */
export function ImageWithFallback({
  src,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority = false,
}: ImageWithFallbackProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "size-full bg-gradient-to-br from-ocean via-turquoise to-sand",
          className,
        )}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      // Skip Next's image optimizer only in dev (it times out fetching remote
      // Unsplash images locally). In production the optimizer runs normally, so
      // images are served as optimized AVIF/WebP.
      unoptimized={process.env.NODE_ENV === "development"}
      onError={() => setFailed(true)}
      className={cn("object-cover", className)}
    />
  );
}
