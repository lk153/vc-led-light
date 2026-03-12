"use server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;

  if (!name || name.length < 2) return { error: "Name must be at least 2 characters" };

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name, phone: phone || null },
  });

  revalidatePath("/account");
  return { success: true };
}

export async function addAddress(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const label = (formData.get("label") as string) || "Home";
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const street = formData.get("street") as string;
  const apartment = (formData.get("apartment") as string) || "";
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const zipCode = formData.get("zipCode") as string;
  const phone = (formData.get("phone") as string) || "";
  const isDefault = formData.get("isDefault") === "true";

  if (!firstName || !lastName || !street || !city || !state || !zipCode) {
    return { error: "Please fill in all required fields" };
  }

  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });
  }

  await prisma.address.create({
    data: {
      userId: session.user.id,
      label,
      firstName,
      lastName,
      street,
      apartment,
      city,
      state,
      zipCode,
      phone,
      country: "VN",
      isDefault,
    },
  });

  revalidatePath("/account");
  return { success: true };
}

export async function deleteAddress(addressId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  await prisma.address.deleteMany({
    where: { id: addressId, userId: session.user.id },
  });

  revalidatePath("/account");
  return { success: true };
}
