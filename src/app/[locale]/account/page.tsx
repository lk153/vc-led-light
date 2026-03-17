import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import EditProfileForm from "./edit-profile-form";
import DeleteAddressButton from "./delete-address-button";

export const metadata: Metadata = { title: "Profile Dashboard" };

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/login`);

  const [dict, user] = await Promise.all([
    getDictionary(locale as Locale),
    prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        addresses: { orderBy: { isDefault: "desc" } },
        orders: { select: { id: true, status: true } },
      },
    }),
  ]);
  const t = dict.account.profile;

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const totalOrders = user.orders.length;
  const activeOrders = user.orders.filter(
    (o) => o.status === "processing" || o.status === "shipped"
  ).length;

  // Platinum progress: based on reward points (2000 = platinum)
  const platinumTarget = 2000;
  const platinumProgress = Math.min(
    Math.round((user.rewardPoints / platinumTarget) * 100),
    100
  );

  return (
    <>
      {/* Page Title */}
      <div>
        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          {t.title}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{t.subtitle}</p>
      </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm group hover:border-primary transition-all dark:bg-slate-900 dark:border-slate-800">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <span className="material-symbols-outlined">shopping_bag</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {t.lifetime}
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t.totalOrders}</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{totalOrders}</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm group hover:border-primary transition-all dark:bg-slate-900 dark:border-slate-800">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                  <span className="material-symbols-outlined">local_shipping</span>
                </div>
                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">
                  {t.inTransit}
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t.activeOrders}</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{activeOrders}</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm group hover:border-primary transition-all dark:bg-slate-900 dark:border-slate-800">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                  <span className="material-symbols-outlined">redeem</span>
                </div>
                <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">
                  {t.balance}
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t.rewardPoints}</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                {user.rewardPoints.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Personal Details */}
          <EditProfileForm
            name={user.name || ""}
            email={user.email}
            phone={user.phone || ""}
            accountType={user.accountType}
            emailVerified={!!user.emailVerified}
            dict={{
              save: "Save",
              cancel: "Cancel",
              edit: "Edit",
              fullName: t.fullName,
              phoneNumber: t.phoneNumber,
              emailAddress: t.emailAddress,
              accountType: t.accountType,
              personalDetails: t.personalDetails,
              verified: dict.common.verified,
            }}
          />

          {/* Membership Progress */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm dark:bg-slate-900 dark:border-slate-800">
            <div className="p-8">
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {t.membershipStatus}
                </label>
                <div className="bg-slate-50 p-6 rounded-xl border border-dashed border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 capitalize">
                      {user.membershipTier} {t.tierProgress}
                    </span>
                    <span className="text-sm font-bold text-primary">
                      {platinumProgress}% {t.toPlatinum}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full shadow-[0_0_10px_rgba(43,140,238,0.5)]"
                      style={{ width: `${platinumProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">
                    {t.platinumMessage}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Saved Addresses */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm dark:bg-slate-900 dark:border-slate-800">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
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
                          : "border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {address.label}
                        </span>
                        {address.isDefault && (
                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded uppercase">
                            Default
                          </span>
                        )}
                        <div className="ml-auto">
                          <DeleteAddressButton
                            addressId={address.id}
                            label={address.label}
                          />
                        </div>
                      </div>
                      <div className="text-slate-600 dark:text-slate-400 text-sm space-y-1">
                        <p className="font-medium text-slate-800 dark:text-slate-200">
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
    </>
  );
}
