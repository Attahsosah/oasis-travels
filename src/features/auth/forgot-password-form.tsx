"use client";

import { useActionState } from "react";

import { requestPasswordReset, type AuthState } from "@/lib/actions/auth";
import type { Locale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";

const initial: AuthState = {};

const inputClass =
  "w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/** Requests a password-reset email. */
export function ForgotPasswordForm({ locale }: { locale: Locale }) {
  const { t } = useI18n();
  const [state, action, pending] = useActionState(
    requestPasswordReset,
    initial,
  );

  if (state.ok) {
    return (
      <p className="mx-auto mt-8 max-w-sm rounded-xl bg-forest/10 px-4 py-3 text-sm text-forest">
        {t("auth.resetSent")}
      </p>
    );
  }

  return (
    <form
      action={action}
      className="mx-auto mt-8 grid max-w-sm gap-4 text-left"
    >
      <input type="hidden" name="locale" value={locale} />
      <label className="block">
        <span className="mb-1 block text-sm font-medium">
          {t("auth.email")}
        </span>
        <input name="email" type="email" required className={inputClass} />
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
        {pending ? t("auth.submitting") : t("auth.sendReset")}
      </button>
    </form>
  );
}
