/**
 * Supabase configuration guard. The whole auth/data layer degrades gracefully
 * when these env vars are absent: the app keeps running on the local seed
 * adapter and auth features show a "not configured" state instead of erroring.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}
