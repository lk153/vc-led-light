import type { Metadata } from "next";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";

export const metadata: Metadata = { title: "Profile Dashboard" };

const user = {
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  phone: "+1 (555) 123-4567",
  accountType: "Residential Individual",
  membershipTier: "Gold",
  rewardPoints: 1250,
  totalOrders: 24,
  activeOrders: 2,
  platinumProgress: 85,
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAwGA7Aj2DDYNkPGrhxE0Fqsyotj5TRm6ZB043m4bEpaZAOb123GSknPT8ArKAD0OTtLbjs_en13G2u3b8JuhM5dm8Zh9OvnJOGSFTL0_u6vG3HL6QRbv1T7VZth4NQ0nDPx96pqS7YoL31JSToVQ-6_63bldF5dGPqj0rDGU4gEDK2TVh6PvNHcA9PP_0Pw5MHLGmJgO5u4n0wkJVBLv9l2eOnJw70UhHcK9EKLVA6K6rwxn1rO1vbTN_nmphDCYhhVU87xVng5ECK",
};

const defaultAddress = {
  label: "Home Office",
  street: "123 Neon Way, Suite 400",
  city: "Lumina Heights",
  state: "CA",
  zip: "90210",
  country: "United States",
};

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const t = dict.account.profile;

  const sidebarLinks = [
    { icon: "person", label: t.sidebarProfileInfo, href: `/${locale}/account`, active: true },
    { icon: "package_2", label: t.sidebarOrderHistory, href: `/${locale}/account/orders`, active: false },
    { icon: "favorite", label: t.sidebarWishlist, href: `/${locale}/account/wishlist`, active: false },
    { icon: "location_on", label: t.sidebarSavedAddresses, href: "#", active: false },
    { icon: "shield_person", label: t.sidebarSecurity, href: "#", active: false },
  ];

  return (
    <div className="max-w-[1280px] mx-auto w-full px-4 lg:px-10 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="flex items-center gap-4 mb-8">
              <div className="size-12 rounded-full overflow-hidden border-2 border-primary">
                <img
                  className="w-full h-full object-cover"
                  src={user.image}
                  alt="Profile avatar"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-slate-900 text-base font-bold leading-tight">
                  {user.name}
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
              <button className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-slate-500 hover:text-red-500 hover:bg-red-50 font-bold transition-all text-sm">
                <span className="material-symbols-outlined text-[20px]">
                  logout
                </span>
                <span>{dict.common.logout}</span>
              </button>
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
            <p className="text-slate-500 mt-1">
              {t.subtitle}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm group hover:border-primary transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <span className="material-symbols-outlined">
                    shopping_bag
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {t.lifetime}
                </span>
              </div>
              <p className="text-slate-500 text-sm font-medium">
                {t.totalOrders}
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {user.totalOrders}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm group hover:border-primary transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                  <span className="material-symbols-outlined">
                    local_shipping
                  </span>
                </div>
                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">
                  {t.inTransit}
                </span>
              </div>
              <p className="text-slate-500 text-sm font-medium">
                {t.activeOrders}
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {user.activeOrders}
              </p>
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
              <p className="text-slate-500 text-sm font-medium">
                {t.rewardPoints}
              </p>
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
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold hover:bg-primary hover:text-white transition-all">
                <span className="material-symbols-outlined text-[18px]">
                  edit
                </span>
                <span>{t.editProfile}</span>
              </button>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {t.fullName}
                  </label>
                  <p className="text-slate-900 font-medium text-lg">
                    {user.name}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {t.emailAddress}
                  </label>
                  <p className="text-slate-900 font-medium text-lg">
                    {user.email}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {t.phoneNumber}
                  </label>
                  <p className="text-slate-900 font-medium text-lg">
                    {user.phone}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {t.accountType}
                  </label>
                  <div className="flex items-center gap-2">
                    <p className="text-slate-900 font-medium text-lg">
                      {user.accountType}
                    </p>
                    <span className="px-2 py-0.5 bg-green-100 text-green-600 text-[10px] font-black rounded uppercase">
                      {dict.common.verified}
                    </span>
                  </div>
                </div>

                {/* Membership Progress */}
                <div className="md:col-span-2 space-y-4 mt-4">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {t.membershipStatus}
                  </label>
                  <div className="bg-slate-50 p-6 rounded-xl border border-dashed border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-slate-700">
                        {user.membershipTier} {t.tierProgress}
                      </span>
                      <span className="text-sm font-bold text-primary">
                        {user.platinumProgress}% {t.toPlatinum}
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full shadow-[0_0_10px_rgba(43,140,238,0.5)]"
                        style={{ width: `${user.platinumProgress}%` }}
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

          {/* Address & Payment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  location_on
                </span>
                {t.defaultShippingAddress}
              </h4>
              <div className="text-slate-600 text-sm space-y-1">
                <p className="font-bold text-slate-900">
                  {defaultAddress.label}
                </p>
                <p>{defaultAddress.street}</p>
                <p>
                  {defaultAddress.city}, {defaultAddress.state}{" "}
                  {defaultAddress.zip}
                </p>
                <p>{defaultAddress.country}</p>
              </div>
              <button className="mt-4 text-primary text-xs font-bold hover:underline">
                {t.manageAddresses}
              </button>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  credit_card
                </span>
                {t.defaultPaymentMethod}
              </h4>
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-slate-100 rounded flex items-center justify-center border border-slate-200">
                  <span className="material-symbols-outlined text-slate-400">
                    payments
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {t.visaEnding}
                  </p>
                  <p className="text-xs text-slate-500">{t.expires}</p>
                </div>
              </div>
              <button className="mt-4 text-primary text-xs font-bold hover:underline">
                {t.managePayments}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
