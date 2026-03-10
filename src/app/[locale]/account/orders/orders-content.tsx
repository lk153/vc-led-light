"use client";

import Link from "next/link";
import { useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Dictionary } from "@/i18n/get-dictionary";

type OrdersContentProps = {
  locale: string;
  dict: Dictionary;
};

const orders = [
  {
    id: "10928-8421",
    date: "2023-10-24",
    total: 124.5,
    shipTo: "Alex Johnson",
    status: "delivered" as const,
    statusText: "Delivered Oct 27",
    productName: "Smart RGBIC LED Wall Panels (9 Pack)",
    description: "Package was handed to resident.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBUgY2o8ZcD7E0DaSwH9lhrLjKR64d0adf18wC4Zs9j1kiuNkRfmEarT56h7ymbWqW7ZYY_Scljq8blL8xBU0WGu-47npraX_Z9f4BtttMdUP4vtf8RV8vNnigUdbi8vvZw_biXKHnbVJlvAzA4lKDT3zVyONbdProq8EOrOI7-YrtyUDw-xx5xp5gi750-7T2ULaiT5Zsylna1PcBJ410l36P48H1mHdi-Y8M5JH0mQqSOlFofvTIOHCPL_2AjRWhR3H5hlm0tv7ea",
  },
  {
    id: "11042-9921",
    date: "2023-11-12",
    total: 89.0,
    shipTo: "Alex Johnson",
    status: "shipped" as const,
    statusText: "Arriving Thursday",
    productName: "Warm White Dimmable LED Strips (50ft)",
    description: "Shipped from logistics center in Chicago.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD9J-nHQC2ZbhChx781K2wBYQCcCoORBRX6D60HdyY9M6w0eXqmAw-61vYf6u9GMu0p_aLXME7s-xgK4tSgHrpJlyI_6TTpTtt4S-ocQmS3-KWMj5RRHpQyXkoMBg9e-3a8_tCtB5ZrEESiQBIzbla4XCKhWHDP8hRDwSGokWOz8cwwbEnqL1ED1-ap6B59fJ3n1JTg60O0RMO75rxFcbfxsB3MMEzJZb9D6kogCfojyd-g__VKYr9rYs_6NJwMzo3SIvmwyKQGekjP",
  },
  {
    id: "10811-1229",
    date: "2023-08-05",
    total: 45.99,
    shipTo: "Alex Johnson",
    status: "delivered" as const,
    statusText: "Delivered Aug 09",
    productName: "Ultra-Bright LED Outdoor Flood Light (100W)",
    description: "Item is eligible for return until Sep 09.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAdZSEH-FqESx0B3exelDK6zSSq8qyaH_l391o7GljxKvXvrCW7ho6YXv4gqtV3_mIA-97TJTzBk51TuSDZrdW6mmFgn70SuuFwki54seIbZqVSYc_sIRa80sYFX3c-M4PWOn_qQdprUcm17TdZ6qVIbs5RDLXxkEPmxS0CZuKqdrNBY_GwlpY8ipBEUfCbsU757wqYqdRMNtrbAE0MaYiiKDpUBXBOxe70a6Y-7krAjV-YXqs3Rl2Y5rBv1FXeg3E0uFgNgH29uY9-",
  },
];

export default function OrdersContent({ locale, dict }: OrdersContentProps) {
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
    <div className="flex flex-1 justify-center py-8">
      <div className="flex flex-col max-w-[1024px] flex-1 px-4 md:px-10">
        {/* Header Section */}
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-slate-900 text-3xl md:text-4xl font-black leading-tight tracking-tight">
            {t.pageTitle}
          </h1>
          <p className="text-slate-500 text-base">
            {t.subtitle}
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
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
          {filteredOrders.map((order) => (
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
                    <p className="text-slate-900 text-sm font-semibold underline decoration-dotted cursor-help">
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
                <div
                  className="w-full md:w-32 h-32 shrink-0 bg-slate-100 rounded-lg bg-center bg-no-repeat bg-cover"
                  style={{ backgroundImage: `url("${order.image}")` }}
                />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-1">
                    {order.status === "delivered" ? (
                      <>
                        <span className="material-symbols-outlined text-green-500 text-xl font-bold">
                          check_circle
                        </span>
                        <p className="text-slate-900 font-bold">
                          {order.statusText}
                        </p>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-primary text-xl font-bold">
                          local_shipping
                        </span>
                        <p className="text-primary font-bold">
                          {order.statusText}
                        </p>
                      </>
                    )}
                  </div>
                  <p className="text-slate-700 font-medium">
                    {order.productName}
                  </p>
                  <p className="text-slate-500 text-sm">
                    {order.description}
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
                        <button className="px-4 py-2 border border-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-50 transition-colors">
                          {t.writeReview}
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
                        <button className="px-4 py-2 border border-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-50 transition-colors">
                          {t.editOrder}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-12 flex justify-center">
          <button className="flex items-center gap-2 px-8 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold hover:shadow-md transition-all">
            <span>{t.loadOlderOrders}</span>
            <span className="material-symbols-outlined">expand_more</span>
          </button>
        </div>
      </div>
    </div>
  );
}
