import { ExportCsvButton } from "@/features/admin/export-csv-button";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveText } from "@/lib/i18n/resolve";
import {
  createSupabaseAdminClient,
  isAdminConfigured,
} from "@/lib/supabase/admin";

type MessageRow = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
};

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage({
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
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  const messages = (data ?? []) as MessageRow[];

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="font-display text-fluid-xl text-navy">
          {resolveText(dict, "admin.messages")}{" "}
          <span className="text-muted-foreground">({messages.length})</span>
        </h2>
        <ExportCsvButton rows={messages} filename="messages.csv" />
      </div>

      {messages.length === 0 ? (
        <p className="text-muted-foreground">
          {resolveText(dict, "admin.noMessages")}
        </p>
      ) : (
        <ul className="space-y-4">
          {messages.map((m) => (
            <li
              key={m.id}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-semibold text-foreground">{m.subject}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(m.created_at).toLocaleString()}
                </p>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {m.name} ·{" "}
                <a
                  href={`mailto:${m.email}`}
                  className="text-primary hover:underline"
                >
                  {m.email}
                </a>
              </p>
              <p className="mt-3 whitespace-pre-wrap text-sm text-foreground">
                {m.message}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
