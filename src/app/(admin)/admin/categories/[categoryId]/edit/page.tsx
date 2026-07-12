import { AdminBreadcrumbs } from "@/components/admin/admin-breadcrumbs";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CategoryForm } from "@/components/admin/categories";
import { SITE } from "@/constants";
import { getAdminCategoryById } from "@/services/admin/categories";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ categoryId: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Edit Category | Admin | ${SITE.name}`,
  };
}

export default async function EditCategoryPage({ params }: PageProps) {
  const { categoryId } = await params;
  const category = await getAdminCategoryById(categoryId);

  if (!category) notFound();

  return (
    <>
      <div className="mb-4">
        <AdminBreadcrumbs />
      </div>

      <AdminPageHeader
        title={`Edit: ${category.name}`}
        description="Update category details"
      />

      <div className="mx-auto max-w-2xl">
        <CategoryForm
          mode="edit"
          categoryId={category.id}
          defaultValues={{
            name: category.name,
            slug: category.slug,
            description: category.description ?? "",
            image: category.image ?? "",
            featured: category.featured,
            active: category.active,
          }}
        />
      </div>
    </>
  );
}
