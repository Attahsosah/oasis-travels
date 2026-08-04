import { SettingsForm } from "@/features/admin/settings-form";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveText } from "@/lib/i18n/resolve";
import { getSiteSettings } from "@/lib/settings";
import { isAdminConfigured } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(isLocale(locale) ? (locale as Locale) : "en");

  if (!isAdminConfigured()) {
    return (
      <p className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
        {resolveText(dict, "admin.notConfigured")}
      </p>
    );
  }

  const settings = await getSiteSettings();

  return (
    <section>
      <h2 className="font-display text-fluid-xl text-navy">
        {resolveText(dict, "admin.settings.title")}
      </h2>
      <p className="mb-6 mt-1 text-sm text-muted-foreground">
        {resolveText(dict, "admin.settings.intro")}
      </p>
      <SettingsForm initial={settings} />
    </section>
  );
}
