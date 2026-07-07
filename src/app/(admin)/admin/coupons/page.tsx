import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SITE } from "@/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Coupons | Admin | ${SITE.name}`,
};

export default function AdminCouponsPage() {
  return (
    <>
      <AdminPageHeader title="Coupons" description="Create and manage discount coupons" />
      <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-base-300 py-24">
        <p className="text-sm text-base-content/40">Coupon management — coming soon</p>
      </div>
    </>
  );
}
