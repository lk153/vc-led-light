"use server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitReview(productId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Please log in to write a review" };

  const rating = parseInt(formData.get("rating") as string);
  const title = (formData.get("title") as string) || null;
  const body = (formData.get("body") as string) || null;

  if (!rating || rating < 1 || rating > 5)
    return { error: "Please select a rating" };

  const existing = await prisma.review.findUnique({
    where: { userId_productId: { userId: session.user.id, productId } },
  });
  if (existing) return { error: "You have already reviewed this product" };

  await prisma.review.create({
    data: {
      userId: session.user.id,
      productId,
      rating,
      title,
      body,
      verified: true,
    },
  });

  const stats = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: true,
  });

  await prisma.product.update({
    where: { id: productId },
    data: {
      rating: stats._avg.rating || 0,
      reviewCount: stats._count,
    },
  });

  revalidatePath(`/products`);
  return { success: true };
}
