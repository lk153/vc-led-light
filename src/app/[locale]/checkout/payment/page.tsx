import { redirect } from "next/navigation";
import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import { auth } from "@/lib/auth";
import { getCart } from "@/actions/cart";
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
  const [dict, cart] = await Promise.all([
    getDictionary(locale as Locale),
    getCart(),
  ]);
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingCost = Math.round(subtotal * 0.1);
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shippingCost + tax;

  return (
    <PaymentContent
      locale={locale}
      dict={dict}
      cartItems={cart.items}
      subtotal={subtotal}
      shippingCost={shippingCost}
      tax={tax}
      total={total}
    />
  );
}
