"use client";

import Link from "next/link";
import { useState } from "react";
import CheckoutSteps from "@/components/checkout/checkout-steps";
import OrderSummary from "@/components/checkout/order-summary";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/i18n/get-dictionary";

type PaymentContentProps = {
  locale: string;
  dict: Dictionary;
};

export default function PaymentContent({ locale, dict }: PaymentContentProps) {
  const [saveCard, setSaveCard] = useState(false);
  const t = dict.checkout.payment;
  const steps = dict.checkout.steps;

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

              <form className="space-y-6">
                {/* Name on Card */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    {t.nameOnCard}
                  </label>
                  <input
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
                  <Link
                    href={`/${locale}/order-confirmation`}
                    className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white font-bold py-4 px-10 rounded-xl shadow-lg shadow-primary/20 transition-all text-lg flex items-center justify-center gap-2"
                  >
                    {t.placeOrder}
                    <span className="material-symbols-outlined">lock</span>
                  </Link>
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
          <OrderSummary dict={dict} />

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
                  Thursday, Oct 12th
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
