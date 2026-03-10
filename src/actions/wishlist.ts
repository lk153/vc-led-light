"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleWishlist(productId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const existing = await prisma.wishlistItem.findUnique({
    where: {
      userId_productId: {
        userId: session.user.id,
        productId,
      },
    },
  });

  if (existing) {
    await prisma.wishlistItem.delete({
      where: { id: existing.id },
    });
    revalidatePath("/");
    return { added: false };
  }

  await prisma.wishlistItem.create({
    data: {
      userId: session.user.id,
      productId,
    },
  });
  revalidatePath("/");
  return { added: true };
}

export async function removeFromWishlist(productId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  await prisma.wishlistItem.deleteMany({
    where: {
      userId: session.user.id,
      productId,
    },
  });
  revalidatePath("/");
  return { success: true };
}

export async function getWishlistProductIds(): Promise<string[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const items = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    select: { productId: true },
  });

  return items.map((i) => i.productId);
}
