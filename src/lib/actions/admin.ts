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
