import { SITE } from "@/constants";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminBreadcrumbs } from "@/components/admin/admin-breadcrumbs";
import { AdminContainer } from "@/components/admin/admin-container";
import { CategoryForm } from "@/components/admin/categories";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `New Category | Admin | ${SITE.name}`,
};

export default function NewCategoryPage() {
  return (
    <>
      <div className="mb-4">
        <AdminBreadcrumbs />
      </div>

      <AdminPageHeader title="New Category" description="Create a new product category" />

      <div className="mx-auto max-w-2xl">
        <CategoryForm mode="create" />
      </div>
    </>
  );
}
