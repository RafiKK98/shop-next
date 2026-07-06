"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { addresses } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { addressSchema, type AddressInput } from "@/lib/validations/checkout";

function formDataToAddressInput(formData: FormData): AddressInput {
  return {
    label: formData.get("label") as string,
    fullName: formData.get("fullName") as string,
    phone: formData.get("phone") as string,
    street: formData.get("street") as string,
    addressLine2: (formData.get("addressLine2") as string) || "",
    city: formData.get("city") as string,
    state: formData.get("state") as string,
    postalCode: formData.get("postalCode") as string,
    country: formData.get("country") as string,
    isDefault: formData.get("isDefault") === "on",
  };
}

export async function createAddress(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const parsed = addressSchema.safeParse(formDataToAddressInput(formData));
  if (!parsed.success) {
    const first = Object.values(parsed.error.flatten().fieldErrors).flat()[0];
    return { error: first || "Invalid address data" };
  }

  const data = parsed.data;

  if (data.isDefault) {
    await db
      .update(addresses)
      .set({ isDefault: false })
      .where(eq(addresses.userId, session.user.id));
  }

  await db.insert(addresses).values({
    userId: session.user.id,
    ...data,
    addressLine2: data.addressLine2 || null,
  });

  revalidatePath("/checkout");
  return { success: true };
}

export async function updateAddress(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const addressId = formData.get("addressId") as string;
  if (!addressId) return { error: "Missing address ID" };

  const parsed = addressSchema.safeParse(formDataToAddressInput(formData));
  if (!parsed.success) {
    const first = Object.values(parsed.error.flatten().fieldErrors).flat()[0];
    return { error: first || "Invalid address data" };
  }

  const data = parsed.data;

  const existing = await db
    .select()
    .from(addresses)
    .where(and(eq(addresses.id, addressId), eq(addresses.userId, session.user.id)))
    .then((r) => r[0] ?? null);

  if (!existing) return { error: "Address not found" };

  if (data.isDefault) {
    await db
      .update(addresses)
      .set({ isDefault: false })
      .where(eq(addresses.userId, session.user.id));
  }

  await db
    .update(addresses)
    .set({
      ...data,
      addressLine2: data.addressLine2 || null,
      updatedAt: new Date(),
    })
    .where(eq(addresses.id, addressId));

  revalidatePath("/checkout");
  return { success: true };
}

export async function deleteAddress(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const addressId = formData.get("addressId") as string;
  if (!addressId) return { error: "Missing address ID" };

  const existing = await db
    .select()
    .from(addresses)
    .where(and(eq(addresses.id, addressId), eq(addresses.userId, session.user.id)))
    .then((r) => r[0] ?? null);

  if (!existing) return { error: "Address not found" };

  await db
    .delete(addresses)
    .where(and(eq(addresses.id, addressId), eq(addresses.userId, session.user.id)));

  revalidatePath("/checkout");
  return { success: true };
}

export async function setDefaultAddress(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const addressId = formData.get("addressId") as string;
  if (!addressId) return { error: "Missing address ID" };

  const existing = await db
    .select()
    .from(addresses)
    .where(and(eq(addresses.id, addressId), eq(addresses.userId, session.user.id)))
    .then((r) => r[0] ?? null);

  if (!existing) return { error: "Address not found" };

  await db
    .update(addresses)
    .set({ isDefault: false })
    .where(eq(addresses.userId, session.user.id));

  await db
    .update(addresses)
    .set({ isDefault: true, updatedAt: new Date() })
    .where(eq(addresses.id, addressId));

  revalidatePath("/checkout");
  return { success: true };
}
