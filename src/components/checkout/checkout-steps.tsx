"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/i18n/get-dictionary";

type CheckoutStepsProps = {
  currentStep: number;
  locale: string;
  dict: Dictionary;
};

export default function CheckoutSteps({ currentStep, locale, dict }: CheckoutStepsProps) {
  const steps = [
    { number: 1, label: dict.checkout.steps.cart, href: `/${locale}/cart` },
    { number: 2, label: dict.checkout.steps.shipping, href: `/${locale}/checkout/shipping` },
    { number: 3, label: dict.checkout.steps.billing, href: `/${locale}/checkout/billing` },
    { number: 4, label: dict.checkout.steps.payment, href: `/${locale}/checkout/payment` },
  ];

  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center gap-4">
          {index > 0 && (
            <div
              className={cn(
                "h-px w-12",
                step.number <= currentStep
                  ? "bg-primary"
                  : "bg-slate-200 dark:bg-slate-800"
              )}
            />
          )}
          <Link
            href={step.number < currentStep ? step.href : "#"}
            className={cn(
              "flex items-center gap-2",
              step.number < currentStep && "cursor-pointer",
              step.number >= currentStep && "pointer-events-none"
            )}
          >
            <span
              className={cn(
                "flex items-center justify-center size-8 rounded-full font-bold text-sm",
                step.number === currentStep &&
                  "bg-primary text-white",
                step.number < currentStep &&
                  "bg-primary/20 text-primary",
                step.number > currentStep &&
                  "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
              )}
            >
              {step.number < currentStep ? (
                <span className="material-symbols-outlined text-sm">check</span>
              ) : (
                step.number
              )}
            </span>
            <span
              className={cn(
                "text-sm font-semibold",
                step.number === currentStep &&
                  "text-slate-900 dark:text-slate-100 font-bold",
                step.number < currentStep &&
                  "text-slate-500 dark:text-slate-400",
                step.number > currentStep &&
                  "text-slate-400 dark:text-slate-500"
              )}
            >
              {step.label}
            </span>
          </Link>
        </div>
      ))}
    </div>
  );
}
