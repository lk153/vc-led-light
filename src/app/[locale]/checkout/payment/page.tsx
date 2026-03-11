import { redirect } from "next/navigation";
import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import { auth } from "@/lib/auth";
import PaymentContent from "./payment-content";

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/${locale}/login`);
  }
  const dict = await getDictionary(locale as Locale);
  return <PaymentContent locale={locale} dict={dict} />;
}
