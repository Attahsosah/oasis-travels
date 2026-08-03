"use client";

import { Heart } from "lucide-react";

import { TransitionLink } from "@/features/transitions/transition-link";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { useI18n } from "@/lib/i18n/provider";
import { useWishlist } from "@/stores/wishlist-store";

/** Header wishlist link with a saved-count badge. */
export function WishlistIndicator() {
  const { locale, t } = useI18n();
  const mounted = useHasMounted();
  const count = useWishlist((s) => s.items.length);
  const shown = mounted ? count : 0;

  return (
    <TransitionLink
      href={`/${locale}/wishlist`}
      aria-label={t("wishlist.title")}
      className="relative inline-flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-card"
    >
      <Heart className="size-5" aria-hidden="true" />
      {shown > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-sunset text-[10px] font-bold text-white">
          {shown}
        </span>
      )}
    </TransitionLink>
  );
}
