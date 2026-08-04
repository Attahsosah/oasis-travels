"use client";

import { BrandMark } from "@/components/layout/brand-mark";
import { siteConfig } from "@/config/site";
import { NAV_KEYS } from "@/components/layout/nav";
import { TransitionLink } from "@/features/transitions/transition-link";
import { useI18n } from "@/lib/i18n/provider";

/**
 * Site footer: brand, navigation columns (explore / company / legal), and a
 * copyright line. Fully localized via the i18n provider.
 */
export function Footer() {
  const { locale, t } = useI18n();
  const home = `/${locale}`;
  const year = new Date().getFullYear();

  const columns = [
    {
      title: t("footer.explore"),
      links: NAV_KEYS.map((key) => ({
        label: t(`nav.${key}`),
        href: `${home}/${key}`,
      })),
    },
    {
      title: t("footer.company"),
      links: [
        { label: t("footer.about"), href: `${home}/about` },
        { label: t("footer.team"), href: `${home}/designers` },
        { label: t("footer.contact"), href: `${home}#contact` },
      ],
    },
    {
      title: t("footer.legal"),
      links: [
        { label: t("footer.privacy"), href: `${home}/privacy` },
        { label: t("footer.terms"), href: `${home}/terms` },
        { label: t("footer.cookies"), href: `${home}/cookies` },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <BrandMark className="text-foreground" />
          <p className="max-w-xs text-sm text-muted-foreground">
            {t("footer.tagline")}
          </p>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <h2 className="text-sm font-semibold text-foreground">
              {column.title}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.href}>
                  <TransitionLink
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-6 text-sm text-muted-foreground">
          © {year} {siteConfig.name}. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
