import "server-only";

import type { User } from "@supabase/supabase-js";

import { getSessionUser } from "@/lib/supabase/auth";

/** Lower-cased allowlist of admin emails from `ADMIN_EMAILS` (comma-separated). */
export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * The current user if they're an admin, otherwise null. Admin status is an
 * allowlist match on the signed-in user's email — no allowlist means no admins.
 */
export async function getAdminUser(): Promise<User | null> {
  const user = await getSessionUser();
  const email = user?.email?.toLowerCase();
  if (!email) return null;
  const allow = adminEmails();
  return allow.includes(email) ? user : null;
}

export async function isAdmin(): Promise<boolean> {
  return (await getAdminUser()) !== null;
}
