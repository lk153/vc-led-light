"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import CheckoutSteps from "@/components/checkout/checkout-steps";
import OrderSummary, { type OrderSummaryItem } from "@/components/checkout/order-summary";
import { saveBillingInfo } from "@/actions/checkout";
import type { Dictionary } from "@/i18n/get-dictionary";

type BillingContentProps = {
  locale: string;
  dict: Dictionary;
  cartItems: OrderSummaryItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
};

export default function BillingContent({
  locale,
  dict,
  cartItems,
  subtotal,
  shippingCost,
  tax,
  total,
}: BillingContentProps) {
  const [sameAsShipping, setSameAsShipping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const t = dict.checkout.billing;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    // Communicate sameAsShipping state via hidden field
    formData.set("sameAsShipping", sameAsShipping ? "true" : "false");
    setError(null);
    startTransition(async () => {
      const result = await saveBillingInfo(formData);
      if (result.error) {
        setError(result.error);
      } else {
        router.push(`/${locale}/checkout/payment`);
      }
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <CheckoutSteps currentStep={3} locale={locale} dict={dict} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Form */}
        <div className="lg:col-span-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {t.title}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {t.subtitle}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-8 bg-white dark:bg-slate-900/50 p-8 rounded-xl border border-slate-200 dark:border-slate-800"
          >
            {/* Same as shipping checkbox */}
            <div className="flex items-center gap-3 pb-6 border-b border-slate-200 dark:border-slate-800">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative flex items-center">
                  <input
                    checked={sameAsShipping}
                    onChange={(e) => setSameAsShipping(e.target.checked)}
                    className="peer sr-only"
                    type="checkbox"
                  />
                  <div className="h-6 w-6 rounded border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 peer-checked:bg-primary peer-checked:border-primary transition-all" />
                  <span className="material-symbols-outlined absolute text-white scale-0 peer-checked:scale-100 transition-transform left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg">
                    check
                  </span>
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t.sameAsShipping}
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t.firstName}
                </label>
                <input
                  name="firstName"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary px-4 py-3 text-slate-900 dark:text-white outline-none transition-all disabled:opacity-50"
                  placeholder={t.firstNamePlaceholder}
                  type="text"
                  disabled={sameAsShipping}
                />
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t.lastName}
                </label>
                <input
                  name="lastName"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary px-4 py-3 text-slate-900 dark:text-white outline-none transition-all disabled:opacity-50"
                  placeholder={t.lastNamePlaceholder}
                  type="text"
                  disabled={sameAsShipping}
                />
              </div>

              {/* Street Address */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t.streetAddress}
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    home
                  </span>
                  <input
                    name="street"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary pl-12 pr-4 py-3 text-slate-900 dark:text-white outline-none transition-all disabled:opacity-50"
                    placeholder={t.streetPlaceholder}
                    type="text"
                    disabled={sameAsShipping}
                  />
                </div>
              </div>

              {/* Apartment / Suite */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t.apartment}
                </label>
                <input
                  name="apartment"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary px-4 py-3 text-slate-900 dark:text-white outline-none transition-all disabled:opacity-50"
                  placeholder={t.apartmentPlaceholder}
                  type="text"
                  disabled={sameAsShipping}
                />
              </div>

              {/* City */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t.city}
                </label>
                <input
                  name="city"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary px-4 py-3 text-slate-900 dark:text-white outline-none transition-all disabled:opacity-50"
                  placeholder={t.cityPlaceholder}
                  type="text"
                  disabled={sameAsShipping}
                />
              </div>

              {/* State + ZIP */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {t.state}
                  </label>
                  <select
                    name="state"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary px-4 py-3 text-slate-900 dark:text-white appearance-none outline-none transition-all disabled:opacity-50"
                    disabled={sameAsShipping}
                  >
                    <option value="">{dict.common.select}</option>
                    <option value="CA">{t.california}</option>
                    <option value="NY">{t.newYork}</option>
                    <option value="TX">{t.texas}</option>
                    <option value="FL">{t.florida}</option>
                    <option value="IL">{t.illinois}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {t.zipCode}
                  </label>
                  <input
                    name="zipCode"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary px-4 py-3 text-slate-900 dark:text-white outline-none transition-all disabled:opacity-50"
                    placeholder={t.zipPlaceholder}
                    type="text"
                    disabled={sameAsShipping}
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t.phoneNumber}
                </label>
                <div className="relative flex">
                  <span className="inline-flex items-center px-4 bg-slate-100 dark:bg-slate-800 border border-r-0 border-slate-200 dark:border-slate-700 rounded-l-lg text-slate-500 text-sm font-medium">
                    +84
                  </span>
                  <input
                    name="phone"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-r-lg focus:ring-primary focus:border-primary px-4 py-3 text-slate-900 dark:text-white outline-none transition-all disabled:opacity-50"
                    placeholder={t.phonePlaceholder}
                    type="tel"
                    disabled={sameAsShipping}
                  />
                </div>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm font-medium">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center">
              <Link
                href={`/${locale}/checkout/shipping`}
                className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors font-medium"
              >
                <span className="material-symbols-outlined text-sm">
                  arrow_back
                </span>
                {t.returnToShipping}
              </Link>
              <button
                type="submit"
                disabled={isPending}
                className="w-full md:w-auto bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 px-10 rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">
                      progress_activity
                    </span>
                    Saving...
                  </>
                ) : (
                  <>
                    {t.continueToPayment}
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4">
          <OrderSummary
            dict={dict}
            items={cartItems}
            subtotal={subtotal}
            shippingCost={shippingCost}
            tax={tax}
            total={total}
          />
        </div>
      </div>
    </div>
  );
}
