"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { cn } from "@/utils/cn";
import { toggleWishlist } from "@/actions/wishlist";

interface WishlistButtonProps {
  slug: string;
  initialState?: boolean;
  className?: string;
  size?: "sm" | "md";
  showLabel?: boolean;
  label?: string;
}

export function WishlistButton({
  slug,
  initialState = false,
  className,
  size = "sm",
  showLabel = false,
  label,
}: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(initialState);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const prev = isWishlisted;
    setIsWishlisted(!prev);

    startTransition(async () => {
      const fd = new FormData();
      fd.set("slug", slug);
      fd.set("callbackUrl", window.location.pathname + window.location.search);

      const result = await toggleWishlist(fd);

      if (result?.redirect) {
        setIsWishlisted(prev);
        router.push(result.redirect as any);
        return;
      }

      if (result?.error) {
        setIsWishlisted(prev);
      }
    });
  };

  const btnClass =
    size === "sm"
      ? "btn btn-ghost btn-square btn-sm"
      : "btn btn-ghost btn-square";

  return (
    <button
      type="button"
      className={cn(btnClass, isPending && "pointer-events-none opacity-50", className)}
      onClick={handleClick}
      aria-label={
        isWishlisted
          ? `Remove ${label || "item"} from wishlist`
          : `Add ${label || "item"} to wishlist`
      }
    >
      <Heart
        className={cn(
          size === "sm" ? "size-4" : "size-5",
          "transition-colors",
          isWishlisted && "fill-red-500 text-red-500",
        )}
      />
      {showLabel && (
        <span className="ml-2 text-sm">
          {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        </span>
      )}
    </button>
  );
}
