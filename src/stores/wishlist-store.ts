import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WishlistKind = "destination" | "package";

export interface WishlistItem {
  kind: WishlistKind;
  slug: string;
}

interface WishlistState {
  items: WishlistItem[];
  toggle: (item: WishlistItem) => void;
  remove: (kind: WishlistKind, slug: string) => void;
  has: (kind: WishlistKind, slug: string) => boolean;
  clear: () => void;
}

const same = (a: WishlistItem, kind: WishlistKind, slug: string) =>
  a.kind === kind && a.slug === slug;

/**
 * Client-global wishlist. Persisted to localStorage so saves survive reloads
 * (a Supabase-backed sync for signed-in users lands in Phase 8). Components
 * must guard first render with `useHasMounted` to avoid hydration mismatches.
 */
export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (item) => {
        const exists = get().items.some((i) =>
          same(i, item.kind, item.slug),
        );
        set({
          items: exists
            ? get().items.filter((i) => !same(i, item.kind, item.slug))
            : [...get().items, item],
        });
      },
      remove: (kind, slug) =>
        set({ items: get().items.filter((i) => !same(i, kind, slug)) }),
      has: (kind, slug) => get().items.some((i) => same(i, kind, slug)),
      clear: () => set({ items: [] }),
    }),
    { name: "az-wishlist" },
  ),
);
