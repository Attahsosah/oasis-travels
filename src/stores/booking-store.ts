import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { BudgetTier } from "@/lib/data/types";

interface BookingDraftState {
  destinationSlug: string | null;
  packageSlug: string | null;
  startDate: string | null;
  endDate: string | null;
  guests: number;
  budgetTier: BudgetTier | null;
  customerName: string;
  customerEmail: string;
  set: (patch: Partial<BookingDraftData>) => void;
  reset: () => void;
}

type BookingDraftData = Omit<BookingDraftState, "set" | "reset">;

const initial: BookingDraftData = {
  destinationSlug: null,
  packageSlug: null,
  startDate: null,
  endDate: null,
  guests: 2,
  budgetTier: null,
  customerName: "",
  customerEmail: "",
};

/**
 * Booking wizard draft. Persisted to `sessionStorage` so a refresh mid-flow
 * keeps progress, but it doesn't linger across sessions. `partialize` keeps the
 * store actions out of storage.
 */
export const useBookingDraft = create<BookingDraftState>()(
  persist(
    (set) => ({
      ...initial,
      set: (patch) => set(patch),
      reset: () => set(initial),
    }),
    {
      name: "az-booking-draft",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s): BookingDraftData => ({
        destinationSlug: s.destinationSlug,
        packageSlug: s.packageSlug,
        startDate: s.startDate,
        endDate: s.endDate,
        guests: s.guests,
        budgetTier: s.budgetTier,
        customerName: s.customerName,
        customerEmail: s.customerEmail,
      }),
    },
  ),
);
