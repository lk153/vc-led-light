"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/actions/auth";

type Props = {
  locale: string;
  label: string;
};

export default function LogoutButton({ locale, label }: Props) {
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push(`/${locale}/login`);
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-slate-500 hover:text-red-500 hover:bg-red-50 font-bold transition-all text-sm"
    >
      <span className="material-symbols-outlined text-[20px]">logout</span>
      <span>{label}</span>
    </button>
  );
}
