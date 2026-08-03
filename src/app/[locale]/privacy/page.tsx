import { notFound } from "next/navigation";

import { LegalPage } from "@/features/legal/legal-page";
import { isLocale } from "@/lib/i18n/config";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <LegalPage locale={locale} slug="privacy" />;
}
