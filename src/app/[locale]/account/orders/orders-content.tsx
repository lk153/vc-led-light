"use client";

import { useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { SerializedOrder } from "./page";

type OrdersContentProps = {
  dict: Dictionary;
  orders: SerializedOrder[];
};

const statusConfig = {
  delivered: { icon: "check_circle", color: "text-green-500", label: "Delivered" },
  shipped: { icon: "local_shipping", color: "text-primary", label: "Shipped" },
  processing: { icon: "pending", color: "text-orange-500", label: "Processing" },
};

export default function OrdersContent({ dict, orders }: OrdersContentProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const t = dict.account.orders;

  const filterOptions = [
    { label: t.allOrders, value: "all" },
    { label: t.delivered, value: "delivered" },
    { label: t.shipped, value: "shipped" },
    { label: t.processing, value: "processing" },
  ];

  const filteredOrders =
    activeFilter === "all"
      ? orders
      : orders.filter((o) => o.status === activeFilter);

  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-slate-900 text-3xl font-black leading-tight tracking-tight">
          {t.pageTitle}
        </h1>
        <p className="text-slate-500 text-base">{t.subtitle}</p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="flex flex-col w-full h-12">
              <div className="flex w-full flex-1 items-stretch rounded-xl h-full bg-white border border-slate-200 shadow-sm">
                <div className="text-slate-400 flex items-center justify-center pl-4">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input
                  className="flex w-full min-w-0 flex-1 border-none bg-transparent focus:ring-0 focus:outline-none text-slate-900 placeholder:text-slate-400 px-4 text-base"
                  placeholder={t.searchPlaceholder}
                />
              </div>
            </label>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setActiveFilter(option.value)}
                className={
                  activeFilter === option.value
                    ? "flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-primary text-white px-5 font-medium shadow-md shadow-primary/20"
                    : "flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-white border border-slate-200 text-slate-700 px-5 font-medium hover:bg-slate-50 transition-colors"
                }
              >
                <span className="text-sm">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Order Cards List */}
        <div className="flex flex-col gap-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-5xl text-slate-300 mb-3 block">
                receipt_long
              </span>
              <p className="text-slate-500 font-medium">No orders found</p>
              <p className="text-slate-400 text-sm mt-1">
                {activeFilter !== "all"
                  ? "Try a different filter"
                  : "Your order history will appear here after your first purchase."}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const config = statusConfig[order.status] || statusConfig.processing;
              const firstItem = order.items[0];
              const itemNames = order.items.map((i) => `${i.name} x${i.quantity}`).join(", ");

              return (
                <div
                  key={order.id}
                  className="flex flex-col rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-wrap justify-between items-center gap-4">
                    <div className="flex gap-8">
                      <div>
                        <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">
                          {t.orderPlaced}
                        </p>
                        <p className="text-slate-900 text-sm font-semibold">
                          {formatDate(order.date)}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">
                          {t.total}
                        </p>
                        <p className="text-slate-900 text-sm font-semibold">
                          {formatCurrency(order.total)}
                        </p>
                      </div>
                      <div className="hidden sm:block">
                        <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">
                          {t.shipTo}
                        </p>
                        <p className="text-slate-900 text-sm font-semibold">
                          {order.shipTo}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">
                        {t.orderNumber}
                      </p>
                      <p className="text-slate-900 text-sm font-semibold">
                        {order.id}
                      </p>
                    </div>
                  </div>

                  {/* Order Body */}
                  <div className="p-6 flex flex-col md:flex-row gap-6">
                    {firstItem?.imageUrl ? (
                      <div
                        className="w-full md:w-32 h-32 shrink-0 bg-slate-100 rounded-lg bg-center bg-no-repeat bg-cover"
                        style={{ backgroundImage: `url("${firstItem.imageUrl}")` }}
                      />
                    ) : (
                      <div className="w-full md:w-32 h-32 shrink-0 bg-slate-100 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-slate-300">
                          image
                        </span>
                      </div>
                    )}
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`material-symbols-outlined ${config.color} text-xl font-bold`}>
                          {config.icon}
                        </span>
                        <p className={`${config.color} font-bold capitalize`}>
                          {config.label}
                        </p>
                      </div>
                      <p className="text-slate-700 font-medium">{itemNames}</p>
                      <p className="text-slate-500 text-sm">
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {order.status === "delivered" ? (
                          <>
                            <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors">
                              {t.buyAgain}
                            </button>
                            <button className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-200 transition-colors">
                              {t.viewDetails}
                            </button>
                          </>
                        ) : (
                          <>
                            <button className="px-6 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
                              {t.trackOrder}
                            </button>
                            <button className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-200 transition-colors">
                              {t.viewDetails}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
      </div>
    </>
  );
}
