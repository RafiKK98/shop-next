import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SITE } from "@/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Reviews | Admin | ${SITE.name}`,
};

export default function AdminReviewsPage() {
  return (
    <>
      <AdminPageHeader title="Reviews" description="Manage product reviews" />
      <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-base-300 py-24">
        <p className="text-sm text-base-content/40">Review management — coming soon</p>
      </div>
    </>
  );
}
