"use server";

import { requireAdmin } from "@/lib/auth/guards";
import { updateReviewStatus } from "@/services/admin/reviews";
import { revalidatePath } from "next/cache";

interface ActionSuccess {
  success: true;
}

interface ActionError {
  error: string;
}

type ActionResult = ActionSuccess | ActionError;

const VALID_STATUSES = ["approved", "rejected", "hidden"];

export async function moderateReview(
  reviewId: string,
  status: string,
): Promise<ActionResult> {
  await requireAdmin();

  if (!VALID_STATUSES.includes(status)) {
    return { error: "Invalid review status" };
  }

  try {
    await updateReviewStatus(reviewId, status);
    revalidatePath("/admin/reviews");
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to moderate review";
    return { error: message };
  }
}
