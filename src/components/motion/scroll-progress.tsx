"use client";

import { Plane } from "lucide-react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Fixed scroll-progress indicator: a brand-gradient bar that fills left→right
 * as the page scrolls, led by a small plane. Purely scroll-driven, so it reads
 * identically on touch and desktop — a lightweight bit of "storytelling" that
 * gives the long mobile page a sense of journey and position.
 *
 * Skipped entirely under reduced motion. Non-interactive and aria-hidden.
 */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });
  // Leading plane rides just ahead of the fill.
  const planeLeft = useTransform(progress, (v) => `calc(${v * 100}% - 9px)`);

  if (reduce) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[90] h-[3px]"
    >
      <motion.div
        className="h-full origin-left bg-gradient-to-r from-turquoise via-primary to-sunset"
        style={{ scaleX: progress }}
      />
      <motion.div
        className="absolute top-1/2 grid size-[18px] -translate-y-1/2 place-items-center rounded-full bg-primary text-white shadow-[0_0_12px_rgba(36,119,179,0.7)]"
        style={{ left: planeLeft }}
      >
        <Plane className="size-3 rotate-45" aria-hidden="true" />
      </motion.div>
    </div>
  );
}
