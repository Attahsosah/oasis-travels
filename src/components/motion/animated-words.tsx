"use client";

import { motion } from "framer-motion";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface AnimatedWordsProps {
  text: string;
  className?: string;
  delay?: number;
  /** Per-word stagger, seconds. */
  stagger?: number;
}

/**
 * Splits text into words, each masked and springing up in sequence. Under
 * reduced motion it renders the plain text. The full string stays in an
 * `aria-label` so assistive tech reads it as one phrase.
 */
export function AnimatedWords({
  text,
  className,
  delay = 0,
  stagger = 0.08,
}: AnimatedWordsProps) {
  const reduce = useReducedMotion();
  if (reduce) return <span className={className}>{text}</span>;

  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="inline-block overflow-hidden pb-[0.12em] align-bottom"
        >
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{
              type: "spring",
              duration: 0.85,
              bounce: 0.24,
              delay: delay + i * stagger,
            }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
