import { beforeEach, describe, expect, it } from "vitest";

import { useBookingDraft } from "@/stores/booking-store";

describe("booking draft store", () => {
  beforeEach(() => useBookingDraft.getState().reset());

  it("patches fields via set()", () => {
    useBookingDraft.getState().set({ destinationSlug: "bali", guests: 4 });
    expect(useBookingDraft.getState().destinationSlug).toBe("bali");
    expect(useBookingDraft.getState().guests).toBe(4);
  });

  it("resets to defaults", () => {
    useBookingDraft.getState().set({ destinationSlug: "bali", guests: 6 });
    useBookingDraft.getState().reset();
    expect(useBookingDraft.getState().destinationSlug).toBeNull();
    expect(useBookingDraft.getState().guests).toBe(2);
  });
});
