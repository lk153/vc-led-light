import { cache } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";
import ProductGallery from "@/components/product/product-gallery";
import ProductAddToCart from "@/components/cart/product-add-to-cart";
import ProductReviews from "@/components/product/product-reviews";
import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import { getWishlistProductIds } from "@/actions/wishlist";
import WishlistButton from "@/components/product/wishlist-button";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

// React cache deduplicates this between generateMetadata and page render
const getProduct = cache(async (slug: string, locale: string) => {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { position: "asc" } },
      category: true,
      translations: { where: { locale }, take: 1 },
      reviews: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 4,
      },
    },
  });
});

async function getRelatedProducts(categoryId: string, excludeSlug: string, locale: string) {
  return prisma.product.findMany({
    where: {
      categoryId,
      slug: { not: excludeSlug },
    },
    include: {
      images: { orderBy: { position: "asc" }, take: 1 },
      translations: { where: { locale }, take: 1 },
    },
    take: 4,
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id: slug } = await params;
  const product = await getProduct(slug, locale ?? "en");

  if (!product) {
    return { title: "Product Not Found" };
  }

  const t = product.translations[0];
  return {
    title: `${t?.name ?? product.name} | ${SITE_NAME}`,
    description: t?.shortDescription ?? product.shortDescription ?? t?.description ?? product.description ?? undefined,
  };
}

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  return (
    <div className="flex items-center gap-1 text-amber-400">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className="material-symbols-outlined"
          style={{
            fontVariationSettings:
              i < fullStars ? "'FILL' 1" : "'FILL' 0",
          }}
        >
          {i < fullStars ? "star" : i === fullStars && hasHalf ? "star_half" : "star"}
        </span>
      ))}
    </div>
  );
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, id: slug } = await params;
  const [dict, product, wishlistIds] = await Promise.all([
    getDictionary(locale as Locale),
    getProduct(slug, locale),
    getWishlistProductIds(),
  ]);

  if (!product) {
    notFound();
  }

  const t = product.translations[0];

  const relatedProducts = await getRelatedProducts(product.categoryId, product.slug, locale);

  const price = Number(product.price);
  const compareAtPrice = product.compareAtPrice
    ? Number(product.compareAtPrice)
    : null;
  const rating = Number(product.rating);

  const discount =
    compareAtPrice && compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : null;

  const inStock = product.stock > 0;

  // Build specs list from product fields
  const specs: { icon: string; label: string; description: string }[] = [];
  if (product.lumens) {
    specs.push({
      icon: "wb_sunny",
      label: `${product.lumens.toLocaleString()} ${dict.productDetail.lumens}`,
      description: dict.productDetail.lumensDescription.replace("{watt}", String(Math.round(product.lumens / 13))),
    });
  }
  if (product.cri) {
    specs.push({
      icon: "palette",
      label: `${product.cri}+ ${dict.productDetail.cri}`,
      description: dict.productDetail.criDescription,
    });
  }
  if (product.lifespan) {
    specs.push({
      icon: "history",
      label: `${product.lifespan.toLocaleString()} ${dict.productDetail.hours}`,
      description: dict.productDetail.lifespanDescription.replace("{years}", String(Math.round(product.lifespan / 1095))),
    });
  }
  if (product.wattage) {
    specs.push({
      icon: "bolt",
      label: `${product.wattage}W`,
      description: dict.productDetail.wattageDescription,
    });
  }
  if (product.colorTemperature) {
    specs.push({
      icon: "thermostat",
      label: product.colorTemperature,
      description: dict.productDetail.colorTempDescription,
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 lg:px-20">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <Link href={`/${locale}`} className="hover:text-primary transition-colors">
          {dict.common.home}
        </Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <Link
          href={`/${locale}/products?category=${product.category.slug}`}
          className="hover:text-primary transition-colors"
        >
          {(dict.productSearch.categoryNames as Record<string, string>)[product.category.slug] ?? product.category.name}
        </Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="font-medium text-slate-900 dark:text-white">{t?.name ?? product.name}</span>
      </nav>

      {/* Product Hero: Gallery + Info */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Left: Image Gallery */}
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} />
        </div>

        {/* Right: Product Info */}
        <div className="space-y-6 lg:col-span-5">
          {/* Badge + Title + Rating */}
          <div>
            {product.featured && (
              <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                {dict.productDetail.bestseller}
              </span>
            )}
            {!inStock && (
              <span className="mb-2 inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-600">
                {dict.common.outOfStock}
              </span>
            )}
            <h2 className="mb-2 text-4xl font-black leading-tight tracking-tight">
              {t?.name ?? product.name}
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <StarRating rating={rating} />
                <span className="ml-1 text-sm font-medium text-slate-600 dark:text-slate-400">
                  {rating.toFixed(1)} ({product.reviewCount.toLocaleString()}{" "}
                  {dict.common.reviews})
                </span>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="border-y border-slate-200 dark:border-slate-700 py-6">
            <div className="mb-1 flex items-baseline gap-4">
              <span className="text-4xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(price)}
              </span>
              {compareAtPrice && (
                <span className="text-lg text-slate-400 line-through">
                  {formatCurrency(compareAtPrice)}
                </span>
              )}
              {discount && (
                <span className="text-sm font-bold text-emerald-500">
                  {dict.productDetail.save} {discount}%
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {dict.productDetail.freeShippingNote}
            </p>
          </div>

          {/* Short Description */}
          {(t?.shortDescription ?? product.shortDescription) && (
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {t?.shortDescription ?? product.shortDescription}
            </p>
          )}

          {/* Quantity + Add to Cart */}
          <ProductAddToCart
            productId={product.id}
            stock={product.stock}
            addToCartLabel={dict.common.addToCart}
            outOfStockLabel={dict.common.outOfStock}
          />

          {/* Wishlist Button */}
          <WishlistButton
            productId={product.id}
            isInWishlist={wishlistIds.includes(product.id)}
            label={dict.productDetail.addToWishlist}
          />

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="flex items-center gap-3 rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
              <span className="material-symbols-outlined text-primary">
                verified
              </span>
              <div className="text-xs">
                <p className="font-bold dark:text-white">{dict.productDetail.warranty}</p>
                <p className="text-slate-500 dark:text-slate-400">{dict.productDetail.warrantyCoverage}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
              <span className="material-symbols-outlined text-primary">eco</span>
              <div className="text-xs">
                <p className="font-bold dark:text-white">{dict.productDetail.energyStar}</p>
                <p className="text-slate-500 dark:text-slate-400">{dict.productDetail.energyStarDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Specifications */}
      {specs.length > 0 && (
        <section className="mt-20">
          <h3 className="mb-8 flex items-center gap-2 text-2xl font-bold dark:text-white">
            <span className="material-symbols-outlined">
              settings_input_component
            </span>
            {dict.productDetail.technicalSpecifications}
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {specs.map((spec) => (
              <div
                key={spec.label}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6"
              >
                <span className="material-symbols-outlined mb-4 text-3xl text-primary">
                  {spec.icon}
                </span>
                <h4 className="mb-1 text-lg font-bold dark:text-white">{spec.label}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">{spec.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Product Description */}
      {(t?.description ?? product.description) && (
        <section className="mt-20">
          <h3 className="mb-8 flex items-center gap-2 text-2xl font-bold dark:text-white">
            <span className="material-symbols-outlined">description</span>
            {dict.productDetail.productDescription}
          </h3>
          <div className="prose prose-slate max-w-none rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8">
            <p className="leading-relaxed text-slate-600 dark:text-slate-400 whitespace-pre-line">
              {t?.description ?? product.description}
            </p>
          </div>
        </section>
      )}

      {/* Product Details Table */}
      <section className="mt-20">
        <h3 className="mb-8 flex items-center gap-2 text-2xl font-bold dark:text-white">
          <span className="material-symbols-outlined">info</span>
          {dict.productDetail.productDetails}
        </h3>
        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <table className="w-full text-sm">
            <tbody>
              {product.brand && (
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400">{dict.productDetail.brand}</td>
                  <td className="px-6 py-4 dark:text-slate-200">{product.brand}</td>
                </tr>
              )}
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <td className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400">{dict.productDetail.sku}</td>
                <td className="px-6 py-4 dark:text-slate-200">{product.sku}</td>
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <td className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400">{dict.productDetail.categoryLabel}</td>
                <td className="px-6 py-4 dark:text-slate-200">{(dict.productSearch.categoryNames as Record<string, string>)[product.category.slug] ?? product.category.name}</td>
              </tr>
              {product.wattage && (
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400">{dict.productDetail.wattage}</td>
                  <td className="px-6 py-4 dark:text-slate-200">{product.wattage}W</td>
                </tr>
              )}
              {product.lumens && (
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400">{dict.productDetail.lumens}</td>
                  <td className="px-6 py-4 dark:text-slate-200">{product.lumens.toLocaleString()}</td>
                </tr>
              )}
              {product.colorTemperature && (
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400">{dict.productDetail.colorTemperature}</td>
                  <td className="px-6 py-4 dark:text-slate-200">{product.colorTemperature}</td>
                </tr>
              )}
              {product.lifespan && (
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400">{dict.productDetail.lifespan}</td>
                  <td className="px-6 py-4 dark:text-slate-200">{product.lifespan.toLocaleString()} {dict.productDetail.hours}</td>
                </tr>
              )}
              {product.cri && (
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400">{dict.productDetail.cri}</td>
                  <td className="px-6 py-4 dark:text-slate-200">{product.cri}+</td>
                </tr>
              )}
              <tr>
                <td className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400">{dict.productDetail.availability}</td>
                <td className="px-6 py-4">
                  {inStock ? (
                    <span className="font-semibold text-emerald-600">
                      {dict.common.inStock} ({product.stock} {dict.productDetail.available})
                    </span>
                  ) : (
                    <span className="font-semibold text-red-600">{dict.common.outOfStock}</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Customer Reviews */}
      <ProductReviews
        reviews={product.reviews}
        rating={rating}
        reviewCount={product.reviewCount}
        dict={dict.productReviews}
        productId={product.id}
      />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20">
          <h3 className="mb-8 text-2xl font-bold dark:text-white">{dict.productDetail.relatedProducts}</h3>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {relatedProducts.map((related) => {
              const rt = related.translations[0];
              const relatedPrice = Number(related.price);
              const relatedCompare = related.compareAtPrice
                ? Number(related.compareAtPrice)
                : null;
              const relatedImage = related.images[0];

              return (
                <Link
                  key={related.id}
                  href={`/${locale}/products/${related.slug}`}
                  className="group overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-800">
                    {relatedImage ? (
                      <Image
                        src={relatedImage.url}
                        alt={relatedImage.alt ?? rt?.name ?? related.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-slate-300">
                          image
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="mb-1 text-sm font-semibold leading-tight line-clamp-2 dark:text-white">
                      {rt?.name ?? related.name}
                    </h4>
                    <div className="flex items-center gap-1 text-amber-400 mb-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span
                          key={i}
                          className="material-symbols-outlined text-xs"
                          style={{
                            fontVariationSettings:
                              i < Math.round(Number(related.rating))
                                ? "'FILL' 1"
                                : "'FILL' 0",
                          }}
                        >
                          star
                        </span>
                      ))}
                      <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                        ({related.reviewCount})
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold">
                        {formatCurrency(relatedPrice)}
                      </span>
                      {relatedCompare && relatedCompare > relatedPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          {formatCurrency(relatedCompare)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
