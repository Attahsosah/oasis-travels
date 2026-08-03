"use client";

import { useEffect } from "react";
import Lenis from "lenis";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Mounts Lenis smooth scrolling app-wide. Renders nothing.
 *
 * Fully disabled under `prefers-reduced-motion` — no instance is created, so
 * native scrolling is preserved. The Lenis `raf` loop is torn down on unmount
 * and when the motion preference changes.
 */
export function SmoothScroll() {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });

    let frame = 0;
    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [reduce]);

  return null;
}
