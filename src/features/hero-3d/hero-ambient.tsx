"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * A small plane that flies along a dashed arc drawn across the hero.
 *
 * The dashed route is a static SVG path; the plane is a second SVG node whose
 * transform is driven imperatively from `getPointAtLength`, so it stays exactly
 * on the path regardless of how the sliced viewBox scales across screen sizes.
 * The route stays visible under reduced motion; only the plane + its loop stop.
 */
function HeroFlightArc() {
  const reduce = useReducedMotion();
  const pathRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (reduce) return;
    const path = pathRef.current;
    const plane = planeRef.current;
    if (!path || !plane) return;

    const length = path.getTotalLength();
    const durationMs = 16000;
    let raf = 0;
    let startedAt = 0;

    const tick = (now: number) => {
      if (!startedAt) startedAt = now;
      const t = ((now - startedAt) % durationMs) / durationMs;
      const at = t * length;
      const p = path.getPointAtLength(at);
      const ahead = path.getPointAtLength(Math.min(length, at + 1));
      const angle = (Math.atan2(ahead.y - p.y, ahead.x - p.x) * 180) / Math.PI;
      plane.setAttribute("transform", `translate(${p.x} ${p.y}) rotate(${angle})`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 z-[31] h-full w-full"
    >
      <path
        ref={pathRef}
        d="M -60 500 C 260 300 620 470 900 250 C 1010 165 1120 150 1260 90"
        fill="none"
        stroke="rgba(255,255,255,0.38)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeDasharray="2 13"
      />
      {!reduce && (
        <g ref={planeRef}>
          <path
            d="M 20 0 L -13 -10 L -4 0 L -13 10 Z"
            fill="rgba(255,255,255,0.95)"
            stroke="rgba(10,28,51,0.35)"
            strokeWidth={1}
          />
        </g>
      )}
    </svg>
  );
}

/**
 * Ambient, always-on motion for the hero — independent of pointer or tilt so
 * the scene looks alive before any interaction: two soft clouds drifting at
 * different speeds, the plane's flight arc, and a slow diagonal light sweep.
 * All GPU-composited (transform/opacity only) and fully removed under reduced
 * motion.
 */
export function HeroAmbient() {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <>
      {/* Drifting clouds — behind the haze/scrim for depth. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[6] overflow-hidden"
      >
        <motion.div
          className="absolute"
          style={{
            top: "16%",
            left: "-32%",
            width: "56%",
            height: "40%",
            background:
              "radial-gradient(closest-side, rgba(255,255,255,0.22), rgba(255,255,255,0))",
            filter: "blur(22px)",
          }}
          animate={{ x: ["0%", "300%"] }}
          transition={{ duration: 66, ease: "linear", repeat: Infinity }}
        />
        <motion.div
          className="absolute"
          style={{
            top: "54%",
            left: "78%",
            width: "44%",
            height: "34%",
            background:
              "radial-gradient(closest-side, rgba(255,255,255,0.16), rgba(255,255,255,0))",
            filter: "blur(26px)",
          }}
          animate={{ x: ["0%", "-320%"] }}
          transition={{ duration: 88, ease: "linear", repeat: Infinity }}
        />
      </div>

      <HeroFlightArc />

      {/* Slow diagonal light sweep — like sun catching the window. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[32]"
        style={{
          background:
            "linear-gradient(105deg, transparent 42%, rgba(255,255,255,0.10) 50%, transparent 58%)",
          mixBlendMode: "screen",
        }}
        initial={{ x: "-120%" }}
        animate={{ x: ["-120%", "120%"] }}
        transition={{
          duration: 5,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 7,
        }}
      />
    </>
  );
}
