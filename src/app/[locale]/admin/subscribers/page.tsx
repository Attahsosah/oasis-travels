import { ExportCsvButton } from "@/features/admin/export-csv-button";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveText } from "@/lib/i18n/resolve";
import {
  createSupabaseAdminClient,
  isAdminConfigured,
} from "@/lib/supabase/admin";

type SubscriberRow = {
  id: string;
  email: string;
  locale: string;
  confirmed: boolean;
  created_at: string;
};

export const dynamic = "force-dynamic";

export default async function AdminSubscribersPage({
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

  const { data } = await createSupabaseAdminClient()
    .from("newsletter_subs")
    .select("*")
    .order("created_at", { ascending: false });
  const subs = (data ?? []) as SubscriberRow[];

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="font-display text-fluid-xl text-navy">
          {resolveText(dict, "admin.subscribers")}{" "}
          <span className="text-muted-foreground">({subs.length})</span>
        </h2>
        <ExportCsvButton rows={subs} filename="subscribers.csv" />
      </div>

      {subs.length === 0 ? (
        <p className="text-muted-foreground">
          {resolveText(dict, "admin.noSubscribers")}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">
                  {resolveText(dict, "admin.colEmail")}
                </th>
                <th className="px-4 py-3 font-medium">
                  {resolveText(dict, "admin.colLocale")}
                </th>
                <th className="px-4 py-3 font-medium">
                  {resolveText(dict, "admin.colJoined")}
                </th>
              </tr>
            </thead>
            <tbody>
              {subs.map((s) => (
                <tr key={s.id} className="border-t border-border">
                  <td className="px-4 py-3">{s.email}</td>
                  <td className="px-4 py-3 uppercase">{s.locale}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                    {new Date(s.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
