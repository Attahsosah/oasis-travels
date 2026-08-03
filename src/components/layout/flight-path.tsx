"use client";

import { Plane } from "lucide-react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Fixed right-rail "flight path": a dashed airline-style route that traces
 * itself in as you scroll, with a small plane travelling down it — doubling as a
 * scroll-progress indicator. Desktop only; hidden under reduced motion.
 */
export function FlightPath() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 26,
    mass: 0.4,
  });
  const planeTop = useTransform(progress, [0, 1], ["1%", "96%"]);

  if (reduce) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed right-5 top-0 bottom-28 z-30 hidden w-10 lg:block"
    >
      <svg
        viewBox="0 0 40 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        {/* Faint full route. */}
        <path
          d="M20 1 L20 99"
          fill="none"
          stroke="var(--color-navy)"
          strokeOpacity="0.16"
          strokeWidth="1.4"
          strokeDasharray="0.6 3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {/* Traced portion, drawn by scroll. */}
        <motion.path
          d="M20 1 L20 99"
          fill="none"
          stroke="var(--color-turquoise)"
          strokeWidth="1.8"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: progress }}
        />
      </svg>

      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ top: planeTop }}
      >
        <span className="grid size-7 place-items-center rounded-full bg-white text-ocean shadow-float ring-1 ring-navy/10">
          <Plane className="size-4 rotate-[135deg]" strokeWidth={2.2} />
        </span>
      </motion.div>
    </div>
  );
}
