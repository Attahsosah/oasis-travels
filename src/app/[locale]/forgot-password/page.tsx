import { notFound } from "next/navigation";

import { Section } from "@/components/layout/section";
import { ForgotPasswordForm } from "@/features/auth/forgot-password-form";
import { TransitionLink } from "@/features/transitions/transition-link";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveText } from "@/lib/i18n/resolve";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export default async function ForgotPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <Section className="max-w-md pt-32 text-center">
      <h1 className="font-display text-fluid-2xl text-navy">
        {resolveText(dict, "auth.resetTitle")}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {resolveText(dict, "auth.resetIntro")}
      </p>

      {isSupabaseConfigured() ? (
        <ForgotPasswordForm locale={locale} />
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          {resolveText(dict, "auth.notConfigured")}
        </p>
      )}

      <p className="mt-6 text-sm text-muted-foreground">
        <TransitionLink
          href={`/${locale}/sign-in`}
          className="font-semibold text-primary"
        >
          {resolveText(dict, "auth.signIn")}
        </TransitionLink>
      </p>
    </Section>
  );
}
