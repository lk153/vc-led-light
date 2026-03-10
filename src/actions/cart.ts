"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const CART_COOKIE = "cart";

export interface CartEntry {
  productId: string;
  quantity: number;
}

async function getCartEntries(): Promise<CartEntry[]> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(CART_COOKIE)?.value;
  if (!raw) return [];
  try {
    return JSON.parse(raw) as CartEntry[];
  } catch {
    return [];
  }
}

async function setCartEntries(entries: CartEntry[]) {
  const cookieStore = await cookies();
  cookieStore.set(CART_COOKIE, JSON.stringify(entries), {
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
    sameSite: "lax",
  });
}

export async function addToCart(productId: string, quantity: number = 1) {
  const entries = await getCartEntries();
  const existing = entries.find((e) => e.productId === productId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    entries.push({ productId, quantity });
  }

  await setCartEntries(entries);
  return { success: true, cartCount: entries.reduce((sum, e) => sum + e.quantity, 0) };
}

export async function updateCartItemQuantity(productId: string, quantity: number) {
  const entries = await getCartEntries();
  const filtered = quantity <= 0
    ? entries.filter((e) => e.productId !== productId)
    : entries.map((e) => (e.productId === productId ? { ...e, quantity } : e));

  await setCartEntries(filtered);
  return { success: true };
}

export async function removeCartItem(productId: string) {
  const entries = await getCartEntries();
  await setCartEntries(entries.filter((e) => e.productId !== productId));
  return { success: true };
}

export async function getCart() {
  const entries = await getCartEntries();
  if (entries.length === 0) return { items: [], count: 0 };

  const products = await prisma.product.findMany({
    where: { id: { in: entries.map((e) => e.productId) } },
    include: {
      images: { orderBy: { position: "asc" }, take: 1 },
    },
  });

  const items = entries
    .map((entry) => {
      const product = products.find((p) => p.id === entry.productId);
      if (!product) return null;
      return {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        sku: product.sku,
        price: Number(product.price),
        quantity: entry.quantity,
        stock: product.stock,
        imageUrl: product.images[0]?.url ?? "",
        imageAlt: product.images[0]?.alt ?? product.name,
      };
    })
    .filter(Boolean) as {
      productId: string;
      slug: string;
      name: string;
      sku: string;
      price: number;
      quantity: number;
      stock: number;
      imageUrl: string;
      imageAlt: string;
    }[];

  return {
    items,
    count: items.reduce((sum, i) => sum + i.quantity, 0),
  };
}

export async function getCartCount() {
  const entries = await getCartEntries();
  return entries.reduce((sum, e) => sum + e.quantity, 0);
}
