import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import PaymentContent from "./payment-content";

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return <PaymentContent locale={locale} dict={dict} />;
}
