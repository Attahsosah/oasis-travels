import { notFound } from "next/navigation";

import { AboutUs } from "@/features/about/about-us";
import { WhyChooseUs } from "@/features/why-choose-us/why-choose-us";
import { isLocale } from "@/lib/i18n/config";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <div className="pt-24">
      <AboutUs locale={locale} />
      <WhyChooseUs locale={locale} />
    </div>
  );
}
