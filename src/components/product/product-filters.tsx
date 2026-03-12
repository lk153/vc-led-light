"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type Category = {
  id: string;
  name: string;
  slug: string;
  _count: { products: number };
};

type ProductFiltersProps = {
  categories: Category[];
  currentCategory: string | undefined;
  currentMinPrice: string | undefined;
  currentMaxPrice: string | undefined;
  locale: string;
  dict: {
    filters: string;
    priceRange: string;
    minPlaceholder: string;
    maxPlaceholder: string;
    applyPrice: string;
    category: string;
    categoryNames: Record<string, string>;
  };
};

export default function ProductFilters({
  categories,
  currentCategory,
  currentMinPrice,
  currentMaxPrice,
  locale,
  dict,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      // Reset to page 1 when filters change
      params.delete("page");
      return params.toString();
    },
    [searchParams],
  );

  function handleCategoryChange(slug: string) {
    const newCategory = slug === currentCategory ? null : slug;
    const qs = createQueryString({ category: newCategory });
    router.push(`/${locale}/products${qs ? `?${qs}` : ""}`);
  }

  function handlePriceSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const min = formData.get("minPrice") as string;
    const max = formData.get("maxPrice") as string;
    const qs = createQueryString({
      minPrice: min || null,
      maxPrice: max || null,
    });
    router.push(`/${locale}/products${qs ? `?${qs}` : ""}`);
  }

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          {dict.filters}
        </h2>

        {/* Price Range */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary">
              payments
            </span>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-500">
              {dict.priceRange}
            </h3>
          </div>
          <form onSubmit={handlePriceSubmit} className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  ₫
                </span>
                <input
                  name="minPrice"
                  type="number"
                  min="0"
                  step="1000"
                  placeholder={dict.minPlaceholder}
                  defaultValue={currentMinPrice || ""}
                  className="w-full pl-7 pr-2 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <span className="text-slate-400 text-sm">-</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  ₫
                </span>
                <input
                  name="maxPrice"
                  type="number"
                  min="0"
                  step="1000"
                  placeholder={dict.maxPlaceholder}
                  defaultValue={currentMaxPrice || ""}
                  className="w-full pl-7 pr-2 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2 text-sm font-semibold text-primary border border-primary rounded-lg hover:bg-primary/10 transition-colors"
            >
              {dict.applyPrice}
            </button>
          </form>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary">
              category
            </span>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-500">
              {dict.category}
            </h3>
          </div>
          <div className="space-y-3">
            {categories.map((cat) => (
              <label
                key={cat.id}
                className="flex items-center group cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={currentCategory === cat.slug}
                  onChange={() => handleCategoryChange(cat.slug)}
                  className="rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary h-4 w-4 transition-colors"
                />
                <span className="ml-3 text-sm text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">
                  {dict.categoryNames[cat.slug] || cat.name}
                </span>
                <span className="ml-auto text-xs text-slate-400">
                  {cat._count.products}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
