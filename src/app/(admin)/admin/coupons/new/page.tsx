import { SITE } from "@/constants";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminContainer } from "@/components/admin/admin-container";
import { CouponForm } from "@/components/admin/coupons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `New Coupon | Admin | ${SITE.name}`,
};

export default function NewCouponPage() {
  return (
    <>
      <AdminPageHeader
        title="New Coupon"
        description="Create a new discount coupon"
      />
      <AdminContainer>
        <CouponForm mode="create" />
      </AdminContainer>
    </>
  );
}
