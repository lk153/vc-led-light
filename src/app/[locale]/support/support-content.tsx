"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";

export default function SupportContent({
  locale,
  dict,
}: {
  locale: string;
  dict: Dictionary;
}) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const t = dict.support;

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const categories = [
    {
      icon: "local_shipping",
      title: t.categories.orderTracking,
      description: t.categories.orderTrackingDesc,
    },
    {
      icon: "assignment_return",
      title: t.categories.returnsRefunds,
      description: t.categories.returnsRefundsDesc,
    },
    {
      icon: "lightbulb",
      title: t.categories.installationGuides,
      description: t.categories.installationGuidesDesc,
    },
    {
      icon: "verified_user",
      title: t.categories.productWarranty,
      description: t.categories.productWarrantyDesc,
    },
  ];

  const allFaqs = [
    { question: t.faqs.q1, answer: t.faqs.a1 },
    { question: t.faqs.q2, answer: t.faqs.a2 },
    { question: t.faqs.q3, answer: t.faqs.a3 },
    { question: t.faqs.q4, answer: t.faqs.a4 },
    { question: t.faqs.q5, answer: t.faqs.a5 },
  ];

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const faqs = normalizedQuery
    ? allFaqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(normalizedQuery) ||
          faq.answer.toLowerCase().includes(normalizedQuery),
      )
    : allFaqs;

  return (
    <div>
      {/* Hero Search Section */}
      <div className="w-full bg-primary/10 py-16 px-6">
        <div className="max-w-[960px] mx-auto flex flex-col items-center gap-8 text-center">
          <div className="space-y-4">
            <h1 className="text-slate-900 text-4xl md:text-5xl font-black tracking-tight">
              {t.heroTitle}
            </h1>
            <p className="text-slate-600 text-base md:text-lg max-w-2xl">
              {t.heroDescription}
            </p>
          </div>
          <div className="w-full max-w-2xl">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                className="block w-full pl-12 pr-32 py-4 md:py-5 border-none bg-white rounded-xl shadow-lg focus:ring-2 focus:ring-primary text-slate-900 placeholder:text-slate-400"
                placeholder={t.searchPlaceholder}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setOpenFaq(null);
                }}
              />
              {searchQuery ? (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setOpenFaq(0);
                  }}
                  className="absolute right-2 top-2 bottom-2 px-4 text-slate-400 hover:text-slate-700 transition-colors"
                  aria-label="Clear search"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              ) : (
                <button className="absolute right-2 top-2 bottom-2 px-6 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary/90 transition-all">
                  {t.searchButton}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-12">
        {/* Categories Grid */}
        <section className="mb-16">
          <h2 className="text-slate-900 text-2xl font-bold mb-8">
            {t.browseByCategory}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.title}
                className="group p-6 bg-white rounded-xl border border-slate-200 hover:border-primary transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">
                    {category.icon}
                  </span>
                </div>
                <h3 className="text-slate-900 font-bold text-lg mb-2">
                  {category.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Main Content: FAQs + Contact Sidebar */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* FAQs Accordion */}
          <div className="flex-1">
            <h2 className="text-slate-900 text-2xl font-bold mb-8">
              {normalizedQuery
                ? `${faqs.length} result${faqs.length !== 1 ? "s" : ""} for "${searchQuery}"`
                : t.popularFaqs}
            </h2>
            {faqs.length === 0 && (
              <div className="flex flex-col items-center gap-4 py-12 text-center text-slate-500">
                <span className="material-symbols-outlined text-5xl text-slate-300">search_off</span>
                <p>No FAQs match your search. Try different keywords or contact support.</p>
              </div>
            )}
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-slate-200 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-semibold text-slate-900">
                      {faq.question}
                    </span>
                    <span className="material-symbols-outlined text-slate-400 transition-transform duration-200 shrink-0 ml-4">
                      {openFaq === index ? "expand_less" : "expand_more"}
                    </span>
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-4 text-slate-600 text-sm leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar: Contact Support */}
          <aside className="w-full lg:w-80">
            <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-24">
              <h3 className="text-slate-900 font-bold text-xl mb-6">
                {t.needMoreHelp}
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {t.emailUs}
                    </p>
                    <p className="text-sm text-slate-500">
                      {t.emailAddress}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {t.responseTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined">call</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {t.callSupport}
                    </p>
                    <p className="text-sm text-slate-500">{t.phoneNumber}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {t.callHours}
                    </p>
                  </div>
                </div>
                <hr className="border-slate-100" />
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-600 mb-3 italic">
                    {t.testimonial}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="size-6 rounded-full bg-slate-300" />
                    <span className="text-xs font-medium text-slate-900">
                      {t.testimonialAuthor}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Floating Live Chat Button */}
      <button className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-primary text-white px-6 py-4 rounded-full shadow-2xl hover:scale-105 transition-transform group">
        <span className="material-symbols-outlined text-2xl">chat_bubble</span>
        <span className="font-bold tracking-wide">{t.liveChat}</span>
        <div className="absolute -top-1 -right-1 size-4 bg-green-500 border-2 border-white rounded-full" />
      </button>
    </div>
  );
}
