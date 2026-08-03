import type { Dictionary } from "./dictionaries";

/**
 * Resolve a dot-path to a string in a dictionary, returning the fallback (or
 * the path itself) when missing. Pure and server-safe — used by Server
 * Components to read localized copy without the client provider.
 */
export function resolveText(
  dict: Dictionary,
  path: string,
  fallback?: string,
): string {
  const value = path
    .split(".")
    .reduce<string | Dictionary | undefined>(
      (acc, key) => (acc && typeof acc === "object" ? acc[key] : undefined),
      dict,
    );
  return typeof value === "string" ? value : (fallback ?? path);
}
