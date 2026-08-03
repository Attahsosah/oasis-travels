"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

import { ImageWithFallback } from "@/components/layout/image-with-fallback";
import { Reveal } from "@/components/motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

// The single hero image for the cinematic push (banking approach over islands).
const DESCENT_IMAGE =
  "https://d8j0ntlcm91z4.cloudfront.net/user_3FtpS2BXtpWM9PBWamolQGsBF7O/hf_20260727_185855_b45be026-30e4-4aa9-ae7b-b5ddc2f4c7f7.png";

// Foreground light motes — parallax faster than the image for a sense of depth.
const MOTES = [
  { top: "20%", left: "16%", size: 130, opacity: 0.2, dur: 9 },
  { top: "64%", left: "22%", size: 90, opacity: 0.16, dur: 11 },
  { top: "34%", left: "78%", size: 170, opacity: 0.18, dur: 13 },
  { top: "72%", left: "70%", size: 110, opacity: 0.2, dur: 10 },
];

interface FlightSequenceProps {
  eyebrow: string;
  title: string;
  subtitle: string;
}

/**
 * One-shot cinematic push. A single image is held in a pinned full-viewport
 * stage and slowly zoomed + drifted as the user scrolls, with foreground motes
 * parallaxing for depth and the headline settling in. Every scroll-driven value
 * is spring-smoothed so the motion glides rather than tracking scroll steps.
 * Collapses to a static band under reduced motion.
 */
export function FlightSequence({ eyebrow, title, subtitle }: FlightSequenceProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  // Spring-smoothed progress is the source for every motion below.
  const p = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 30,
    mass: 0.5,
  });

  const scale = useTransform(p, [0, 1], [1.05, 1.32]);
  const imageY = useTransform(p, [0, 1], ["0%", "-5%"]);
  const moteY = useTransform(p, [0, 1], ["8%", "-22%"]);
  const textOpacity = useTransform(p, [0.42, 0.68], [0, 1]);
  const textY = useTransform(p, [0.42, 0.68], [40, 0]);

  if (reduce) {
    return (
      <section className="relative h-[80vh] min-h-[460px] w-full overflow-hidden bg-navy">
        <ImageWithFallback src={DESCENT_IMAGE} alt="" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/35 to-navy/45" />
        <div className="relative z-10 mx-auto flex h-full max-w-4xl flex-col items-center justify-end px-6 pb-[14vh] text-center">
          <span className="mb-4 text-fluid-sm font-medium uppercase tracking-[0.24em] text-turquoise">
            {eyebrow}
          </span>
          <h2 className="font-display text-fluid-h1 text-white text-balance">
            {title}
          </h2>
          <p className="mt-5 max-w-xl text-fluid-lg text-white/85 text-balance">
            {subtitle}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[240vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-navy">
        {/* Image — deep, slow zoom + drift. */}
        <motion.div
          className="absolute inset-[-8%]"
          style={{ scale, y: imageY }}
        >
          <ImageWithFallback src={DESCENT_IMAGE} alt="" sizes="100vw" priority />
        </motion.div>

        {/* Foreground motes — faster parallax for depth. */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ y: moteY }}
        >
          {MOTES.map((m, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full"
              style={{
                top: m.top,
                left: m.left,
                width: m.size,
                height: m.size,
                background: `radial-gradient(circle, rgba(255,255,255,${m.opacity}) 0%, rgba(255,255,255,0) 70%)`,
                filter: "blur(4px)",
              }}
              animate={{ y: [0, -14, 0], opacity: [0.6, 1, 0.6] }}
              transition={{
                duration: m.dur,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.7,
              }}
            />
          ))}
        </motion.div>

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/15 to-navy/45"
        />

        <motion.div
          className="absolute inset-0 mx-auto flex max-w-4xl flex-col items-center justify-end px-6 pb-[14vh] text-center"
          style={{ opacity: textOpacity, y: textY }}
        >
          <Reveal direction="up">
            <span className="mb-4 inline-block text-fluid-sm font-medium uppercase tracking-[0.24em] text-turquoise">
              {eyebrow}
            </span>
          </Reveal>
          <h2 className="font-display text-fluid-h1 text-white text-balance [text-shadow:0_2px_34px_rgba(10,28,51,0.6)]">
            {title}
          </h2>
          <p className="mt-5 max-w-xl text-fluid-lg text-white/85 text-balance">
            {subtitle}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
