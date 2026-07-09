import { cn } from "@/utils/cn";

interface RatingProps {
  value: number;
  max?: number;
  size?: "xs" | "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

const starSize: Record<string, string> = {
  xs: "rating-xs",
  sm: "rating-sm",
  md: "rating-md",
  lg: "rating-lg",
};

export function Rating({
  value,
  max = 5,
  size = "sm",
  showValue = false,
  className,
}: RatingProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className={cn("rating", starSize[size])}>
        {Array.from({ length: max }, (_, i) => (
          <input
            key={i}
            type="radio"
            className="mask mask-star-2 bg-orange-400"
            aria-label={`${i + 1} star${i > 0 ? "s" : ""}`}
            checked={i + 1 === Math.round(value)}
            readOnly
            disabled
          />
        ))}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-base-content/70">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}
