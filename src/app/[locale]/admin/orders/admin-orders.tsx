"use client";

import { useState, useTransition } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { updateOrderStatus, updateOrderItem, updateOrderDiscount } from "@/actions/admin";
import type { Dictionary } from "@/i18n/get-dictionary";

type SerializedOrder = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  promoCode: string | null;
  paymentMethod: string;
  paymentLast4: string | null;
  shippingName: string;
  shippingStreet: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  shippingCountry: string;
  billingName: string | null;
  billingStreet: string | null;
  billingCity: string | null;
  billingState: string | null;
  billingZip: string | null;
  billingCountry: string | null;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  items: { id: string; name: string; price: number; quantity: number; imageUrl: string | null }[];
};

const statusColors: Record<string, string> = {
  processing: "bg-orange-100 text-orange-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminOrders({
  dict,
  orders,
}: {
  dict: Dictionary;
  orders: SerializedOrder[];
}) {
  const t = dict.admin;
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(orderId: string, newStatus: string) {
    startTransition(async () => {
      await updateOrderStatus(orderId, newStatus);
    });
  }

  function handleItemSave(itemId: string, form: HTMLFormElement) {
    const formData = new FormData(form);
    startTransition(async () => {
      await updateOrderItem(itemId, formData);
    });
  }

  function handleDiscountSave(orderId: string, form: HTMLFormElement) {
    const formData = new FormData(form);
    startTransition(async () => {
      await updateOrderDiscount(orderId, formData);
    });
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{t.ordersTitle}</h1>
        <p className="text-slate-500 mt-1">{t.ordersSubtitle}</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 text-slate-400">{t.noOrders}</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, idx) => (
            <OrderCard
              key={order.id}
              order={order}
              t={t}
              even={idx % 2 === 0}
              expanded={expandedId === order.id}
              onToggle={() => setExpandedId(expandedId === order.id ? null : order.id)}
              onStatusChange={handleStatusChange}
              onItemSave={handleItemSave}
              onDiscountSave={handleDiscountSave}
              isPending={isPending}
            />
          ))}
        </div>
      )}
    </>
  );
}

function OrderCard({
  order,
  t,
  even,
  expanded,
  onToggle,
  onStatusChange,
  onItemSave,
  onDiscountSave,
  isPending,
}: {
  order: SerializedOrder;
  t: Dictionary["admin"];
  even: boolean;
  expanded: boolean;
  onToggle: () => void;
  onStatusChange: (orderId: string, status: string) => void;
  onItemSave: (itemId: string, form: HTMLFormElement) => void;
  onDiscountSave: (orderId: string, form: HTMLFormElement) => void;
  isPending: boolean;
}) {
  const statuses = ["processing", "shipped", "delivered", "cancelled"];
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingDiscount, setEditingDiscount] = useState(false);

  return (
    <div className={`rounded-xl border border-slate-200 shadow-sm overflow-hidden ${even ? "bg-white" : "bg-slate-100"}`}>
      {/* Order summary row */}
      <div className="flex items-center gap-4 p-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-slate-900">{order.orderNumber}</h3>
            <select
              value={order.status}
              onChange={(e) => onStatusChange(order.id, e.target.value)}
              disabled={isPending}
              className={`text-xs font-bold px-3 py-1.5 rounded-full border-none cursor-pointer ${statusColors[order.status] || statusColors.processing}`}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {t[s as keyof typeof t] as string}
                </option>
              ))}
            </select>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            {order.customerName} · {order.customerEmail} · {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="font-bold text-slate-900">{formatCurrency(order.total)}</p>
          <p className="text-xs text-slate-400">{order.items.length} {t.items}</p>
        </div>
        <button
          onClick={onToggle}
          className="shrink-0 inline-flex items-center gap-1 text-primary hover:text-primary/80 font-medium text-xs"
        >
          <span className="material-symbols-outlined text-base">
            {expanded ? "expand_less" : "expand_more"}
          </span>
          {expanded ? t.close : t.orderDetails}
        </button>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-slate-200 bg-slate-100 px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Items */}
            <div className="md:col-span-2">
              <h4 className="font-bold text-slate-700 mb-3">{t.items}</h4>
              <div className="space-y-2">
                {order.items.map((item) =>
                  editingItemId === item.id ? (
                    <form
                      key={item.id}
                      onSubmit={(e) => {
                        e.preventDefault();
                        onItemSave(item.id, e.currentTarget);
                        setEditingItemId(null);
                      }}
                      className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg border border-primary/30"
                    >
                      {item.imageUrl ? (
                        <div
                          className="w-12 h-12 shrink-0 rounded bg-slate-100 bg-center bg-no-repeat bg-cover"
                          style={{ backgroundImage: `url("${item.imageUrl}")` }}
                        />
                      ) : (
                        <div className="w-12 h-12 shrink-0 rounded bg-slate-100 flex items-center justify-center">
                          <span className="material-symbols-outlined text-lg text-slate-300">image</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{item.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <label className="text-xs text-slate-500">{t.quantity}:</label>
                          <input
                            type="number"
                            name="quantity"
                            defaultValue={item.quantity}
                            min={1}
                            className="w-16 rounded border border-slate-200 px-2 py-1 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          />
                          <label className="text-xs text-slate-500 ml-2">{t.price}:</label>
                          <input
                            type="number"
                            name="price"
                            defaultValue={item.price}
                            min={0}
                            step="any"
                            className="w-24 rounded border border-slate-200 px-2 py-1 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          />
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          type="submit"
                          disabled={isPending}
                          className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50"
                        >
                          {t.save}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingItemId(null)}
                          className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-200"
                        >
                          {t.cancel}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div key={item.id} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200">
                      {item.imageUrl ? (
                        <div
                          className="w-12 h-12 shrink-0 rounded bg-slate-100 bg-center bg-no-repeat bg-cover"
                          style={{ backgroundImage: `url("${item.imageUrl}")` }}
                        />
                      ) : (
                        <div className="w-12 h-12 shrink-0 rounded bg-slate-100 flex items-center justify-center">
                          <span className="material-symbols-outlined text-lg text-slate-300">image</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{item.name}</p>
                        <p className="text-xs text-slate-400">x{item.quantity} @ {formatCurrency(item.price)}</p>
                      </div>
                      <p className="text-sm font-bold text-slate-900">{formatCurrency(item.price * item.quantity)}</p>
                      <button
                        onClick={() => setEditingItemId(item.id)}
                        className="shrink-0 p-1.5 text-slate-400 hover:text-primary transition-colors"
                        title={t.edit}
                      >
                        <span className="material-symbols-outlined text-base">edit</span>
                      </button>
                    </div>
                  )
                )}
              </div>
              {/* Summary */}
              <div className="mt-4 pt-3 border-t border-slate-200 space-y-1 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>{t.subtotal}</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>{t.shipping}</span>
                  <span>{formatCurrency(order.shippingCost)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>{t.tax}</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
                {editingDiscount ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      onDiscountSave(order.id, e.currentTarget);
                      setEditingDiscount(false);
                    }}
                    className="flex items-center justify-between"
                  >
                    <span className="text-green-600">{t.discount}</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        name="discount"
                        defaultValue={order.discount}
                        min={0}
                        step="any"
                        className="w-28 rounded border border-slate-200 px-2 py-1 text-xs text-right focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                      <button
                        type="submit"
                        disabled={isPending}
                        className="px-2 py-1 bg-primary text-white text-xs font-bold rounded hover:bg-primary/90 disabled:opacity-50"
                      >
                        {t.save}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingDiscount(false)}
                        className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded hover:bg-slate-200"
                      >
                        {t.cancel}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center justify-between text-green-600">
                    <span>{t.discount} {order.promoCode && `(${order.promoCode})`}</span>
                    <div className="flex items-center gap-2">
                      <span>-{formatCurrency(order.discount)}</span>
                      <button
                        onClick={() => setEditingDiscount(true)}
                        className="p-0.5 text-slate-400 hover:text-primary transition-colors"
                        title={t.edit}
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                    </div>
                  </div>
                )}
                <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>{t.total}</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Addresses & Payment */}
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-700 mb-2">{t.shippingAddress}</h4>
                <div className="text-sm text-slate-600 bg-white p-3 rounded-lg border border-slate-200">
                  <p>{order.shippingName}</p>
                  <p>{order.shippingStreet}</p>
                  <p>{order.shippingCity}, {order.shippingState} {order.shippingZip}</p>
                  <p>{order.shippingCountry}</p>
                </div>
              </div>
              {order.billingName && (
                <div>
                  <h4 className="font-bold text-slate-700 mb-2">{t.billingAddress}</h4>
                  <div className="text-sm text-slate-600 bg-white p-3 rounded-lg border border-slate-200">
                    <p>{order.billingName}</p>
                    <p>{order.billingStreet}</p>
                    <p>{order.billingCity}, {order.billingState} {order.billingZip}</p>
                    <p>{order.billingCountry}</p>
                  </div>
                </div>
              )}
              <div>
                <h4 className="font-bold text-slate-700 mb-2">{t.paymentMethod}</h4>
                <div className="text-sm text-slate-600 bg-white p-3 rounded-lg border border-slate-200">
                  <p className="capitalize">{order.paymentMethod}</p>
                  {order.paymentLast4 && <p className="text-slate-400">•••• {order.paymentLast4}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
