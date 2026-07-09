"use server";

import { requireAdmin } from "@/lib/auth/guards";
import { updateOrderStatusDb, updatePaymentStatusDb } from "@/services/admin/orders";
import type { OrderStatus, PaymentStatus } from "@/services/admin/order-types";
import { revalidatePath, updateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache";

interface ActionSuccess {
  success: true;
}

interface ActionError {
  error: string;
}

type ActionResult = ActionSuccess | ActionError;

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
): Promise<ActionResult> {
  await requireAdmin();

  try {
    await updateOrderStatusDb(orderId, newStatus);
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    updateTag(CACHE_TAGS.ORDERS);
    return { success: true };
  } catch (err) {
    return {
      error:
        err instanceof Error
          ? err.message
          : "Failed to update order status",
    };
  }
}

export async function updatePaymentStatus(
  orderId: string,
  newStatus: PaymentStatus,
): Promise<ActionResult> {
  await requireAdmin();

  try {
    await updatePaymentStatusDb(orderId, newStatus);
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    updateTag(CACHE_TAGS.ORDERS);
    return { success: true };
  } catch (err) {
    return {
      error:
        err instanceof Error
          ? err.message
          : "Failed to update payment status",
    };
  }
}
