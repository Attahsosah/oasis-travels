import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";

import { siteConfig } from "@/config/site";
import { SignOutButton } from "@/features/auth/sign-out-button";
import { getAdminUser } from "@/lib/auth/admin";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveText } from "@/lib/i18n/resolve";

export const dynamic = "force-dynamic";

/**
 * Admin shell. Gated to allowlisted admins (ADMIN_EMAILS); everyone else is
 * bounced to sign-in. Fully localized via the active locale.
 */
export default async function AdminLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const admin = await getAdminUser();
  if (!admin) redirect(`/${locale}/sign-in`);

  const dict = await getDictionary(locale as Locale);
  const tabClass =
    "rounded-full border border-border px-4 py-2 hover:bg-secondary";

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-28">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-turquoise">
            {siteConfig.name}
          </p>
          <h1 className="font-display text-fluid-2xl text-navy">
            {resolveText(dict, "admin.title")}
          </h1>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">{admin.email}</span>
          <SignOutButton
            locale={locale}
            label={resolveText(dict, "auth.signOut")}
          />
        </div>
      </header>

      <nav className="mb-8 flex flex-wrap gap-2 text-sm font-medium">
        <Link href={`/${locale}/admin`} className={tabClass}>
          {resolveText(dict, "admin.bookings")}
        </Link>
        <Link href={`/${locale}/admin/messages`} className={tabClass}>
          {resolveText(dict, "admin.messages")}
        </Link>
        <Link href={`/${locale}/admin/subscribers`} className={tabClass}>
          {resolveText(dict, "admin.subscribers")}
        </Link>
        <Link href={`/${locale}/admin/settings`} className={tabClass}>
          {resolveText(dict, "admin.settings.title")}
        </Link>
      </nav>

      {children}
    </div>
  );
}
