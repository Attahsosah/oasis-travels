"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

// Client-only: WebGL never renders on the server.
const AuroraCanvas = dynamic(
  () => import("@/components/layout/aurora-canvas").then((m) => m.AuroraCanvas),
  { ssr: false },
);

/**
 * Fixed full-page background. A soft dawn→dusk CSS gradient is always present
 * (so there's never a bland white void, and it's the reduced-motion / low-power
 * fallback); on capable desktops a flowing WebGL aurora shader — whose palette
 * follows scroll — cross-fades in on top after idle.
 */
export function AuroraBackground() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (reduce || typeof window === "undefined") return;

    const smallScreen = window.matchMedia("(max-width: 767px)").matches;
    const lowCore =
      typeof navigator !== "undefined" &&
      typeof navigator.hardwareConcurrency === "number" &&
      navigator.hardwareConcurrency < 4;
    if (smallScreen || lowCore) return;

    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(() => setMounted(true), { timeout: 2500 })
      : window.setTimeout(() => setMounted(true), 800);

    return () => {
      if (window.cancelIdleCallback && typeof idle === "number") {
        window.cancelIdleCallback(idle);
      } else {
        window.clearTimeout(idle as number);
      }
    };
  }, [reduce]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #d3e2f3 0%, #eaf0f5 26%, #f6e6c8 64%, #ded1ee 100%)",
        }}
      />
      {mounted && (
        <div className="absolute inset-0 opacity-90">
          <AuroraCanvas />
        </div>
      )}
    </div>
  );
}
