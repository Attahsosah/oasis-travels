/** Primary navigation item keys — resolved to labels via `nav.<key>` and to
 * hrefs as `/{locale}/<key>`. Single source shared by header + mobile nav. */
export const NAV_KEYS = [
  "destinations",
  "packages",
  "experiences",
  "about",
] as const;

export type NavKey = (typeof NAV_KEYS)[number];
