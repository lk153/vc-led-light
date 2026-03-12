"use server";
import { prisma } from "@/lib/prisma";

type PromoDiscount = {
  type: string;
  value: number;
  minOrder: number | null;
  code: string;
};

type PromoResult =
  | { error: string; success?: never; discount?: never }
  | { success: true; discount: PromoDiscount; error?: never };

export async function validatePromoCode(code: string): Promise<PromoResult> {
  if (!code) return { error: "Please enter a promo code" };

  const promo = await prisma.promoCode.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!promo) return { error: "Invalid promo code" };
  if (!promo.active) return { error: "This promo code is no longer active" };
  if (promo.expiresAt && promo.expiresAt < new Date()) return { error: "This promo code has expired" };
  if (promo.maxUses && promo.usedCount >= promo.maxUses) return { error: "This promo code has been fully redeemed" };

  return {
    success: true,
    discount: {
      type: promo.discountType,
      value: Number(promo.discountValue),
      minOrder: promo.minOrder ? Number(promo.minOrder) : null,
      code: promo.code,
    },
  };
}
