import { describe, expect, it } from "vitest";

import { formatPrice } from "@/lib/utils/format";

describe("formatPrice", () => {
  it("formats EUR for en with no decimals", () => {
    const s = formatPrice(3200, "EUR", "en");
    expect(s).toMatch(/3,200/);
    expect(s).toContain("€");
    expect(s).not.toContain(".00");
  });

  it("formats for the fr locale", () => {
    const s = formatPrice(3200, "EUR", "fr");
    // fr-FR groups with (non-breaking) spaces.
    expect(s.replace(/\s/g, "")).toContain("3200");
  });
});
