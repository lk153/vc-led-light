import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import AddToCartButton from "@/components/cart/add-to-cart-button";
import WishlistButton from "@/components/product/wishlist-button";

type ProductCardProps = {
  productId: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  price: number | string;
  compareAtPrice: number | string | null;
  rating: number | string;
  reviewCount: number;
  featured: boolean;
  stock: number;
  imageUrl: string | null;
  imageAlt: string | null;
  isInWishlist?: boolean;
  locale: string;
  dict: {
    sale: string;
    bestSeller: string;
    outOfStock: string;
    addToCart: string;
    addToWishlist: string;
  };
};

function StarRating({ rating, count }: { rating: number; count: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-2 mb-2">
      <div className="flex text-yellow-400">
        {Array.from({ length: fullStars }, (_, i) => (
          <span
            key={`full-${i}`}
            className="material-symbols-outlined text-sm"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
        ))}
        {hasHalf && (
          <span className="material-symbols-outlined text-sm">star_half</span>
        )}
        {Array.from({ length: emptyStars }, (_, i) => (
          <span key={`empty-${i}`} className="material-symbols-outlined text-sm">
            star
          </span>
        ))}
      </div>
      <span className="text-xs text-slate-400">({count})</span>
    </div>
  );
}

export default function ProductCard({
  productId,
  slug,
  name,
  shortDescription,
  price,
  compareAtPrice,
  rating,
  reviewCount,
  featured,
  stock,
  imageUrl,
  imageAlt,
  isInWishlist = false,
  locale,
  dict,
}: ProductCardProps) {
  const priceNum = Number(price);
  const compareNum = compareAtPrice ? Number(compareAtPrice) : null;
  const ratingNum = Number(rating);
  const hasDiscount = compareNum && compareNum > priceNum;
  const discountPct = hasDiscount
    ? Math.round(((compareNum - priceNum) / compareNum) * 100)
    : 0;

  return (
    <Link
      href={`/${locale}/products/${slug}`}
      className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 block"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt || name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-slate-300">
              lightbulb
            </span>
          </div>
        )}

        {featured && (
          <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">
            {dict.bestSeller}
          </span>
        )}
        {!featured && hasDiscount && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">
            {dict.sale} {discountPct}%
          </span>
        )}
        {!featured && !hasDiscount && stock === 0 && (
          <span className="absolute top-3 left-3 bg-slate-700 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">
            {dict.outOfStock}
          </span>
        )}

        <div className={`absolute top-3 right-3 transition-opacity ${isInWishlist ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
          <WishlistButton
            productId={productId}
            isInWishlist={isInWishlist}
            label={dict.addToWishlist}
            variant="icon"
          />
        </div>
      </div>

      <div className="p-5">
        <StarRating rating={ratingNum} count={reviewCount} />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">
          {name}
        </h3>
        {shortDescription && (
          <p className="text-sm text-slate-500 mb-4 line-clamp-2">
            {shortDescription}
          </p>
        )}
        <div className="flex items-center justify-between">
          {hasDiscount ? (
            <div className="flex flex-col">
              <span className="text-xl font-bold text-primary">
                {formatCurrency(priceNum)}
              </span>
              <span className="text-xs text-slate-400 line-through">
                {formatCurrency(compareNum)}
              </span>
            </div>
          ) : (
            <span className="text-xl font-bold text-primary">
              {formatCurrency(priceNum)}
            </span>
          )}
          <AddToCartButton
            productId={productId}
            label={dict.addToCart}
            disabled={stock === 0}
            variant="icon"
          />
        </div>
      </div>
    </Link>
  );
}
