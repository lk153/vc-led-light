"use client";

import { useState, useTransition } from "react";
import { addToCart } from "@/actions/cart";

export default function AddToCartButton({
  productId,
  label,
  disabled = false,
  variant = "primary",
  getQuantity,
}: {
  productId: string;
  label: string;
  disabled?: boolean;
  variant?: "primary" | "compact" | "icon";
  getQuantity?: () => number;
}) {
  const [isPending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);

  function handleClick() {
    const qty = getQuantity ? getQuantity() : 1;
    startTransition(async () => {
      await addToCart(productId, qty);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    });
  }

  if (variant === "icon") {
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleClick();
        }}
        disabled={disabled || isPending}
        className="flex items-center justify-center p-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined">
          {added ? "check" : "add_shopping_cart"}
        </span>
      </button>
    );
  }

  if (variant === "compact") {
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleClick();
        }}
        disabled={disabled || isPending}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary/10 py-3 font-bold text-primary hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined text-xl">
          {added ? "check" : "add_shopping_cart"}
        </span>
        {isPending ? "..." : added ? "Added!" : label}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isPending}
      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-3 font-bold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span className="material-symbols-outlined">
        {added ? "check" : "add_shopping_cart"}
      </span>
      {isPending ? "..." : added ? "Added!" : label}
    </button>
  );
}
