"use client";

import { type MouseEvent, useRef } from "react";
import { motion, type HTMLMotionProps, useMotionValue, useSpring } from "framer-motion";

import { cn } from "@/lib/utils/cn";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type MagneticButtonProps = HTMLMotionProps<"button"> & {
  /** How far the button follows the cursor, as a fraction of the offset. */
  strength?: number;
};

/**
 * Button that magnetically eases toward the cursor on hover, springing back on
 * leave. A signature luxury micro-interaction. Under reduced motion it renders
 * a plain, fully accessible button with no movement.
 */
export function MagneticButton({
  strength = 0.35,
  className,
  children,
  ...props
}: MagneticButtonProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 });

  function handleMouseMove(event: MouseEvent<HTMLButtonElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = event.clientX - (rect.left + rect.width / 2);
    const relY = event.clientY - (rect.top + rect.height / 2);
    x.set(relX * strength);
    y.set(relY * strength);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  // A `motion.button` with no motion props renders as a plain, accessible
  // <button>, so the reduced-motion path simply omits movement.
  return (
    <motion.button
      ref={ref}
      className={cn("inline-flex", className)}
      style={reduceMotion ? undefined : { x: springX, y: springY }}
      onMouseMove={reduceMotion ? undefined : handleMouseMove}
      onMouseLeave={reduceMotion ? undefined : handleMouseLeave}
      {...props}
    >
      {children}
    </motion.button>
  );
}
