import { notFound, redirect } from "next/navigation";

import { Section } from "@/components/layout/section";
import { AuthForm } from "@/features/auth/auth-form";
import { TransitionLink } from "@/features/transitions/transition-link";
import { signIn } from "@/lib/actions/auth";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveText } from "@/lib/i18n/resolve";
import { getSessionUser } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export default async function SignInPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ checkEmail?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const user = await getSessionUser();
  if (user) redirect(`/${locale}/account`);

  const [dict, sp] = await Promise.all([getDictionary(locale), searchParams]);

  return (
    <Section className="max-w-md pt-32 text-center">
      <h1 className="font-display text-fluid-2xl text-navy">
        {resolveText(dict, "auth.signInTitle")}
      </h1>

      {sp.checkEmail && (
        <p className="mt-4 rounded-xl bg-forest/10 px-4 py-3 text-sm text-forest">
          {resolveText(dict, "auth.checkEmail")}
        </p>
      )}

      {isSupabaseConfigured() ? (
        <AuthForm mode="signin" locale={locale} action={signIn} />
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          {resolveText(dict, "auth.notConfigured")}
        </p>
      )}

      {isSupabaseConfigured() && (
        <p className="mt-4 text-sm">
          <TransitionLink
            href={`/${locale}/forgot-password`}
            className="text-muted-foreground hover:text-foreground"
          >
            {resolveText(dict, "auth.forgotPassword")}
          </TransitionLink>
        </p>
      )}

      <p className="mt-6 text-sm text-muted-foreground">
        {resolveText(dict, "auth.noAccount")}{" "}
        <TransitionLink
          href={`/${locale}/sign-up`}
          className="font-semibold text-primary"
        >
          {resolveText(dict, "auth.signUp")}
        </TransitionLink>
      </p>
    </Section>
  );
}
