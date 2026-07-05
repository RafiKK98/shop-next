import { cn } from "@/utils/cn";
import { formatCurrency, formatDiscount } from "@/utils/format";

interface PriceProps {
  price: number | string;
  discount?: number | string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: { price: "text-sm", original: "text-xs" },
  md: { price: "text-lg font-semibold", original: "text-sm" },
  lg: { price: "text-2xl font-bold", original: "text-base" },
};

export function Price({ price, discount, size = "md", className }: PriceProps) {
  const numericPrice = typeof price === "string" ? Number.parseFloat(price) : price;
  const numericDiscount = discount != null ? (typeof discount === "string" ? Number.parseFloat(discount) : discount) : 0;
  const discountedPrice = numericDiscount > 0 ? numericPrice * (1 - numericDiscount / 100) : null;

  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      {discountedPrice !== null ? (
        <>
          <span className={cn("text-error", sizeMap[size].price)}>
            {formatCurrency(discountedPrice)}
          </span>
          <span className={cn("text-base-content/40 line-through", sizeMap[size].original)}>
            {formatCurrency(numericPrice)}
          </span>
          <span className={cn("badge badge-error badge-sm", size === "lg" && "badge-md")}>
            {formatDiscount(numericDiscount)}
          </span>
        </>
      ) : (
        <span className={cn(sizeMap[size].price)}>{formatCurrency(numericPrice)}</span>
      )}
    </div>
  );
}
