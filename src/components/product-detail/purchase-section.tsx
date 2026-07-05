"use client";

import { useState } from "react";
import { Button, IconButton } from "@/components/ui";

interface PurchaseSectionProps {
  title: string;
  stockStatus: string;
}

export function PurchaseSection({ title, stockStatus }: PurchaseSectionProps) {
  const [quantity, setQuantity] = useState(1);
  const isOutOfStock = stockStatus === "out_of_stock";

  return (
    <div className="space-y-4 rounded-xl border border-base-200 bg-base-100 p-5">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Quantity</span>
        <div className="flex items-center">
          <button
            type="button"
            className="btn btn-outline btn-sm btn-square rounded-r-none"
            disabled={quantity <= 1}
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <div className="flex h-9 w-12 items-center justify-center border-y border-base-200 text-sm font-medium">
            {quantity}
          </div>
          <button
            type="button"
            className="btn btn-outline btn-sm btn-square rounded-l-none"
            onClick={() => setQuantity(quantity + 1)}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Button
          className="w-full"
          size="lg"
          disabled={isOutOfStock}
          aria-label={isOutOfStock ? `${title} is out of stock` : `Add ${title} to cart`}
        >
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
        <Button
          variant="outline"
          className="w-full"
          size="lg"
          disabled={isOutOfStock}
        >
          Buy Now
        </Button>
      </div>

      <div className="flex items-center justify-center">
        <IconButton aria-label={`Add ${title} to wishlist`}>
          <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
          <span className="ml-2 text-sm">Add to Wishlist</span>
        </IconButton>
      </div>
    </div>
  );
}
