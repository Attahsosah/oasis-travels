"use client";

import { useEffect, useState } from "react";

/**
 * Returns `false` on the server and first client render, then `true` after
 * mount. Used to gate rendering of client-only state (e.g. localStorage-backed
 * wishlist) so SSR markup matches the first client paint.
 */
export function useHasMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
