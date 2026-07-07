import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SITE } from "@/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Categories | Admin | ${SITE.name}`,
};

export default function AdminCategoriesPage() {
  return (
    <>
      <AdminPageHeader title="Categories" description="Organize your product categories" />
      <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-base-300 py-24">
        <p className="text-sm text-base-content/40">Category management — coming soon</p>
      </div>
    </>
  );
}
