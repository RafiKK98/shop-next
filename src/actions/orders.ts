"use server";

import { auth } from "@/lib/auth";
import { cancelOrderById } from "@/services/orders";
import { revalidatePath, updateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache";

export async function cancelOrder(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in" };
  }

  const orderId = formData.get("orderId") as string;
  if (!orderId) {
    return { error: "Missing order ID" };
  }

  const result = await cancelOrderById(session.user.id, orderId);

  if ("error" in result) {
    return { error: result.error };
  }

  revalidatePath("/");
  revalidatePath("/account/orders");
  revalidatePath(`/account/orders/${orderId}`);
  revalidatePath("/products");
  updateTag(CACHE_TAGS.ORDERS);
  updateTag(CACHE_TAGS.PRODUCTS);

  return { success: true };
}
