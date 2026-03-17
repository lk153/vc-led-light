import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import { getAdminUsers } from "@/actions/admin";
import AdminUsers from "./admin-users";

export default async function AdminUsersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [dict, users] = await Promise.all([
    getDictionary(locale as Locale),
    getAdminUsers(),
  ]);

  const serialized = users.map((u) => ({
    id: u.id,
    name: u.name || "N/A",
    email: u.email,
    phone: u.phone || null,
    role: u.role,
    accountType: u.accountType,
    membershipTier: u.membershipTier,
    rewardPoints: u.rewardPoints,
    createdAt: u.createdAt.toISOString(),
    orderCount: u._count.orders,
    wishlistCount: u._count.wishlistItems,
    reviewCount: u._count.reviews,
    addresses: u.addresses.map((a) => ({
      label: a.label,
      firstName: a.firstName,
      lastName: a.lastName,
      street: a.street,
      city: a.city,
      state: a.state,
      zipCode: a.zipCode,
      country: a.country,
      phone: a.phone,
      isDefault: a.isDefault,
    })),
    recentOrders: u.orders.map((o) => ({
      orderNumber: o.orderNumber,
      status: o.status,
      total: Number(o.total),
      createdAt: o.createdAt.toISOString(),
    })),
  }));

  return <AdminUsers dict={dict} users={serialized} />;
}
