"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Plane } from "lucide-react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

export interface ItineraryDay {
  day: number;
  title: string;
  body: string;
}

/**
 * Day-by-day itinerary as a vertical flight route. A dashed line draws itself in
 * (turquoise fill) and a plane travels down it as you scroll, while each day card
 * slides in from the side — a signature, on-brand timeline animation.
 */
export function ItineraryTimeline({
  items,
  dayLabel,
}: {
  items: ItineraryDay[];
  dayLabel: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.35", "end 0.75"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 30,
    mass: 0.4,
  });
  const lineHeight = useTransform(smooth, [0, 1], ["0%", "100%"]);
  const planeTop = useTransform(smooth, [0, 1], ["0%", "100%"]);

  return (
    <div ref={ref} className="relative mt-8">
      {/* Base route. */}
      <div
        aria-hidden="true"
        className="absolute bottom-2 left-5 top-2 w-0.5 bg-border"
      />
      {!reduce && (
        <>
          {/* Traced route fill. */}
          <motion.div
            aria-hidden="true"
            style={{ height: lineHeight }}
            className="absolute left-5 top-2 w-0.5 origin-top bg-turquoise"
          />
          {/* Travelling plane. */}
          <motion.div
            aria-hidden="true"
            style={{ top: planeTop }}
            className="absolute left-5 -translate-x-1/2 text-primary"
          >
            <span className="grid size-7 place-items-center rounded-full bg-white shadow-float ring-1 ring-navy/10">
              <Plane className="size-3.5 rotate-[135deg]" />
            </span>
          </motion.div>
        </>
      )}

      <ol className="space-y-8">
        {items.map((it) => (
          <motion.li
            key={it.day}
            initial={reduce ? false : { opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-70px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative pl-14"
          >
            <span
              aria-hidden="true"
              className="absolute left-5 top-1.5 size-3 -translate-x-1/2 rounded-full bg-turquoise ring-4 ring-background"
            />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-turquoise">
              {dayLabel} {it.day}
            </p>
            <h3 className="mt-1 font-display text-fluid-lg text-navy">
              {it.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{it.body}</p>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
