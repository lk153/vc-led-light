"use client";

import Link from "next/link";

export default function CartBadge({
  locale,
  count,
}: {
  locale: string;
  count: number;
}) {
  return (
    <Link
      href={`/${locale}/cart`}
      className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 hover:bg-primary/10 hover:text-primary transition-all"
    >
      <span className="material-symbols-outlined">shopping_cart</span>
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
