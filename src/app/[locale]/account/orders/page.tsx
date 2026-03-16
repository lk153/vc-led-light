import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import OrdersContent from "./orders-content";

export type SerializedOrder = {
  id: string;
  date: string;
  total: number;
  shipTo: string;
  status: "delivered" | "shipped" | "processing";
  items: {
    name: string;
    quantity: number;
    price: number;
    imageUrl: string | null;
  }[];
};

export default async function OrderHistoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/${locale}/login`);
  }

  const [dict, orders] = await Promise.all([
    getDictionary(locale as Locale),
    prisma.order.findMany({
      where: { userId: session.user.id },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const serializedOrders: SerializedOrder[] = orders.map((order) => ({
    id: order.orderNumber,
    date: order.createdAt.toISOString(),
    total: Number(order.total),
    shipTo: order.shippingName,
    status: order.status as "delivered" | "shipped" | "processing",
    items: order.items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: Number(item.price),
      imageUrl: item.imageUrl,
    })),
  }));

  return (
    <OrdersContent dict={dict} orders={serializedOrders} />
  );
}
