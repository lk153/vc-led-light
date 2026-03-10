import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import LogoutButton from "./logout-button";

export const metadata: Metadata = { title: "Profile Dashboard" };

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/${locale}/login`);
  }

  const dict = await getDictionary(locale as Locale);
  const t = dict.account.profile;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      addresses: { orderBy: { isDefault: "desc" } },
      orders: { select: { id: true, status: true } },
    },
  });

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const totalOrders = user.orders.length;
  const activeOrders = user.orders.filter(
    (o) => o.status === "processing" || o.status === "shipped"
  ).length;
  const defaultAddress = user.addresses.find((a) => a.isDefault) || user.addresses[0];

  // Platinum progress: based on reward points (2000 = platinum)
  const platinumTarget = 2000;
  const platinumProgress = Math.min(
    Math.round((user.rewardPoints / platinumTarget) * 100),
    100
  );

  const sidebarLinks = [
    { icon: "person", label: t.sidebarProfileInfo, href: `/${locale}/account`, active: true },
    { icon: "package_2", label: t.sidebarOrderHistory, href: `/${locale}/account/orders`, active: false },
    { icon: "favorite", label: t.sidebarWishlist, href: `/${locale}/account/wishlist`, active: false },
    { icon: "location_on", label: t.sidebarSavedAddresses, href: `/${locale}/account/addresses`, active: false },
  ];

  return (
    <div className="max-w-[1280px] mx-auto w-full px-4 lg:px-10 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="flex items-center gap-4 mb-8">
              <div className="size-12 rounded-full overflow-hidden border-2 border-primary bg-primary/10 flex items-center justify-center">
                {user.image ? (
                  <img
                    className="w-full h-full object-cover"
                    src={user.image}
                    alt="Profile avatar"
                  />
                ) : (
                  <span className="material-symbols-outlined text-primary text-2xl">
                    person
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <h1 className="text-slate-900 text-base font-bold leading-tight">
                  {user.name || user.email}
                </h1>
                <p className="text-primary text-xs font-semibold uppercase tracking-wider">
                  {user.membershipTier} {t.member}
                </p>
              </div>
            </div>

            <nav className="flex flex-col gap-1">
              {sidebarLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={
                    link.active
                      ? "flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-white font-medium shadow-md shadow-primary/20 transition-all"
                      : "flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 font-medium transition-all"
                  }
                >
                  <span className="material-symbols-outlined text-[22px]">
                    {link.icon}
                  </span>
                  <span className="text-sm">{link.label}</span>
                </Link>
              ))}
            </nav>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <LogoutButton locale={locale} label={dict.common.logout} />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Page Title */}
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">
              {t.title}
            </h2>
            <p className="text-slate-500 mt-1">{t.subtitle}</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm group hover:border-primary transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <span className="material-symbols-outlined">shopping_bag</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {t.lifetime}
                </span>
              </div>
              <p className="text-slate-500 text-sm font-medium">{t.totalOrders}</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{totalOrders}</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm group hover:border-primary transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                  <span className="material-symbols-outlined">local_shipping</span>
                </div>
                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">
                  {t.inTransit}
                </span>
              </div>
              <p className="text-slate-500 text-sm font-medium">{t.activeOrders}</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{activeOrders}</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm group hover:border-primary transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                  <span className="material-symbols-outlined">redeem</span>
                </div>
                <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">
                  {t.balance}
                </span>
              </div>
              <p className="text-slate-500 text-sm font-medium">{t.rewardPoints}</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {user.rewardPoints.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Personal Details */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">
                {t.personalDetails}
              </h3>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {t.fullName}
                  </label>
                  <p className="text-slate-900 font-medium text-lg">
                    {user.name || "—"}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {t.emailAddress}
                  </label>
                  <p className="text-slate-900 font-medium text-lg">{user.email}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {t.phoneNumber}
                  </label>
                  <p className="text-slate-900 font-medium text-lg">
                    {user.phone || "—"}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {t.accountType}
                  </label>
                  <div className="flex items-center gap-2">
                    <p className="text-slate-900 font-medium text-lg capitalize">
                      {user.accountType}
                    </p>
                    {user.emailVerified && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-600 text-[10px] font-black rounded uppercase">
                        {dict.common.verified}
                      </span>
                    )}
                  </div>
                </div>

                {/* Membership Progress */}
                <div className="md:col-span-2 space-y-4 mt-4">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {t.membershipStatus}
                  </label>
                  <div className="bg-slate-50 p-6 rounded-xl border border-dashed border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-slate-700 capitalize">
                        {user.membershipTier} {t.tierProgress}
                      </span>
                      <span className="text-sm font-bold text-primary">
                        {platinumProgress}% {t.toPlatinum}
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full shadow-[0_0_10px_rgba(43,140,238,0.5)]"
                        style={{ width: `${platinumProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                      {t.platinumMessage}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Saved Addresses */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">location_on</span>
                {t.sidebarSavedAddresses}
              </h3>
            </div>
            <div className="p-8">
              {user.addresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {user.addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`p-5 rounded-xl border ${
                        address.isDefault
                          ? "border-primary bg-primary/5"
                          : "border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-bold text-slate-900">
                          {address.label}
                        </span>
                        {address.isDefault && (
                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded uppercase">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="text-slate-600 text-sm space-y-1">
                        <p className="font-medium text-slate-800">
                          {address.firstName} {address.lastName}
                        </p>
                        <p>{address.street}</p>
                        {address.apartment && <p>{address.apartment}</p>}
                        <p>
                          {address.city}, {address.state} {address.zipCode}
                        </p>
                        <p>{address.country}</p>
                        {address.phone && (
                          <p className="text-slate-500">{address.phone}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <span className="material-symbols-outlined text-4xl text-slate-300 mb-2 block">
                    location_off
                  </span>
                  <p className="text-sm">
                    No saved addresses yet. Addresses will appear here after your
                    first checkout.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
