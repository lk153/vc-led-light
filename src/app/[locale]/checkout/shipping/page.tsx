import { redirect } from "next/navigation";
import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import { auth } from "@/lib/auth";
import ShippingContent from "./shipping-content";

export default async function ShippingPage({
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
  return <ShippingContent locale={locale} dict={dict} />;
}
