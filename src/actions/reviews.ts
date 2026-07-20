"use server";

import { db } from "@/db";
import { reviews } from "@/db/schema";
import { requireAuth } from "@/lib/auth/guards";
import { CACHE_TAGS } from "@/lib/cache";
import { reviewFormServerSchema } from "@/lib/validations/review";
import {
  getUserReviewForProduct,
  hasVerifiedPurchase,
} from "@/services/reviews";
import { eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";

interface ActionSuccess {
  success: true;
  reviewId: string;
}

interface ActionError {
  error: string;
}

type ActionResult = ActionSuccess | ActionError;

export async function createReview(formData: FormData): Promise<ActionResult> {
  const session = await requireAuth();
  const userId = session.user.id;

  const raw = Object.fromEntries(formData);
  const productId = (raw.productId as string) ?? "";

  if (!productId) return { error: "Product ID is required" };

  const parsed = reviewFormServerSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return { error: `${firstError.path.join(".")}: ${firstError.message}` };
  }

  // Verified purchase check
  const hasPurchased = await hasVerifiedPurchase(userId, productId);
  if (!hasPurchased)
    return { error: "You must purchase this product before reviewing it" };

  // Duplicate check
  const existing = await getUserReviewForProduct(userId, productId);
  if (existing) return { error: "You have already reviewed this product" };

  const data = parsed.data;

  try {
    const [review] = await db
      .insert(reviews)
      .values({
        userId,
        productId,
        rating: data.rating,
        title: data.title || null,
        comment: data.comment,
        status: "pending",
      })
      .returning({ id: reviews.id });

    revalidatePath(`/products/${productId}`);
    updateTag(CACHE_TAGS.REVIEWS);
    return { success: true, reviewId: review.id };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to submit review";
    return { error: message };
  }
}

export async function updateReview(formData: FormData): Promise<ActionResult> {
  const session = await requireAuth();
  const userId = session.user.id;

  const raw = Object.fromEntries(formData);
  const reviewId = (raw.reviewId as string) ?? "";
  const productId = (raw.productId as string) ?? "";

  if (!reviewId || !productId)
    return { error: "Review ID and Product ID are required" };

  const parsed = reviewFormServerSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return { error: `${firstError.path.join(".")}: ${firstError.message}` };
  }

  // Ownership check
  const existing = await db
    .select({ id: reviews.id, userId: reviews.userId })
    .from(reviews)
    .where(eq(reviews.id, reviewId))
    .then((r) => r[0] ?? null);

  if (!existing) return { error: "Review not found" };

  if (existing.userId !== userId)
    return { error: "You can only edit your own reviews" };

  const data = parsed.data;

  try {
    await db
      .update(reviews)
      .set({
        rating: data.rating,
        title: data.title || null,
        comment: data.comment,
        status: "pending",
        updatedAt: new Date(),
      })
      .where(eq(reviews.id, reviewId));

    revalidatePath(`/products/${productId}`);
    updateTag(CACHE_TAGS.REVIEWS);
    return { success: true, reviewId };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to update review";
    return { error: message };
  }
}
