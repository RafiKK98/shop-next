import { notFound } from "next/navigation";
import { SITE } from "@/constants";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ProductForm } from "@/components/admin/products";
import { getAdminProductById, getAdminCategories } from "@/services/admin/products";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Edit Product | Admin | ${SITE.name}`,
};

interface PageProps {
  params: Promise<{ productId: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { productId } = await params;
  const [product, categories] = await Promise.all([
    getAdminProductById(productId),
    getAdminCategories(),
  ]);

  if (!product) notFound();

  return (
    <>
      <AdminPageHeader
        title={`Edit: ${product.title}`}
        description="Update product information"
      />

      <ProductForm
        defaultValues={{
          title: product.title,
          slug: product.slug,
          description: product.description ?? "",
          categoryId: product.categoryId ?? "",
          brand: product.brand ?? "",
          price: Number(product.price),
          discount: Number(product.discount ?? 0),
          stock: product.stock ?? 0,
          featured: product.featured ?? false,
          images: product.images.map((img) => img.url),
        }}
        categories={categories}
        mode="edit"
        productId={productId}
      />
    </>
  );
}
