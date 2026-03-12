"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import CheckoutSteps from "@/components/checkout/checkout-steps";
import OrderSummary, { type OrderSummaryItem } from "@/components/checkout/order-summary";
import { cn } from "@/lib/utils";
import { placeOrder } from "@/actions/checkout";
import type { Dictionary } from "@/i18n/get-dictionary";

type PaymentContentProps = {
  locale: string;
  dict: Dictionary;
  cartItems: OrderSummaryItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
};

export default function PaymentContent({
  locale,
  dict,
  cartItems,
  subtotal,
  shippingCost,
  tax,
  total,
}: PaymentContentProps) {
  const [saveCard, setSaveCard] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const t = dict.checkout.payment;
  const steps = dict.checkout.steps;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("paymentMethod", "card");
    setError(null);
    startTransition(async () => {
      const result = await placeOrder(formData);
      if (result.error) {
        setError(result.error);
      } else if (result.orderNumber) {
        router.push(`/${locale}/order-confirmation?order=${result.orderNumber}`);
      }
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <CheckoutSteps currentStep={4} locale={locale} dict={dict} />

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 mb-8 text-sm font-medium">
        <Link
          href={`/${locale}/cart`}
          className="text-slate-500 hover:text-primary transition-colors"
        >
          {steps.cart}
        </Link>
        <span className="material-symbols-outlined text-sm text-slate-400">
          chevron_right
        </span>
        <Link
          href={`/${locale}/checkout/shipping`}
          className="text-slate-500 hover:text-primary transition-colors"
        >
          {steps.shipping}
        </Link>
        <span className="material-symbols-outlined text-sm text-slate-400">
          chevron_right
        </span>
        <Link
          href={`/${locale}/checkout/billing`}
          className="text-slate-500 hover:text-primary transition-colors"
        >
          {steps.billing}
        </Link>
        <span className="material-symbols-outlined text-sm text-slate-400">
          chevron_right
        </span>
        <span className="text-primary">{steps.payment}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Payment Methods */}
        <div className="lg:col-span-7">
          <div className="mb-8">
            <h1 className="text-3xl font-black tracking-tight mb-2">
              {t.title}
            </h1>
            <div className="flex items-center gap-2 text-emerald-600 font-medium">
              <span className="material-symbols-outlined text-lg">
                verified_user
              </span>
              <p className="text-sm">{t.secureEnvironment}</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Express Pay Options */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-4 border-2 border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-bold"
              >
                <span className="material-symbols-outlined">payments</span>
                {t.paypal}
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-4 border-2 border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-bold"
              >
                <span className="material-symbols-outlined">ios</span>
                {t.applePay}
              </button>
            </div>

            {/* Divider */}
            <div className="relative py-4 flex items-center">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
              <span className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                {t.orPayWithCard}
              </span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
            </div>

            {/* Card Payment Form */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">{t.creditOrDebitCard}</h3>
                <div className="flex gap-2">
                  <span className="material-symbols-outlined text-slate-400">
                    credit_card
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name on Card */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    {t.nameOnCard}
                  </label>
                  <input
                    name="cardName"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-background-light dark:bg-slate-800/50 py-3 px-4 focus:border-primary focus:ring-primary outline-none transition-all text-slate-900 dark:text-slate-100"
                    placeholder={t.nameOnCardPlaceholder}
                    type="text"
                  />
                </div>

                {/* Card Number */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    {t.cardNumber}
                  </label>
                  <div className="relative">
                    <input
                      name="cardNumber"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-background-light dark:bg-slate-800/50 py-3 px-4 focus:border-primary focus:ring-primary outline-none transition-all text-slate-900 dark:text-slate-100"
                      placeholder={t.cardNumberPlaceholder}
                      type="text"
                    />
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      lock
                    </span>
                  </div>
                </div>

                {/* Expiry + CVV */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      {t.expiryDate}
                    </label>
                    <input
                      name="expiryDate"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-background-light dark:bg-slate-800/50 py-3 px-4 focus:border-primary focus:ring-primary outline-none transition-all text-slate-900 dark:text-slate-100"
                      placeholder={t.expiryPlaceholder}
                      type="text"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      {t.cvv}
                    </label>
                    <div className="relative">
                      <input
                        name="cvv"
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-background-light dark:bg-slate-800/50 py-3 px-4 focus:border-primary focus:ring-primary outline-none transition-all text-slate-900 dark:text-slate-100"
                        placeholder={t.cvvPlaceholder}
                        type="text"
                      />
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-help">
                        help
                      </span>
                    </div>
                  </div>
                </div>

                {/* Save Card */}
                <div className="flex items-center gap-3 py-2">
                  <input
                    checked={saveCard}
                    onChange={(e) => setSaveCard(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                    id="save-card"
                    type="checkbox"
                  />
                  <label
                    className="text-sm text-slate-600 dark:text-slate-400"
                    htmlFor="save-card"
                  >
                    {t.saveCard}
                  </label>
                </div>

                {/* Error message */}
                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm font-medium">
                    {error}
                  </div>
                )}

                {/* Actions */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center">
                  <Link
                    href={`/${locale}/checkout/billing`}
                    className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors font-medium"
                  >
                    <span className="material-symbols-outlined text-sm">
                      arrow_back
                    </span>
                    {t.returnToBilling}
                  </Link>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full md:w-auto bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 px-10 rounded-xl shadow-lg shadow-primary/20 transition-all text-lg flex items-center justify-center gap-2"
                  >
                    {isPending ? (
                      <>
                        <span className="material-symbols-outlined animate-spin">
                          progress_activity
                        </span>
                        Processing...
                      </>
                    ) : (
                      <>
                        {t.placeOrder}
                        <span className="material-symbols-outlined">lock</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Security badges */}
          <div className="mt-8 flex items-center justify-center gap-6 opacity-50 grayscale">
            <span className="material-symbols-outlined text-3xl">verified</span>
            <span className="material-symbols-outlined text-3xl">shield</span>
            <span className="material-symbols-outlined text-3xl">lock</span>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5">
          <OrderSummary
            dict={dict}
            items={cartItems}
            subtotal={subtotal}
            shippingCost={shippingCost}
            tax={tax}
            total={total}
          />

          {/* Estimated Delivery */}
          <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-primary">
                local_shipping
              </span>
              <div>
                <p className="text-xs font-bold text-primary uppercase">
                  {t.estimatedDelivery}
                </p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  7 business days
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
