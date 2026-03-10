import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import ShippingContent from "./shipping-content";

export default async function ShippingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return <ShippingContent locale={locale} dict={dict} />;
}
