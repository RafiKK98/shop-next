"use client";

import { Badge, Button } from "@/components/ui";
import type { ProductDetail } from "@/services/admin/products";
import { cn } from "@/utils/cn";
import { formatCurrency, formatDate } from "@/utils/format";
import { Package, Star, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ProductDetailModalProps {
  productId: string;
  onClose: () => void;
}

export function ProductDetailModal({
  productId,
  onClose,
}: ProductDetailModalProps) {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [productId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 pt-10 sm:pt-20"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Product details"
    >
      <div className="relative mx-4 w-full max-w-2xl rounded-xl bg-base-100 shadow-xl">
        <div className="flex items-center justify-between border-b border-base-200 px-5 py-4">
          <h2 className="text-lg font-bold">
            {loading ? "Loading..." : product?.title || "Product Details"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-square btn-sm"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="p-5">
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-48 rounded-lg bg-base-200" />
              <div className="h-4 w-3/4 rounded bg-base-200" />
              <div className="h-4 w-1/2 rounded bg-base-200" />
            </div>
          ) : product ? (
            <div className="space-y-5">
              {product.images.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {product.images.map((img) => (
                    <div
                      key={img.id}
                      className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-base-200"
                    >
                      <img
                        src={img.url}
                        alt={img.alt ?? product.title}
                        className="size-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {product.images.length === 0 && (
                <div className="flex items-center justify-center rounded-lg bg-base-200 py-12">
                  <Package className="size-12 text-base-content/20" />
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-base-content/40">
                    Price
                  </p>
                  <p className="text-xl font-bold">
                    {formatCurrency(product.price)}
                  </p>
                  {product.discount && Number(product.discount) > 0 && (
                    <p className="text-sm text-error">
                      -{product.discount}% off
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-base-content/40">
                    Stock
                  </p>
                  <p
                    className={cn(
                      "text-lg font-semibold",
                      (product.stock ?? 0) === 0
                        ? "text-error"
                        : (product.stock ?? 0) < 10
                          ? "text-warning"
                          : "text-success",
                    )}
                  >
                    {product.stock ?? 0} units
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-base-content/40">
                    Category
                  </p>
                  <p>
                    {product.categoryName ?? (
                      <span className="text-base-content/30">None</span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-base-content/40">
                    Brand
                  </p>
                  <p>
                    {product.brand ?? (
                      <span className="text-base-content/30">None</span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-base-content/40">
                    Featured
                  </p>
                  {product.featured ? (
                    <Badge variant="primary">Yes</Badge>
                  ) : (
                    "No"
                  )}
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-base-content/40">
                    Rating
                  </p>
                  <p className="flex items-center gap-1">
                    {product.avgRating ? (
                      <>
                        <Star className="size-4 fill-warning text-warning" />
                        {product.avgRating.toFixed(1)} ({product.reviewCount}{" "}
                        reviews)
                      </>
                    ) : (
                      <span className="text-base-content/30">No reviews</span>
                    )}
                  </p>
                </div>
              </div>

              {product.description && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-base-content/40">
                    Description
                  </p>
                  <p className="mt-1 text-sm text-base-content/70">
                    {product.description}
                  </p>
                </div>
              )}

              <div className="grid gap-4 text-xs text-base-content/40 sm:grid-cols-2">
                <p>Created: {formatDate(product.createdAt)}</p>
                <p>Updated: {formatDate(product.updatedAt)}</p>
              </div>
            </div>
          ) : (
            <p className="py-8 text-center text-base-content/40">
              Product not found
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-base-200 px-5 py-4">
          {product && (
            <Link href={`/admin/products/${product.id}/edit`}>
              <Button size="sm">Edit Product</Button>
            </Link>
          )}
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
