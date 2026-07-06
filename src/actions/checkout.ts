"use server";

import { auth } from "@/lib/auth";
import { createOrder } from "@/services/checkout";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function placeOrder(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in to place an order" };
  }

  const addressId = formData.get("addressId") as string;
  if (!addressId) {
    return { error: "Please select a shipping address" };
  }

  const result = await createOrder(session.user.id, addressId);

  if ("error" in result) {
    return { error: result.error };
  }

  revalidatePath("/");
  revalidatePath("/cart");
  revalidatePath("/checkout");
  revalidatePath("/products");

  redirect(`/checkout/success?orderId=${result.orderId}`);
}
