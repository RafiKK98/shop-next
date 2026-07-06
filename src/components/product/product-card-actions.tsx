import { AddToCartButton } from "@/components/cart";
import { WishlistButton } from "@/components/wishlist";
import type { StockStatus } from "@/types/product";

interface ProductCardActionsProps {
  title: string;
  stockStatus: StockStatus;
  slug: string;
}

export function ProductCardActions({ title, stockStatus, slug }: ProductCardActionsProps) {
  const isOutOfStock = stockStatus === "out_of_stock";

  return (
    <div className="flex items-center gap-2">
      <WishlistButton slug={slug} aria-label={`Add ${title} to wishlist`} />
      <AddToCartButton
        slug={slug}
        className="btn-sm flex-1"
        disabled={isOutOfStock}
      >
        {isOutOfStock ? "Out of Stock" : "Add to Cart"}
      </AddToCartButton>
      <button
        type="button"
        className="btn btn-ghost btn-square btn-sm"
        aria-label={`Quick view ${title}`}
      >
        <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      </button>
    </div>
  );
}
