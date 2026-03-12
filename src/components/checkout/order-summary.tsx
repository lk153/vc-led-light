"use client";

import { formatCurrency } from "@/lib/utils";
import type { Dictionary } from "@/i18n/get-dictionary";

export type OrderSummaryItem = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string;
};

type OrderSummaryProps = {
  showItems?: boolean;
  dict: Dictionary;
  items?: OrderSummaryItem[];
  subtotal?: number;
  shippingCost?: number;
  tax?: number;
  total?: number;
};

export default function OrderSummary({
  showItems = true,
  dict,
  items,
  subtotal: subtotalProp,
  shippingCost: shippingCostProp,
  tax: taxProp,
  total: totalProp,
}: OrderSummaryProps) {
  const t = dict.checkout.orderSummary;

  // Use provided values or fall back to computed sample
  const displayItems = items ?? [];
  const subtotal =
    subtotalProp ??
    displayItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = shippingCostProp ?? Math.round(subtotal * 0.1);
  const tax = taxProp ?? Math.round(subtotal * 0.08);
  const total = totalProp ?? subtotal + shippingCost + tax;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sticky top-24">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
        {t.title}
      </h2>

      {showItems && displayItems.length > 0 && (
        <div className="space-y-4 mb-8">
          {displayItems.map((item) => (
            <div key={item.productId} className="flex gap-4">
              <div className="relative h-20 w-20 flex-shrink-0 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-400">
                      image
                    </span>
                  </div>
                )}
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {item.name}
                </h3>
                <p className="text-sm font-bold text-primary mt-1">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-3 py-6 border-t border-slate-200 dark:border-slate-800">
        <div className="flex justify-between text-slate-600 dark:text-slate-400 text-sm">
          <span>{t.subtotal}</span>
          <span className="font-medium text-slate-900 dark:text-white">
            {formatCurrency(subtotal)}
          </span>
        </div>
        <div className="flex justify-between text-slate-600 dark:text-slate-400 text-sm">
          <span>{t.shipping}</span>
          <span className="font-medium text-slate-900 dark:text-white">
            {formatCurrency(shippingCost)}
          </span>
        </div>
        <div className="flex justify-between text-slate-600 dark:text-slate-400 text-sm">
          <span>{t.taxPercent}</span>
          <span className="font-medium text-slate-900 dark:text-white">
            {formatCurrency(tax)}
          </span>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-between items-end">
        <span className="text-lg font-bold text-slate-900 dark:text-white">
          {t.total}
        </span>
        <div className="text-right">
          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">
            VND
          </span>
          <span className="text-2xl font-black text-primary">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      {/* Discount Code */}
      <div className="mt-8">
        <div className="flex gap-2">
          <input
            className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm px-4 py-2 focus:ring-primary focus:border-primary outline-none"
            placeholder={t.discountCode}
            type="text"
          />
          <button className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold px-4 rounded-lg text-sm transition-colors">
            {t.apply}
          </button>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mt-8 flex justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
        <span
          className="material-symbols-outlined text-2xl"
          title={t.securePayment}
        >
          verified_user
        </span>
        <span
          className="material-symbols-outlined text-2xl"
          title={t.fastDelivery}
        >
          local_shipping
        </span>
        <span
          className="material-symbols-outlined text-2xl"
          title={t.premiumSupport}
        >
          support_agent
        </span>
      </div>
    </div>
  );
}
