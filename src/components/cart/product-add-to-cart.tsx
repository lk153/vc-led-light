"use client";

import { useRef } from "react";
import QuantitySelector from "@/components/product/quantity-selector";
import AddToCartButton from "./add-to-cart-button";

export default function ProductAddToCart({
  productId,
  stock,
  addToCartLabel,
  outOfStockLabel,
}: {
  productId: string;
  stock: number;
  addToCartLabel: string;
  outOfStockLabel: string;
}) {
  const quantityRef = useRef(1);
  const inStock = stock > 0;

  return (
    <div className="flex gap-4">
      <QuantitySelector
        max={stock}
        onQuantityChange={(q) => {
          quantityRef.current = q;
        }}
      />
      <AddToCartButton
        productId={productId}
        label={inStock ? addToCartLabel : outOfStockLabel}
        disabled={!inStock}
        getQuantity={() => quantityRef.current}
      />
    </div>
  );
}
