import "server-only";

import { db } from "@/db";
import { coupons } from "@/db/schema";
import { eq } from "drizzle-orm";

export interface CouponValidationResult {
  valid: true;
  coupon: {
    id: string;
    code: string;
    type: "percentage" | "fixed";
    value: number;
    maxDiscount: number | null;
  };
  discountAmount: number;
}

export interface CouponValidationError {
  valid: false;
  error: string;
}

export type CouponValidation = CouponValidationResult | CouponValidationError;

export function computeDiscount(
  subtotal: number,
  type: "percentage" | "fixed",
  value: number,
  maxDiscount: number | null,
): number {
  let amount: number;
  if (type === "percentage") {
    amount = subtotal * (value / 100);
    if (maxDiscount !== null && amount > maxDiscount) amount = maxDiscount;
  } else amount = value;

  return Math.round(amount * 100) / 100;
}

export async function validateCoupon(
  code: string,
  subtotal: number,
): Promise<CouponValidation> {
  const trimmed = code.trim();
  if (!trimmed) return { valid: false, error: "Please enter a coupon code" };

  const coupon = await db
    .select()
    .from(coupons)
    .where(eq(coupons.code, trimmed.toUpperCase()))
    .then((r) => r[0] ?? null);

  if (!coupon) return { valid: false, error: `Coupon "${trimmed}" not found` };

  if (!coupon.isActive)
    return { valid: false, error: "This coupon is no longer active" };

  const now = new Date();

  if (coupon.startDate && now < coupon.startDate)
    return { valid: false, error: "This coupon has not started yet" };

  if (coupon.expiresAt && now > coupon.expiresAt)
    return { valid: false, error: "This coupon has expired" };

  if (coupon.maxUsage !== null && (coupon.currentUsage ?? 0) >= coupon.maxUsage)
    return { valid: false, error: "This coupon has reached its usage limit" };

  if (coupon.minPurchase !== null) {
    const minAmount = parseFloat(coupon.minPurchase);
    if (subtotal < minAmount)
      return {
        valid: false,
        error: `Minimum order amount of $${minAmount.toFixed(2)} required for this coupon`,
      };
  }

  const value = parseFloat(coupon.value);
  const maxDiscount = coupon.maxDiscount
    ? parseFloat(coupon.maxDiscount)
    : null;
  const discountAmount = computeDiscount(
    subtotal,
    coupon.type,
    value,
    maxDiscount,
  );

  return {
    valid: true,
    coupon: {
      id: coupon.id,
      code: coupon.code,
      type: coupon.type,
      value,
      maxDiscount,
    },
    discountAmount,
  };
}
