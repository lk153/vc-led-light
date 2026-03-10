"use client";

import { formatCurrency } from "@/lib/utils";
import type { Dictionary } from "@/i18n/get-dictionary";

const sampleItems = [
  {
    id: "1",
    name: "Smart RGB LED Strip (5m)",
    variant: "Multi-color, Wi-Fi Enabled",
    price: 24.99,
    quantity: 2,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBQ5_Na6jDCZ9D9G8q4S_YAQTCcm0ls-5vFdEj2_NmFQjt7ZV48cTcf67ezXFW9xxOtVpFSJAUcm20EezdvWttO8v9nq0ub9_gi4VAu99RNhIC7Z7UFLUHSDyx9Amo1HWPN2Pg83D99mtpourxtgNhx4yfdOdFp3qg61rde7PKPH-hiZIDi_v3ECgBvcsP7mD_jPXY7gB81QSD_O4XHDQp5gUVee9In0BT3aJM6NcNiNByU6xy2G6ByU9EBMBr1LN3U3pkUUJr-eIfA",
  },
  {
    id: "2",
    name: "Architectural Desk Lamp",
    variant: "Warm White, Dimmer",
    price: 85.0,
    quantity: 1,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDeJAJX8LhXcj-hfP53_lhDLXOB0MTM0gIOlnpq3WdnGQMAq5jiJGMguqIImRuv2-gFwdFQknCyhbv6h3KKNI5493xkoF0vH5tj5lDcANzJvrcgUZ1oaf4lxwRkqWeaEs3QC607hXf89CpwYVgZidkrDVtiPGK1p-lIT2vliXyPy8Y9QvxQX9Wdk7t4KQfogxYYXdXSy4HNBpdxm7KNmiIGXyAPFahU841bucItNuaYxMjdsPDoJau15QIaJ2A6J82y4713-aAvu0gK",
  },
];

const subtotal = sampleItems.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0
);
const shipping = 0;
const taxRate = 0.08;
const tax = subtotal * taxRate;
const total = subtotal + shipping + tax;

type OrderSummaryProps = {
  showItems?: boolean;
  dict: Dictionary;
};

export default function OrderSummary({ showItems = true, dict }: OrderSummaryProps) {
  const t = dict.checkout.orderSummary;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sticky top-24">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
        {t.title}
      </h2>

      {showItems && (
        <div className="space-y-4 mb-8">
          {sampleItems.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="relative h-20 w-20 flex-shrink-0 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {item.variant}
                </p>
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
          <span className="text-green-500 font-medium">{t.shippingFree}</span>
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
            USD
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
        <span className="material-symbols-outlined text-2xl" title={t.securePayment}>
          verified_user
        </span>
        <span className="material-symbols-outlined text-2xl" title={t.fastDelivery}>
          local_shipping
        </span>
        <span className="material-symbols-outlined text-2xl" title={t.premiumSupport}>
          support_agent
        </span>
      </div>
    </div>
  );
}
