"use client";

import { motion } from "framer-motion";
import { Plane } from "lucide-react";

import { useTransition } from "./transition-provider";
import type { TransitionVariant } from "./variants";

/** Panel background per variant. */
const backgrounds: Record<TransitionVariant, string> = {
  sunrise:
    "linear-gradient(180deg, #10233b 0%, #3a5f8a 40%, #e9a94e 78%, #f6d08a 100%)",
  clouds:
    "radial-gradient(60% 40% at 20% 30%, #ffffff 0%, rgba(255,255,255,0) 60%), radial-gradient(50% 40% at 70% 60%, #ffffff 0%, rgba(255,255,255,0) 60%), radial-gradient(70% 50% at 50% 90%, #ffffff 0%, rgba(255,255,255,0) 60%), linear-gradient(180deg, #cfe0ec 0%, #eaf1f6 100%)",
  ocean:
    "linear-gradient(180deg, #0a3d62 0%, #1b6f8a 55%, #2ec4b6 100%)",
  airplane:
    "linear-gradient(180deg, #bfe1e6 0%, #7fb2cf 55%, #4f97a8 100%)",
};

/**
 * Full-screen cinematic transition overlay.
 *
 * Slides up to cover the viewport, signals the provider to swap the route once
 * covered, then slides off the top to reveal the new page. Idle repositioning
 * is instant (off-screen both ways) so it's never visible between navigations.
 * Decorative only; hidden from assistive tech and inert when idle.
 */
export function TransitionOverlay() {
  const { phase, variant, onCovered, onRevealed } = useTransition();

  const y = phase === "cover" ? "0%" : phase === "reveal" ? "-101%" : "101%";

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100]"
      style={{ pointerEvents: phase === "idle" ? "none" : "auto" }}
      initial={false}
      animate={{ y }}
      transition={
        phase === "idle"
          ? { duration: 0 }
          : {
              // Exit (reveal) faster than the enter (cover) — feels snappier.
              duration: phase === "reveal" ? 0.45 : 0.62,
              ease: [0.83, 0, 0.17, 1],
            }
      }
      onAnimationComplete={() => {
        if (phase === "cover") onCovered();
        else if (phase === "reveal") onRevealed();
      }}
    >
      <div
        className="absolute inset-0"
        style={{ background: backgrounds[variant] }}
      >
        {variant === "airplane" && phase !== "idle" && (
          <motion.div
            className="absolute top-1/2 text-white/90"
            initial={{ x: "-15vw" }}
            animate={{ x: "115vw" }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
          >
            <Plane className="size-10 -rotate-12" aria-hidden="true" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
