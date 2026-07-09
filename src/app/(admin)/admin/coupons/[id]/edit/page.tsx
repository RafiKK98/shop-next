import { notFound } from "next/navigation";
import { SITE } from "@/constants";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminContainer } from "@/components/admin/admin-container";
import { CouponForm } from "@/components/admin/coupons";
import { getAdminCouponById } from "@/services/admin/coupons";
import type { Metadata } from "next";

function toDatetimeLocal(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d}T${h}:${min}`;
}

export const metadata: Metadata = {
  title: `Edit Coupon | Admin | ${SITE.name}`,
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCouponPage({ params }: PageProps) {
  const { id } = await params;
  const coupon = await getAdminCouponById(id);

  if (!coupon) notFound();

  const defaultValues = {
    code: coupon.code,
    type: coupon.type,
    value: parseFloat(coupon.value),
    description: coupon.description ?? "",
    minPurchase: coupon.minPurchase ? parseFloat(coupon.minPurchase) : ("" as any),
    maxDiscount: coupon.maxDiscount ? parseFloat(coupon.maxDiscount) : ("" as any),
    maxUsage: coupon.maxUsage ?? ("" as any),
    isActive: coupon.isActive ?? true,
    startDate: coupon.startDate ?? null,
    expiresAt: coupon.expiresAt ?? null,
  };

  return (
    <>
      <AdminPageHeader
        title={`Edit: ${coupon.code}`}
        description="Update coupon details and restrictions"
      />
      <AdminContainer>
        <CouponForm
          mode="edit"
          couponId={coupon.id}
          defaultValues={defaultValues}
        />
      </AdminContainer>
    </>
  );
}
