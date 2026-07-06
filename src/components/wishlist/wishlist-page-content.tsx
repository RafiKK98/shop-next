"use client";

import { useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, ArrowLeft } from "lucide-react";
import { Button, EmptyState, Rating } from "@/components/ui";
import { Price } from "@/components/ui/price";
import { WishlistButton } from "./wishlist-button";
import { moveWishlistToCart, removeFromWishlist } from "@/actions/wishlist";
import { ROUTES } from "@/constants";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/format";
import type { WishlistItemWithProduct } from "@/lib/wishlist";
import type { StockStatus } from "@/types/product";

interface WishlistPageContentProps {
  items: WishlistItemWithProduct[];
}

function getStockDisplay(stock: number): { status: StockStatus; label: string } {
  if (stock <= 0) return { status: "out_of_stock", label: "Out of Stock" };
  if (stock <= 5) return { status: "low_stock", label: "Low Stock" };
  return { status: "in_stock", label: "In Stock" };
}

export function WishlistPageContent({ items }: WishlistPageContentProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <EmptyState
          icon={<Heart className="size-16" />}
          title="Your wishlist is empty"
          description="Save items you love by tapping the heart icon. They'll appear here for easy access!"
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          My Wishlist ({items.length})
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => {
          const stock = getStockDisplay(item.product.stock ?? 0);
          const price = parseFloat(item.product.price);
          const discount = parseFloat(item.product.discount || "0");

          return (
            <div
              key={item.id}
              className="group card card-compact bg-base-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <Link
                href={ROUTES.productDetail(item.product.slug) as unknown as any}
                className="relative"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-box bg-base-200">
                  {item.product.image ? (
                    <Image
                      src={item.product.image}
                      alt={item.product.imageAlt || item.product.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-base-content/30">
                      No image
                    </div>
                  )}
                </div>

                <div className="absolute right-2 top-2 z-10">
                  <WishlistButton slug={item.product.slug} initialState={true} />
                </div>
              </Link>

              <div className="card-body p-3 md:p-4">
                <Link
                  href={ROUTES.productDetail(item.product.slug) as unknown as any}
                  className="text-xs font-medium uppercase tracking-wider text-base-content/50 hover:text-base-content transition-colors"
                >
                  Brand
                </Link>

                <h3 className="card-title text-sm md:text-base leading-tight line-clamp-2">
                  <Link
                    href={ROUTES.productDetail(item.product.slug) as unknown as any}
                    className="hover:text-primary transition-colors"
                  >
                    {item.product.title}
                  </Link>
                </h3>

                <Price price={price} discount={discount > 0 ? discount : null} size="sm" />

                <span
                  className={cn(
                    "badge badge-sm",
                    stock.status === "in_stock" && "badge-primary",
                    stock.status === "low_stock" && "badge-warning",
                    stock.status === "out_of_stock" && "badge-neutral",
                  )}
                >
                  {stock.label}
                </span>

                <div className="mt-2 flex items-center gap-2">
                  <WishlistActions item={item} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WishlistActions({ item }: { item: WishlistItemWithProduct }) {
  const [movePending, startMove] = useTransition();
  const [removePending, startRemove] = useTransition();
  const isOutOfStock = (item.product.stock ?? 0) < 1;

  const handleMoveToCart = () => {
    startMove(async () => {
      const fd = new FormData();
      fd.set("wishlistItemId", item.id);
      await moveWishlistToCart(fd);
    });
  };

  const handleRemove = () => {
    startRemove(async () => {
      const fd = new FormData();
      fd.set("itemId", item.id);
      await removeFromWishlist(fd);
    });
  };

  return (
    <div className="flex w-full gap-2">
      <Button
        className="flex-1 btn-sm"
        disabled={isOutOfStock || movePending}
        onClick={handleMoveToCart}
      >
        {movePending ? (
          "Moving..."
        ) : (
          <>
            <ShoppingBag className="mr-1 size-3.5" />
            Add to Cart
          </>
        )}
      </Button>
      <button
        type="button"
        className="btn btn-ghost btn-sm btn-square"
        disabled={removePending}
        onClick={handleRemove}
        aria-label="Remove from wishlist"
      >
        <Trash2 className="size-4 text-error" />
      </button>
    </div>
  );
}
