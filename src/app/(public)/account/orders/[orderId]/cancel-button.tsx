"use client";

import { cancelOrder } from "@/actions/orders";
import { Button } from "@/components/ui";
import { useState, useTransition } from "react";

interface CancelOrderButtonProps {
  orderId: string;
}

export function CancelOrderButton({ orderId }: CancelOrderButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [cancelled, setCancelled] = useState(false);

  const handleCancel = () => {
    if (
      !confirm(
        "Are you sure you want to cancel this order? This action cannot be undone.",
      )
    )
      return;

    setError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("orderId", orderId);
      const result = await cancelOrder(fd);
      if (result?.error) setError(result.error);
      else setCancelled(true);
    });
  };

  if (cancelled)
    return (
      <div className="text-sm text-success font-medium">Order cancelled</div>
    );

  return (
    <div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleCancel}
        disabled={isPending}
        loading={isPending}
        className="text-error border-error/30 hover:bg-error/10"
      >
        Cancel Order
      </Button>
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
}
