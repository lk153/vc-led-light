import type { Metadata } from "next";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Order Confirmed" };

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ order?: string }>;
}) {
  const { locale } = await params;
  const { order: orderNumber } = await searchParams;
  const dict = await getDictionary(locale as Locale);
  const t = dict.orderConfirmation;

  const order = orderNumber
    ? await prisma.order.findUnique({
        where: { orderNumber },
        include: { items: true },
      })
    : null;

  const subtotal = order ? Number(order.subtotal) : 0;
  const shippingCost = order ? Number(order.shippingCost) : 0;
  const tax = order ? Number(order.tax) : 0;
  const total = order ? Number(order.total) : 0;

  return (
    <div className="flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-[800px] w-full bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Success Header */}
        <div className="bg-primary/5 dark:bg-primary/10 p-8 flex flex-col items-center text-center">
          <div className="size-20 bg-green-500 rounded-full flex items-center justify-center text-white mb-6 shadow-lg shadow-green-500/20">
            <span
              className="material-symbols-outlined text-4xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
          </div>
          <h1 className="text-slate-900 dark:text-white text-3xl font-extrabold tracking-tight mb-2">
            {t.title}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-md">
            {t.thankYouMessage}
          </p>
        </div>

        <div className="p-8 space-y-8">
          {/* Order Number & Estimated Delivery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2 rounded-xl p-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
                <span className="material-symbols-outlined text-sm">
                  confirmation_number
                </span>
                <p className="text-sm font-semibold uppercase tracking-wider">
                  {t.orderNumber}
                </p>
              </div>
              <p className="text-slate-900 dark:text-white text-2xl font-bold">
                #{order?.orderNumber ?? "—"}
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-xl p-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
                <span className="material-symbols-outlined text-sm">
                  local_shipping
                </span>
                <p className="text-sm font-semibold uppercase tracking-wider">
                  {t.estimatedDelivery}
                </p>
              </div>
              <p className="text-slate-900 dark:text-white text-2xl font-bold">
                {order?.estimatedDelivery
                  ? formatDate(order.estimatedDelivery)
                  : "—"}
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              {t.orderSummary}
            </h3>

            {order ? (
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="size-16 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                      {item.imageUrl ? (
                        <div
                          className="w-full h-full bg-center bg-cover"
                          style={{ backgroundImage: `url('${item.imageUrl}')` }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-slate-400">
                            image
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900 dark:text-white">{item.name}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {t.qty}: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(Number(item.price) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No order details found.</p>
            )}

            {/* Totals */}
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>{t.subtotal}</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>{t.shipping}</span>
                <span className="font-medium">
                  {formatCurrency(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Tax (8%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between text-slate-900 dark:text-white text-xl font-bold pt-2">
                <span>{t.totalPaid}</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href={`/${locale}/account/orders`}
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">track_changes</span>
              {t.trackOrder}
            </Link>
            <Link
              href={`/${locale}/products`}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-200 dark:bg-slate-800 dark:text-white dark:border-slate-700"
            >
              <span className="material-symbols-outlined">shopping_bag</span>
              {t.continueShopping}
            </Link>
          </div>
        </div>

        {/* Help Banner */}
        <div className="bg-slate-50 dark:bg-slate-800 p-6 flex items-start gap-4">
          <span className="material-symbols-outlined text-primary">info</span>
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              {t.needHelp}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t.helpMessage}{" "}
              <Link
                href={`/${locale}/support`}
                className="text-primary hover:underline"
              >
                support@luminaled.com
              </Link>{" "}
              {t.helpMessageSuffix}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
