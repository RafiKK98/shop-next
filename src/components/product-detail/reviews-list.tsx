import { Avatar, Rating } from "@/components/ui";
import type { Review } from "@/data/product-detail";

interface ReviewsListProps {
  reviews: Review[];
}

export function ReviewsList({ reviews }: ReviewsListProps) {
  return (
    <div>
      <h2 className="mb-6 text-xl font-bold">Customer Reviews ({reviews.length})</h2>
      <div className="space-y-5">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-xl border border-base-200 bg-base-100 p-5"
          >
            <div className="flex items-start gap-4">
              <Avatar src={review.avatar} alt={review.author} size="md" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold">{review.author}</h3>
                  <span className="text-xs text-base-content/40">{review.date}</span>
                </div>
                <Rating value={review.rating} size="xs" className="mt-1" />
                <p className="mt-2 text-sm leading-relaxed text-base-content/80">
                  {review.comment}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
