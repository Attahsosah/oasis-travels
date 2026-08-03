"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

import { ImageWithFallback } from "@/components/layout/image-with-fallback";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils/cn";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  /** Vertical drift in px across the element's viewport crossing. */
  strength?: number;
}

/**
 * Image that drifts vertically within its (overflow-hidden) frame as it crosses
 * the viewport — the classic depth-parallax effect. The image is over-sized by
 * `strength` on each side so the drift never reveals an edge. Static under
 * reduced motion.
 */
export function ParallaxImage({
  src,
  alt,
  className,
  sizes,
  strength = 60,
}: ParallaxImageProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    mass: 0.4,
  });
  const y = useTransform(smooth, [0, 1], [strength, -strength]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div
        className="absolute inset-x-0"
        style={
          reduce
            ? { top: 0, bottom: 0 }
            : { top: -strength, bottom: -strength, y }
        }
      >
        <div className="relative size-full">
          <ImageWithFallback src={src} alt={alt} sizes={sizes} />
        </div>
      </motion.div>
    </div>
  );
}
