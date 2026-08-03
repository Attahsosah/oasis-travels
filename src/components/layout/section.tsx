import type { ReactNode } from "react";

import { Reveal } from "@/components/motion";
import { cn } from "@/lib/utils/cn";

/** Consistent max-width, padding, and rhythm for every marketing section. */
export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn("mx-auto w-full max-w-7xl px-6 py-20 sm:py-28", className)}
    >
      {children}
    </section>
  );
}

/** Eyebrow + title + optional description, revealed on scroll. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "light",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  tone?: "light" | "onDark";
}) {
  const dark = tone === "onDark";
  return (
    <Reveal>
      <div
        className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}
      >
        {eyebrow && (
          <p
            className={cn(
              "text-fluid-sm font-semibold uppercase tracking-[0.14em]",
              dark ? "text-turquoise" : "text-primary",
            )}
          >
            {eyebrow}
          </p>
        )}
        <h2
          className={cn(
            "mt-2 font-display text-fluid-2xl text-balance",
            dark ? "text-white" : "text-navy",
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "mt-3 text-fluid-base text-balance",
              dark ? "text-white/70" : "text-muted-foreground",
            )}
          >
            {description}
          </p>
        )}
      </div>
    </Reveal>
  );
}
