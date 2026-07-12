"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { ROUTES } from "@/constants";

interface CartCountProps {
  count: number;
}

export function CartCount({ count }: CartCountProps) {
  return (
    <Link
      href={ROUTES.cart}
      className="btn btn-ghost btn-square relative"
      aria-label={`Cart${count > 0 ? ` (${count} items)` : ""}`}
    >
      <ShoppingCart size={18} />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-content">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
