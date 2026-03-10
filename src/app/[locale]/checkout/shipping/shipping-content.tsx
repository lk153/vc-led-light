"use client";

import Link from "next/link";
import { useState } from "react";
import CheckoutSteps from "@/components/checkout/checkout-steps";
import OrderSummary from "@/components/checkout/order-summary";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/i18n/get-dictionary";

type ShippingContentProps = {
  locale: string;
  dict: Dictionary;
};

export default function ShippingContent({ locale, dict }: ShippingContentProps) {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [useSameForBilling, setUseSameForBilling] = useState(true);
  const t = dict.checkout.shipping;

  const savedAddresses = [
    {
      id: "addr-1",
      label: t.home,
      name: "Alex Johnson",
      street: "742 Evergreen Terrace",
      city: "Springfield",
      state: "CA",
      zip: "90210",
    },
    {
      id: "addr-2",
      label: t.office,
      name: "Alex Johnson",
      street: "1600 Amphitheatre Pkwy",
      city: "Mountain View",
      state: "CA",
      zip: "94043",
    },
  ];

  return (
    <div className="w-full max-w-[960px] mx-auto px-6 py-8">
      <CheckoutSteps currentStep={2} locale={locale} dict={dict} />

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-6 md:p-10">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 mb-2">
              {t.title}
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              {t.subtitle}
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  {t.stepProgress}
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {t.percentComplete}
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full w-[50%]" />
              </div>
            </div>
          </div>

          {/* Saved Addresses */}
          <div className="mb-8">
            <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">
              {t.savedAddresses}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedAddresses.map((addr) => (
                <button
                  key={addr.id}
                  type="button"
                  onClick={() => setSelectedAddress(addr.id)}
                  className={cn(
                    "text-left p-4 rounded-lg border-2 transition-all",
                    selectedAddress === addr.id
                      ? "border-primary bg-primary/5"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-sm text-primary">
                      {addr.label === t.home ? "home" : "business"}
                    </span>
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                      {addr.label}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {addr.name}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {addr.street}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {addr.city}, {addr.state} {addr.zip}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="relative py-4 flex items-center mb-6">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
            <span className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
              {t.orEnterNewAddress}
            </span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
          </div>

          {/* Form */}
          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {t.firstName}
              </label>
              <input
                className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-background-light dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                placeholder={t.firstNamePlaceholder}
                type="text"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {t.lastName}
              </label>
              <input
                className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-background-light dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                placeholder={t.lastNamePlaceholder}
                type="text"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {t.streetAddress}
              </label>
              <input
                className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-background-light dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                placeholder={t.streetPlaceholder}
                type="text"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {t.apartment}
              </label>
              <input
                className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-background-light dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                placeholder={t.apartmentPlaceholder}
                type="text"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {t.city}
              </label>
              <input
                className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-background-light dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                placeholder={t.cityPlaceholder}
                type="text"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {t.state}
                </label>
                <select className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-background-light dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all">
                  <option value="">{dict.common.select}</option>
                  <option value="CA">{dict.checkout.billing.california}</option>
                  <option value="NY">{dict.checkout.billing.newYork}</option>
                  <option value="TX">{dict.checkout.billing.texas}</option>
                  <option value="FL">{dict.checkout.billing.florida}</option>
                  <option value="IL">{dict.checkout.billing.illinois}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {t.zipCode}
                </label>
                <input
                  className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-background-light dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                  placeholder={t.zipPlaceholder}
                  type="text"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {t.phoneNumber}
              </label>
              <div className="flex w-full items-stretch rounded-lg h-12 overflow-hidden border border-slate-200 dark:border-slate-800 bg-background-light dark:bg-slate-800">
                <div className="flex items-center justify-center px-4 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border-r border-slate-200 dark:border-slate-800 text-sm font-medium">
                  +1
                </div>
                <input
                  className="flex-1 px-4 bg-transparent text-slate-900 dark:text-slate-100 border-none focus:ring-0 outline-none"
                  placeholder={t.phonePlaceholder}
                  type="tel"
                />
              </div>
            </div>

            {/* Same for billing checkbox */}
            <div className="md:col-span-2 py-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    checked={useSameForBilling}
                    onChange={(e) => setUseSameForBilling(e.target.checked)}
                    className="peer sr-only"
                    type="checkbox"
                  />
                  <div className="h-6 w-6 rounded border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 peer-checked:bg-primary peer-checked:border-primary transition-all" />
                  <span className="material-symbols-outlined absolute text-white scale-0 peer-checked:scale-100 transition-transform left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg">
                    check
                  </span>
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t.useSameForBilling}
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="md:col-span-2 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center">
              <Link
                href={`/${locale}/cart`}
                className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold text-sm hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                {t.returnToCart}
              </Link>
              <Link
                href={`/${locale}/checkout/billing`}
                className="w-full md:w-auto px-10 h-14 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
              >
                {t.continueToBilling}
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Trust features */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center px-4">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-primary text-3xl">
            local_shipping
          </span>
          <h3 className="font-bold text-slate-900 dark:text-slate-100">
            {t.fastShipping}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t.fastShippingDesc}
          </p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-primary text-3xl">
            verified_user
          </span>
          <h3 className="font-bold text-slate-900 dark:text-slate-100">
            {t.secureCheckout}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t.secureCheckoutDesc}
          </p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-primary text-3xl">
            support_agent
          </span>
          <h3 className="font-bold text-slate-900 dark:text-slate-100">
            {t.support247}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t.support247Desc}
          </p>
        </div>
      </div>
    </div>
  );
}
