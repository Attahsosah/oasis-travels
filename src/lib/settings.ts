import "server-only";

import { siteConfig } from "@/config/site";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface SiteSettings {
  whatsapp: string;
  email: string;
  phone: string;
  address: string;
  hours: string;
}

/**
 * Site settings, editable from /admin. Reads the single `site_settings` row and
 * falls back to `siteConfig.contact` for any value that's blank or when Supabase
 * isn't configured — so the site always has sensible defaults.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  const fallback: SiteSettings = {
    whatsapp: siteConfig.contact.whatsapp,
    email: siteConfig.contact.email,
    phone: siteConfig.contact.phone,
    address: siteConfig.contact.address,
    hours: siteConfig.contact.hours,
  };

  if (!isSupabaseConfigured()) return fallback;

  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (!data) return fallback;
    const row = data as Partial<SiteSettings>;
    return {
      whatsapp: row.whatsapp || fallback.whatsapp,
      email: row.email || fallback.email,
      phone: row.phone || fallback.phone,
      address: row.address || fallback.address,
      hours: row.hours || fallback.hours,
    };
  } catch {
    return fallback;
  }
}
