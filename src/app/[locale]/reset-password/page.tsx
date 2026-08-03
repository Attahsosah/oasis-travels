import { notFound } from "next/navigation";

import { Section } from "@/components/layout/section";
import { ResetPasswordForm } from "@/features/auth/reset-password-form";
import { TransitionLink } from "@/features/transitions/transition-link";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveText } from "@/lib/i18n/resolve";
import { getSessionUser } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  if (!isSupabaseConfigured()) {
    return (
      <Section className="max-w-md pt-32 text-center">
        <p className="text-sm text-muted-foreground">
          {resolveText(dict, "auth.notConfigured")}
        </p>
      </Section>
    );
  }

  // The recovery link (via /auth/callback) establishes a session; if there
  // isn't one, the link was invalid or has expired.
  const user = await getSessionUser();

  return (
    <Section className="max-w-md pt-32 text-center">
      <h1 className="font-display text-fluid-2xl text-navy">
        {resolveText(dict, "auth.newPasswordTitle")}
      </h1>

      {user ? (
        <ResetPasswordForm locale={locale} />
      ) : (
        <div className="mt-6">
          <p className="text-sm text-muted-foreground">
            {resolveText(dict, "auth.resetExpired")}
          </p>
          <p className="mt-4 text-sm">
            <TransitionLink
              href={`/${locale}/forgot-password`}
              className="font-semibold text-primary"
            >
              {resolveText(dict, "auth.resetTitle")}
            </TransitionLink>
          </p>
        </div>
      )}
    </Section>
  );
}
