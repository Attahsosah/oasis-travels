"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface MarqueeProps {
  children: ReactNode;
  /** Seconds for one full loop. Lower = faster. */
  speed?: number;
}

/**
 * Seamless infinite horizontal scroll. Renders the children twice and slides
 * the track by half its width, so the loop is continuous. Edges are faded via a
 * mask. Under reduced motion it falls back to a static wrapped row.
 */
export function Marquee({ children, speed = 36 }: MarqueeProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
        {children}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <motion.div
        className="flex w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
      >
        <div className="flex shrink-0 items-center gap-12 pr-12">{children}</div>
        <div
          aria-hidden="true"
          className="flex shrink-0 items-center gap-12 pr-12"
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
}
