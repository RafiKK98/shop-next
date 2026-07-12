"use client";

import { AddToCartButton } from "@/components/cart";
import { Price, Rating } from "@/components/ui";
import { WishlistButton } from "@/components/wishlist";
import { ROUTES } from "@/constants";
import type { Product } from "@/types/product";
import { getProductDiscount } from "@/types/product";
import { X } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { ProductCardImage } from "./product-card-image";

interface ProductQuickViewModalProps {
  product: Product;
  onClose: () => void;
}

export function ProductQuickViewModal({
  product,
  onClose,
}: ProductQuickViewModalProps) {
  const discount = getProductDiscount(product);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view ${product.title}`}
    >
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-y-auto rounded-xl bg-base-100 shadow-xl">
        <div className="flex items-center justify-between border-b border-base-200 px-5 py-4">
          <h2 className="text-lg font-bold">{product.title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-square btn-sm"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex flex-col gap-6 p-5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <div className="aspect-square overflow-hidden rounded-lg bg-base-200">
              <ProductCardImage src={product.images[0]} alt={product.title} />
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-4">
            <p className="text-xs font-medium uppercase tracking-wider text-base-content/50">
              {product.brand}
            </p>

            <div className="flex items-center gap-2">
              <Rating value={product.rating} size="sm" />
              <span className="text-sm text-base-content/50">
                ({product.reviewCount} reviews)
              </span>
            </div>

            <Price
              price={product.price}
              discount={discount || null}
              size="lg"
            />

            <p className="line-clamp-3 text-sm leading-relaxed text-base-content/70">
              High-quality {product.title} from {product.brand}. Shop now for
              the best prices.
            </p>

            <div className="mt-auto flex flex-col gap-3 pt-4">
              <AddToCartButton
                slug={product.slug}
                className="w-full"
                disabled={product.stockStatus === "out_of_stock"}
              >
                {product.stockStatus === "out_of_stock"
                  ? "Out of Stock"
                  : "Add to Cart"}
              </AddToCartButton>
              <WishlistButton slug={product.slug} showLabel size="md" />
              <Link
                href={ROUTES.productDetail(product.slug)}
                className="btn btn-outline btn-sm w-full"
                onClick={onClose}
              >
                View Full Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
