"use client";

import { motion, useScroll, useTransform } from "framer-motion";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Fixed ambient background behind all content: a faint vertical gradient plus
 * large blurred color orbs that parallax at different speeds on scroll — so the
 * white sections gain colour, depth, and motion without a per-section WebGL
 * canvas. Purely decorative; disabled (static) under reduced motion.
 */
export function ScrollAmbience() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -260]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -180]);

  const orb = "pointer-events-none absolute rounded-full blur-3xl";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Faint dawn → dusk wash over the base background. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(143,182,207,0.10) 0%, rgba(250,247,242,0) 30%, rgba(233,220,201,0.10) 70%, rgba(79,151,168,0.12) 100%)",
        }}
      />
      <motion.div
        className={orb}
        style={{
          left: "-12%",
          top: "12%",
          width: "46vw",
          height: "46vw",
          opacity: 0.16,
          background:
            "radial-gradient(circle, var(--color-turquoise) 0%, transparent 70%)",
          ...(reduce ? {} : { y: y1 }),
        }}
      />
      <motion.div
        className={orb}
        style={{
          right: "-10%",
          top: "42%",
          width: "42vw",
          height: "42vw",
          opacity: 0.13,
          background:
            "radial-gradient(circle, var(--color-ocean) 0%, transparent 70%)",
          ...(reduce ? {} : { y: y2 }),
        }}
      />
      <motion.div
        className={orb}
        style={{
          left: "10%",
          top: "74%",
          width: "40vw",
          height: "40vw",
          opacity: 0.12,
          background:
            "radial-gradient(circle, var(--color-sunset) 0%, transparent 70%)",
          ...(reduce ? {} : { y: y3 }),
        }}
      />
    </div>
  );
}
