import type { ReactNode } from "react";

import { HeroParallax } from "@/features/hero-3d/hero-parallax";

/**
 * Hero shell.
 *
 * Server Component: the localized headline/CTA block is passed as `children` so
 * it stays server-rendered for SEO, then handed to the client `HeroParallax`
 * layer that builds photographic depth (pointer + scroll driven).
 */
export function Hero({ children }: { children: ReactNode }) {
  return <HeroParallax>{children}</HeroParallax>;
}
