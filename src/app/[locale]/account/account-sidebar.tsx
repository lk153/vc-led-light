"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./logout-button";

type SidebarLink = {
  icon: string;
  label: string;
  href: string;
};

export default function AccountSidebar({
  locale,
  userName,
  userEmail,
  userImage,
  membershipTier,
  memberLabel,
  logoutLabel,
  links,
}: {
  locale: string;
  userName: string;
  userEmail: string;
  userImage: string | null;
  membershipTier: string;
  memberLabel: string;
  logoutLabel: string;
  links: SidebarLink[];
}) {
  const pathname = usePathname();

  function isActive(href: string) {
    // Exact match for /account, prefix match for sub-routes
    if (href === `/${locale}/account`) {
      return pathname === `/${locale}/account`;
    }
    return pathname.startsWith(href);
  }

  return (
    <aside className="w-full lg:w-64 flex flex-col gap-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
        <div className="flex items-center gap-4 mb-8">
          <div className="size-12 rounded-full overflow-hidden border-2 border-primary bg-primary/10 flex items-center justify-center">
            {userImage ? (
              <img
                className="w-full h-full object-cover"
                src={userImage}
                alt="Profile avatar"
              />
            ) : (
              <span className="material-symbols-outlined text-primary text-2xl">
                person
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <h1 className="text-slate-900 dark:text-white text-base font-bold leading-tight">
              {userName || userEmail}
            </h1>
            <p className="text-primary text-xs font-semibold uppercase tracking-wider">
              {membershipTier} {memberLabel}
            </p>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                isActive(link.href)
                  ? "flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-white font-medium shadow-md shadow-primary/20 transition-all"
                  : "flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 font-medium transition-all dark:text-slate-400 dark:hover:bg-slate-800"
              }
            >
              <span className="material-symbols-outlined text-[22px]">
                {link.icon}
              </span>
              <span className="text-sm">{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <LogoutButton locale={locale} label={logoutLabel} />
        </div>
      </div>
    </aside>
  );
}
