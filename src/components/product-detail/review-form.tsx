"use client";

import { createReview, updateReview } from "@/actions/reviews";
import { Button, FormError, Label } from "@/components/ui";
import { notify } from "@/lib/notifications";
import {
  reviewFormSchema,
  type ReviewFormValues,
} from "@/lib/validations/review";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm, type Resolver } from "react-hook-form";

interface ReviewFormProps {
  productId: string;
  defaultValues?: ReviewFormValues & { reviewId?: string };
}

export function ReviewForm({ productId, defaultValues }: ReviewFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [hoverRating, setHoverRating] = useState(0);

  const isEditing = !!defaultValues?.reviewId;

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(
      reviewFormSchema,
    ) as unknown as Resolver<ReviewFormValues>,
    defaultValues: defaultValues ?? {
      rating: 0,
      title: "",
      comment: "",
    },
  });

  const currentRating = form.watch("rating") || hoverRating;

  const onSubmit = form.handleSubmit((data) => {
    setServerError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("productId", productId);
      fd.set("rating", String(data.rating));
      fd.set("title", data.title ?? "");
      fd.set("comment", data.comment);
      if (isEditing) {
        fd.set("reviewId", defaultValues.reviewId!);
      }

      const result = isEditing
        ? await updateReview(fd)
        : await createReview(fd);

      if ("error" in result) {
        setServerError(result.error);
        notify.error(result.error);
      } else {
        notify.success(
          isEditing
            ? "Review updated successfully"
            : "Review submitted successfully",
          "It will appear once approved by a moderator.",
        );
        router.refresh();
      }
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate>
      {serverError && (
        <div
          className="mb-4 rounded-lg border border-error/30 bg-error/5 px-4 py-3 text-sm text-error"
          role="alert"
        >
          {serverError}
        </div>
      )}

      <div className="mb-4">
        <Label required>Rating</Label>
        <div
          className="rating rating-lg mt-1"
          onMouseLeave={() => setHoverRating(0)}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <input
              key={star}
              type="radio"
              name="rating-input"
              className="mask mask-star-2 bg-orange-400"
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
              checked={currentRating >= star}
              onChange={() =>
                form.setValue("rating", star, { shouldValidate: true })
              }
              onMouseEnter={() => setHoverRating(star)}
            />
          ))}
        </div>
        {form.formState.errors.rating && (
          <p className="mt-1 text-xs text-error">
            {form.formState.errors.rating.message}
          </p>
        )}
      </div>

      <div className="mb-4">
        <Label>Title (optional)</Label>
        <input
          {...form.register("title")}
          className="input w-full"
          placeholder="Summary of your review"
        />
      </div>

      <div className="mb-4">
        <Label required>Review</Label>
        <textarea
          {...form.register("comment")}
          className="textarea textarea-bordered w-full"
          rows={4}
          placeholder="Share your experience with this product"
        />
        <FormError>{form.formState.errors.comment?.message}</FormError>
      </div>

      <Button type="submit" loading={isPending}>
        {isEditing ? "Update Review" : "Submit Review"}
      </Button>
    </form>
  );
}
