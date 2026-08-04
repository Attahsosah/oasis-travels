"use server";

import { siteConfig } from "@/config/site";
import { sendEmail, notifyAddress } from "@/lib/email";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  createSupabaseAdminClient,
  isAdminConfigured,
} from "@/lib/supabase/admin";
import {
  bookingSchema,
  contactSchema,
  flightRequestSchema,
  newsletterSchema,
  type FormState,
} from "@/lib/validation/schemas";

export interface BookingResult {
  ok: boolean;
  reference?: string;
  error?: string;
}

/** Minimal HTML escaping for values interpolated into notification emails. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Creates a booking: validates server-side, generates a reference, persists the
 * enquiry (guests included, via the service role), and fires notification +
 * confirmation emails. Persistence and email are each best-effort — a missing
 * service role or email config never breaks the customer-facing flow.
 */
export async function createBooking(input: unknown): Promise<BookingResult> {
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const v = parsed.data;
  const reference = `AZ-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  // Attach the signed-in user if there is one (guests stay null).
  let userId: string | null = null;
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      userId = user?.id ?? null;
    } catch {
      userId = null;
    }
  }

  const record = {
    user_id: userId,
    reference,
    customer_name: v.customerName,
    customer_email: v.customerEmail,
    destination_slug: v.destinationSlug,
    package_slug: v.packageSlug,
    start_date: v.startDate,
    end_date: v.endDate,
    guests: v.guests,
    budget_tier: v.budgetTier,
    status: "pending",
  };

  try {
    if (isAdminConfigured()) {
      // Service role persists both guest and signed-in bookings.
      await createSupabaseAdminClient().from("bookings").insert(record);
    } else if (isSupabaseConfigured() && userId) {
      // Fallback: signed-in users only, under their own RLS policy.
      const supabase = await createSupabaseServerClient();
      await supabase.from("bookings").insert(record);
    }
  } catch {
    // Persistence is best-effort; still return a reference to the customer.
  }

  // Notifications (no-ops unless Resend is configured).
  const summary = `
    <h2>New booking — ${esc(reference)}</h2>
    <p><strong>Customer:</strong> ${esc(v.customerName)} (${esc(v.customerEmail)})</p>
    <p><strong>Destination:</strong> ${esc(v.destinationSlug)}</p>
    <p><strong>Package:</strong> ${esc(v.packageSlug ?? "No preference")}</p>
    <p><strong>Dates:</strong> ${esc(v.startDate)} &rarr; ${esc(v.endDate)}</p>
    <p><strong>Guests:</strong> ${v.guests}</p>
    <p><strong>Budget:</strong> ${esc(v.budgetTier)}</p>`;

  const notify = notifyAddress();
  if (notify) {
    await sendEmail({
      to: notify,
      subject: `New booking ${reference} — ${v.destinationSlug}`,
      html: summary,
      replyTo: v.customerEmail,
    });
  }
  await sendEmail({
    to: v.customerEmail,
    subject: `We've received your enquiry (${reference})`,
    html: `<p>Thank you, ${esc(v.customerName)}.</p><p>We've received your enquiry <strong>${esc(reference)}</strong> and a travel designer will be in touch within one business day.</p><p>— ${esc(siteConfig.name)}</p>`,
  });

  return { ok: true, reference };
}

export interface FlightRequestResult {
  ok: boolean;
  reference?: string;
  error?: string;
}

/**
 * Flight-quote request. Stored as a structured contact message (avoids the
 * bookings trip-date constraints) and emailed to the agency + a confirmation to
 * the customer.
 */
export async function requestFlight(
  input: unknown,
): Promise<FlightRequestResult> {
  const parsed = flightRequestSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const v = parsed.data;
  const reference = `OT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const trip = v.tripType === "round" ? "Aller-retour" : "Aller simple";
  const dates = v.returnDate
    ? `${v.departDate} → ${v.returnDate}`
    : v.departDate;
  const subject = `Demande de vol : ${v.from} → ${v.to}`;
  const message = `Type : ${trip}\nItinéraire : ${v.from} → ${v.to}\nDates : ${dates}\nPassagers : ${v.passengers}\nRéférence : ${reference}`;

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      await supabase.from("contact_messages").insert({
        name: v.customerName,
        email: v.customerEmail,
        subject,
        message,
      });
    } catch {
      // best-effort
    }
  }

  const notify = notifyAddress();
  if (notify) {
    await sendEmail({
      to: notify,
      subject,
      html: `<h2>${esc(subject)}</h2><p>${esc(message).replace(/\n/g, "<br/>")}</p><p><strong>${esc(v.customerName)}</strong> (${esc(v.customerEmail)})</p>`,
      replyTo: v.customerEmail,
    });
  }
  await sendEmail({
    to: v.customerEmail,
    subject: `${siteConfig.name} — ${reference}`,
    html: `<p>Merci, ${esc(v.customerName)}.</p><p>Nous avons bien reçu votre demande de vol <strong>${esc(reference)}</strong> et nous vous répondrons avec les meilleurs tarifs disponibles.</p><p>— ${esc(siteConfig.name)}</p>`,
  });

  return { ok: true, reference };
}

/**
 * Newsletter signup — persists to `newsletter_subs`. A duplicate email is
 * treated as success (already subscribed).
 */
export async function subscribeNewsletter(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = newsletterSchema.safeParse({
    email: formData.get("email"),
    locale: formData.get("locale"),
  });
  if (!parsed.success) return { ok: false, error: "invalid" };

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      const { error } = await supabase
        .from("newsletter_subs")
        .insert({ email: parsed.data.email, locale: parsed.data.locale });
      // 23505 = unique violation → already subscribed, still a success.
      if (error && error.code !== "23505") {
        return { ok: false, error: "server" };
      }
    } catch {
      return { ok: false, error: "server" };
    }
  }

  return { ok: true };
}

/**
 * Contact form — persists to `contact_messages` and notifies the agency (reply-to
 * set to the sender so staff can reply directly).
 */
export async function sendContact(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });
  if (!parsed.success) return { ok: false, error: "invalid" };
  const v = parsed.data;

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      await supabase.from("contact_messages").insert({
        name: v.name,
        email: v.email,
        subject: v.subject,
        message: v.message,
      });
    } catch {
      return { ok: false, error: "server" };
    }
  }

  const notify = notifyAddress();
  if (notify) {
    await sendEmail({
      to: notify,
      subject: `Contact: ${v.subject}`,
      html: `<h2>New message</h2><p><strong>From:</strong> ${esc(v.name)} (${esc(v.email)})</p><p><strong>Subject:</strong> ${esc(v.subject)}</p><p>${esc(v.message).replace(/\n/g, "<br/>")}</p>`,
      replyTo: v.email,
    });
  }

  return { ok: true };
}
