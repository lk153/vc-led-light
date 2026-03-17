"use client";

import { useState, useTransition } from "react";
import { updateCategory } from "@/actions/admin";
import type { Dictionary } from "@/i18n/get-dictionary";

type SerializedCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  productCount: number;
};

export default function AdminCategories({
  dict,
  categories,
}: {
  dict: Dictionary;
  categories: SerializedCategory[];
}) {
  const t = dict.admin;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSave(categoryId: string, form: HTMLFormElement) {
    const formData = new FormData(form);
    startTransition(async () => {
      await updateCategory(categoryId, formData);
      setEditingId(null);
    });
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{t.categoriesTitle}</h1>
        <p className="text-slate-500 mt-1">{t.categoriesSubtitle}</p>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-16 text-slate-400">{t.noCategories}</div>
      ) : (
        <div className="space-y-4">
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              className={`rounded-xl border border-slate-200 shadow-sm overflow-hidden ${idx % 2 === 0 ? "bg-white" : "bg-slate-100"}`}
            >
              {editingId === cat.id ? (
                <CategoryEditForm
                  category={cat}
                  t={t}
                  isPending={isPending}
                  onSave={handleSave}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="flex items-center gap-4 p-4">
                  <div className="w-12 h-12 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                    {cat.icon ? (
                      <span className="material-symbols-outlined text-2xl text-primary">{cat.icon}</span>
                    ) : (
                      <span className="material-symbols-outlined text-2xl text-slate-300">category</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900">{cat.name}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      <span className="font-mono text-xs">{cat.slug}</span>
                      {cat.description && <> · {cat.description}</>}
                    </p>
                  </div>
                  <div className="text-center shrink-0 px-4">
                    <p className="text-lg font-bold text-slate-900">{cat.productCount}</p>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{t.productCount}</p>
                  </div>
                  <button
                    onClick={() => setEditingId(cat.id)}
                    className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                    {t.edit}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function CategoryEditForm({
  category,
  t,
  isPending,
  onSave,
  onCancel,
}: {
  category: SerializedCategory;
  t: Dictionary["admin"];
  isPending: boolean;
  onSave: (categoryId: string, form: HTMLFormElement) => void;
  onCancel: () => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(category.id, e.currentTarget);
      }}
      className="p-6 space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">{t.categoryName}</label>
          <input
            type="text"
            name="name"
            defaultValue={category.name}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">{t.slug}</label>
          <input
            type="text"
            name="slug"
            defaultValue={category.slug}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">{t.icon}</label>
          <input
            type="text"
            name="icon"
            defaultValue={category.icon}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">{t.description}</label>
          <input
            type="text"
            name="description"
            defaultValue={category.description}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {t.save}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 bg-slate-100 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-200 transition-colors"
        >
          {t.cancel}
        </button>
      </div>
    </form>
  );
}
