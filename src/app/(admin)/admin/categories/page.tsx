import { Suspense } from "react";
import { SITE } from "@/constants";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CategoriesTable } from "@/components/admin/categories";
import { getAdminCategories } from "@/services/admin/categories";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Categories | Admin | ${SITE.name}`,
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminCategoriesPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;
  const pageSize = Number(sp.pageSize) || 20;
  const search = (sp.search as string) ?? "";
  const sort = (sp.sort as string) ?? "createdAt";
  const order = (sp.order as "asc" | "desc") ?? "desc";

  const result = await getAdminCategories({ page, pageSize, search, sort, order });

  return (
    <>
      <AdminPageHeader
        title="Categories"
        description={`${result.total} categor${result.total === 1 ? "y" : "ies"} total`}
      />

      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-base-200" />}>
        <CategoriesTable
          categories={result.items}
          total={result.total}
          page={result.page}
          pageSize={result.pageSize}
          totalPages={result.totalPages}
          search={search}
          sort={sort}
          order={order}
        />
      </Suspense>
    </>
  );
}
