"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

import { cn } from "@/lib/utils/cn";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type FloatingCardProps = HTMLMotionProps<"div"> & {
  /** Enable the gentle idle float (vertical drift). Defaults to true. */
  float?: boolean;
  /** Vertical travel of the idle float, in pixels. */
  amplitude?: number;
  /** Duration of one idle float cycle, in seconds. */
  duration?: number;
  /** Lift + scale on hover. Defaults to true. */
  hoverLift?: boolean;
};

/**
 * Elevated card with a soft idle float and a hover lift.
 *
 * Idle motion is a slow, GPU-composited vertical drift; hover adds a small lift
 * and scale with elevated shadow. Under reduced motion both are disabled and the
 * card renders static (keeping its resting elevation).
 */
export function FloatingCard({
  float = true,
  amplitude = 8,
  duration = 6,
  hoverLift = true,
  className,
  children,
  ...props
}: FloatingCardProps) {
  const reduceMotion = useReducedMotion();

  const base = cn(
    "rounded-xl bg-card text-card-foreground shadow-soft transition-shadow",
    className,
  );

  const idle = !reduceMotion && float;

  return (
    <motion.div
      className={base}
      animate={idle ? { y: [0, -amplitude, 0] } : undefined}
      transition={
        idle ? { duration, ease: "easeInOut", repeat: Infinity } : undefined
      }
      whileHover={
        !reduceMotion && hoverLift
          ? {
              y: -6,
              scale: 1.02,
              boxShadow: "0 20px 60px -12px rgb(10 37 64 / 0.22)",
            }
          : undefined
      }
      {...props}
    >
      {children}
    </motion.div>
  );
}
