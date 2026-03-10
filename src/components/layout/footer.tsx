import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import type { Dictionary } from "@/i18n/get-dictionary";

type Props = {
  locale: string;
  dict: Dictionary;
};

export default function Footer({ locale, dict }: Props) {
  const prefix = `/${locale}`;

  const shopLinks = [
    { label: dict.footer.newArrivals, href: `${prefix}/products?sort=newest` },
    { label: dict.footer.bestSellers, href: `${prefix}/products?sort=popular` },
    { label: dict.footer.smartHome, href: `${prefix}/products?category=smart-lighting` },
  ];

  const supportLinks = [
    { label: dict.footer.shippingPolicy, href: `${prefix}/support` },
    { label: dict.footer.refundsReturns, href: `${prefix}/support` },
    { label: dict.footer.contactUs, href: `${prefix}/support` },
  ];

  return (
    <footer className="border-t border-slate-200 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-6 flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined text-3xl">lightbulb</span>
              <h2 className="text-xl font-bold text-slate-900">{SITE_NAME}</h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-500">
              {dict.footer.brandDescription}
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="mb-6 font-bold text-slate-900">{dict.footer.shop}</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="mb-6 font-bold text-slate-900">{dict.footer.support}</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-6 font-bold text-slate-900">{dict.footer.newsletter}</h4>
            <p className="mb-4 text-sm text-slate-500">
              {dict.footer.newsletterText}
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder={dict.footer.emailPlaceholder}
                className="flex-1 rounded-lg border-none bg-slate-100 px-4 text-sm focus:ring-primary"
              />
              <button className="rounded-lg bg-primary p-2 text-white">
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 md:flex-row">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} {SITE_NAME}. {dict.common.allRightsReserved}
          </p>
          <div className="flex gap-6 text-xs text-slate-400">
            <Link href="#" className="hover:text-primary">
              {dict.common.privacyPolicy}
            </Link>
            <Link href="#" className="hover:text-primary">
              {dict.common.termsOfService}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
