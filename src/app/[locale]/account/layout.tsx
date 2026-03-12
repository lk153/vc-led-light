import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import AccountSidebar from "./account-sidebar";

export default async function AccountLayout({
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

  const dict = await getDictionary(locale as Locale);
  const t = dict.account.profile;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      image: true,
      membershipTier: true,
    },
  });

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const sidebarLinks = [
    { icon: "person", label: t.sidebarProfileInfo, href: `/${locale}/account` },
    { icon: "package_2", label: t.sidebarOrderHistory, href: `/${locale}/account/orders` },
    { icon: "favorite", label: t.sidebarWishlist, href: `/${locale}/account/wishlist` },
    { icon: "location_on", label: t.sidebarSavedAddresses, href: `/${locale}/account/addresses` },
  ];

  return (
    <div className="max-w-[1280px] mx-auto w-full px-4 lg:px-10 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <AccountSidebar
          locale={locale}
          userName={user.name || ""}
          userEmail={user.email}
          userImage={user.image}
          membershipTier={user.membershipTier}
          memberLabel={t.member}
          logoutLabel={dict.common.logout}
          links={sidebarLinks}
        />
        <div className="flex-1 flex flex-col gap-6">
          {children}
        </div>
      </div>
    </div>
  );
}
