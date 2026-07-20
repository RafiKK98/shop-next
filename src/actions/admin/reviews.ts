"use server";

import { reviewStatusEnum } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/guards";
import { CACHE_TAGS } from "@/lib/cache";
import { updateReviewStatus } from "@/services/admin/reviews";
import { revalidatePath, updateTag } from "next/cache";

interface ActionSuccess {
  success: true;
}

interface ActionError {
  error: string;
}

type ActionResult = ActionSuccess | ActionError;

type ReviewStatus = (typeof reviewStatusEnum.enumValues)[number];

const VALID_STATUSES: ReviewStatus[] = ["approved", "rejected", "hidden"];

export async function moderateReview(
  reviewId: string,
  status: ReviewStatus,
): Promise<ActionResult> {
  await requireAdmin();

  if (!VALID_STATUSES.includes(status))
    return { error: "Invalid review status" };

  try {
    await updateReviewStatus(reviewId, status);
    revalidatePath("/admin/reviews");
    updateTag(CACHE_TAGS.REVIEWS);
    return { success: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to moderate review";
    return { error: message };
  }
}
