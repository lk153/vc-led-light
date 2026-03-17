"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SITE_NAME } from "@/lib/constants";
import type { Dictionary } from "@/i18n/get-dictionary";

type Props = {
  locale: string;
  dict: Dictionary;
  cartCount?: number;
  userName?: string | null;
};

export default function Header({ locale, dict, cartCount = 0, userName }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDark, setIsDark] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Sync dark mode from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = stored === "dark" || (!stored && prefersDark);
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle("dark", shouldBeDark);
  }, []);

  function toggleDarkMode() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  function handleSearch(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/${locale}/products?q=${encodeURIComponent(q)}`);
    } else {
      router.push(`/${locale}/products`);
    }
  }

  const prefix = `/${locale}`;

  const navLinks = [
    { label: dict.nav.products, href: `${prefix}/products` },
    { label: dict.nav.categories, href: `${prefix}/products` },
    { label: dict.nav.newArrivals, href: `${prefix}/products?sort=newest` },
    { label: dict.nav.support, href: `${prefix}/support` },
  ];

  function switchLocalePath(targetLocale: string) {
    const pathWithoutLocale = pathname.replace(/^\/(en|vi)/, "");
    return `/${targetLocale}${pathWithoutLocale || "/"}`;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href={prefix} className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-3xl">lightbulb</span>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {SITE_NAME}
            </h1>
          </Link>

          {/* Search */}
          <div className="hidden flex-1 md:block max-w-sm">
            <form onSubmit={handleSearch} role="search">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                  search
                </span>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={dict.common.search}
                  className="w-full rounded-lg border-none bg-slate-100 py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:outline-none dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link, i) => (
            <Link
              key={i}
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-primary transition-colors dark:text-slate-400"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <Link
            href={switchLocalePath(locale === "en" ? "vi" : "en")}
            className="flex h-10 items-center gap-1.5 rounded-lg bg-slate-100 px-3 text-sm font-medium text-slate-700 hover:bg-primary/10 hover:text-primary transition-all dark:bg-slate-800 dark:text-slate-300"
            title={locale === "en" ? "Chuyển sang Tiếng Việt" : "Switch to English"}
          >
            <span className="material-symbols-outlined text-lg">translate</span>
            <span className="hidden sm:inline">{locale === "en" ? "VI" : "EN"}</span>
          </Link>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 hover:bg-primary/10 hover:text-primary transition-all dark:bg-slate-800 dark:text-slate-300"
          >
            <span className="material-symbols-outlined text-xl">
              {isDark ? "light_mode" : "dark_mode"}
            </span>
          </button>

          <Link
            href={`${prefix}/cart`}
            className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 hover:bg-primary/10 hover:text-primary transition-all dark:bg-slate-800 dark:text-slate-300"
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
          {userName ? (
            <Link
              href={`${prefix}/account`}
              className="flex h-10 items-center gap-2 rounded-lg bg-primary/10 px-3 text-primary hover:bg-primary/20 transition-all"
              title={userName}
            >
              <span className="material-symbols-outlined text-xl">person</span>
              <span className="hidden sm:inline text-sm font-medium max-w-[100px] truncate">
                {userName}
              </span>
            </Link>
          ) : (
            <Link
              href={`${prefix}/login`}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 hover:bg-primary/10 hover:text-primary transition-all dark:bg-slate-800 dark:text-slate-300"
            >
              <span className="material-symbols-outlined">person</span>
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg lg:hidden"
          >
            <span className="material-symbols-outlined">
              {mobileOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="border-t border-slate-200 px-4 py-4 lg:hidden dark:border-slate-800">
          {navLinks.map((link, i) => (
            <Link
              key={i}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-400"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={switchLocalePath(locale === "en" ? "vi" : "en")}
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-400"
          >
            {locale === "en" ? "🇻🇳 Tiếng Việt" : "🇬🇧 English"}
          </Link>
        </nav>
      )}
    </header>
  );
}
