import { redirect } from "next/navigation";
import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCart } from "@/actions/cart";
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
  const [dict, addresses, cart] = await Promise.all([
    getDictionary(locale as Locale),
    prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: { isDefault: "desc" },
    }),
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
    <ShippingContent
      locale={locale}
      dict={dict}
      savedAddresses={addresses.map((a) => ({
        id: a.id,
        label: a.label,
        firstName: a.firstName,
        lastName: a.lastName,
        street: a.street,
        apartment: a.apartment ?? "",
        city: a.city,
        state: a.state,
        zipCode: a.zipCode,
        phone: a.phone ?? "",
      }))}
      cartItems={cart.items}
      subtotal={subtotal}
      shippingCost={shippingCost}
      tax={tax}
      total={total}
    />
  );
}
