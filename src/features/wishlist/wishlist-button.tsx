"use client";

import { Heart } from "lucide-react";

import { useHasMounted } from "@/hooks/use-has-mounted";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils/cn";
import { useWishlist, type WishlistKind } from "@/stores/wishlist-store";

/** Save/unsave toggle backed by the persisted wishlist store. */
export function WishlistButton({
  kind,
  slug,
  className,
}: {
  kind: WishlistKind;
  slug: string;
  className?: string;
}) {
  const { t } = useI18n();
  const mounted = useHasMounted();
  const items = useWishlist((s) => s.items);
  const toggle = useWishlist((s) => s.toggle);
  const saved =
    mounted && items.some((i) => i.kind === kind && i.slug === slug);

  return (
    <button
      type="button"
      onClick={() => toggle({ kind, slug })}
      aria-pressed={saved}
      aria-label={saved ? t("wishlist.remove") : t("wishlist.add")}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-card/90 px-4 py-2 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:border-sunset",
        className,
      )}
    >
      <Heart
        className={cn("size-4", saved && "fill-sunset text-sunset")}
        aria-hidden="true"
      />
      {saved ? t("wishlist.saved") : t("wishlist.save")}
    </button>
  );
}
