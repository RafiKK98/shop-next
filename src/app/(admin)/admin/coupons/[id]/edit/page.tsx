import { AdminContainer } from "@/components/admin/admin-container";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CouponForm } from "@/components/admin/coupons";
import type { CouponFormValues } from "@/lib/validations/coupon";
import { SITE } from "@/constants";
import { getAdminCouponById } from "@/services/admin/coupons";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

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
    minPurchase: coupon.minPurchase ? parseFloat(coupon.minPurchase) : undefined,
    maxDiscount: coupon.maxDiscount ? parseFloat(coupon.maxDiscount) : undefined,
    maxUsage: coupon.maxUsage ?? undefined,
    isActive: coupon.isActive ?? true,
    startDate: coupon.startDate ? toDatetimeLocal(coupon.startDate) : null,
    expiresAt: coupon.expiresAt ? toDatetimeLocal(coupon.expiresAt) : null,
  } as Partial<CouponFormValues & { startDate?: string | Date | null; expiresAt?: string | Date | null }>;

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
