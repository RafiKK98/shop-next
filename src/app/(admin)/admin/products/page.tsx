import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SITE } from "@/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Products | Admin | ${SITE.name}`,
};

export default function AdminProductsPage() {
  return (
    <>
      <AdminPageHeader title="Products" description="Manage your product catalog" />
      <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-base-300 py-24">
        <p className="text-sm text-base-content/40">Product management — coming soon</p>
      </div>
    </>
  );
}
