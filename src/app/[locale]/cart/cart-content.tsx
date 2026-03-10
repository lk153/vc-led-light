"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { updateCartItemQuantity, removeCartItem } from "@/actions/cart";
import type { Dictionary } from "@/i18n/get-dictionary";

export interface CartItemData {
  productId: string;
  slug: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  stock: number;
  imageUrl: string;
  imageAlt: string;
}

const SHIPPING_RATE = 0.1;
const TAX_RATE = 0.08;

export default function CartContent({
  locale,
  dict,
  initialItems,
}: {
  locale: string;
  dict: Dictionary;
  initialItems: CartItemData[];
}) {
  const [items, setItems] = useState<CartItemData[]>(initialItems);
  const [promoCode, setPromoCode] = useState("");
  const [isPending, startTransition] = useTransition();

  const t = dict.cart;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? parseFloat((subtotal * SHIPPING_RATE).toFixed(2)) : 0;
  const tax = subtotal > 0 ? parseFloat((subtotal * TAX_RATE).toFixed(2)) : 0;
  const total = subtotal + shipping + tax;

  function handleUpdateQuantity(productId: string, newQuantity: number) {
    if (newQuantity <= 0) {
      handleRemove(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item,
      ),
    );
    startTransition(async () => {
      await updateCartItemQuantity(productId, newQuantity);
    });
  }

  function handleRemove(productId: string) {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
    startTransition(async () => {
      await removeCartItem(productId);
    });
  }

  if (items.length === 0) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-10 py-20 text-center">
        <span className="material-symbols-outlined mb-6 text-7xl text-slate-300">
          shopping_cart
        </span>
        <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
          {t.emptyCartTitle}
        </h1>
        <p className="mb-8 text-slate-500">
          {t.emptyCartMessage}
        </p>
        <Link
          href={`/${locale}/products`}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-bold text-white transition-colors hover:bg-primary/90"
        >
          {dict.common.continueShopping}
          <span className="material-symbols-outlined text-xl">arrow_forward</span>
        </Link>
      </main>
    );
  }

  return (
    <main className="flex flex-1 justify-center px-10 py-10 md:px-20 lg:px-40">
      <div className="flex max-w-[1200px] flex-1 flex-col">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap gap-2 pb-6">
          <Link href={`/${locale}`} className="text-sm font-medium text-slate-500 hover:text-primary">
            {dict.common.home}
          </Link>
          <span className="text-sm font-medium text-slate-400">/</span>
          <Link href={`/${locale}/products`} className="text-sm font-medium text-slate-500 hover:text-primary">
            {dict.common.shop}
          </Link>
          <span className="text-sm font-medium text-slate-400">/</span>
          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{t.reviewCart}</span>
        </div>

        <div className="flex flex-col gap-10 lg:flex-row">
          {/* Cart Items */}
          <div className="flex-1">
            <h1 className="mb-8 text-3xl font-black leading-tight tracking-tight text-slate-900 dark:text-slate-100">
              {t.reviewYourCart}
            </h1>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
                    <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                      {t.product}
                    </th>
                    <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                      {t.quantity}
                    </th>
                    <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                      {t.price}
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                      {t.total}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {items.map((item) => (
                    <tr key={item.productId}>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                            {item.imageUrl ? (
                              <Image
                                src={item.imageUrl}
                                alt={item.imageAlt}
                                fill
                                className="object-cover"
                                sizes="80px"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-slate-100">
                                <span className="material-symbols-outlined text-2xl text-slate-300">image</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <Link
                              href={`/${locale}/products/${item.slug}`}
                              className="font-bold text-slate-900 hover:text-primary dark:text-slate-100"
                            >
                              {item.name}
                            </Link>
                            <p className="text-xs text-slate-500">SKU: {item.sku}</p>
                            <button
                              onClick={() => handleRemove(item.productId)}
                              disabled={isPending}
                              className="mt-1 flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                              {dict.common.remove}
                            </button>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-6">
                        <div className="flex w-fit items-center rounded-lg border border-slate-200 dark:border-slate-700">
                          <button
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                            disabled={isPending}
                            className="px-3 py-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 font-medium text-slate-900 dark:text-slate-100">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                            disabled={isPending || item.quantity >= item.stock}
                            className="px-3 py-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <td className="px-6 py-6 font-medium text-slate-600 dark:text-slate-400">
                        {formatCurrency(item.price)}
                      </td>

                      <td className="px-6 py-6 text-right font-bold text-slate-900 dark:text-slate-100">
                        {formatCurrency(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Promo Code */}
            <div className="mt-8 flex flex-col items-end gap-4 md:flex-row">
              <label className="flex flex-1 flex-col">
                <span className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t.promoCodeLabel}
                </span>
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-900 transition-all focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                  placeholder={t.promoCodePlaceholder}
                />
              </label>
              <button className="h-12 rounded-xl bg-slate-200 px-8 font-bold text-slate-900 transition-colors hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700">
                {dict.common.apply}
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <aside className="w-full lg:w-[380px]">
            <div className="sticky top-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-slate-100">
                {t.orderSummary}
              </h2>

              <div className="mb-6 space-y-4">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>{dict.common.subtotal}</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>{t.estimatedShipping}</span>
                  <span className="font-medium">{formatCurrency(shipping)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>{t.estimatedTax}</span>
                  <span className="font-medium">{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
                  <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {dict.common.total}
                  </span>
                  <span className="text-lg font-bold text-primary">{formatCurrency(total)}</span>
                </div>
              </div>

              <Link
                href={`/${locale}/checkout/shipping`}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-lg font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
              >
                <span>{t.proceedToShipping}</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>

              <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span className="material-symbols-outlined text-primary">verified_user</span>
                  <span>{t.secureEncryption}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span className="material-symbols-outlined text-primary">local_shipping</span>
                  <span>{t.freeDeliveryNote}</span>
                </div>
              </div>
            </div>

            <Link
              href={`/${locale}/products`}
              className="mt-6 flex items-center justify-center gap-2 font-medium text-slate-500 transition-colors hover:text-primary"
            >
              <span className="material-symbols-outlined text-sm">keyboard_backspace</span>
              <span>{dict.common.continueShopping}</span>
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
