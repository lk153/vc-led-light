import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import { getCart } from "@/actions/cart";
import CartContent from "./cart-content";

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [dict, cart] = await Promise.all([
    getDictionary(locale as Locale),
    getCart(),
  ]);

  return <CartContent locale={locale} dict={dict} initialItems={cart.items} />;
}
