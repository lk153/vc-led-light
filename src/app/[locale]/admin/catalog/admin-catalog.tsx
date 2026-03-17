"use client";

import { useState, useTransition } from "react";
import { formatCurrency } from "@/lib/utils";
import { updateProduct } from "@/actions/admin";
import type { Dictionary } from "@/i18n/get-dictionary";

type SerializedProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  sku: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  categoryId: string;
  categoryName: string;
  brand: string;
  featured: boolean;
  wattage: number | null;
  lumens: number | null;
  colorTemperature: string;
  lifespan: number | null;
  cri: number | null;
  imageUrl: string | null;
};

type CategoryOption = { id: string; name: string };

export default function AdminCatalog({
  dict,
  products,
  categories,
}: {
  dict: Dictionary;
  products: SerializedProduct[];
  categories: CategoryOption[];
}) {
  const t = dict.admin;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSave(productId: string, form: HTMLFormElement) {
    const formData = new FormData(form);
    startTransition(async () => {
      await updateProduct(productId, formData);
      setEditingId(null);
    });
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{t.catalogTitle}</h1>
        <p className="text-slate-500 mt-1">{t.catalogSubtitle}</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 text-slate-400">{t.noProducts}</div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
            >
              {editingId === product.id ? (
                <ProductEditForm
                  product={product}
                  categories={categories}
                  t={t}
                  isPending={isPending}
                  onSave={handleSave}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <ProductRow
                  product={product}
                  t={t}
                  onEdit={() => setEditingId(product.id)}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function ProductRow({
  product,
  t,
  onEdit,
}: {
  product: SerializedProduct;
  t: Dictionary["admin"];
  onEdit: () => void;
}) {
  return (
    <div className="flex items-center gap-4 p-4">
      {product.imageUrl ? (
        <div
          className="w-16 h-16 shrink-0 rounded-lg bg-slate-100 bg-center bg-no-repeat bg-cover"
          style={{ backgroundImage: `url("${product.imageUrl}")` }}
        />
      ) : (
        <div className="w-16 h-16 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center">
          <span className="material-symbols-outlined text-2xl text-slate-300">image</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-slate-900 truncate">{product.name}</h3>
          {product.featured && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              {t.featured}
            </span>
          )}
        </div>
        <p className="text-sm text-slate-500 mt-0.5">
          {t.sku}: {product.sku} · {product.categoryName} · {t.stock}: {product.stock}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="font-bold text-slate-900">{formatCurrency(product.price)}</p>
        {product.compareAtPrice && (
          <p className="text-xs text-slate-400 line-through">
            {formatCurrency(product.compareAtPrice)}
          </p>
        )}
      </div>
      <button
        onClick={onEdit}
        className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors"
      >
        <span className="material-symbols-outlined text-base">edit</span>
        {t.edit}
      </button>
    </div>
  );
}

function ProductEditForm({
  product,
  categories,
  t,
  isPending,
  onSave,
  onCancel,
}: {
  product: SerializedProduct;
  categories: CategoryOption[];
  t: Dictionary["admin"];
  isPending: boolean;
  onSave: (productId: string, form: HTMLFormElement) => void;
  onCancel: () => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(product.id, e.currentTarget);
      }}
      className="p-6 space-y-4"
    >
      <h3 className="font-bold text-slate-900">{t.editProduct}: {product.name}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Field label={t.productName} name="name" defaultValue={product.name} />
        <Field label={t.sku} name="sku" defaultValue={product.sku} />
        <Field label={t.brand} name="brand" defaultValue={product.brand} />
        <Field label={t.price} name="price" type="number" defaultValue={String(product.price)} />
        <Field
          label={t.compareAtPrice}
          name="compareAtPrice"
          type="number"
          defaultValue={product.compareAtPrice ? String(product.compareAtPrice) : ""}
        />
        <Field label={t.stock} name="stock" type="number" defaultValue={String(product.stock)} />
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">{t.category}</label>
          <select
            name="categoryId"
            defaultValue={product.categoryId}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              name="featured"
              value="true"
              defaultChecked={product.featured}
              className="rounded border-slate-300"
            />
            {t.featured}
          </label>
        </div>
        <Field label={t.wattage} name="wattage" type="number" defaultValue={product.wattage != null ? String(product.wattage) : ""} />
        <Field label={t.lumens} name="lumens" type="number" defaultValue={product.lumens != null ? String(product.lumens) : ""} />
        <Field label={t.colorTemperature} name="colorTemperature" defaultValue={product.colorTemperature} />
        <Field label={t.lifespan} name="lifespan" type="number" defaultValue={product.lifespan != null ? String(product.lifespan) : ""} />
        <Field label={t.cri} name="cri" type="number" defaultValue={product.cri != null ? String(product.cri) : ""} />
      </div>

      <Field label={t.shortDescription} name="shortDescription" defaultValue={product.shortDescription} />

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">{t.description}</label>
        <textarea
          name="description"
          defaultValue={product.description}
          rows={3}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {t.save}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-slate-100 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-200 transition-colors"
        >
          {t.cancel}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        step={type === "number" ? "any" : undefined}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
      />
    </div>
  );
}
