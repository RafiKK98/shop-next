"use client";

import { useState, useTransition } from "react";
import { Tag, X } from "lucide-react";
import { validateCouponAction } from "@/actions/coupons";
import { formatCurrency } from "@/utils/format";
import { notify } from "@/lib/notifications";

interface CouponState {
  code: string;
  discountAmount: number;
  couponId: string;
}

interface CouponInputProps {
  subtotal: number;
  onCouponApplied: (state: CouponState | null) => void;
  appliedCoupon: CouponState | null;
}

export function CouponInput({ subtotal, onCouponApplied, appliedCoupon }: CouponInputProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleApply = () => {
    if (!code.trim()) return;
    setError(null);

    startTransition(async () => {
      const result = await validateCouponAction(code.trim(), subtotal);

      if (!result.valid) {
        setError(result.error);
        notify.error(result.error);
        return;
      }

      onCouponApplied({
        code: result.coupon.code,
        discountAmount: result.discountAmount,
        couponId: result.coupon.id,
      });
      notify.success(`Coupon "${result.coupon.code}" applied! ${formatCurrency(result.discountAmount)} off`);
      setCode("");
    });
  };

  const handleRemove = () => {
    onCouponApplied(null);
    notify.info("Coupon removed");
  };

  if (appliedCoupon) {
    return (
      <div className="rounded-xl border border-success/30 bg-success/5 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="size-4 text-success" />
            <div>
              <p className="text-sm font-medium">
                {appliedCoupon.code}
              </p>
              <p className="text-xs text-success">
                -{formatCurrency(appliedCoupon.discountAmount)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="btn btn-ghost btn-square btn-xs"
            aria-label="Remove coupon"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-base-200 bg-base-100 p-4">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-base-content/50">
        Coupon Code
      </h3>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleApply();
            }
          }}
          placeholder="Enter coupon code"
          className="input input-sm w-full font-mono uppercase"
          aria-label="Coupon code"
        />
        <button
          type="button"
          onClick={handleApply}
          disabled={isPending || !code.trim()}
          className="btn btn-primary btn-sm"
        >
          {isPending ? <span className="loading loading-spinner loading-xs" /> : "Apply"}
        </button>
      </div>
      {error && (
        <p className="mt-1 text-xs text-error">{error}</p>
      )}
    </div>
  );
}
