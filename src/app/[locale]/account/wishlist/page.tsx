import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import WishlistContent from "./wishlist-content";

export default async function WishlistPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return <WishlistContent locale={locale} dict={dict} />;
}
