import type { Metadata } from "next";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/product/product-card";
import ProductFilters from "@/components/product/product-filters";
import SortDropdown from "@/components/product/sort-dropdown";
import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import { getWishlistProductIds } from "@/actions/wishlist";

const PRODUCTS_PER_PAGE = 12;

type SortOption = "featured" | "price-asc" | "price-desc" | "newest" | "rating";

function getSortOrder(sort: SortOption): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case "price-asc":
      return { price: "asc" };
    case "price-desc":
      return { price: "desc" };
    case "newest":
      return { createdAt: "desc" };
    case "rating":
      return { rating: "desc" };
    case "featured":
    default:
      return { featured: "desc" };
  }
}

type SearchParams = Promise<{
  q?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  page?: string;
}>;

export default async function ProductSearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: SearchParams;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const sp = await searchParams;
  const query = sp.q || "";
  const categorySlug = sp.category;
  const minPrice = sp.minPrice ? parseFloat(sp.minPrice) : undefined;
  const maxPrice = sp.maxPrice ? parseFloat(sp.maxPrice) : undefined;
  const sort = (sp.sort as SortOption) || "featured";
  const page = Math.max(1, parseInt(sp.page || "1", 10));

  // Build Prisma where clause
  const where: Prisma.ProductWhereInput = {};

  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
      { shortDescription: { contains: query, mode: "insensitive" } },
      { brand: { contains: query, mode: "insensitive" } },
    ];
  }

  if (categorySlug && categorySlug !== "all") {
    where.category = { slug: categorySlug };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  // Fetch products, count, and categories in parallel
  const [products, totalCount, categories, wishlistIds] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: getSortOrder(sort),
      skip: (page - 1) * PRODUCTS_PER_PAGE,
      take: PRODUCTS_PER_PAGE,
      include: {
        images: {
          orderBy: { position: "asc" },
          take: 1,
        },
        category: true,
        translations: {
          where: { locale },
          take: 1,
        },
      },
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { products: true } },
      },
    }),
    getWishlistProductIds(),
  ]);

  const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);

  // Determine active category name for breadcrumb (use translated name if available)
  const categoryNames = dict.productSearch.categoryNames as Record<string, string>;
  const activeCategoryName = categorySlug
    ? categoryNames[categorySlug] || categories.find((c) => c.slug === categorySlug)?.name
    : null;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-primary transition-colors">
          {dict.common.home}
        </Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        {activeCategoryName ? (
          <>
            <Link
              href={`/${locale}/products`}
              className="hover:text-primary transition-colors"
            >
              {dict.common.products}
            </Link>
            <span className="material-symbols-outlined text-sm">
              chevron_right
            </span>
            <span className="text-slate-900 dark:text-white font-medium">
              {activeCategoryName}
            </span>
          </>
        ) : (
          <span className="text-slate-900 dark:text-white font-medium">
            {dict.common.products}
          </span>
        )}
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <ProductFilters
          categories={categories}
          currentCategory={categorySlug}
          currentMinPrice={sp.minPrice}
          currentMaxPrice={sp.maxPrice}
          locale={locale}
          dict={{
            filters: dict.productSearch.filters,
            priceRange: dict.productSearch.priceRange,
            minPlaceholder: dict.productSearch.minPlaceholder,
            maxPlaceholder: dict.productSearch.maxPlaceholder,
            applyPrice: dict.productSearch.applyPrice,
            category: dict.productSearch.category,
            categoryNames: dict.productSearch.categoryNames,
          }}
        />

        {/* Main Results Area */}
        <div className="flex-1">
          {/* Sorting and Results Count Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 mb-6 gap-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {dict.common.showing}{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                {totalCount}
              </span>{" "}
              {totalCount !== 1 ? dict.common.results : dict.common.result}
              {query && (
                <>
                  {" "}
                  {dict.common.for} <span className="italic">&quot;{query}&quot;</span>
                </>
              )}
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">{dict.common.sortBy}</span>
                <SortDropdown
                  currentSort={sort}
                  locale={locale}
                  dict={{
                    sortFeatured: dict.productSearch.sortFeatured,
                    sortPriceLowHigh: dict.productSearch.sortPriceLowHigh,
                    sortPriceHighLow: dict.productSearch.sortPriceHighLow,
                    sortNewest: dict.productSearch.sortNewest,
                    sortTopRated: dict.productSearch.sortTopRated,
                    sortProducts: dict.productSearch.sortProducts,
                  }}
                />
              </div>
              <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-700" />
              <div className="flex items-center gap-2">
                <button className="p-1.5 text-primary bg-primary/10 rounded-md">
                  <span className="material-symbols-outlined text-xl">
                    grid_view
                  </span>
                </button>
                <button className="p-1.5 text-slate-400 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-xl">
                    view_list
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => {
                const t = product.translations[0];
                return (
                <ProductCard
                  key={product.id}
                  productId={product.id}
                  slug={product.slug}
                  name={t?.name ?? product.name}
                  shortDescription={t?.shortDescription ?? product.shortDescription}
                  price={Number(product.price)}
                  compareAtPrice={product.compareAtPrice ? Number(product.compareAtPrice) : null}
                  rating={Number(product.rating)}
                  reviewCount={product.reviewCount}
                  featured={product.featured}
                  stock={product.stock}
                  imageUrl={product.images[0]?.url || null}
                  imageAlt={product.images[0]?.alt || null}
                  isInWishlist={wishlistIds.includes(product.id)}
                  locale={locale}
                  dict={{
                    sale: dict.common.sale,
                    bestSeller: dict.common.bestSeller,
                    outOfStock: dict.common.outOfStock,
                    addToCart: dict.common.addToCart,
                    addToWishlist: dict.productDetail.addToWishlist,
                  }}
                />
              ); })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">
                search_off
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {dict.productSearch.noProductsFound}
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                {dict.productSearch.noProductsHint}
              </p>
              <Link
                href={`/${locale}/products`}
                className="px-6 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors"
              >
                {dict.productSearch.clearFilters}
              </Link>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              baseParams={sp}
              locale={locale}
            />
          )}
        </div>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Pagination (Server Component)                                       */
/* ------------------------------------------------------------------ */

function Pagination({
  currentPage,
  totalPages,
  baseParams,
  locale,
}: {
  currentPage: number;
  totalPages: number;
  baseParams: {
    q?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  };
  locale: string;
}) {
  function buildPageUrl(pageNum: number): string {
    const p = new URLSearchParams();
    if (baseParams.q) p.set("q", baseParams.q);
    if (baseParams.category) p.set("category", baseParams.category);
    if (baseParams.minPrice) p.set("minPrice", baseParams.minPrice);
    if (baseParams.maxPrice) p.set("maxPrice", baseParams.maxPrice);
    if (baseParams.sort && baseParams.sort !== "featured")
      p.set("sort", baseParams.sort);
    if (pageNum > 1) p.set("page", String(pageNum));
    const qs = p.toString();
    return `/${locale}/products${qs ? `?${qs}` : ""}`;
  }

  // Determine which page numbers to show
  const pages: (number | "ellipsis")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("ellipsis");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("ellipsis");
    pages.push(totalPages);
  }

  const disabledClasses =
    "w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed";
  const linkClasses =
    "w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:border-primary text-slate-600 dark:text-slate-400 transition-colors";
  const activeClasses =
    "w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-white font-bold";

  return (
    <div className="mt-12 flex justify-center">
      <nav className="flex items-center gap-2">
        {/* Previous */}
        {currentPage > 1 ? (
          <Link href={buildPageUrl(currentPage - 1)} className={linkClasses}>
            <span className="material-symbols-outlined">chevron_left</span>
          </Link>
        ) : (
          <span className={disabledClasses}>
            <span className="material-symbols-outlined">chevron_left</span>
          </span>
        )}

        {/* Page Numbers */}
        {pages.map((p, idx) =>
          p === "ellipsis" ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-slate-400">
              ...
            </span>
          ) : p === currentPage ? (
            <span key={p} className={activeClasses}>
              {p}
            </span>
          ) : (
            <Link key={p} href={buildPageUrl(p)} className={linkClasses}>
              {p}
            </Link>
          ),
        )}

        {/* Next */}
        {currentPage < totalPages ? (
          <Link href={buildPageUrl(currentPage + 1)} className={linkClasses}>
            <span className="material-symbols-outlined">chevron_right</span>
          </Link>
        ) : (
          <span className={disabledClasses}>
            <span className="material-symbols-outlined">chevron_right</span>
          </span>
        )}
      </nav>
    </div>
  );
}
