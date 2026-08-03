import "server-only";

import { createClient } from "@supabase/supabase-js";

import { SUPABASE_URL } from "./config";

const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * True when the service-role key is present — enables admin reads/writes that
 * bypass RLS (viewing all bookings, updating status, persisting guest bookings).
 */
export function isAdminConfigured(): boolean {
  return Boolean(SUPABASE_URL && SERVICE_ROLE_KEY);
}

/**
 * Service-role Supabase client. Server-only and never bound to a user session;
 * it bypasses Row Level Security, so it must only be used behind an admin gate
 * (or in trusted server actions) — never exposed to the browser.
 */
export function createSupabaseAdminClient() {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    throw new Error("Supabase admin client is not configured.");
  }
  return createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
