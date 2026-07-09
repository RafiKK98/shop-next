"use server";

import { auth } from "@/lib/auth";
import { createOrder } from "@/services/checkout";
import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache";

export async function placeOrder(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in to place an order" };
  }

  const addressId = formData.get("addressId") as string;
  if (!addressId) {
    return { error: "Please select a shipping address" };
  }

  const couponId = (formData.get("couponId") as string) || undefined;

  const result = await createOrder(session.user.id, addressId, couponId);

  if ("error" in result) {
    return { error: result.error };
  }

  revalidatePath("/");
  revalidatePath("/cart");
  revalidatePath("/checkout");
  revalidatePath("/products");
  updateTag(CACHE_TAGS.ORDERS);
  updateTag(CACHE_TAGS.PRODUCTS);

  redirect(`/checkout/success?orderId=${result.orderId}`);
}
