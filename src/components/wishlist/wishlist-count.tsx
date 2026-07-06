"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

interface WishlistCountProps {
  count: number;
  href: string;
}

export function WishlistCount({ count, href }: WishlistCountProps) {
  return (
    <Link
      href={href as unknown as any}
      className="btn btn-ghost btn-square relative"
      aria-label={`Wishlist${count > 0 ? ` (${count} items)` : ""}`}
    >
      <Heart size={18} />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-content">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
