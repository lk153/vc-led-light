"use client";

import { useState } from "react";

export default function QuantitySelector({
  max = 99,
  onQuantityChange,
}: {
  max?: number;
  onQuantityChange?: (quantity: number) => void;
}) {
  const [quantity, setQuantity] = useState(1);

  function decrement() {
    setQuantity((prev) => {
      const next = Math.max(1, prev - 1);
      onQuantityChange?.(next);
      return next;
    });
  }

  function increment() {
    setQuantity((prev) => {
      const next = Math.min(max, prev + 1);
      onQuantityChange?.(next);
      return next;
    });
  }

  return (
    <div className="flex items-center overflow-hidden rounded-lg border border-slate-300">
      <button
        onClick={decrement}
        disabled={quantity <= 1}
        className="px-4 py-2 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Decrease quantity"
      >
        -
      </button>
      <span className="px-4 py-2 font-bold">{quantity}</span>
      <button
        onClick={increment}
        disabled={quantity >= max}
        className="px-4 py-2 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
