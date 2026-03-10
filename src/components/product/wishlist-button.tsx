"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleWishlist } from "@/actions/wishlist";

type Props = {
  productId: string;
  isInWishlist: boolean;
  label: string;
  variant?: "full" | "icon";
};

export default function WishlistButton({
  productId,
  isInWishlist,
  label,
  variant = "full",
}: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      await toggleWishlist(productId);
      router.refresh();
    });
  }

  if (variant === "icon") {
    return (
      <button
        onClick={handleClick}
        disabled={isPending}
        className={`p-2 rounded-full transition-all ${
          isInWishlist
            ? "bg-red-50 text-red-500"
            : "bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm text-slate-400 hover:text-red-500"
        } ${isPending ? "opacity-50" : ""}`}
        title={label}
      >
        <span
          className="material-symbols-outlined text-xl"
          style={{
            fontVariationSettings: isInWishlist ? "'FILL' 1" : "'FILL' 0",
          }}
        >
          favorite
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`flex w-full items-center justify-center gap-2 rounded-lg border py-3 text-sm font-semibold transition-colors disabled:opacity-50 ${
        isInWishlist
          ? "border-red-300 text-red-500 bg-red-50 hover:bg-red-100"
          : "border-slate-300 hover:border-primary hover:text-primary"
      }`}
    >
      <span
        className="material-symbols-outlined"
        style={{
          fontVariationSettings: isInWishlist ? "'FILL' 1" : "'FILL' 0",
        }}
      >
        favorite
      </span>
      {label}
    </button>
  );
}
