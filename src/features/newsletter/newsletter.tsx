"use client";

import { useActionState } from "react";

import { Section } from "@/components/layout/section";
import { subscribeNewsletter } from "@/lib/actions/forms";
import type { FormState } from "@/lib/validation/schemas";
import type { Locale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";

const initial: FormState = { ok: false };

/** Newsletter CTA band with a Server Action-backed subscribe form. */
export function Newsletter({ locale }: { locale: Locale }) {
  const { t } = useI18n();
  const [state, action, pending] = useActionState(subscribeNewsletter, initial);

  return (
    <Section id="newsletter">
      <div className="mx-auto max-w-3xl rounded-3xl bg-navy px-6 py-14 text-center text-white">
        <p className="text-fluid-sm font-semibold uppercase tracking-[0.14em] text-turquoise">
          {t("sections.newsletter.eyebrow")}
        </p>
        <h2 className="mt-2 font-display text-fluid-2xl text-white text-balance">
          {t("sections.newsletter.title")}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-white/80">
          {t("sections.newsletter.description")}
        </p>

        <form
          action={action}
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <input type="hidden" name="locale" value={locale} />
          <input
            name="email"
            type="email"
            required
            placeholder={t("sections.newsletter.placeholder")}
            aria-label={t("sections.newsletter.title")}
            className="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3 text-white placeholder:text-white/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-turquoise"
          />
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-turquoise px-6 py-3 font-semibold text-navy transition-opacity disabled:opacity-60"
          >
            {t("sections.newsletter.subscribe")}
          </button>
        </form>

        <div aria-live="polite" className="mt-3 min-h-5 text-sm">
          {state.ok && (
            <p className="text-turquoise">{t("sections.newsletter.success")}</p>
          )}
          {state.error && (
            <p className="text-sunset">{t("sections.newsletter.error")}</p>
          )}
        </div>
      </div>
    </Section>
  );
}
