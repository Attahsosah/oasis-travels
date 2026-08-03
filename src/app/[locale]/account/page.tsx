import { notFound, redirect } from "next/navigation";

import { Section, SectionHeading } from "@/components/layout/section";
import { SignOutButton } from "@/features/auth/sign-out-button";
import { TransitionLink } from "@/features/transitions/transition-link";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveText } from "@/lib/i18n/resolve";
import { getSessionUser } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface BookingRow {
  id: string;
  reference: string;
  destination_slug: string;
  start_date: string;
  end_date: string;
  guests: number;
  status: string;
}

export const dynamic = "force-dynamic";

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  if (!isSupabaseConfigured()) {
    return (
      <Section className="max-w-2xl pt-32 text-center">
        <h1 className="font-display text-fluid-2xl text-navy">
          {resolveText(dict, "auth.accountTitle")}
        </h1>
        <p className="mt-4 text-muted-foreground">
          {resolveText(dict, "auth.notConfigured")}
        </p>
      </Section>
    );
  }

  const user = await getSessionUser();
  if (!user) redirect(`/${locale}/sign-in`);

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });
  const bookings = (data ?? []) as BookingRow[];

  return (
    <Section className="max-w-3xl pt-32">
      <SectionHeading
        align="left"
        eyebrow={resolveText(dict, "auth.accountEyebrow")}
        title={resolveText(dict, "auth.accountTitle")}
      />

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6">
        <div>
          <p className="text-sm text-muted-foreground">
            {resolveText(dict, "auth.signedInAs")}
          </p>
          <p className="font-medium text-foreground">{user.email}</p>
        </div>
        <SignOutButton
          locale={locale}
          label={resolveText(dict, "auth.signOut")}
        />
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-display text-fluid-xl text-navy">
          {resolveText(dict, "auth.bookingHistory")}
        </h2>
        <TransitionLink
          href={`/${locale}/wishlist`}
          className="text-sm font-semibold text-primary hover:underline"
        >
          {resolveText(dict, "wishlist.title")}
        </TransitionLink>
      </div>

      {bookings.length === 0 ? (
        <p className="mt-4 text-muted-foreground">
          {resolveText(dict, "auth.noBookings")}
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-border rounded-xl border border-border bg-card">
          {bookings.map((b) => (
            <li
              key={b.id}
              className="flex flex-wrap items-center justify-between gap-2 px-5 py-4"
            >
              <div>
                <p className="font-medium capitalize text-foreground">
                  {b.destination_slug.replace(/-/g, " ")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {b.start_date} → {b.end_date} · {b.guests}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm text-foreground">
                  {b.reference}
                </p>
                <p className="text-xs capitalize text-muted-foreground">
                  {b.status}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
