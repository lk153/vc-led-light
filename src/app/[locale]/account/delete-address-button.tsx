"use client";
import { useTransition } from "react";
import { deleteAddress } from "@/actions/profile";

export default function DeleteAddressButton({
  addressId,
  label,
}: {
  addressId: string;
  label: string;
}) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      onClick={() => {
        if (confirm(`Delete ${label} address?`))
          startTransition(async () => {
            await deleteAddress(addressId);
          });
      }}
      disabled={isPending}
      className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 disabled:opacity-50 transition-colors"
    >
      <span className="material-symbols-outlined text-sm">delete</span>
    </button>
  );
}
