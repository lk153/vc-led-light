import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { hashSync } from "bcryptjs";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const rawUrl = process.env.DATABASE_URL!;
const needsSsl = rawUrl.includes("sslmode=require") || rawUrl.includes("supabase");
// Strip sslmode from URL to prevent pg from enforcing verify-full
const connectionString = rawUrl.replace(/[?&]sslmode=require/g, (match) =>
  match.startsWith("?") ? "?" : ""
).replace(/\?$/, "").replace(/\?&/, "?");
const pool = new pg.Pool({
  connectionString,
  ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "indoor-lighting" },
      update: {},
      create: {
        name: "Indoor Lighting",
        slug: "indoor-lighting",
        description: "LED lights for interior spaces",
        icon: "light",
      },
    }),
    prisma.category.upsert({
      where: { slug: "outdoor-lighting" },
      update: {},
      create: {
        name: "Outdoor Lighting",
        slug: "outdoor-lighting",
        description: "Weather-resistant LED lights for outdoor use",
        icon: "wb_twilight",
      },
    }),
    prisma.category.upsert({
      where: { slug: "smart-lighting" },
      update: {},
      create: {
        name: "Smart Lighting",
        slug: "smart-lighting",
        description: "WiFi and Bluetooth connected LED lights",
        icon: "smart_toy",
      },
    }),
    prisma.category.upsert({
      where: { slug: "decorative-lighting" },
      update: {},
      create: {
        name: "Decorative Lighting",
        slug: "decorative-lighting",
        description: "Stylish LED lights for ambiance",
        icon: "lightbulb",
      },
    }),
  ]);

  const [indoor, outdoor, smart, decorative] = categories;

  // Products
  const products = [
    {
      name: "Premium LED Panel Light 60W",
      slug: "premium-led-panel-60w",
      description:
        "Ultra-thin LED panel light with edge-lit technology. Perfect for offices, kitchens, and commercial spaces. Flicker-free design reduces eye strain during long working hours.",
      shortDescription: "Ultra-thin 60W LED panel for offices and kitchens",
      sku: "LED-PNL-60W-001",
      price: 850000,
      compareAtPrice: 1200000,
      categoryId: indoor.id,
      brand: "LuminaLED",
      wattage: 60,
      lumens: 6000,
      colorTemperature: "4000K",
      lifespan: 50000,
      cri: 90,
      stock: 150,
      featured: true,
      rating: 4.5,
      reviewCount: 128,
      images: [
        "/images/products/premium-led-panel-60w.jpg",
        "/images/products/premium-led-panel-60w-2.jpg",
      ],
    },
    {
      name: "Smart WiFi LED Bulb A19",
      slug: "smart-wifi-led-bulb-a19",
      description:
        "Color-changing smart LED bulb compatible with Alexa and Google Home. 16 million colors, schedules, and scenes. No hub required.",
      shortDescription: "WiFi smart bulb with 16M colors",
      sku: "LED-SMT-A19-001",
      price: 450000,
      compareAtPrice: 550000,
      categoryId: smart.id,
      brand: "LuminaLED",
      wattage: 9,
      lumens: 800,
      colorTemperature: "2700K-6500K",
      lifespan: 25000,
      cri: 85,
      stock: 500,
      featured: true,
      rating: 4.3,
      reviewCount: 256,
      images: [
        "/images/products/smart-wifi-led-bulb-a19.jpg",
      ],
    },
    {
      name: "Outdoor LED Flood Light 100W",
      slug: "outdoor-led-flood-100w",
      description:
        "IP66 waterproof LED flood light for security and landscape lighting. Wide 120° beam angle with dusk-to-dawn sensor.",
      shortDescription: "100W waterproof flood light with sensor",
      sku: "LED-FLD-100W-001",
      price: 1550000,
      compareAtPrice: 2100000,
      categoryId: outdoor.id,
      brand: "LuminaLED",
      wattage: 100,
      lumens: 10000,
      colorTemperature: "5000K",
      lifespan: 50000,
      cri: 80,
      stock: 75,
      featured: true,
      rating: 4.7,
      reviewCount: 89,
      images: [
        "/images/products/outdoor-led-flood-100w.jpg",
      ],
    },
    {
      name: "LED Strip Light RGB 5M",
      slug: "led-strip-light-rgb-5m",
      description:
        "Flexible RGB LED strip with remote control. Cuttable every 3 LEDs, self-adhesive backing. Perfect for accent lighting, gaming setups, and under-cabinet installations.",
      shortDescription: "5-meter RGB LED strip with remote",
      sku: "LED-STR-RGB-5M-001",
      price: 250000,
      compareAtPrice: 350000,
      categoryId: decorative.id,
      brand: "LuminaLED",
      wattage: 24,
      lumens: 1200,
      colorTemperature: "RGB",
      lifespan: 30000,
      cri: 75,
      stock: 200,
      featured: true,
      rating: 4.4,
      reviewCount: 312,
      images: [
        "/images/products/led-strip-light-rgb-5m.jpg",
      ],
    },
    {
      name: "Recessed LED Downlight 12W",
      slug: "recessed-led-downlight-12w",
      description:
        "Slim recessed LED downlight with adjustable color temperature. Easy retrofit installation with spring clips.",
      shortDescription: "12W recessed downlight, adjustable color",
      sku: "LED-DWN-12W-001",
      price: 165000,
      compareAtPrice: 220000,
      categoryId: indoor.id,
      brand: "LuminaLED",
      wattage: 12,
      lumens: 1100,
      colorTemperature: "3000K-5000K",
      lifespan: 40000,
      cri: 90,
      stock: 300,
      featured: false,
      rating: 4.6,
      reviewCount: 74,
      images: [
        "/images/products/recessed-led-downlight-12w.jpg",
      ],
    },
    {
      name: "LED Desk Lamp with Wireless Charger",
      slug: "led-desk-lamp-wireless-charger",
      description:
        "Modern LED desk lamp with built-in Qi wireless charging pad. 5 brightness levels, 3 color modes, and USB-A charging port.",
      shortDescription: "Desk lamp with wireless charging",
      sku: "LED-DSK-WC-001",
      price: 890000,
      compareAtPrice: 1200000,
      categoryId: smart.id,
      brand: "LuminaLED",
      wattage: 10,
      lumens: 600,
      colorTemperature: "2700K-6500K",
      lifespan: 30000,
      cri: 95,
      stock: 120,
      featured: false,
      rating: 4.8,
      reviewCount: 45,
      images: [
        "/images/products/led-desk-lamp-wireless-charger.jpg",
      ],
    },
    {
      name: "Solar LED Garden Path Lights (6-Pack)",
      slug: "solar-led-garden-path-6pack",
      description:
        "Stainless steel solar-powered path lights. Auto on at dusk, off at dawn. No wiring needed. Waterproof IP65 rated.",
      shortDescription: "6-pack solar garden path lights",
      sku: "LED-SOL-PTH-6PK",
      price: 750000,
      compareAtPrice: 950000,
      categoryId: outdoor.id,
      brand: "LuminaLED",
      wattage: 1,
      lumens: 30,
      colorTemperature: "3000K",
      lifespan: 20000,
      cri: 70,
      stock: 90,
      featured: false,
      rating: 4.2,
      reviewCount: 167,
      images: [
        "/images/products/solar-led-garden-path-6pack.jpg",
      ],
    },
    {
      name: "LED Pendant Light Modern Globe",
      slug: "led-pendant-light-globe",
      description:
        "Minimalist globe pendant light with warm LED. Hand-blown glass shade. Adjustable hanging height up to 60 inches.",
      shortDescription: "Modern globe pendant with warm LED",
      sku: "LED-PND-GLB-001",
      price: 1850000,
      compareAtPrice: 2500000,
      categoryId: decorative.id,
      brand: "LuminaLED",
      wattage: 8,
      lumens: 500,
      colorTemperature: "2700K",
      lifespan: 25000,
      cri: 90,
      stock: 40,
      featured: false,
      rating: 4.9,
      reviewCount: 33,
      images: [
        "/images/products/led-pendant-light-globe.jpg",
      ],
    },
  ];

  for (const product of products) {
    const { images, ...data } = product;
    const created = await prisma.product.upsert({
      where: { slug: data.slug },
      update: { price: data.price, compareAtPrice: data.compareAtPrice ?? undefined },
      create: {
        ...data,
        price: data.price,
        compareAtPrice: data.compareAtPrice ?? undefined,
        rating: data.rating,
        images: {
          create: images.map((url, i) => ({ url, alt: data.name, position: i })),
        },
      },
    });
    console.log(`  Product: ${created.name}`);
  }

  // Vietnamese translations for products
  const viTranslations: Record<string, { name: string; shortDescription: string; description: string }> = {
    "premium-led-panel-60w": {
      name: "Đèn LED Panel Cao Cấp 60W",
      shortDescription: "Đèn panel LED siêu mỏng 60W cho văn phòng và nhà bếp",
      description:
        "Đèn panel LED siêu mỏng với công nghệ chiếu sáng cạnh. Hoàn hảo cho văn phòng, nhà bếp và không gian thương mại. Thiết kế không nhấp nháy giảm mỏi mắt trong thời gian làm việc dài.",
    },
    "smart-wifi-led-bulb-a19": {
      name: "Bóng Đèn LED Thông Minh WiFi A19",
      shortDescription: "Bóng đèn thông minh WiFi với 16 triệu màu",
      description:
        "Bóng đèn LED thông minh đổi màu tương thích với Alexa và Google Home. 16 triệu màu, lịch trình và cảnh. Không cần hub.",
    },
    "outdoor-led-flood-100w": {
      name: "Đèn LED Pha Ngoài Trời 100W",
      shortDescription: "Đèn pha chống nước 100W với cảm biến",
      description:
        "Đèn LED pha chống nước IP66 cho an ninh và chiếu sáng cảnh quan. Góc chiếu rộng 120° với cảm biến hoàng hôn-bình minh.",
    },
    "led-strip-light-rgb-5m": {
      name: "Đèn LED Dây RGB 5M",
      shortDescription: "Dây LED RGB 5 mét với điều khiển từ xa",
      description:
        "Dây LED RGB linh hoạt với điều khiển từ xa. Có thể cắt mỗi 3 bóng LED, mặt sau dán dính. Hoàn hảo cho chiếu sáng trang trí, góc chơi game và lắp đặt dưới tủ.",
    },
    "recessed-led-downlight-12w": {
      name: "Đèn LED Âm Trần 12W",
      shortDescription: "Đèn âm trần 12W, nhiệt độ màu có thể điều chỉnh",
      description:
        "Đèn LED âm trần mỏng với nhiệt độ màu có thể điều chỉnh. Lắp đặt dễ dàng với kẹp lò xo.",
    },
    "led-desk-lamp-wireless-charger": {
      name: "Đèn Bàn LED Sạc Không Dây",
      shortDescription: "Đèn bàn với sạc không dây",
      description:
        "Đèn bàn LED hiện đại với đế sạc không dây Qi tích hợp. 5 mức độ sáng, 3 chế độ màu và cổng sạc USB-A.",
    },
    "solar-led-garden-path-6pack": {
      name: "Đèn LED Năng Lượng Mặt Trời Lối Đi (Bộ 6)",
      shortDescription: "Bộ 6 đèn lối đi vườn năng lượng mặt trời",
      description:
        "Đèn lối đi năng lượng mặt trời thép không gỉ. Tự bật lúc hoàng hôn, tắt lúc bình minh. Không cần dây điện. Chống nước IP65.",
    },
    "led-pendant-light-globe": {
      name: "Đèn Treo LED Hình Cầu Hiện Đại",
      shortDescription: "Đèn treo hình cầu hiện đại với LED ấm",
      description:
        "Đèn treo hình cầu tối giản với LED ấm. Chao đèn thủy tinh thổi tay. Chiều cao treo có thể điều chỉnh đến 150cm.",
    },
  };

  for (const [slug, trans] of Object.entries(viTranslations)) {
    const product = await prisma.product.findUnique({ where: { slug } });
    if (product) {
      await prisma.productTranslation.upsert({
        where: { productId_locale: { productId: product.id, locale: "vi" } },
        update: { name: trans.name, shortDescription: trans.shortDescription, description: trans.description },
        create: {
          productId: product.id,
          locale: "vi",
          name: trans.name,
          shortDescription: trans.shortDescription,
          description: trans.description,
        },
      });
      console.log(`  Translation (vi): ${trans.name}`);
    }
  }

  // Demo user
  const user = await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: {},
    create: {
      name: "Admin Test",
      email: "admin@admin.com",
      passwordHash: hashSync("password123", 10),
      phone: "+1 (555) 123-4567",
      role: "admin",
      membershipTier: "gold",
      rewardPoints: 2450,
    },
  });
  console.log(`  User: ${user.email}`);

  // Demo address
  const address = await prisma.address.upsert({
    where: { id: "demo-address-1" },
    update: {},
    create: {
      id: "demo-address-1",
      userId: user.id,
      label: "Home",
      firstName: "John",
      lastName: "Smith",
      street: "123 Main Street",
      apartment: "Apt 4B",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "US",
      phone: "+1 (555) 123-4567",
      isDefault: true,
    },
  });
  console.log(`  Address: ${address.id}`);

  // Promo code
  const promoCode = await prisma.promoCode.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      discountType: "percentage",
      discountValue: 10,
      minOrder: 500000,
      maxUses: 1000,
      active: true,
      expiresAt: new Date("2027-12-31"),
    },
  });
  console.log(`  Promo Code: ${promoCode.code}`);

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
