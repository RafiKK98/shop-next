"use client";

import { placeOrder } from "@/actions/checkout";
import { Button } from "@/components/ui";
import { ROUTES } from "@/constants";
import type { CartItemWithProduct } from "@/lib/cart";
import { computeCartTotals } from "@/utils/checkout";
import { formatCurrency } from "@/utils/format";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import type { Address, CouponState } from "./checkout-page";
import { CouponInput } from "./coupon-input";

interface ReviewStepProps {
  items: CartItemWithProduct[];
  selectedAddress: Address | null;
  onBack: () => void;
  appliedCoupon: CouponState | null;
  onCouponChange: (coupon: CouponState | null) => void;
}

export function ReviewStep({
  items,
  selectedAddress,
  onBack,
  appliedCoupon,
  onCouponChange,
}: ReviewStepProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { subtotal, discountAmount, shipping, tax, total } = computeCartTotals(
    items,
    appliedCoupon?.discountAmount ?? 0,
  );

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedAddress) return;
    setServerError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("addressId", selectedAddress.id);
      if (appliedCoupon) {
        fd.set("couponId", appliedCoupon.couponId);
      }
      const result = await placeOrder(fd);
      if (result?.error) setServerError(result.error);
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Review Your Order</h2>
        <p className="mt-1 text-sm text-base-content/60">
          Please review your items and shipping address before placing the
          order.
        </p>
      </div>

      {/* Shipping address summary */}
      {selectedAddress && (
        <div className="rounded-xl border border-base-200 bg-base-100 p-4">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-base-content/50">
            Shipping To
          </h3>
          <div className="text-sm">
            {selectedAddress.fullName && (
              <p className="font-medium">{selectedAddress.fullName}</p>
            )}
            <p>{selectedAddress.street}</p>
            {selectedAddress.addressLine2 && (
              <p>{selectedAddress.addressLine2}</p>
            )}
            <p>
              {selectedAddress.city}, {selectedAddress.state}{" "}
              {selectedAddress.postalCode}
            </p>
            <p>{selectedAddress.country}</p>
            {selectedAddress.phone && (
              <p className="mt-1 text-base-content/50">
                {selectedAddress.phone}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Coupon */}
      <CouponInput
        subtotal={subtotal}
        onCouponApplied={onCouponChange}
        appliedCoupon={appliedCoupon}
      />

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
            const unitPrice =
              discount > 0 ? price * (1 - discount / 100) : price;

            return (
              <li key={item.id} className="flex gap-3 px-4 py-3">
                <Link
                  href={ROUTES.productDetail(item.product.slug)}
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
                      href={ROUTES.productDetail(item.product.slug)}
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
        {discountAmount > 0 && (
          <div className="flex justify-between text-success">
            <span>Discount ({appliedCoupon?.code})</span>
            <span>-{formatCurrency(discountAmount)}</span>
          </div>
        )}
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

      {serverError && (
        <div className="alert alert-error" role="alert">
          {serverError}
        </div>
      )}

      <form onSubmit={onSubmit} className="border-t border-base-200 pt-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="btn btn-ghost gap-2"
            onClick={onBack}
            disabled={isPending}
          >
            <ArrowLeft className="size-4" />
            Back to Shipping
          </button>
          <Button
            type="submit"
            className="w-full sm:w-auto"
            size="lg"
            disabled={!selectedAddress || isPending}
            loading={isPending}
          >
            Place Order
          </Button>
        </div>
      </form>
    </div>
  );
}
