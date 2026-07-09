"use server";

import { auth } from "@/lib/auth";
import { requireAdmin } from "@/lib/auth/guards";
import { createCoupon, updateCoupon, toggleCouponActive } from "@/services/admin/coupons";
import { couponFormSchema } from "@/lib/validations/coupon";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCouponAction(formData: FormData) {
  await requireAdmin();

  const raw = Object.fromEntries(formData);
  const parsed = couponFormSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.issues.map((e: { message: string }) => e.message).join(", ") };
  }

  const data = parsed.data;

  try {
    const coupon = await createCoupon({
      code: data.code,
      type: data.type,
      value: String(data.value),
      description: (data.description as string) || null,
      minPurchase: data.minPurchase !== null ? String(data.minPurchase) : null,
      maxDiscount: data.maxDiscount !== null ? String(data.maxDiscount) : null,
      maxUsage: data.maxUsage !== null ? Number(data.maxUsage) : null,
      isActive: data.isActive,
      startDate: data.startDate,
      expiresAt: data.expiresAt,
    });

    revalidatePath("/admin/coupons");
    redirect(`/admin/coupons`);
  } catch (err) {
    const e = err as { message?: string; constraint?: string };
    if (e.message?.includes("unique") || e.constraint?.includes("code")) {
      return { error: "A coupon with this code already exists" };
    }
    return { error: "Failed to create coupon. Please try again." };
  }
}

export async function updateCouponAction(id: string, formData: FormData) {
  await requireAdmin();

  const raw = Object.fromEntries(formData);
  const parsed = couponFormSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.issues.map((e: { message: string }) => e.message).join(", ") };
  }

  const data = parsed.data;

  try {
    await updateCoupon(id, {
      code: data.code,
      type: data.type,
      value: String(data.value),
      description: (data.description as string) || null,
      minPurchase: data.minPurchase !== null ? String(data.minPurchase) : null,
      maxDiscount: data.maxDiscount !== null ? String(data.maxDiscount) : null,
      maxUsage: data.maxUsage !== null ? Number(data.maxUsage) : null,
      isActive: data.isActive,
      startDate: data.startDate,
      expiresAt: data.expiresAt,
    });

    revalidatePath("/admin/coupons");
    redirect(`/admin/coupons`);
  } catch (err) {
    const e = err as { message?: string; constraint?: string };
    if (e.message?.includes("unique") || e.constraint?.includes("code")) {
      return { error: "A coupon with this code already exists" };
    }
    return { error: "Failed to update coupon. Please try again." };
  }
}

export async function toggleCouponAction(id: string, isActive: boolean) {
  await requireAdmin();

  await toggleCouponActive(id, isActive);

  revalidatePath("/admin/coupons");
}
