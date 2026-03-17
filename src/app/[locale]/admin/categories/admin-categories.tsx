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
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">{t.icon}</th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">{t.categoryName}</th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">{t.slug}</th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">{t.description}</th>
                  <th className="text-center px-6 py-4 font-semibold text-slate-600">{t.productCount}</th>
                  <th className="text-center px-6 py-4 font-semibold text-slate-600">{t.actions}</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) =>
                  editingId === cat.id ? (
                    <CategoryEditRow
                      key={cat.id}
                      category={cat}
                      t={t}
                      isPending={isPending}
                      onSave={handleSave}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    <tr key={cat.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        {cat.icon && (
                          <span className="material-symbols-outlined text-xl text-primary">
                            {cat.icon}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">{cat.name}</td>
                      <td className="px-6 py-4 text-slate-500 font-mono text-xs">{cat.slug}</td>
                      <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                        {cat.description}
                      </td>
                      <td className="px-6 py-4 text-center text-slate-600">{cat.productCount}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setEditingId(cat.id)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                          {t.edit}
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

function CategoryEditRow({
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
    <tr className="border-b border-slate-100 bg-blue-50/30">
      <td colSpan={6} className="px-6 py-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(category.id, e.currentTarget);
          }}
          className="space-y-4"
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
      </td>
    </tr>
  );
}
