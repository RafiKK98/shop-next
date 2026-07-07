import { Avatar, Rating } from "@/components/ui";
import type { ReviewListItem } from "@/services/reviews";
import { formatDate } from "@/utils/format";

interface ReviewsListProps {
  reviews: ReviewListItem[];
}

export function ReviewsList({ reviews }: ReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-base-content/40">
        No reviews yet. Be the first to review this product!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="rounded-xl border border-base-200 bg-base-100 p-5"
        >
          <div className="flex items-start gap-4">
            <Avatar
              src={review.authorImage}
              alt={review.authorName ?? "Anonymous"}
              size="md"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-semibold">{review.authorName ?? "Anonymous"}</h3>
                  <div className="mt-0.5 flex items-center gap-2">
                    <Rating value={review.rating} size="xs" />
                    <span className="text-xs text-base-content/40">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
              {review.title && (
                <p className="mt-2 text-sm font-medium">{review.title}</p>
              )}
              {review.comment && (
                <p className="mt-1 text-sm leading-relaxed text-base-content/70">
                  {review.comment}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
