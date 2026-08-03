import "server-only";

import type { User } from "@supabase/supabase-js";

import { isSupabaseConfigured } from "./config";
import { createSupabaseServerClient } from "./server";

/**
 * Current authenticated user, or null (incl. when Supabase isn't configured or
 * when called outside a request context, e.g. during static prerender — the
 * try/catch keeps the shared layout from crashing a page's build).
 */
export async function getSessionUser(): Promise<User | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    return data.user ?? null;
  } catch {
    return null;
  }
}
