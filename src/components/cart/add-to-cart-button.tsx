"use client";

import { addToCart } from "@/actions/cart";
import { Button } from "@/components/ui";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { type ReactNode, useState, useTransition } from "react";

interface AddToCartButtonProps {
  slug: string;
  quantity?: number;
  children?: ReactNode;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AddToCartButton({
  slug,
  quantity = 1,
  children,
  disabled,
  variant,
  size,
  className,
}: AddToCartButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    if (disabled) return;
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const fd = new FormData();
      fd.set("slug", slug);
      fd.set("quantity", String(quantity));
      fd.set("callbackUrl", window.location.pathname + window.location.search);

      const result = await addToCart(fd);

      if (result?.redirect) {
        router.push(result.redirect as Route);
        return;
      }

      if (result?.error) {
        setError(result.error);
        return;
      }

      setSuccess(true);
    });
  };

  return (
    <div>
      <Button
        variant={variant}
        size={size}
        className={className}
        disabled={disabled || isPending}
        onClick={handleClick}
      >
        {isPending ? "Adding..." : success ? "Added!" : children}
      </Button>
      {error && <p className="mt-2 text-sm text-error">{error}</p>}
    </div>
  );
}
