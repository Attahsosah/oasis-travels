import { describe, expect, it } from "vitest";

import {
  bookingSchema,
  contactSchema,
  newsletterSchema,
} from "@/lib/validation/schemas";

describe("newsletterSchema", () => {
  it("accepts a valid email", () => {
    expect(
      newsletterSchema.safeParse({ email: "a@b.com", locale: "en" }).success,
    ).toBe(true);
  });

  it("rejects a bad email", () => {
    expect(
      newsletterSchema.safeParse({ email: "nope", locale: "en" }).success,
    ).toBe(false);
  });
});

describe("contactSchema", () => {
  it("accepts a complete message", () => {
    expect(
      contactSchema.safeParse({
        name: "Jo",
        email: "a@b.com",
        subject: "Hi",
        message: "Hello there, this is long enough.",
      }).success,
    ).toBe(true);
  });

  it("rejects an empty name / short message", () => {
    expect(
      contactSchema.safeParse({
        name: "",
        email: "a@b.com",
        subject: "Hi",
        message: "short",
      }).success,
    ).toBe(false);
  });
});

describe("bookingSchema", () => {
  const base = {
    destinationSlug: "santorini",
    packageSlug: null,
    startDate: "2030-01-01",
    endDate: "2030-01-05",
    guests: 2,
    budgetTier: "premium" as const,
  };

  it("accepts a valid booking", () => {
    expect(bookingSchema.safeParse(base).success).toBe(true);
  });

  it("rejects an end date before the start", () => {
    expect(
      bookingSchema.safeParse({ ...base, endDate: "2029-12-31" }).success,
    ).toBe(false);
  });

  it("rejects out-of-range guests", () => {
    expect(bookingSchema.safeParse({ ...base, guests: 20 }).success).toBe(false);
  });

  it("rejects an unknown budget tier", () => {
    expect(
      bookingSchema.safeParse({ ...base, budgetTier: "gold" }).success,
    ).toBe(false);
  });
});
