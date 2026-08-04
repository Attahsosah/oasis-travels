"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { BrandMark } from "@/components/layout/brand-mark";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { NAV_KEYS } from "@/components/layout/nav";
import { TransitionLink } from "@/features/transitions/transition-link";
import { useI18n } from "@/lib/i18n/provider";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  authed: boolean;
}

/**
 * Full-screen mobile navigation overlay. Rendered through a portal on
 * `document.body` so it escapes the header's stacking context and reliably sits
 * above the page, background, and flight-path layers (and receives taps). Locks
 * body scroll while open, closes on Escape, and staggers its links in.
 */
export function MobileNav({ open, onClose, authed }: MobileNavProps) {
  const { locale, t } = useI18n();
  const reduce = useReducedMotion();
  const home = `/${locale}`;
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={t("nav.primaryLabel")}
          className="fixed inset-0 z-[90] flex flex-col bg-background md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.25 }}
        >
          <div className="flex items-center justify-between px-6 py-4">
            <BrandMark className="text-foreground" />
            <button
              type="button"
              onClick={onClose}
              aria-label={t("nav.closeMenu")}
              className="inline-flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-card"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          <nav
            aria-label={t("nav.primaryLabel")}
            className="flex flex-col gap-1 px-6 py-8"
          >
            {NAV_KEYS.map((key, index) => (
              <motion.div
                key={key}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduce ? 0 : 0.35,
                  delay: reduce ? 0 : 0.05 * index,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <TransitionLink
                  href={`${home}/${key}`}
                  onClick={onClose}
                  className="block py-2 font-display text-3xl font-semibold text-foreground"
                >
                  {t(`nav.${key}`)}
                </TransitionLink>
              </motion.div>
            ))}
            <TransitionLink
              href={`${home}/${authed ? "account" : "sign-in"}`}
              onClick={onClose}
              className="block py-2 font-display text-3xl font-semibold text-foreground"
            >
              {authed ? t("nav.account") : t("nav.signIn")}
            </TransitionLink>
          </nav>

          <div className="mt-auto flex items-center justify-between gap-4 px-6 py-8">
            <LanguageSwitcher />
            <TransitionLink
              href={`${home}/booking`}
              onClick={onClose}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              {t("nav.book")}
            </TransitionLink>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
