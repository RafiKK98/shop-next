"use server";

import { auth } from "@/lib/auth";
import { validateCoupon } from "@/services/coupons";
import type { CouponValidation } from "@/services/coupons";

export async function validateCouponAction(
  code: string,
  subtotal: number,
): Promise<CouponValidation> {
  const session = await auth();
  if (!session?.user?.id) {
    return { valid: false, error: "You must be logged in to use a coupon" };
  }

  return validateCoupon(code, subtotal);
}
