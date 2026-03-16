"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { getCart } from "./cart";

// Save shipping info to a cookie for the checkout session
export async function saveShippingInfo(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const info = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    street: formData.get("street") as string,
    apartment: (formData.get("apartment") as string) || "",
    city: formData.get("city") as string,
    state: formData.get("state") as string,
    zipCode: formData.get("zipCode") as string,
    phone: (formData.get("phone") as string) || "",
  };

  // Basic validation
  if (
    !info.firstName ||
    !info.lastName ||
    !info.street ||
    !info.city ||
    !info.state ||
    !info.zipCode
  ) {
    return { error: "Please fill in all required fields" };
  }

  const cookieStore = await cookies();
  cookieStore.set("checkout_shipping", JSON.stringify(info), {
    path: "/",
    maxAge: 3600,
    httpOnly: true,
    sameSite: "lax",
  });
  return { success: true };
}

// Save billing info
export async function saveBillingInfo(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const sameAsShipping = formData.get("sameAsShipping") === "true";

  if (sameAsShipping) {
    const cookieStore = await cookies();
    cookieStore.set(
      "checkout_billing",
      JSON.stringify({ sameAsShipping: true }),
      { path: "/", maxAge: 3600, httpOnly: true, sameSite: "lax" }
    );
    return { success: true };
  }

  const info = {
    sameAsShipping: false,
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    street: formData.get("street") as string,
    apartment: (formData.get("apartment") as string) || "",
    city: formData.get("city") as string,
    state: formData.get("state") as string,
    zipCode: formData.get("zipCode") as string,
    phone: (formData.get("phone") as string) || "",
  };

  if (
    !info.firstName ||
    !info.lastName ||
    !info.street ||
    !info.city ||
    !info.state ||
    !info.zipCode
  ) {
    return { error: "Please fill in all required fields" };
  }

  const cookieStore = await cookies();
  cookieStore.set("checkout_billing", JSON.stringify(info), {
    path: "/",
    maxAge: 3600,
    httpOnly: true,
    sameSite: "lax",
  });
  return { success: true };
}

// Place order - creates order in DB, clears cart
export async function placeOrder(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const cookieStore = await cookies();
  const shippingRaw = cookieStore.get("checkout_shipping")?.value;
  if (!shippingRaw) return { error: "Shipping information missing" };
  const shipping = JSON.parse(shippingRaw);

  const billingRaw = cookieStore.get("checkout_billing")?.value;
  const billing = billingRaw ? JSON.parse(billingRaw) : { sameAsShipping: true };

  const cart = await getCart();
  if (cart.items.length === 0) return { error: "Cart is empty" };

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingCost = Math.round(subtotal * 0.1);
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shippingCost + tax;

  // Generate order number
  const orderNumber = `LED-${Date.now().toString(36).toUpperCase()}`;

  // Determine payment info from form (only last 4 digits sent from client)
  const paymentMethod = (formData.get("paymentMethod") as string) || "card";
  const cardLast4 = (formData.get("cardLast4") as string) || "0000";

  // Estimated delivery: 7 days from now
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

  try {
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session.user.id,
        status: "processing",
        subtotal,
        shippingCost,
        tax,
        total,
        shippingName: `${shipping.firstName} ${shipping.lastName}`,
        shippingStreet: shipping.street,
        shippingCity: shipping.city,
        shippingState: shipping.state,
        shippingZip: shipping.zipCode,
        shippingCountry: "VN",
        billingName: billing.sameAsShipping
          ? `${shipping.firstName} ${shipping.lastName}`
          : `${billing.firstName} ${billing.lastName}`,
        billingStreet: billing.sameAsShipping ? shipping.street : billing.street,
        billingCity: billing.sameAsShipping ? shipping.city : billing.city,
        billingState: billing.sameAsShipping ? shipping.state : billing.state,
        billingZip: billing.sameAsShipping ? shipping.zipCode : billing.zipCode,
        billingCountry: "VN",
        paymentMethod,
        paymentLast4: cardLast4,
        estimatedDelivery,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            imageUrl: item.imageUrl || null,
          })),
        },
      },
    });

    // Clear cart cookie
    cookieStore.set("cart", "[]", { path: "/", maxAge: 0 });
    // Clear checkout cookies
    cookieStore.set("checkout_shipping", "", { path: "/", maxAge: 0 });
    cookieStore.set("checkout_billing", "", { path: "/", maxAge: 0 });

    return { success: true, orderNumber: order.orderNumber };
  } catch (e) {
    console.error("Order placement error:", e);
    return { error: "Failed to place order. Please try again." };
  }
}

// Get checkout shipping info from cookie
export async function getCheckoutShipping() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("checkout_shipping")?.value;
  return raw ? JSON.parse(raw) : null;
}
