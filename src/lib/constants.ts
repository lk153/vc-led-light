export const SITE_NAME = "LuminaLED";
export const SITE_DESCRIPTION =
  "Premium LED lighting solutions for homes and businesses.";

export const NAV_LINKS = [
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/products" },
  { label: "New Arrivals", href: "/products?sort=newest" },
  { label: "Support", href: "/support" },
] as const;

export const FOOTER_LINKS = {
  shop: [
    { label: "New Arrivals", href: "/products?sort=newest" },
    { label: "Best Sellers", href: "/products?sort=popular" },
    { label: "Smart Home", href: "/products?category=smart-lighting" },
  ],
  support: [
    { label: "Shipping Policy", href: "/support" },
    { label: "Refunds & Returns", href: "/support" },
    { label: "Contact Us", href: "/support" },
  ],
} as const;
