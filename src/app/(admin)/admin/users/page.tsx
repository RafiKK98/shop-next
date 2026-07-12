import { Suspense } from "react";
import { SITE } from "@/constants";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { UsersTable } from "@/components/admin/users";
import { getAdminUsers } from "@/services/admin/users";
import type { UserRole, UserStatus } from "@/services/admin/user-types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Users | Admin | ${SITE.name}`,
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;
  const pageSize = Number(sp.pageSize) || 20;
  const search = (sp.search as string) ?? "";
  const sort = (sp.sort as string) ?? "createdAt";
  const order = (sp.order as "asc" | "desc") ?? "desc";
  const roleFilter = (sp.role as UserRole | "") ?? "";
  const statusFilter = (sp.status as UserStatus | "") ?? "";

  const result = await getAdminUsers({
    page,
    pageSize,
    search,
    sort,
    order,
    role: roleFilter,
    status: statusFilter,
  });

  return (
    <>
      <AdminPageHeader
        title="Users"
        description={`${result.total} user${result.total === 1 ? "" : "s"} total`}
      />

      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-base-200" />}>
        <UsersTable
          users={result.items}
          total={result.total}
          page={result.page}
          pageSize={result.pageSize}
          totalPages={result.totalPages}
          search={search}
          sort={sort}
          order={order}
          roleFilter={roleFilter}
          statusFilter={statusFilter}
        />
      </Suspense>
    </>
  );
}
