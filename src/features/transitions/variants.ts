/**
 * Cinematic transition variants. Each is a full-screen overlay that covers the
 * viewport, the route swaps underneath, then it reveals the new page. Kept to a
 * small, curated set per the plan (≤ 3–5, each < ~1.2s).
 */
export const TRANSITION_VARIANTS = [
  "sunrise",
  "clouds",
  "ocean",
  "airplane",
] as const;

export type TransitionVariant = (typeof TRANSITION_VARIANTS)[number];

/** Pick the next variant in a stable rotation so consecutive navigations vary. */
export function nextVariant(index: number): TransitionVariant {
  return TRANSITION_VARIANTS[index % TRANSITION_VARIANTS.length]!;
}
