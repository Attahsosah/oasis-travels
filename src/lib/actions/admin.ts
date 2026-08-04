"use server";

import { revalidatePath } from "next/cache";

import { getAdminUser } from "@/lib/auth/admin";
import {
  createSupabaseAdminClient,
  isAdminConfigured,
} from "@/lib/supabase/admin";

const STATUSES = ["pending", "confirmed", "cancelled"] as const;
type BookingStatus = (typeof STATUSES)[number];

function isStatus(value: string): value is BookingStatus {
  return (STATUSES as readonly string[]).includes(value);
}

/**
 * Updates a booking's status. Double-gated: the caller must be an admin, and the
 * service role must be configured. Safe to expose as a Server Action.
 */
export async function updateBookingStatus(
  id: string,
  status: string,
): Promise<{ ok: boolean }> {
  const admin = await getAdminUser();
  if (!admin || !isAdminConfigured() || !isStatus(status)) {
    return { ok: false };
  }
  try {
    await createSupabaseAdminClient()
      .from("bookings")
      .update({ status })
      .eq("id", id);
    revalidatePath("/en/admin");
    revalidatePath("/fr/admin");
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export interface SiteSettingsInput {
  whatsapp?: string;
  email?: string;
  phone?: string;
  address?: string;
  hours?: string;
}

/** Admin-only update of the editable site settings (contact details). */
export async function updateSiteSettings(
  input: SiteSettingsInput,
): Promise<{ ok: boolean }> {
  const admin = await getAdminUser();
  if (!admin || !isAdminConfigured()) return { ok: false };
  try {
    await createSupabaseAdminClient()
      .from("site_settings")
      .upsert({
        id: 1,
        whatsapp: input.whatsapp ?? "",
        email: input.email ?? "",
        phone: input.phone ?? "",
        address: input.address ?? "",
        hours: input.hours ?? "",
        updated_at: new Date().toISOString(),
      });
    // Settings feed the layout (floating CTA), so revalidate the whole tree.
    revalidatePath("/en", "layout");
    revalidatePath("/fr", "layout");
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
