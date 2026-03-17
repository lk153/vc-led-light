import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import { getAdminOrders } from "@/actions/admin";
import AdminOrders from "./admin-orders";

export default async function AdminOrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [dict, orders] = await Promise.all([
    getDictionary(locale as Locale),
    getAdminOrders(),
  ]);

  const serialized = orders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    status: o.status,
    total: Number(o.total),
    subtotal: Number(o.subtotal),
    shippingCost: Number(o.shippingCost),
    tax: Number(o.tax),
    discount: Number(o.discount),
    promoCode: o.promoCode,
    paymentMethod: o.paymentMethod,
    paymentLast4: o.paymentLast4,
    shippingName: o.shippingName,
    shippingStreet: o.shippingStreet,
    shippingCity: o.shippingCity,
    shippingState: o.shippingState,
    shippingZip: o.shippingZip,
    shippingCountry: o.shippingCountry,
    billingName: o.billingName,
    billingStreet: o.billingStreet,
    billingCity: o.billingCity,
    billingState: o.billingState,
    billingZip: o.billingZip,
    billingCountry: o.billingCountry,
    createdAt: o.createdAt.toISOString(),
    customerName: o.user.name || "N/A",
    customerEmail: o.user.email,
    items: o.items.map((i) => ({
      id: i.id,
      name: i.name,
      price: Number(i.price),
      quantity: i.quantity,
      imageUrl: i.imageUrl,
    })),
  }));

  return <AdminOrders dict={dict} orders={serialized} />;
}
