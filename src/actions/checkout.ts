"use server";

import { db } from "@/db";
import { orders } from "@/db/schema";
import { auth } from "@/lib/auth";
import { CACHE_TAGS } from "@/lib/cache";
import { createPendingOrder } from "@/services/checkout";
import { createCheckoutSession } from "@/services/payment";
import { eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";

export async function placeOrder(
  formData: FormData,
): Promise<{ url?: string; error?: string }> {
  const session = await auth();
  if (!session?.user?.id)
    return { error: "You must be logged in to place an order" };

  const addressId = formData.get("addressId") as string;
  if (!addressId) return { error: "Please select a shipping address" };

  const couponId = (formData.get("couponId") as string) || undefined;

  const result = await createPendingOrder(session.user.id, addressId, couponId);

  if ("error" in result) return { error: result.error };

  const { url, sessionId } = await createCheckoutSession(
    {
      id: result.orderId,
      userId: session.user.id,
      total: result.total,
      couponId: result.couponId,
      couponCode: result.couponCode,
      discountAmount: result.discountAmount,
      subtotal: result.subtotal,
      shipping: result.shipping,
      tax: result.tax,
      items: result.items,
    },
    session.user.email ?? null,
  );

  await db
    .update(orders)
    .set({ stripeCheckoutSessionId: sessionId })
    .where(eq(orders.id, result.orderId));

  revalidatePath("/");
  revalidatePath("/cart");
  revalidatePath("/checkout");
  updateTag(CACHE_TAGS.ORDERS);

  return { url };
}
