import { Suspense } from "react";
import { SITE } from "@/constants";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ReviewsTable } from "@/components/admin/reviews";
import { getAdminReviews } from "@/services/admin/reviews";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Reviews | Admin | ${SITE.name}`,
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminReviewsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;
  const pageSize = Number(sp.pageSize) || 20;
  const search = (sp.search as string) ?? "";
  const status = (sp.status as string) ?? "";
  const sort = (sp.sort as string) ?? "createdAt";
  const order = (sp.order as "asc" | "desc") ?? "desc";

  const result = await getAdminReviews({
    page,
    pageSize,
    search,
    status,
    sort,
    order,
  });

  return (
    <>
      <AdminPageHeader
        title="Reviews"
        description={`${result.total} review${result.total === 1 ? "" : "s"} total`}
      />

      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-base-200" />}>
        <ReviewsTable
          reviews={result.items}
          total={result.total}
          page={result.page}
          pageSize={result.pageSize}
          totalPages={result.totalPages}
          search={search}
          statusFilter={status}
          sort={sort}
          order={order}
        />
      </Suspense>
    </>
  );
}
