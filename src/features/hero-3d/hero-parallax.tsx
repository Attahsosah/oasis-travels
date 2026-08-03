"use client";

import { type ReactNode, useRef } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import { ImageWithFallback } from "@/components/layout/image-with-fallback";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

// Bespoke, on-brand hero: an airplane window-seat view over ocean and islands,
// generated via the image connector.
const HERO_IMAGE =
  "https://d8j0ntlcm91z4.cloudfront.net/user_3FtpS2BXtpWM9PBWamolQGsBF7O/hf_20260726_030433_d8eb7da8-cb64-4317-b8e6-452f88e13b3f.png";

// Foreground light motes — the closest depth plane (largest parallax).
const MOTES = [
  { top: "16%", left: "12%", size: 150, opacity: 0.34, dur: 7 },
  { top: "66%", left: "18%", size: 96, opacity: 0.28, dur: 9 },
  { top: "28%", left: "82%", size: 190, opacity: 0.26, dur: 11 },
  { top: "74%", left: "74%", size: 120, opacity: 0.3, dur: 8 },
  { top: "46%", left: "54%", size: 70, opacity: 0.22, dur: 10 },
  { top: "12%", left: "62%", size: 104, opacity: 0.2, dur: 12 },
];

/**
 * Photographic depth-parallax hero. A background photo, an atmospheric haze
 * layer, a foreground field of light motes, and the content each translate at a
 * different rate in response to pointer movement and scroll — building real
 * perceived depth from flat imagery. Fully static under reduced motion.
 *
 * `children` is the server-rendered headline/CTA block (kept for SEO).
 */
export function HeroParallax({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // Pointer position, normalised to roughly [-0.5, 0.5], spring-smoothed.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 55, damping: 18, mass: 0.7 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);

  function handleMove(e: React.MouseEvent) {
    if (reduce) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function handleLeave() {
    px.set(0);
    py.set(0);
  }

  // Scroll drift as the hero leaves the viewport.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgScrollY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const contentScrollY = useTransform(scrollYProgress, [0, 1], ["0%", "42%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Per-layer pointer parallax (background moves least, motes move most).
  const bgX = useTransform(sx, (v) => v * -20);
  const bgY = useTransform(sy, (v) => v * -16);
  const hazeX = useTransform(sx, (v) => v * -38);
  const hazeY = useTransform(sy, (v) => v * -28);
  const moteX = useTransform(sx, (v) => v * 66);
  const moteY = useTransform(sy, (v) => v * 50);
  const contentX = useTransform(sx, (v) => v * 12);

  return (
    <section
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-navy"
    >
      {/* Layer 1 — background photo (scroll on outer, pointer on inner). */}
      <motion.div
        className="absolute inset-0 z-0"
        style={reduce ? undefined : { y: bgScrollY }}
      >
        <motion.div
          className="absolute inset-[-10%]"
          style={reduce ? undefined : { x: bgX, y: bgY, scale: 1.16 }}
        >
          <ImageWithFallback
            src={HERO_IMAGE}
            alt=""
            sizes="100vw"
            priority
          />
        </motion.div>
      </motion.div>

      {/* Layer 2 — atmospheric haze / light for mid-depth. */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-[-10%] z-10"
        style={reduce ? undefined : { x: hazeX, y: hazeY }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 42%, rgba(255,246,232,0.35) 0%, rgba(255,214,161,0.12) 40%, rgba(10,28,51,0) 72%)",
          }}
        />
      </motion.div>

      {/* Readability scrim (static). */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-20 bg-gradient-to-t from-navy/85 via-navy/35 to-navy/45"
      />

      {/* Layer 3 — foreground light motes (closest plane). */}
      {!reduce && (
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 z-30"
          style={{ x: moteX, y: moteY }}
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
              animate={{ y: [0, -16, 0], opacity: [0.7, 1, 0.7] }}
              transition={{
                duration: m.dur,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.6,
              }}
            />
          ))}
        </motion.div>
      )}

      {/* Layer 4 — content (server-rendered children). */}
      <motion.div
        className="relative z-40 mx-auto max-w-4xl px-6 pt-24 text-center"
        style={
          reduce ? undefined : { y: contentScrollY, x: contentX, opacity: contentOpacity }
        }
      >
        {children}
      </motion.div>
    </section>
  );
}
