"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { updateSiteSettings } from "@/lib/actions/admin";
import { useI18n } from "@/lib/i18n/provider";

interface Values {
  whatsapp: string;
  email: string;
  phone: string;
  address: string;
  hours: string;
}

export function SettingsForm({ initial }: { initial: Values }) {
  const { t } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<Values>(initial);

  function set(key: keyof Values, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  function submit() {
    startTransition(async () => {
      const res = await updateSiteSettings(form);
      if (res.ok) {
        setSaved(true);
        router.refresh();
      }
    });
  }

  const fields: {
    key: keyof Values;
    label: string;
    hint?: string;
    type?: string;
  }[] = [
    {
      key: "whatsapp",
      label: t("admin.settings.whatsapp"),
      hint: t("admin.settings.whatsappHint"),
    },
    { key: "phone", label: t("admin.settings.phone") },
    { key: "email", label: t("admin.settings.email"), type: "email" },
    { key: "address", label: t("admin.settings.address") },
    { key: "hours", label: t("admin.settings.hours") },
  ];

  return (
    <div className="max-w-lg space-y-5">
      {fields.map((f) => (
        <label key={f.key} className="block">
          <span className="mb-1 block text-sm font-medium text-foreground">
            {f.label}
          </span>
          <input
            type={f.type ?? "text"}
            value={form[f.key]}
            onChange={(e) => set(f.key, e.target.value)}
            className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {f.hint && (
            <span className="mt-1 block text-xs text-muted-foreground">
              {f.hint}
            </span>
          )}
        </label>
      ))}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={submit}
          disabled={pending}
          className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-60"
        >
          {t("admin.settings.save")}
        </button>
        {saved && (
          <span className="text-sm text-forest">
            {t("admin.settings.saved")}
          </span>
        )}
      </div>
    </div>
  );
}
