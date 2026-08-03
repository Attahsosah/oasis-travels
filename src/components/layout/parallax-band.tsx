"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

import { ImageWithFallback } from "@/components/layout/image-with-fallback";
import { Reveal } from "@/components/motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils/cn";

interface ParallaxBandProps {
  src: string;
  alt: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  /** Tailwind height classes for the band. */
  heightClassName?: string;
}

/**
 * Full-bleed cinematic "chapter": a large photo that drifts vertically and
 * slowly scales (Ken Burns) as it crosses the viewport, with a dark scrim and a
 * revealed headline over it. Static image under reduced motion.
 */
export function ParallaxBand({
  src,
  alt,
  eyebrow,
  title,
  subtitle,
  align = "center",
  heightClassName = "h-[72vh] min-h-[460px] md:h-[86vh]",
}: ParallaxBandProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    mass: 0.4,
  });
  // The image sits over-sized (inset -15%) so drift + scale never reveal an edge.
  const y = useTransform(smooth, [0, 1], ["-9%", "9%"]);
  const scale = useTransform(smooth, [0, 1], [1.06, 1.2]);

  return (
    <section
      ref={ref}
      className={cn("relative w-full overflow-hidden", heightClassName)}
    >
      <motion.div
        className="absolute inset-[-15%]"
        style={reduce ? undefined : { y, scale }}
      >
        <ImageWithFallback src={src} alt={alt} sizes="100vw" />
      </motion.div>

      {/* Readability scrim — darker toward the bottom where text sits. */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/40 to-navy/55" />

      <div
        className={cn(
          "relative z-10 mx-auto flex h-full max-w-5xl flex-col justify-center px-6",
          align === "center" ? "items-center text-center" : "items-start",
        )}
      >
        {eyebrow && (
          <Reveal direction="up">
            <span className="mb-4 inline-block text-fluid-sm font-medium uppercase tracking-[0.24em] text-turquoise">
              {eyebrow}
            </span>
          </Reveal>
        )}
        <Reveal direction="up" delay={0.08}>
          <h2 className="max-w-3xl font-display text-fluid-h1 text-white text-balance [text-shadow:0_2px_34px_rgba(10,28,51,0.6)]">
            {title}
          </h2>
        </Reveal>
        {subtitle && (
          <Reveal direction="up" delay={0.16}>
            <p className="mt-5 max-w-xl text-fluid-lg text-white/85 text-balance">
              {subtitle}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
