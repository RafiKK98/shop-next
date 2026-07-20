"use server";

import { requireAdmin } from "@/lib/auth/guards";
import { CACHE_TAGS } from "@/lib/cache";
import { couponFormSchema } from "@/lib/validations/coupon";
import {
  createCoupon,
  toggleCouponActive,
  updateCoupon,
} from "@/services/admin/coupons";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function createCouponAction(formData: FormData) {
  await requireAdmin();

  const raw = Object.fromEntries(formData);
  const parsed = couponFormSchema.safeParse(raw);

  if (!parsed.success)
    return {
      error: parsed.error.issues
        .map((e: { message: string }) => e.message)
        .join(", "),
    };

  const data = parsed.data;

  try {
    await createCoupon({
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
  } catch (err) {
    const e = err as { message?: string; constraint?: string };
    if (e.message?.includes("unique") || e.constraint?.includes("code"))
      return { error: "A coupon with this code already exists" };

    return { error: "Failed to create coupon. Please try again." };
  }

  revalidatePath("/admin/coupons");
  updateTag(CACHE_TAGS.COUPONS);
  redirect("/admin/coupons");
}

export async function updateCouponAction(id: string, formData: FormData) {
  await requireAdmin();

  const raw = Object.fromEntries(formData);
  const parsed = couponFormSchema.safeParse(raw);

  console.log("Raw: ", { raw });
  console.log("Parsed Edit: ", { parsed });

  if (!parsed.success)
    return {
      error: parsed.error.issues
        .map((e: { message: string }) => e.message)
        .join(", "),
    };

  const data = parsed.data;
  console.log("Parsed edit data: ", { data });
  try {
    await updateCoupon(id, {
      code: data.code,
      type: data.type,
      value: String(data.value),
      description: (data.description as string) || null,
      minPurchase: data.minPurchase ? String(data.minPurchase) : null,
      maxDiscount: data.maxDiscount ? String(data.maxDiscount) : null,
      maxUsage: data.maxUsage ? Number(data.maxUsage) : null,
      isActive: data.isActive,
      startDate: data.startDate,
      expiresAt: data.expiresAt,
    });
    console.log("success");
  } catch (err) {
    const e = err as { message?: string; constraint?: string };
    if (e.message?.includes("unique") || e.constraint?.includes("code"))
      return { error: "A coupon with this code already exists" };

    return { error: "Failed to update coupon. Please try again." };
  }

  revalidatePath("/admin/coupons");
  updateTag(CACHE_TAGS.COUPONS);
  redirect("/admin/coupons");
}

export async function toggleCouponAction(id: string, isActive: boolean) {
  await requireAdmin();

  await toggleCouponActive(id, isActive);

  revalidatePath("/admin/coupons");
  updateTag(CACHE_TAGS.COUPONS);
}
