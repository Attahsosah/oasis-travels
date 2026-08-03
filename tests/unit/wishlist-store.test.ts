import { beforeEach, describe, expect, it } from "vitest";

import { useWishlist } from "@/stores/wishlist-store";

describe("wishlist store", () => {
  beforeEach(() => useWishlist.getState().clear());

  it("toggles an item on and off", () => {
    useWishlist.getState().toggle({ kind: "destination", slug: "santorini" });
    expect(useWishlist.getState().has("destination", "santorini")).toBe(true);

    useWishlist.getState().toggle({ kind: "destination", slug: "santorini" });
    expect(useWishlist.getState().has("destination", "santorini")).toBe(false);
  });

  it("removes a specific item", () => {
    useWishlist.getState().toggle({ kind: "package", slug: "x" });
    useWishlist.getState().toggle({ kind: "package", slug: "y" });
    useWishlist.getState().remove("package", "x");

    expect(useWishlist.getState().has("package", "x")).toBe(false);
    expect(useWishlist.getState().has("package", "y")).toBe(true);
    expect(useWishlist.getState().items).toHaveLength(1);
  });
});
