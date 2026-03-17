import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import { getAdminProducts, getAdminCategories } from "@/actions/admin";
import AdminCatalog from "./admin-catalog";

export default async function AdminCatalogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [dict, products, categories] = await Promise.all([
    getDictionary(locale as Locale),
    getAdminProducts(),
    getAdminCategories(),
  ]);

  const serializedProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description || "",
    shortDescription: p.shortDescription || "",
    sku: p.sku,
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
    stock: p.stock,
    categoryId: p.categoryId,
    categoryName: p.category.name,
    brand: p.brand || "",
    featured: p.featured,
    wattage: p.wattage,
    lumens: p.lumens,
    colorTemperature: p.colorTemperature || "",
    lifespan: p.lifespan,
    cri: p.cri,
    imageUrl: p.images[0]?.url || null,
  }));

  const serializedCategories = categories.map((c) => ({
    id: c.id,
    name: c.name,
  }));

  return (
    <AdminCatalog
      dict={dict}
      products={serializedProducts}
      categories={serializedCategories}
    />
  );
}
