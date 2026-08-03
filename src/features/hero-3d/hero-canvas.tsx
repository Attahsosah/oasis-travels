"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils/cn";

// Client-only: the WebGL scene never renders on the server.
const Scene = dynamic(
  () => import("@/features/hero-3d/scene").then((m) => m.Scene),
  { ssr: false },
);

/**
 * Decides whether — and when — to mount the WebGL hero scene, then cross-fades
 * it in over the poster.
 *
 * The scene is skipped entirely (poster stays) when the user prefers reduced
 * motion, on small screens, or on low-core devices. When allowed, mounting is
 * deferred to idle so it never competes with first paint / LCP.
 */
export function HeroCanvas({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(true);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduceMotion) return;
    if (typeof window === "undefined") return;

    const smallScreen = window.matchMedia("(max-width: 767px)").matches;
    const lowCore =
      typeof navigator !== "undefined" &&
      typeof navigator.hardwareConcurrency === "number" &&
      navigator.hardwareConcurrency < 4;

    if (smallScreen || lowCore) return;

    // Defer to idle so the 3D work never blocks first paint / LCP.
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(() => setMounted(true), { timeout: 2500 })
      : window.setTimeout(() => setMounted(true), 1200);

    return () => {
      if (window.cancelIdleCallback && typeof idle === "number") {
        window.cancelIdleCallback(idle);
      } else {
        window.clearTimeout(idle as number);
      }
    };
  }, [reduceMotion]);

  // Pause the render loop while the hero is scrolled out of view.
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setActive(Boolean(entry?.isIntersecting)),
      { threshold: 0.05 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={wrapperRef}
      className={cn(
        "transition-opacity duration-[1200ms] ease-out",
        visible ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      <Scene onReady={() => setVisible(true)} active={active} />
    </div>
  );
}
