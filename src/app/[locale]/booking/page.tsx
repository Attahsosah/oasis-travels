import { Suspense } from "react";
import { notFound } from "next/navigation";

import { BookingWizard } from "@/features/booking/booking-wizard";
import { getContentRepository } from "@/lib/data/repository";
import { isLocale } from "@/lib/i18n/config";

export default async function BookingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const repo = getContentRepository();
  const [destinations, packages] = await Promise.all([
    repo.getDestinations(),
    repo.getPackages(),
  ]);

  return (
    <Suspense fallback={<div className="min-h-dvh" />}>
      <BookingWizard
        locale={locale}
        destinations={destinations}
        packages={packages}
      />
    </Suspense>
  );
}
