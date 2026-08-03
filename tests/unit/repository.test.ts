import { describe, expect, it } from "vitest";

import { getContentRepository } from "@/lib/data/repository";

const repo = getContentRepository();

describe("content repository (local adapter)", () => {
  it("returns destinations", async () => {
    expect((await repo.getDestinations()).length).toBeGreaterThan(0);
  });

  it("finds a destination by slug", async () => {
    expect((await repo.getDestinationBySlug("santorini"))?.name).toBe(
      "Santorini",
    );
  });

  it("returns null for an unknown slug", async () => {
    expect(await repo.getDestinationBySlug("does-not-exist")).toBeNull();
  });

  it("featured destinations are a valid subset", async () => {
    const [all, featured] = await Promise.all([
      repo.getDestinations(),
      repo.getFeaturedDestinations(),
    ]);
    expect(featured.length).toBeLessThanOrEqual(all.length);
    expect(featured.every((d) => d.featured)).toBe(true);
  });

  it("finds a package by slug", async () => {
    expect(
      await repo.getPackageBySlug("santorini-caldera-escape"),
    ).not.toBeNull();
  });
});
