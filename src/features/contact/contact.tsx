"use client";

import { useActionState } from "react";

import { Section, SectionHeading } from "@/components/layout/section";
import { sendContact } from "@/lib/actions/forms";
import type { FormState } from "@/lib/validation/schemas";
import type { Locale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";

const initial: FormState = { ok: false };

const inputClass =
  "w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function Field({
  label,
  name,
  type,
}: {
  label: string;
  name: string;
  type: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-foreground">
        {label}
      </span>
      <input name={name} type={type} required className={inputClass} />
    </label>
  );
}

/** Contact form backed by a Zod-validated Server Action. */
export function Contact({ locale }: { locale: Locale }) {
  const { t } = useI18n();
  const [state, action, pending] = useActionState(sendContact, initial);

  return (
    <Section id="contact">
      <SectionHeading
        eyebrow={t("sections.contact.eyebrow")}
        title={t("sections.contact.title")}
        description={t("sections.contact.description")}
      />

      <form action={action} className="mx-auto mt-10 grid max-w-2xl gap-4">
        <input type="hidden" name="locale" value={locale} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("sections.contact.name")} name="name" type="text" />
          <Field
            label={t("sections.contact.email")}
            name="email"
            type="email"
          />
        </div>
        <Field
          label={t("sections.contact.subject")}
          name="subject"
          type="text"
        />
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-foreground">
            {t("sections.contact.message")}
          </span>
          <textarea name="message" rows={5} required className={inputClass} />
        </label>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition-opacity disabled:opacity-60"
          >
            {pending
              ? t("sections.contact.sending")
              : t("sections.contact.send")}
          </button>
          <span aria-live="polite" className="text-sm">
            {state.ok && (
              <span className="text-forest">
                {t("sections.contact.success")}
              </span>
            )}
            {state.error && (
              <span className="text-destructive">
                {t("sections.contact.error")}
              </span>
            )}
          </span>
        </div>
      </form>
    </Section>
  );
}
