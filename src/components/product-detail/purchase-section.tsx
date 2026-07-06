"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { AddToCartButton } from "@/components/cart";
import { WishlistButton } from "@/components/wishlist";

interface PurchaseSectionProps {
  title: string;
  stockStatus: string;
  slug: string;
  isWishlisted?: boolean;
}

export function PurchaseSection({ title, stockStatus, slug, isWishlisted = false }: PurchaseSectionProps) {
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
        <AddToCartButton
          slug={slug}
          quantity={quantity}
          size="lg"
          className="w-full"
          disabled={isOutOfStock}
        >
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </AddToCartButton>
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
        <WishlistButton slug={slug} initialState={isWishlisted} size="md" showLabel label={title} />
      </div>
    </div>
  );
}
