"use client";

import Link from "next/link";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import type { Dictionary } from "@/i18n/get-dictionary";

type WishlistContentProps = {
  locale: string;
  dict: Dictionary;
};

interface WishlistProduct {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  stockStatus: "in-stock" | "limited" | "out-of-stock";
}

const initialProducts: WishlistProduct[] = [
  {
    id: "1",
    name: "Neon Linear Pro RGBW Flexible Strip",
    price: 89.0,
    compareAtPrice: 112.0,
    rating: 4.9,
    reviewCount: 124,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBdTyw7AwChq8obJCMo6Q2RD6Uly1JyhJwKfJl0J6b_xQ-VSOkLJwnMDxXzvUj2S-L9MwVb2CMZ73v-y36iCdUFiOIrXNFIuSbYa50IWjB5l9YFrs3XoEsMxaH2V9sB7yo5T10XBjODcByPiwQDoYFwlunM4YNHLLO_2qUA_gJgseOybqp04sHtF-p-ZrzsDuWhhlOIJnig9Zk08KXApX93oGhJVneYQ6o6DD_2x7iaQgdc-jfHkq0jlYGPasvN8ci5zlESdMy07lKV",
    stockStatus: "in-stock",
  },
  {
    id: "2",
    name: "Smart 4\" Recessed Downlight Tunable White",
    price: 45.0,
    rating: 4.8,
    reviewCount: 89,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBUy6GMNvStZeR8lcKVNXd7QJUqcJVR0vSD0GiMhbqCKOpunFiI0CbOxPpijnMbTdhNRREwdeoEIkgVU9MaGPcz7rhKgU2jk-AKM6HLBRe7Ef4vBuzBmjBb7pc-6WLJzIEs-W7WEm2tbKIDMKxs7-uyrdT7KRXgSMcfPuTv6GSVsXEYAM02FWAMhzAt2uCHRMKrfhRgKbCecJ4wD8jjsaSdtQszN2UwXMu3YQey-xVQFbOvOj2DTN1TC4HMoyjljKexS8MlbbuCPeVf",
    stockStatus: "in-stock",
  },
  {
    id: "3",
    name: "Hyperion Industrial High-Bay LED Pendant",
    price: 215.0,
    compareAtPrice: 249.0,
    rating: 5.0,
    reviewCount: 42,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDN5agtbS4zpgcQZrfU-_prBYii1Fd57qb-mA3yLNvsmo8bHIJmGCdvy_asDG7LHLgFsmAsme4P7g9LO9Ij-WVQBDFWvGYUaSNkWfr9EcuJ_oEgAX9ZPsvbOLy_dxlF1g8edOaqoRwE7otshLXaLf05Ty6Uwa9Qf2wVTXD6gQfrPo_s4BB7PYq0tmAksNIw9oDyzmwmaT_G4O9iPQgQlbX_ADEejfptGqK5aI6_hLj7K-eKtMaZBL-ljl2YH_QodXSIF88jKH6fFxjt",
    stockStatus: "limited",
  },
  {
    id: "4",
    name: "Eclipse Minimalist Outdoor Wall Sconce",
    price: 129.0,
    rating: 4.7,
    reviewCount: 215,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC19QUl3u7X8CUco9Gjgx3WqAh8hZmSy9vhA68FsmOkIxOgyLrLuvYcz0Jmk0uTBsiTkZ-YQTImprFytVou8rM31efpBBcrQAkqSezK-MlgWrq9pM6cmtOWCaZdbrNVnYP3gOs6Er7Bysx04O-Uv6UEYG2-e81Qy-_PEEijlqjMpE2Wd6ekAwurnXx9jXbN0f8XEu8LNsb0-93uIu22LtMZUXoZsFROK0_WszVLhrlLDg3Oe-q8_Eyt_aMDExVciwloVrN4ZTwJbXaJ",
    stockStatus: "out-of-stock",
  },
];

export default function WishlistContent({ locale, dict }: WishlistContentProps) {
  const [products, setProducts] = useState(initialProducts);
  const t = dict.account.wishlist;

  const removeItem = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  function stockBadge(status: WishlistProduct["stockStatus"]) {
    switch (status) {
      case "in-stock":
        return (
          <span className="px-3 py-1 bg-green-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
            {dict.common.inStock}
          </span>
        );
      case "limited":
        return (
          <span className="px-3 py-1 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
            {dict.common.limitedStock}
          </span>
        );
      case "out-of-stock":
        return (
          <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
            {dict.common.outOfStock}
          </span>
        );
    }
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
          <p className="text-slate-500 mb-8 max-w-sm">
            {t.emptyMessage}
          </p>
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
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-sm transition-all shadow-sm">
            <span className="material-symbols-outlined text-xl">share</span>
            {t.shareWishlist}
          </button>
          <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm transition-all shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-xl">
              add_shopping_cart
            </span>
            {t.addAllToCart}
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="group relative bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="relative aspect-square overflow-hidden bg-slate-100">
              <img
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                src={product.image}
              />
              <button
                onClick={() => removeItem(product.id)}
                className="absolute top-4 right-4 p-2 bg-white/90 rounded-full text-slate-400 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
              <div className="absolute bottom-4 left-4">
                {stockBadge(product.stockStatus)}
              </div>
            </div>
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
              {product.stockStatus === "out-of-stock" ? (
                <button className="w-full bg-slate-200 cursor-not-allowed text-slate-500 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">
                    notifications
                  </span>
                  {t.notifyMe}
                </button>
              ) : (
                <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2">
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
