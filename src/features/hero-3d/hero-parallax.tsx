"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Compass } from "lucide-react";

import { ImageWithFallback } from "@/components/layout/image-with-fallback";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useI18n } from "@/lib/i18n/provider";

type OrientationPermission = "granted" | "denied" | "default";

/** iOS 13+ exposes a permission gate on the constructor; other platforms don't. */
interface DeviceOrientationEventIOS {
  requestPermission?: () => Promise<OrientationPermission>;
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

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
  const { locale } = useI18n();
  const ref = useRef<HTMLElement>(null);

  // Pointer position, normalised to roughly [-0.5, 0.5], spring-smoothed.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 55, damping: 18, mass: 0.7 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);

  // On touch devices the pointer never moves, so the depth parallax is driven
  // by the gyroscope instead. `needsPermission` is true only on iOS, where the
  // sensor requires an explicit user gesture to unlock.
  const [needsPermission, setNeedsPermission] = useState(false);

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

  // Translate device tilt into the same [-0.5, 0.5] space as the pointer.
  function handleOrientation(e: DeviceOrientationEvent) {
    const gamma = e.gamma; // left/right tilt, degrees
    const beta = e.beta; // front/back tilt, degrees
    if (gamma === null || beta === null) return;
    // Neutral hold is ~45° of forward tilt; ±40° of range maps to the extremes.
    px.set(clamp(gamma / 40, -0.5, 0.5));
    py.set(clamp((beta - 45) / 40, -0.5, 0.5));
  }

  useEffect(() => {
    if (reduce || typeof window === "undefined") return;
    // Only phones/tablets: skip fine-pointer (desktop) devices entirely.
    if (!window.matchMedia("(pointer: coarse)").matches) return;
    if (typeof window.DeviceOrientationEvent === "undefined") return;

    const gate = window.DeviceOrientationEvent as unknown as DeviceOrientationEventIOS;
    if (typeof gate.requestPermission === "function") {
      // iOS: wait for a tap before we can read the sensor.
      setNeedsPermission(true);
      return;
    }
    window.addEventListener("deviceorientation", handleOrientation);
    return () =>
      window.removeEventListener("deviceorientation", handleOrientation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  async function enableMotion() {
    const gate =
      window.DeviceOrientationEvent as unknown as DeviceOrientationEventIOS;
    try {
      const result = await gate.requestPermission?.();
      if (result === "granted") {
        window.addEventListener("deviceorientation", handleOrientation);
      }
    } catch {
      // Ignore — leave the hero on its static/scroll behaviour.
    }
    setNeedsPermission(false);
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

      {/* Touch devices (iOS): tap to unlock gyroscope-driven depth. */}
      <AnimatePresence>
        {!reduce && needsPermission && (
          <motion.button
            type="button"
            onClick={() => void enableMotion()}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ delay: 1.2, duration: 0.4 }}
            className="absolute bottom-7 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md"
          >
            <Compass className="size-4" aria-hidden="true" />
            {locale === "fr" ? "Inclinez pour explorer" : "Tilt to explore"}
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
}
