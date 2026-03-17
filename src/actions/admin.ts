"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (user?.role !== "admin") throw new Error("Not authorized");
  return session.user;
}

// ─── Orders ───

export async function getAdminOrders() {
  await requireAdmin();
  return prisma.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateOrderStatus(orderId: string, status: string) {
  await requireAdmin();
  const validStatuses = ["processing", "shipped", "delivered", "cancelled"];
  if (!validStatuses.includes(status)) throw new Error("Invalid status");

  const data: { status: string; deliveredAt?: Date } = { status };
  if (status === "delivered") data.deliveredAt = new Date();

  await prisma.order.update({ where: { id: orderId }, data });
  revalidatePath("/admin/orders", "page");
  return { success: true };
}

// ─── Users ───

export async function getAdminUsers() {
  await requireAdmin();
  return prisma.user.findMany({
    include: {
      _count: { select: { orders: true, wishlistItems: true, reviews: true } },
      addresses: { orderBy: { isDefault: "desc" } },
      orders: {
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          orderNumber: true,
          status: true,
          total: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function toggleUserActive(userId: string) {
  await requireAdmin();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, accountType: true },
  });
  if (!user) throw new Error("User not found");
  if (user.role === "admin") throw new Error("Cannot deactivate admin");

  const newType = user.accountType === "disabled" ? "individual" : "disabled";
  await prisma.user.update({
    where: { id: userId },
    data: { accountType: newType },
  });
  revalidatePath("/admin/users", "page");
  return { success: true };
}

// ─── Products ───

export async function getAdminProducts() {
  await requireAdmin();
  return prisma.product.findMany({
    include: { category: true, images: { orderBy: { position: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateProduct(productId: string, formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const shortDescription = formData.get("shortDescription") as string;
  const description = formData.get("description") as string;
  const sku = formData.get("sku") as string;
  const price = Number(formData.get("price"));
  const compareAtPrice = formData.get("compareAtPrice")
    ? Number(formData.get("compareAtPrice"))
    : null;
  const stock = Number(formData.get("stock"));
  const categoryId = formData.get("categoryId") as string;
  const brand = (formData.get("brand") as string) || null;
  const featured = formData.get("featured") === "true";
  const wattage = formData.get("wattage") ? Number(formData.get("wattage")) : null;
  const lumens = formData.get("lumens") ? Number(formData.get("lumens")) : null;
  const colorTemperature = (formData.get("colorTemperature") as string) || null;
  const lifespan = formData.get("lifespan") ? Number(formData.get("lifespan")) : null;
  const cri = formData.get("cri") ? Number(formData.get("cri")) : null;

  await prisma.product.update({
    where: { id: productId },
    data: {
      name,
      shortDescription,
      description,
      sku,
      price,
      compareAtPrice,
      stock,
      categoryId,
      brand,
      featured,
      wattage,
      lumens,
      colorTemperature,
      lifespan,
      cri,
    },
  });
  revalidatePath("/admin/catalog", "page");
  return { success: true };
}

export async function updateOrderItem(
  itemId: string,
  formData: FormData
) {
  await requireAdmin();

  const quantity = Number(formData.get("quantity"));
  const price = Number(formData.get("price"));

  if (quantity < 1) throw new Error("Quantity must be at least 1");
  if (price < 0) throw new Error("Price cannot be negative");

  const item = await prisma.orderItem.update({
    where: { id: itemId },
    data: { quantity, price },
    select: { orderId: true },
  });

  // Recalculate order totals
  const orderItems = await prisma.orderItem.findMany({
    where: { orderId: item.orderId },
  });
  const subtotal = orderItems.reduce(
    (sum, i) => sum + Number(i.price) * i.quantity,
    0
  );
  const order = await prisma.order.findUnique({
    where: { id: item.orderId },
    select: { shippingCost: true, tax: true, discount: true },
  });
  const total =
    subtotal +
    Number(order!.shippingCost) +
    Number(order!.tax) -
    Number(order!.discount);

  await prisma.order.update({
    where: { id: item.orderId },
    data: { subtotal, total: Math.max(total, 0) },
  });

  revalidatePath("/admin/orders", "page");
  return { success: true };
}

export async function updateOrderDiscount(
  orderId: string,
  formData: FormData
) {
  await requireAdmin();

  const discount = Number(formData.get("discount"));
  if (discount < 0) throw new Error("Discount cannot be negative");

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { subtotal: true, shippingCost: true, tax: true },
  });
  if (!order) throw new Error("Order not found");

  const total =
    Number(order.subtotal) +
    Number(order.shippingCost) +
    Number(order.tax) -
    discount;

  await prisma.order.update({
    where: { id: orderId },
    data: { discount, total: Math.max(total, 0) },
  });

  revalidatePath("/admin/orders", "page");
  return { success: true };
}

export async function resetUserPassword(userId: string) {
  await requireAdmin();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  if (!user) throw new Error("User not found");

  // Reset to default password "password123"
  const bcrypt = await import("bcryptjs");
  const passwordHash = await bcrypt.hash("password123", 12);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  revalidatePath("/admin/users", "page");
  return { success: true };
}

// ─── Categories ───

export async function getAdminCategories() {
  await requireAdmin();
  return prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
}

export async function updateCategory(categoryId: string, formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = (formData.get("description") as string) || null;
  const icon = (formData.get("icon") as string) || null;

  await prisma.category.update({
    where: { id: categoryId },
    data: { name, slug, description, icon },
  });
  revalidatePath("/admin/categories", "page");
  return { success: true };
}
