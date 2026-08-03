"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { updateBookingStatus } from "@/lib/actions/admin";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils/cn";

const BADGE: Record<string, string> = {
  pending: "bg-sunset/15 text-sunset",
  confirmed: "bg-turquoise/20 text-ocean",
  cancelled: "bg-destructive/15 text-destructive",
};

export function BookingStatusControl({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const { t } = useI18n();
  const [current, setCurrent] = useState(status);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const statusLabel = (s: string) =>
    s === "confirmed"
      ? t("admin.statusConfirmed")
      : s === "cancelled"
        ? t("admin.statusCancelled")
        : t("admin.statusPending");

  function set(next: string) {
    startTransition(async () => {
      const res = await updateBookingStatus(id, next);
      if (res.ok) {
        setCurrent(next);
        router.refresh();
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "rounded-full px-2.5 py-0.5 text-xs font-semibold",
          BADGE[current] ?? "bg-secondary text-muted-foreground",
        )}
      >
        {statusLabel(current)}
      </span>
      {current !== "confirmed" && (
        <button
          type="button"
          onClick={() => set("confirmed")}
          disabled={pending}
          className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium hover:bg-secondary disabled:opacity-50"
        >
          {t("admin.confirm")}
        </button>
      )}
      {current !== "cancelled" && (
        <button
          type="button"
          onClick={() => set("cancelled")}
          disabled={pending}
          className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium hover:bg-secondary disabled:opacity-50"
        >
          {t("admin.cancel")}
        </button>
      )}
    </div>
  );
}
