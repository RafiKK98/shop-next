"use client";

import { useTransition } from "react";
import Link from "next/link";
import { ShoppingCart, ArrowLeft, ArrowRight } from "lucide-react";
import { Button, EmptyState } from "@/components/ui";
import { CartItemRow } from "./cart-item-row";
import { clearCart } from "@/actions/cart";
import { formatCurrency } from "@/utils/format";
import { ROUTES } from "@/constants";
import type { CartItemWithProduct } from "@/lib/cart";

interface CartPageContentProps {
  items: CartItemWithProduct[];
}

export function CartPageContent({ items }: CartPageContentProps) {
  const [isClearing, startClearTransition] = useTransition();

  const subtotal = items.reduce((sum, item) => {
    const price = parseFloat(item.product.price);
    const discount = parseFloat(item.product.discount || "0");
    const unitPrice = discount > 0 ? price * (1 - discount / 100) : price;
    return sum + unitPrice * item.quantity;
  }, 0);

  const shipping = subtotal >= 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleClear = () => {
    startClearTransition(async () => {
      await clearCart();
    });
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <EmptyState
          icon={<ShoppingCart className="size-16" />}
          title="Your cart is empty"
          description="Looks like you haven&apos;t added anything to your cart yet. Browse our products and find something you love!"
          action={
            <Link href={ROUTES.products as unknown as any}>
              <Button variant="primary" size="lg">
                Continue Shopping
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Shopping Cart ({items.length})
        </h1>
        <button
          type="button"
          className="btn btn-ghost btn-sm text-error"
          disabled={isClearing}
          onClick={handleClear}
        >
          {isClearing ? "Clearing..." : "Clear Cart"}
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4 rounded-xl border border-base-200 bg-base-100 p-4 md:p-6">
          {items.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-base-200 bg-base-100 p-5 space-y-4">
            <h2 className="text-lg font-semibold">Order Summary</h2>

            <div className="space-y-3 text-sm">
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

            <div className="space-y-3 pt-2">
              <Button className="w-full" size="lg" disabled>
                Proceed to Checkout
                <ArrowRight className="ml-2 size-4" />
              </Button>
              <Link
                href={ROUTES.products as unknown as any}
                className="btn btn-ghost btn-sm w-full gap-2"
              >
                <ArrowLeft className="size-4" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
