import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import DeleteAddressButton from "../delete-address-button";
import AddAddressForm from "./add-address-form";

export const metadata: Metadata = { title: "Saved Addresses" };

export default async function AddressesPage({
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

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: { isDefault: "desc" },
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            {t.sidebarSavedAddresses}
          </h2>
          <p className="text-slate-500 mt-1">
            Manage your shipping and billing addresses
          </p>
        </div>
        <AddAddressForm />
      </div>

      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`bg-white p-5 rounded-xl border ${
                address.isDefault
                  ? "border-primary bg-primary/5"
                  : "border-slate-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary text-lg">
                  {address.label === "Home" ? "home" : address.label === "Office" ? "business" : "location_on"}
                </span>
                <span className="text-sm font-bold text-slate-900">
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
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-slate-300 mb-3 block">
            location_off
          </span>
          <p className="text-slate-500 font-medium">No saved addresses yet</p>
          <p className="text-slate-400 text-sm mt-1">
            Add an address to get started
          </p>
        </div>
      )}
    </>
  );
}
