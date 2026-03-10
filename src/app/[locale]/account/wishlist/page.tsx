import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import WishlistContent from "./wishlist-content";

export type SerializedWishlistProduct = {
  id: string;
  productId: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  rating: number;
  reviewCount: number;
  image: string;
  stock: number;
  slug: string;
};

export default async function WishlistPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/${locale}/login`);
  }

  const dict = await getDictionary(locale as Locale);

  const wishlistItems = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        include: {
          images: { orderBy: { position: "asc" }, take: 1 },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const products: SerializedWishlistProduct[] = wishlistItems.map((item) => ({
    id: item.id,
    productId: item.productId,
    name: item.product.name,
    price: Number(item.product.price),
    compareAtPrice: item.product.compareAtPrice
      ? Number(item.product.compareAtPrice)
      : null,
    rating: Number(item.product.rating),
    reviewCount: item.product.reviewCount,
    image: item.product.images[0]?.url || "",
    stock: item.product.stock,
    slug: item.product.slug,
  }));

  return <WishlistContent locale={locale} dict={dict} products={products} />;
}
