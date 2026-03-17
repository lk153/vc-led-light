import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/${locale}/login`);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, name: true },
  });

  if (user?.role !== "admin") {
    redirect(`/${locale}`);
  }

  const dict = await getDictionary(locale as Locale);
  const t = dict.admin;

  const navItems = [
    { href: `/${locale}/admin/orders`, label: t.orders, icon: "receipt_long" },
    { href: `/${locale}/admin/users`, label: t.users, icon: "group" },
    { href: `/${locale}/admin/catalog`, label: t.catalog, icon: "inventory_2" },
    { href: `/${locale}/admin/categories`, label: t.categories, icon: "category" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-background-dark text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-lg font-bold">{t.title}</h1>
          <p className="text-sm text-slate-400 mt-1">{user.name}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
            {t.backToSite}
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
