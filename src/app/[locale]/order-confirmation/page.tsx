import type { Metadata } from "next";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";

export const metadata: Metadata = { title: "Order Confirmed" };

const orderItems = [
  {
    id: "1",
    name: "Smart RGB LED Strip - 5m",
    variant: "Warm White",
    quantity: 2,
    price: 49.98,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAclCQFJtVYW8_XCKuwMQPJPlGbXwMORfXHX2lBg6nlS9rb7sdY-CBQbYViaTAP2yAYpmtrrV_uAW07sdPXAuD-wT27DtqfmDTCoA0z7t16q6knDofDPVw891O0RT7TBV8ZfpU-XkQrsk9_OA7D6ptbowH5lskBHd183AP9MIXsNWhlTZFsRx-1gEye02a_AaAxv0SMQnggTGyDPO-_s_pcnZcFqLcFArr3M6hdGG1OhbeOsTXVFhAVpG2AIDEOWFsx-Fpm7AdGy0ve",
  },
  {
    id: "2",
    name: "Modern Hexagon Wall Panel",
    variant: "Matte Black",
    quantity: 1,
    price: 129.0,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBOG65pEY7EHODg5PCqOtTwdsB2ayuipF_v7shZwLm76hWoqx7SYyubdwqftx5UQuAzmnsG_lYR7frULQ9oHwf2KkZhdfXvoh2Tm5Zr02uu-C3Wpat356VLCv9ICS7d15Y_sYR4TQ2ZBvTG9EEgDcaEmg17pkl06DyARtDKqLD2ZOn2tvPzzpcC6DIoA_fPGjGQMwxJXLSUMeH-8RnLYYo4E6laTnJoAwCluzQ3ACuVW85jrjRksj6mYc1BAXqALCVZsbcRWWHZvACY",
  },
];

const subtotal = 178.98;
const shipping = 0;
const total = 178.98;

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const t = dict.orderConfirmation;

  return (
    <div className="flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-[800px] w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Success Header */}
        <div className="bg-primary/5 p-8 flex flex-col items-center text-center">
          <div className="size-20 bg-green-500 rounded-full flex items-center justify-center text-white mb-6 shadow-lg shadow-green-500/20">
            <span
              className="material-symbols-outlined text-4xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
          </div>
          <h1 className="text-slate-900 text-3xl font-extrabold tracking-tight mb-2">
            {t.title}
          </h1>
          <p className="text-slate-600 text-lg max-w-md">
            {t.thankYouMessage}
          </p>
        </div>

        <div className="p-8 space-y-8">
          {/* Order Number & Estimated Delivery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2 rounded-xl p-6 bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <span className="material-symbols-outlined text-sm">
                  confirmation_number
                </span>
                <p className="text-sm font-semibold uppercase tracking-wider">
                  {t.orderNumber}
                </p>
              </div>
              <p className="text-slate-900 text-2xl font-bold">#LED-982341</p>
            </div>
            <div className="flex flex-col gap-2 rounded-xl p-6 bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <span className="material-symbols-outlined text-sm">
                  local_shipping
                </span>
                <p className="text-sm font-semibold uppercase tracking-wider">
                  {t.estimatedDelivery}
                </p>
              </div>
              <p className="text-slate-900 text-2xl font-bold">
                October 24, 2023
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t border-slate-200 pt-8">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              {t.orderSummary}
            </h3>
            <div className="space-y-4">
              {orderItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="size-16 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                    <div
                      className="w-full h-full bg-center bg-cover"
                      style={{ backgroundImage: `url('${item.image}')` }}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900">{item.name}</h4>
                    <p className="text-sm text-slate-500">
                      {t.qty}: {item.quantity} &bull; {item.variant}
                    </p>
                  </div>
                  <p className="font-semibold text-slate-900">
                    {formatCurrency(item.price)}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-6 pt-6 border-t border-slate-100 space-y-2">
              <div className="flex justify-between text-slate-500">
                <span>{t.subtotal}</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>{t.shipping}</span>
                <span className="text-green-500 font-medium">
                  {shipping === 0 ? dict.common.free : formatCurrency(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-slate-900 text-xl font-bold pt-2">
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
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-200"
            >
              <span className="material-symbols-outlined">shopping_bag</span>
              {t.continueShopping}
            </Link>
          </div>
        </div>

        {/* Help Banner */}
        <div className="bg-slate-50 p-6 flex items-start gap-4">
          <span className="material-symbols-outlined text-primary">info</span>
          <div>
            <p className="text-sm font-medium text-slate-900">
              {t.needHelp}
            </p>
            <p className="text-sm text-slate-500 mt-1">
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
