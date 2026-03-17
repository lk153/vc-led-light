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
    role: u.role,
    accountType: u.accountType,
    membershipTier: u.membershipTier,
    rewardPoints: u.rewardPoints,
    createdAt: u.createdAt.toISOString(),
    orderCount: u._count.orders,
  }));

  return <AdminUsers dict={dict} users={serialized} />;
}
