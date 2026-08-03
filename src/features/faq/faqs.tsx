"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { Section, SectionHeading } from "@/components/layout/section";
import { pick, type Faq } from "@/lib/data/types";
import type { Locale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils/cn";

/** Accordion FAQ. Reduced-motion collapses the expand animation. */
export function Faqs({ locale, faqs }: { locale: Locale; faqs: Faq[] }) {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <Section id="faq" className="max-w-3xl">
      <SectionHeading
        eyebrow={t("sections.faq.eyebrow")}
        title={t("sections.faq.title")}
        description={t("sections.faq.description")}
      />
      <div className="mt-10 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
        {faqs.map((f) => {
          const isOpen = openId === f.id;
          return (
            <div key={f.id}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenId(isOpen ? null : f.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-medium text-foreground">
                  {pick(f.question, locale)}
                </span>
                <ChevronDown
                  className={cn(
                    "size-5 shrink-0 text-muted-foreground transition-transform",
                    isOpen && "rotate-180",
                  )}
                  aria-hidden="true"
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={reduce ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                    transition={{ duration: reduce ? 0 : 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 text-sm text-muted-foreground">
                      {pick(f.answer, locale)}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
