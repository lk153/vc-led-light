import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import OrdersContent from "./orders-content";

export default async function OrderHistoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return <OrdersContent locale={locale} dict={dict} />;
}
