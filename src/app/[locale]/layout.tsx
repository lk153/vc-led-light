import { notFound } from "next/navigation";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getCartCount } from "@/actions/cart";
import { auth } from "@/lib/auth";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const dict = await getDictionary(locale as Locale);
  const cartCount = await getCartCount();
  const session = await auth();
  const userName = session?.user?.name || null;
  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="relative flex min-h-screen flex-col" lang={locale}>
      <Header locale={locale} dict={dict} cartCount={cartCount} userName={userName} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} dict={dict} />
      {isAdmin && (
        <a
          href={`/${locale}/admin`}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 bg-background-dark text-white dark:bg-white dark:text-background-dark text-sm font-bold rounded-full shadow-lg hover:bg-background-dark/90 dark:hover:bg-slate-200 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
          Admin
        </a>
      )}
    </div>
  );
}
