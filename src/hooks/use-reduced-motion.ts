"use client";

import { useReducedMotion as useFramerReducedMotion } from "framer-motion";

/**
 * Single source of truth for the user's motion preference.
 *
 * Wraps Framer Motion's `useReducedMotion` so every motion primitive imports
 * from one place. Returns `true` when the user has requested reduced motion
 * (via `prefers-reduced-motion: reduce`), in which case primitives render their
 * instant/static state and skip transforms, parallax, and idle animation.
 *
 * SSR-safe: returns `false` on the server and during first paint, then updates
 * on the client once the media query is read.
 */
export function useReducedMotion(): boolean {
  return useFramerReducedMotion() ?? false;
}
