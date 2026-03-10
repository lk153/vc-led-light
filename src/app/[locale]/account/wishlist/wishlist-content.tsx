"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { formatCurrency } from "@/lib/utils";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { SerializedWishlistProduct } from "./page";
import { removeFromWishlist } from "@/actions/wishlist";
import { addToCart } from "@/actions/cart";

type WishlistContentProps = {
  locale: string;
  dict: Dictionary;
  products: SerializedWishlistProduct[];
};

function stockBadge(
  stock: number,
  labels: { inStock: string; limitedStock: string; outOfStock: string }
) {
  if (stock <= 0) {
    return (
      <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
        {labels.outOfStock}
      </span>
    );
  }
  if (stock <= 5) {
    return (
      <span className="px-3 py-1 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
        {labels.limitedStock}
      </span>
    );
  }
  return (
    <span className="px-3 py-1 bg-green-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
      {labels.inStock}
    </span>
  );
}

export default function WishlistContent({
  locale,
  dict,
  products,
}: WishlistContentProps) {
  const t = dict.account.wishlist;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleRemove(productId: string) {
    startTransition(async () => {
      await removeFromWishlist(productId);
      router.refresh();
    });
  }

  function handleMoveToCart(productId: string) {
    startTransition(async () => {
      await addToCart(productId, 1);
      await removeFromWishlist(productId);
      router.refresh();
    });
  }

  if (products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-5xl text-slate-300">
              favorite
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {t.emptyTitle}
          </h2>
          <p className="text-slate-500 mb-8 max-w-sm">{t.emptyMessage}</p>
          <Link
            href={`/${locale}/products`}
            className="px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
          >
            {t.exploreCollections}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <Link href={`/${locale}`} className="hover:text-primary">
              {dict.common.home}
            </Link>
            <span className="material-symbols-outlined text-sm">
              chevron_right
            </span>
            <span className="text-slate-900 font-medium">{t.title}</span>
          </nav>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            {t.title}
          </h1>
          <p className="mt-2 text-slate-500">
            {t.itemCount.replace("{count}", String(products.length))}
          </p>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="group relative bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <Link
              href={`/${locale}/products/${product.slug}`}
              className="block relative aspect-square overflow-hidden bg-slate-100"
            >
              {product.image ? (
                <img
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  src={product.image}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-5xl text-slate-300">
                    image
                  </span>
                </div>
              )}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleRemove(product.productId);
                }}
                disabled={isPending}
                className="absolute top-4 right-4 p-2 bg-white/90 rounded-full text-slate-400 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
              <div className="absolute bottom-4 left-4">
                {stockBadge(product.stock, {
                  inStock: dict.common.inStock,
                  limitedStock: dict.common.limitedStock,
                  outOfStock: dict.common.outOfStock,
                })}
              </div>
            </Link>
            <div className="p-6">
              <div className="flex items-center gap-1 mb-2">
                <span
                  className="material-symbols-outlined text-amber-400 text-lg"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {product.rating}
                </span>
                <span className="text-xs text-slate-400 font-medium ml-1">
                  ({product.reviewCount} {dict.common.reviews})
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">
                {product.name}
              </h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-2xl font-black text-primary">
                  {formatCurrency(product.price)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-sm text-slate-400 line-through font-medium">
                    {formatCurrency(product.compareAtPrice)}
                  </span>
                )}
              </div>
              {product.stock <= 0 ? (
                <button className="w-full bg-slate-200 cursor-not-allowed text-slate-500 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">
                    notifications
                  </span>
                  {t.notifyMe}
                </button>
              ) : (
                <button
                  onClick={() => handleMoveToCart(product.productId)}
                  disabled={isPending}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <span className="material-symbols-outlined">
                    shopping_cart
                  </span>
                  {t.moveToCart}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
