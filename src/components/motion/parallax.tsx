"use client";

import { type ReactNode, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface ParallaxProps {
  children: ReactNode;
  /**
   * Parallax strength. Positive values move the element slower than scroll
   * (drifts up), negative values move it faster. Roughly a fraction of the
   * element's travel; `0.3` is a subtle, tasteful default.
   */
  speed?: number;
  /** Axis of movement. Defaults to vertical. */
  axis?: "x" | "y";
  className?: string;
}

/**
 * Scroll-linked parallax translation for a single element.
 *
 * Uses Framer Motion's `useScroll` progress across the element's viewport
 * crossing, mapped to a bounded translation. Disabled (static) under reduced
 * motion. GPU-composited transform only — no layout thrash.
 */
export function Parallax({
  children,
  speed = 0.3,
  axis = "y",
  className,
}: ParallaxProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Map 0→1 progress to a symmetric ±range so the element is centered at
  // mid-crossing. 100px baseline scaled by `speed`.
  const range = 100 * speed;
  const transformed = useTransform(
    scrollYProgress,
    [0, 1],
    [range, -range],
  );

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={axis === "y" ? { y: transformed } : { x: transformed }}
    >
      {children}
    </motion.div>
  );
}
