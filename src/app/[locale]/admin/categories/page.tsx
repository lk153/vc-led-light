import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import { getAdminCategories } from "@/actions/admin";
import AdminCategories from "./admin-categories";

export default async function AdminCategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [dict, categories] = await Promise.all([
    getDictionary(locale as Locale),
    getAdminCategories(),
  ]);

  const serialized = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description || "",
    icon: c.icon || "",
    productCount: c._count.products,
  }));

  return <AdminCategories dict={dict} categories={serialized} />;
}
