"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

import { BrandMark } from "@/components/layout/brand-mark";
import { MobileNav } from "@/components/layout/mobile-nav";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { NAV_KEYS } from "@/components/layout/nav";
import { WishlistIndicator } from "@/components/layout/wishlist-indicator";
import { TransitionLink } from "@/features/transitions/transition-link";
import { useI18n } from "@/lib/i18n/provider";

/**
 * Floating glass header: brand mark, primary navigation, language switcher,
 * and a booking CTA on desktop; a menu trigger that opens `MobileNav` on
 * smaller screens.
 */
export function Header({ authed }: { authed: boolean }) {
  const { locale, t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const home = `/${locale}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 px-4 transition-all duration-300 ${scrolled ? "pt-2" : "pt-4"}`}
    >
      <div
        className={`glass mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full px-4 py-2.5 transition-shadow duration-300 sm:px-6 ${scrolled ? "shadow-elevated" : ""}`}
      >
        <div className="flex items-center gap-3">
          <TransitionLink href={home} className="text-foreground">
            <BrandMark />
          </TransitionLink>
          <LanguageSwitcher className="md:hidden" />
        </div>

        <nav
          aria-label={t("nav.primaryLabel")}
          className="hidden items-center gap-7 md:flex"
        >
          {NAV_KEYS.map((key) => (
            <TransitionLink
              key={key}
              href={`${home}/${key}`}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t(`nav.${key}`)}
            </TransitionLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <WishlistIndicator />
          <TransitionLink
            href={authed ? `${home}/account` : `${home}/sign-in`}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {authed ? t("nav.account") : t("nav.signIn")}
          </TransitionLink>
          <LanguageSwitcher />
          <TransitionLink
            href={`${home}/booking`}
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.03]"
          >
            {t("nav.book")}
          </TransitionLink>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <WishlistIndicator />
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label={t("nav.openMenu")}
            aria-expanded={menuOpen}
            aria-haspopup="dialog"
            className="inline-flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-card"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <MobileNav
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        authed={authed}
      />
    </header>
  );
}
