"use client";

import { type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

type RevealDirection = "up" | "down" | "left" | "right" | "none";

interface RevealProps {
  children: ReactNode;
  /** Slide-in direction of the reveal. Defaults to `up`. */
  direction?: RevealDirection;
  /** Seconds to wait before animating. Useful for staggering siblings. */
  delay?: number;
  /** Animation duration in seconds. */
  duration?: number;
  /** Travel distance in pixels for the slide. */
  distance?: number;
  /** Only animate the first time the element enters the viewport. */
  once?: boolean;
  /** Portion of the element that must be visible to trigger (0–1). */
  amount?: number;
  className?: string;
}

const offset: Record<RevealDirection, { x: number; y: number }> = {
  up: { x: 0, y: 1 },
  down: { x: 0, y: -1 },
  left: { x: 1, y: 0 },
  right: { x: -1, y: 0 },
  none: { x: 0, y: 0 },
};

/**
 * Scroll-triggered entrance animation (fade + optional slide).
 *
 * Built on Framer Motion's `whileInView`. Fully honors reduced motion: when the
 * user prefers reduced motion the content renders immediately with no transform.
 * Renders a `div` wrapper — use `className` for layout; wrap in a semantic
 * element where one is needed.
 */
export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  distance = 24,
  once = true,
  amount = 0.3,
  className,
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const { x, y } = offset[direction];
  const variants: Variants = {
    hidden: { opacity: 0, x: x * distance, y: y * distance, scale: 0.96 },
    visible: { opacity: 1, x: 0, y: 0, scale: 1 },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      // Spring (with a touch of bounce) reads more premium than a flat tween.
      transition={{ type: "spring", duration, bounce: 0.32, delay }}
    >
      {children}
    </motion.div>
  );
}
