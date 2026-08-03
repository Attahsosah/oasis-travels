"use client";

import {
  type ComponentPropsWithoutRef,
  type PointerEvent,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils/cn";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

type RippleButtonProps = ComponentPropsWithoutRef<"button">;

/**
 * Button that emits a material-style ripple from the pointer on press.
 *
 * The ripple is a self-contained Framer Motion span animated over transform +
 * opacity (GPU-composited), auto-removed on completion. Under reduced motion the
 * ripple is skipped entirely; the button remains fully functional. The host
 * passes visual styling (colors, padding, radius) via `className`; this
 * component only adds `relative overflow-hidden` and the ripple layer.
 */
export function RippleButton({
  className,
  children,
  onPointerDown,
  ...props
}: RippleButtonProps) {
  const reduceMotion = useReducedMotion();
  const [ripples, setRipples] = useState<Ripple[]>([]);

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
    onPointerDown?.(event);
    if (reduceMotion) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple: Ripple = {
      id: Date.now() + Math.random(),
      x: event.clientX - rect.left - size / 2,
      y: event.clientY - rect.top - size / 2,
      size,
    };
    setRipples((prev) => [...prev, ripple]);
  }

  function removeRipple(id: number) {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <button
      className={cn("relative overflow-hidden", className)}
      onPointerDown={handlePointerDown}
      {...props}
    >
      {!reduceMotion && (
        <span aria-hidden className="pointer-events-none absolute inset-0">
          <AnimatePresence>
            {ripples.map((ripple) => (
              <motion.span
                key={ripple.id}
                className="absolute rounded-full bg-current opacity-30"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  width: ripple.size,
                  height: ripple.size,
                }}
                initial={{ scale: 0, opacity: 0.35 }}
                animate={{ scale: 2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                onAnimationComplete={() => removeRipple(ripple.id)}
              />
            ))}
          </AnimatePresence>
        </span>
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}
