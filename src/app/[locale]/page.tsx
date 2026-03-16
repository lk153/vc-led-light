import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import AddToCartButton from "@/components/cart/add-to-cart-button";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [dict, featuredProducts, dbCategories] = await Promise.all([
    getDictionary(locale as Locale),
    prisma.product.findMany({
      where: { featured: true },
      include: {
        images: { take: 1, orderBy: { position: "asc" } },
        translations: { where: { locale }, take: 1 },
      },
      take: 4,
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  const categoryNameMap: Record<string, string> = {
    "indoor-lighting": dict.home.categories.indoorLighting,
    "smart-lighting": dict.home.categories.smartLighting,
    "outdoor-lighting": dict.home.categories.outdoorLighting,
    "decorative-lighting": dict.home.categories.decorativeLighting,
  };
  const categoryDescMap: Record<string, string> = {
    "indoor-lighting": dict.home.categories.indoorLightingDesc,
    "smart-lighting": dict.home.categories.smartLightingDesc,
    "outdoor-lighting": dict.home.categories.outdoorLightingDesc,
    "decorative-lighting": dict.home.categories.decorativeLightingDesc,
  };
  const categoryIconMap: Record<string, string> = {
    "indoor-lighting": "light",
    "smart-lighting": "smart_toy",
    "outdoor-lighting": "deck",
    "decorative-lighting": "lightbulb",
  };

  const categories = dbCategories.map((cat) => ({
    name: categoryNameMap[cat.slug] ?? cat.name,
    slug: cat.slug,
    description: categoryDescMap[cat.slug] ?? cat.description ?? "",
    icon: categoryIconMap[cat.slug] ?? cat.icon ?? "lightbulb",
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Hero */}
      <div
        className="relative flex min-h-[520px] flex-col items-start justify-center overflow-hidden rounded-xl bg-cover bg-center px-8 lg:px-20"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(16,25,34,0.8) 0%, rgba(16,25,34,0.2) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCstwwIAE0LskDuXSjSTP6jWQ3fRTN_JUP0QdrrhRtBu8xudBzLqEmDTK_AGZqztSPZ3OKtTxpTJBPgz-a9AElLvg2XV4wXVzSuiZe0Pi20TgKnj6BtKpWd7d3nKybL4tWra2_P6rHzXRxv0GudUzaIWk4TgKhlETgh56AdWasYsYq3pEDuL4Q_-LhfFP9MXs0L05PdcZlIrDDcMya3yEtXfKEToSAHqsg3DSt86DTO02o5ZPIz1VbiF7uZHCbI5vJxuQfYZQwBDBQY")`,
        }}
      >
        <div className="z-10 flex max-w-xl flex-col gap-4">
          <span className="text-sm font-bold uppercase tracking-widest text-primary">
            {dict.home.heroTagline}
          </span>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-white lg:text-6xl">
            {dict.home.heroTitle} <span className="text-primary">{dict.home.heroTitleHighlight}</span>
          </h1>
          <p className="max-w-md text-lg text-slate-300">
            {dict.home.heroDescription}
          </p>
          <div className="mt-4 flex gap-4">
            <Link
              href={`/${locale}/products`}
              className="flex min-w-[140px] items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-bold text-white hover:scale-105 transition-transform"
            >
              {dict.home.shopNow}
            </Link>
            <Link
              href={`/${locale}/products?sort=newest`}
              className="flex min-w-[140px] items-center justify-center rounded-lg border border-white/30 px-6 py-3 text-base font-bold text-white hover:bg-white/10 transition-colors"
            >
              {dict.home.viewDeals}
            </Link>
          </div>
        </div>
      </div>

      {/* Categories */}
      <section className="mt-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">
            {dict.home.shopByCategory}
          </h2>
          <Link
            href={`/${locale}/products`}
            className="flex items-center gap-1 font-semibold text-primary hover:underline"
          >
            {dict.common.viewAll}
            <span className="material-symbols-outlined text-sm">
              arrow_forward
            </span>
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${locale}/products?category=${cat.slug}`}
              className="group flex flex-col gap-4 rounded-xl border border-primary/10 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-3xl">
                  {cat.icon}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{cat.name}</h3>
                <p className="text-sm text-slate-500">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="mt-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">
            {dict.home.featuredProducts}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => {
            const t = product.translations[0];
            const price = Number(product.price);
            const compareAt = product.compareAtPrice
              ? Number(product.compareAtPrice)
              : null;
            const imageUrl = product.images[0]?.url;

            return (
              <Link
                key={product.id}
                href={`/${locale}/products/${product.slug}`}
                className="group overflow-hidden rounded-xl border border-primary/10 bg-white transition-all hover:shadow-2xl"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={t?.name ?? product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-300">
                      <span className="material-symbols-outlined text-6xl">image</span>
                    </div>
                  )}
                  {compareAt && compareAt > price && (
                    <span className="absolute left-3 top-3 rounded-full bg-primary px-2 py-1 text-[10px] font-bold uppercase text-white">
                      {dict.common.sale}
                    </span>
                  )}
                  {product.featured && !compareAt && (
                    <span className="absolute left-3 top-3 rounded-full bg-emerald-500 px-2 py-1 text-[10px] font-bold uppercase text-white">
                      {dict.common.featured}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs font-medium uppercase text-slate-500">
                    {product.brand || "LuminaLED"}
                  </p>
                  <h3 className="truncate text-lg font-bold text-slate-900">
                    {t?.name ?? product.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-primary">
                      {formatCurrency(price)}
                    </span>
                    {compareAt && compareAt > price && (
                      <span className="text-sm text-slate-400 line-through">
                        {formatCurrency(compareAt)}
                      </span>
                    )}
                  </div>
                  <AddToCartButton
                    productId={product.id}
                    label={dict.common.addToCart}
                    variant="compact"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Promo Banners */}
      <section className="mb-16 mt-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="group relative overflow-hidden rounded-2xl bg-primary/5 p-8 lg:p-12">
            <div className="relative z-10">
              <h2 className="mb-4 text-3xl font-black text-slate-900">
                {dict.home.newArrivalsTitle}
                <br />
                {dict.home.newArrivalsSeason}
              </h2>
              <p className="mb-8 max-w-sm text-slate-600">
                {dict.home.newArrivalsDescription}
              </p>
              <Link
                href={`/${locale}/products?sort=newest`}
                className="rounded-lg bg-primary px-8 py-3 font-bold text-white hover:scale-105 transition-transform inline-block"
              >
                {dict.home.exploreSeries}
              </Link>
            </div>
            <span className="material-symbols-outlined absolute -bottom-10 -right-10 text-[180px] text-primary/10 group-hover:rotate-12 transition-transform duration-700">
              lightbulb
            </span>
          </div>
          <div className="group relative overflow-hidden rounded-2xl bg-slate-900 p-8 lg:p-12">
            <div className="relative z-10">
              <h2 className="mb-4 text-3xl font-black text-white">
                {dict.home.industrialTitle}
                <br />
                {dict.home.industrialSubtitle}
              </h2>
              <p className="mb-8 max-w-sm text-slate-400">
                {dict.home.industrialDescription}
              </p>
              <Link
                href={`/${locale}/products?category=outdoor-lighting`}
                className="rounded-lg bg-white px-8 py-3 font-bold text-slate-900 hover:scale-105 transition-transform inline-block"
              >
                {dict.home.bulkOrders}
              </Link>
            </div>
            <span className="material-symbols-outlined absolute -bottom-10 -right-10 text-[180px] text-white/5 group-hover:scale-110 transition-transform duration-700">
              bolt
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
