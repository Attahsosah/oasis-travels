import { z } from "zod";

/** Shared form-submission state for `useActionState`. */
export type FormState = { ok: boolean; error?: string };

export const newsletterSchema = z.object({
  email: z.email(),
  locale: z.string().min(2),
});

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  subject: z.string().min(2),
  message: z.string().min(10),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type ContactInput = z.infer<typeof contactSchema>;

export const budgetTiers = ["comfort", "premium", "ultra"] as const;

export const bookingSchema = z
  .object({
    destinationSlug: z.string().min(1),
    packageSlug: z.string().nullable(),
    startDate: z.string().min(1),
    endDate: z.string().min(1),
    guests: z.number().int().min(1).max(12),
    budgetTier: z.enum(budgetTiers),
    customerName: z.string().min(2),
    customerEmail: z.email(),
  })
  .refine((v) => v.endDate > v.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export type BookingInput = z.infer<typeof bookingSchema>;

