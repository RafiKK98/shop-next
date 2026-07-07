import { Rating } from "@/components/ui";
import { Star } from "lucide-react";
import type { ReviewAggregate } from "@/services/reviews";

interface ReviewSummaryProps {
  aggregate: ReviewAggregate;
}

export function ReviewSummary({ aggregate }: ReviewSummaryProps) {
  const { total, average, breakdown } = aggregate;

  if (total === 0) {
    return (
      <div className="text-center">
        <p className="text-4xl font-bold text-base-content/20">—</p>
        <p className="mt-1 text-sm text-base-content/40">No reviews yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
      {/* Big average */}
      <div className="text-center">
        <p className="text-5xl font-bold tracking-tight">
          {average?.toFixed(1) ?? "—"}
        </p>
        <Rating value={average ?? 0} size="sm" className="mt-1 justify-center" />
        <p className="mt-1 text-sm text-base-content/50">{total} review{total !== 1 ? "s" : ""}</p>
      </div>

      {/* Breakdown bars */}
      <div className="flex-1 space-y-1.5">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = breakdown[star] ?? 0;
          const pct = total > 0 ? (count / total) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-2 text-sm">
              <span className="flex w-8 items-center gap-1 text-base-content/60">
                {star} <Star className="size-3 fill-current" />
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-base-200">
                <div
                  className="h-full rounded-full bg-orange-400 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-8 text-right text-xs text-base-content/40">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
