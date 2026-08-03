"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, MessageCircle, Plane, X } from "lucide-react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useI18n } from "@/lib/i18n/provider";

/**
 * Global floating "talk to a designer" control. A pulsing orb that expands into
 * a small speed-dial with plan / message actions. Its icon rotates between chat
 * and close, and the panel springs open — a distinct micro-interaction.
 */
export function FloatingDesignerCta({ locale }: { locale: string }) {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const home = `/${locale}`;
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  return (
    <div className="fixed bottom-5 right-5 z-[80] flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
            className="w-72 origin-bottom-right rounded-2xl border border-border bg-card p-5 shadow-float"
          >
            <p className="font-display text-fluid-lg text-navy">
              {t("cta.title")}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("cta.body")}
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                href={`${home}/booking`}
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                <Plane className="size-4" aria-hidden="true" />
                {t("cta.plan")}
              </Link>
              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(t("cta.whatsappText"))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white"
                  style={{ backgroundColor: "#25D366" }}
                >
                  <MessageCircle className="size-4" aria-hidden="true" />
                  {t("cta.whatsapp")}
                </a>
              )}
              <Link
                href={`${home}#contact`}
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"
              >
                <Mail className="size-4" aria-hidden="true" />
                {t("cta.message")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={t("cta.aria")}
        className="relative grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-float"
      >
        {!reduce && !open && (
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-primary/40 motion-safe:animate-ping"
          />
        )}
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="size-6" aria-hidden="true" />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="size-6" aria-hidden="true" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
