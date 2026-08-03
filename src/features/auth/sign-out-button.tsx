"use client";

import { signOut } from "@/lib/actions/auth";
import { useWishlist } from "@/stores/wishlist-store";

/**
 * Sign-out form button. Clears the local (browser-scoped) wishlist on submit so
 * a signed-in user's saves don't linger for the next person on the same device.
 */
export function SignOutButton({
  locale,
  label,
}: {
  locale: string;
  label: string;
}) {
  return (
    <form action={signOut} onSubmit={() => useWishlist.getState().clear()}>
      <input type="hidden" name="locale" value={locale} />
      <button
        type="submit"
        className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
      >
        {label}
      </button>
    </form>
  );
}
