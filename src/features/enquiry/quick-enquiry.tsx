"use client";

import { useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, MoveRight, Plane } from "lucide-react";

import { createBooking } from "@/lib/actions/forms";
import type { Destination } from "@/lib/data/types";
import { useI18n } from "@/lib/i18n/provider";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils/cn";

const inputClass =
  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const labelClass = "mb-1 block text-xs font-medium text-muted-foreground";

const GUESTS = Array.from({ length: 12 }, (_, i) => i + 1);

/**
 * Floating homepage enquiry card. A low-friction lead-capture that writes to the
 * same bookings pipeline (via createBooking) and, on success, plays a signature
 * plane-takeoff confirmation unique to this feature.
 */
export function QuickEnquiry({
  destinations,
}: {
  destinations: Destination[];
}) {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [pending, startTransition] = useTransition();
  const [reference, setReference] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const today = new Date().toISOString().slice(0, 10);
  const [destinationSlug, setDestinationSlug] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const valid =
    destinationSlug &&
    startDate &&
    endDate &&
    endDate > startDate &&
    customerName.trim().length >= 2 &&
    /.+@.+\..+/.test(customerEmail);

  function submit() {
    if (!valid) return;
    setError(false);
    startTransition(async () => {
      const res = await createBooking({
        destinationSlug,
        packageSlug: null,
        startDate,
        endDate,
        guests,
        budgetTier: "premium",
        customerName,
        customerEmail,
      });
      if (res.ok && res.reference) setReference(res.reference);
      else setError(true);
    });
  }

  function reset() {
    setReference(null);
    setDestinationSlug("");
    setStartDate("");
    setEndDate("");
    setGuests(2);
    setCustomerName("");
    setCustomerEmail("");
  }

  return (
    <section className="relative z-20 mx-auto -mt-16 max-w-5xl px-4 sm:-mt-24 sm:px-6">
      {/* Soft glow behind the card. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-8 -top-2 bottom-2 -z-10 rounded-[2rem] bg-gradient-to-r from-turquoise/25 via-ocean/15 to-sunset/25 blur-2xl"
      />

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 44 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ type: "spring", duration: 0.9, bounce: 0.28 }}
        className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/85 p-6 shadow-float backdrop-blur-xl sm:p-8"
      >
        <AnimatePresence mode="wait" initial={false}>
          {reference ? (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-4 text-center"
            >
              {/* Plane arcs across leaving a contrail, then the checkmark pops. */}
              <div className="relative mx-auto mb-5 h-16 w-full max-w-sm overflow-hidden">
                {!reduce && (
                  <motion.span
                    aria-hidden="true"
                    className="absolute top-1/2 left-0 text-primary"
                    initial={{ x: "-15%", y: 12, opacity: 0 }}
                    animate={{ x: "115%", y: -12, opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 1.6, ease: "easeInOut" }}
                  >
                    <Plane className="size-8 -rotate-[24deg]" />
                  </motion.span>
                )}
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center"
                  initial={reduce ? false : { scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: reduce ? 0 : 0.55,
                    type: "spring",
                    bounce: 0.5,
                  }}
                >
                  <span className="grid size-12 place-items-center rounded-full bg-turquoise/20 text-ocean">
                    <Check className="size-6" />
                  </span>
                </motion.span>
              </div>

              <h3 className="font-display text-fluid-xl text-navy">
                {t("sections.enquiry.successTitle")}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                {t("sections.enquiry.successBody")}
              </p>
              <p className="mt-5 inline-block rounded-full bg-secondary px-5 py-2 font-mono text-sm font-semibold text-secondary-foreground">
                {t("booking.reference")}: {reference}
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={reset}
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  {t("sections.enquiry.again")}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-turquoise">
                  {t("sections.enquiry.eyebrow")}
                </p>
                <h2 className="mt-1 font-display text-fluid-xl text-navy">
                  {t("sections.enquiry.title")}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("sections.enquiry.subtitle")}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <label className="block md:col-span-1">
                  <span className={labelClass}>
                    {t("sections.enquiry.destination")}
                  </span>
                  <select
                    value={destinationSlug}
                    onChange={(e) => setDestinationSlug(e.target.value)}
                    className={inputClass}
                  >
                    <option value="" disabled>
                      —
                    </option>
                    {destinations.map((d) => (
                      <option key={d.slug} value={d.slug}>
                        {d.name}
                      </option>
                    ))}
                    <option value="custom">
                      {t("sections.enquiry.anyDestination")}
                    </option>
                  </select>
                </label>

                <label className="block">
                  <span className={labelClass}>{t("booking.startDate")}</span>
                  <input
                    type="date"
                    min={today}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={inputClass}
                  />
                </label>

                <label className="block">
                  <span className={labelClass}>{t("booking.endDate")}</span>
                  <input
                    type="date"
                    min={startDate || today}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={inputClass}
                  />
                </label>

                <label className="block">
                  <span className={labelClass}>
                    {t("sections.enquiry.travellers")}
                  </span>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className={inputClass}
                  >
                    {GUESTS.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
                <label className="block">
                  <span className={labelClass}>{t("booking.name")}</span>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className={labelClass}>{t("booking.email")}</span>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className={inputClass}
                  />
                </label>

                <motion.button
                  type="button"
                  onClick={submit}
                  disabled={pending || !valid}
                  whileHover={reduce || !valid ? undefined : { scale: 1.03 }}
                  whileTap={reduce || !valid ? undefined : { scale: 0.97 }}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-float transition-opacity",
                    (pending || !valid) && "opacity-60",
                  )}
                >
                  {pending
                    ? t("sections.enquiry.sending")
                    : t("sections.enquiry.submit")}
                  {!pending && <MoveRight className="size-4" aria-hidden="true" />}
                </motion.button>
              </div>

              {error && (
                <p className="mt-3 text-sm text-destructive">
                  {t("sections.enquiry.error")}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
