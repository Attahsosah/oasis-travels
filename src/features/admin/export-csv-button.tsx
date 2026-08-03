"use client";

import { useI18n } from "@/lib/i18n/provider";

/** Client-side CSV export of already-fetched rows — no server round-trip. */
export function ExportCsvButton({
  rows,
  filename,
}: {
  rows: Record<string, unknown>[];
  filename: string;
}) {
  const { t } = useI18n();

  function download() {
    if (rows.length === 0) return;
    const headers = Object.keys(rows[0]!);
    const escape = (v: unknown) => {
      const s = v == null ? "" : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const csv = [
      headers.join(","),
      ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
    ].join("\n");

    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={download}
      disabled={rows.length === 0}
      className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-secondary disabled:opacity-50"
    >
      {t("admin.exportCsv")}
    </button>
  );
}
