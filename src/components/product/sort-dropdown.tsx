"use client";

import { useRouter, useSearchParams } from "next/navigation";

type SortDropdownProps = {
  currentSort: string;
  locale: string;
  dict: {
    sortFeatured: string;
    sortPriceLowHigh: string;
    sortPriceHighLow: string;
    sortNewest: string;
    sortTopRated: string;
    sortProducts: string;
  };
};

export default function SortDropdown({ currentSort, locale, dict }: SortDropdownProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const SORT_OPTIONS = [
    { value: "featured", label: dict.sortFeatured },
    { value: "price-asc", label: dict.sortPriceLowHigh },
    { value: "price-desc", label: dict.sortPriceHighLow },
    { value: "newest", label: dict.sortNewest },
    { value: "rating", label: dict.sortTopRated },
  ] as const;

  const currentLabel =
    SORT_OPTIONS.find((o) => o.value === currentSort)?.label ?? dict.sortFeatured;

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    const value = e.target.value;
    if (value === "featured") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    params.delete("page");
    const qs = params.toString();
    router.push(`/${locale}/products${qs ? `?${qs}` : ""}`);
  }

  return (
    <div className="relative inline-flex items-center">
      <span className="text-sm font-semibold text-slate-900 dark:text-white pointer-events-none">
        {currentLabel}
      </span>
      <select
        defaultValue={currentSort}
        onChange={handleChange}
        className="absolute inset-0 opacity-0 cursor-pointer w-full"
        aria-label={dict.sortProducts}
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
