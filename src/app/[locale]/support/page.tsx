import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import SupportContent from "./support-content";

export default async function SupportPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return <SupportContent locale={locale} dict={dict} />;
}
