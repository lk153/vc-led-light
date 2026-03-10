import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import BillingContent from "./billing-content";

export default async function BillingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return <BillingContent locale={locale} dict={dict} />;
}
