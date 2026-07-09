import { Suspense } from "react";
import { SITE } from "@/constants";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CouponsTable } from "@/components/admin/coupons";
import { getAdminCoupons } from "@/services/admin/coupons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Coupons | Admin | ${SITE.name}`,
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminCouponsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;
  const pageSize = Number(sp.pageSize) || 20;
  const search = (sp.search as string) ?? "";
  const sort = (sp.sort as string) ?? "createdAt";
  const order = (sp.order as "asc" | "desc") ?? "desc";
  const status = (sp.status as string) ?? "";

  const result = await getAdminCoupons({ page, pageSize, search, sort, order, status });

  return (
    <>
      <AdminPageHeader
        title="Coupons"
        description={`${result.total} coupon${result.total === 1 ? "" : "s"} total`}
      />

      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-base-200" />}>
        <CouponsTable
          coupons={result.items}
          total={result.total}
          page={result.page}
          pageSize={result.pageSize}
          totalPages={result.totalPages}
          search={search}
          sort={sort}
          order={order}
          status={status}
        />
      </Suspense>
    </>
  );
}
