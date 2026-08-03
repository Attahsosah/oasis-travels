"use client";

import { useActionState } from "react";

import type { AuthState } from "@/lib/actions/auth";
import type { Locale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";

const initial: AuthState = {};

const inputClass =
  "w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/** Shared email/password form for sign-in and sign-up. */
export function AuthForm({
  mode,
  locale,
  action,
}: {
  mode: "signin" | "signup";
  locale: Locale;
  action: (state: AuthState, formData: FormData) => Promise<AuthState>;
}) {
  const { t } = useI18n();
  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <form action={formAction} className="mx-auto mt-8 grid max-w-sm gap-4 text-left">
      <input type="hidden" name="locale" value={locale} />
      <label className="block">
        <span className="mb-1 block text-sm font-medium">{t("auth.email")}</span>
        <input name="email" type="email" required className={inputClass} />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium">
          {t("auth.password")}
        </span>
        <input
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          className={inputClass}
        />
      </label>

      {state.error && (
        <p className="text-sm text-destructive">
          {state.error === "not_configured"
            ? t("auth.notConfigured")
            : state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-60"
      >
        {pending
          ? t("auth.submitting")
          : mode === "signin"
            ? t("auth.signIn")
            : t("auth.signUp")}
      </button>
    </form>
  );
}
