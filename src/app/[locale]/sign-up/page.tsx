import { notFound, redirect } from "next/navigation";

import { Section } from "@/components/layout/section";
import { AuthForm } from "@/features/auth/auth-form";
import { TransitionLink } from "@/features/transitions/transition-link";
import { signUp } from "@/lib/actions/auth";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveText } from "@/lib/i18n/resolve";
import { getSessionUser } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export default async function SignUpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const user = await getSessionUser();
  if (user) redirect(`/${locale}/account`);

  const dict = await getDictionary(locale);

  return (
    <Section className="max-w-md pt-32 text-center">
      <h1 className="font-display text-fluid-2xl text-navy">
        {resolveText(dict, "auth.signUpTitle")}
      </h1>

      {isSupabaseConfigured() ? (
        <AuthForm mode="signup" locale={locale} action={signUp} />
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          {resolveText(dict, "auth.notConfigured")}
        </p>
      )}

      <p className="mt-6 text-sm text-muted-foreground">
        {resolveText(dict, "auth.haveAccount")}{" "}
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
