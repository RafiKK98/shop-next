"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui";
import { formatCurrency } from "@/utils/format";
import { computeCartTotals } from "@/utils/checkout";
import { ROUTES } from "@/constants";
import type { CartItemWithProduct } from "@/lib/cart";
import type { Address } from "./checkout-page";

interface ReviewStepProps {
  items: CartItemWithProduct[];
  selectedAddress: Address | null;
  onBack: () => void;
}

export function ReviewStep({ items, selectedAddress, onBack }: ReviewStepProps) {
  const { subtotal, shipping, tax, total } = computeCartTotals(items);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Review Your Order</h2>
        <p className="mt-1 text-sm text-base-content/60">
          Please review your items and shipping address before placing the order.
        </p>
      </div>

      {/* Shipping address summary */}
      {selectedAddress && (
        <div className="rounded-xl border border-base-200 bg-base-100 p-4">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-base-content/50">
            Shipping To
          </h3>
          <div className="text-sm">
            {selectedAddress.fullName && <p className="font-medium">{selectedAddress.fullName}</p>}
            <p>{selectedAddress.street}</p>
            {selectedAddress.addressLine2 && <p>{selectedAddress.addressLine2}</p>}
            <p>
              {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postalCode}
            </p>
            <p>{selectedAddress.country}</p>
            {selectedAddress.phone && (
              <p className="mt-1 text-base-content/50">{selectedAddress.phone}</p>
            )}
          </div>
        </div>
      )}

      {/* Cart items */}
      <div className="rounded-xl border border-base-200 bg-base-100">
        <div className="border-b border-base-200 px-4 py-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-base-content/50">
            Cart Items ({items.length})
          </h3>
        </div>

        <ul className="divide-y divide-base-200">
          {items.map((item) => {
            const price = parseFloat(item.product.price);
            const discount = parseFloat(item.product.discount || "0");
            const unitPrice = discount > 0 ? price * (1 - discount / 100) : price;

            return (
              <li key={item.id} className="flex gap-3 px-4 py-3">
                <Link
                  href={ROUTES.productDetail(item.product.slug) as unknown as any}
                  className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-base-200"
                >
                  {item.product.image ? (
                    <Image
                      src={item.product.image}
                      alt={item.product.imageAlt || item.product.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-base-content/30">
                      No image
                    </div>
                  )}
                </Link>

                <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                  <div className="min-w-0">
                    <Link
                      href={ROUTES.productDetail(item.product.slug) as unknown as any}
                      className="text-sm font-medium hover:text-primary transition-colors line-clamp-1"
                    >
                      {item.product.title}
                    </Link>
                    <p className="text-xs text-base-content/50">
                      Qty: {item.quantity} × {formatCurrency(unitPrice)}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-medium">
                    {formatCurrency(unitPrice * item.quantity)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Totals */}
      <div className="rounded-xl border border-base-200 bg-base-100 p-4 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-base-content/60">Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-base-content/60">Shipping</span>
          <span>
            {shipping === 0 ? (
              <span className="text-success">Free</span>
            ) : (
              formatCurrency(shipping)
            )}
          </span>
        </div>
        {shipping > 0 && (
          <p className="text-xs text-base-content/40">
            Free shipping on orders over {formatCurrency(100)}
          </p>
        )}
        <div className="flex justify-between">
          <span className="text-base-content/60">Estimated Tax</span>
          <span>{formatCurrency(tax)}</span>
        </div>
        <div className="border-t border-base-200 pt-3">
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-base-200 pt-4">
        <button
          type="button"
          className="btn btn-ghost gap-2"
          onClick={onBack}
        >
          <ArrowLeft className="size-4" />
          Back to Shipping
        </button>
        <Button className="w-full sm:w-auto" size="lg" disabled>
          Place Order
        </Button>
      </div>
    </div>
  );
}
