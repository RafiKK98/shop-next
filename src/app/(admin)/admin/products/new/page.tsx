import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ProductForm } from "@/components/admin/products";
import { SITE } from "@/constants";
import { getAdminCategories } from "@/services/admin/products";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `New Product | Admin | ${SITE.name}`,
};

export default async function NewProductPage() {
  const categories = await getAdminCategories();
  return (
    <>
      <AdminPageHeader
        title="New Product"
        description="Add a new product to your catalog"
      />

      <ProductForm categories={categories} mode="create" />
    </>
  );
}
