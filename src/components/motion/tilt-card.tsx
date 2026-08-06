"use client";

import {
  type PointerEvent,
  type ReactNode,
  type TouchEvent,
  useEffect,
  useState,
} from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees. */
  max?: number;
}

type Mode = "none" | "hover" | "touch";

/**
 * Wraps content in a subtle 3D perspective tilt.
 *
 * On hover-capable (desktop) devices the tilt follows the cursor and springs
 * back on leave. On touch devices — where there is no cursor — the card instead
 * reacts to taps: it tilts toward the finger and presses in (scale) while held,
 * springing back on release. Under reduced motion it renders a plain, static
 * wrapper (which also keeps SSR and first client render identical).
 */
export function TiltCard({ children, className, max = 7 }: TiltCardProps) {
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<Mode>("none");

  useEffect(() => {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      setMode("hover");
    } else if (window.matchMedia("(pointer: coarse)").matches) {
      setMode("touch");
    }
  }, []);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [max, -max]), {
    stiffness: 150,
    damping: 15,
  });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-max, max]), {
    stiffness: 150,
    damping: 15,
  });

  function handleMove(e: PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleTouchStart(e: TouchEvent<HTMLDivElement>) {
    const touch = e.touches[0];
    if (!touch) return;
    const rect = e.currentTarget.getBoundingClientRect();
    // Softer than hover (× 0.6) so a tap tilts gently rather than snapping.
    px.set(((touch.clientX - rect.left) / rect.width - 0.5) * 0.6);
    py.set(((touch.clientY - rect.top) / rect.height - 0.5) * 0.6);
  }

  function reset() {
    px.set(0);
    py.set(0);
  }

  if (reduce || mode === "none") {
    return <div className={className}>{children}</div>;
  }

  if (mode === "touch") {
    return (
      <motion.div
        className={className}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          transformPerspective: 900,
        }}
        whileTap={{ scale: 0.97 }}
        onTouchStart={handleTouchStart}
        onTouchEnd={reset}
        onTouchCancel={reset}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        transformPerspective: 900,
      }}
      onPointerMove={handleMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  );
}
