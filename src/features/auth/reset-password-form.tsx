"use client";

import { useActionState } from "react";

import { updatePassword, type AuthState } from "@/lib/actions/auth";
import type { Locale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";

const initial: AuthState = {};

const inputClass =
  "w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/** Sets a new password within the recovery session. */
export function ResetPasswordForm({ locale }: { locale: Locale }) {
  const { t } = useI18n();
  const [state, action, pending] = useActionState(updatePassword, initial);

  return (
    <form
      action={action}
      className="mx-auto mt-8 grid max-w-sm gap-4 text-left"
    >
      <input type="hidden" name="locale" value={locale} />
      <label className="block">
        <span className="mb-1 block text-sm font-medium">
          {t("auth.newPassword")}
        </span>
        <input
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          className={inputClass}
        />
      </label>

      {state.error && (
        <p className="text-sm text-destructive">
          {state.error === "not_configured"
            ? t("auth.notConfigured")
            : state.error === "weak_password"
              ? t("auth.weakPassword")
              : state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-60"
      >
        {pending ? t("auth.submitting") : t("auth.updatePassword")}
      </button>
    </form>
  );
}
