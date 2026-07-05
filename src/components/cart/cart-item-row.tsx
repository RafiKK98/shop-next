"use client";

import { useTransition, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus } from "lucide-react";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/format";
import { removeFromCart, updateCartItemQuantity } from "@/actions/cart";
import { ROUTES } from "@/constants";
import type { CartItemWithProduct } from "@/lib/cart";

interface CartItemRowProps {
  item: CartItemWithProduct;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [localQty, setLocalQty] = useState(item.quantity);

  useEffect(() => {
    setLocalQty(item.quantity);
  }, [item.quantity]);

  const price = parseFloat(item.product.price);
  const discount = parseFloat(item.product.discount || "0");
  const unitPrice = discount > 0 ? price * (1 - discount / 100) : price;
  const subtotal = unitPrice * localQty;

  const handleQuantityChange = (newQty: number) => {
    if (newQty < 1 || newQty > (item.product.stock || 0)) return;
    setLocalQty(newQty);
    setError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("itemId", item.id);
      fd.set("quantity", String(newQty));
      const result = await updateCartItemQuantity(fd);
      if (result?.error) setError(result.error);
    });
  };

  const handleRemove = () => {
    setError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("itemId", item.id);
      await removeFromCart(fd);
    });
  };

  return (
    <div
      className={cn(
        "flex gap-4 border-b border-base-200 pb-4 last:border-b-0",
        isPending && "opacity-50 pointer-events-none",
      )}
    >
      <Link
        href={ROUTES.productDetail(item.product.slug) as unknown as any}
        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-base-200"
      >
        {item.product.image ? (
          <Image
            src={item.product.image}
            alt={item.product.imageAlt || item.product.title}
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-base-content/30">
            No image
          </div>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
        <div className="min-w-0">
          <Link
            href={ROUTES.productDetail(item.product.slug) as unknown as any}
            className="text-sm font-medium hover:text-primary transition-colors line-clamp-2"
          >
            {item.product.title}
          </Link>
          <p className="mt-0.5 text-sm text-base-content/60">
            {discount > 0 ? (
              <>
                <span className="text-error">{formatCurrency(unitPrice)}</span>
                <span className="ml-1.5 text-xs line-through text-base-content/40">
                  {formatCurrency(price)}
                </span>
              </>
            ) : (
              formatCurrency(unitPrice)
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <button
              type="button"
              className="btn btn-outline btn-xs btn-square rounded-r-none"
              disabled={localQty <= 1}
              onClick={() => handleQuantityChange(localQty - 1)}
              aria-label="Decrease quantity"
            >
              <Minus className="size-3" />
            </button>
            <div className="flex h-7 w-10 items-center justify-center border-y border-base-200 text-xs font-medium">
              {localQty}
            </div>
            <button
              type="button"
              className="btn btn-outline btn-xs btn-square rounded-l-none"
              disabled={localQty >= (item.product.stock || 0)}
              onClick={() => handleQuantityChange(localQty + 1)}
              aria-label="Increase quantity"
            >
              <Plus className="size-3" />
            </button>
          </div>

          <button
            type="button"
            className="btn btn-ghost btn-xs text-error gap-1"
            disabled={isPending}
            onClick={handleRemove}
          >
            <Trash2 className="size-3.5" />
            Remove
          </button>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end justify-between">
        <span className="text-sm font-semibold">{formatCurrency(subtotal)}</span>
      </div>
    </div>
  );
}
