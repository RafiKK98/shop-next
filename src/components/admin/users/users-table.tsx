"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronUp, ChevronDown, Search, Eye, Pencil, Users } from "lucide-react";
import { formatDate } from "@/utils/format";
import { Badge, Avatar } from "@/components/ui";
import {
  USER_ROLE_LABEL,
  USER_STATUS_LABEL,
  type UserListItem,
  type UserRole,
  type UserStatus,
} from "@/services/admin/user-types";

interface UsersTableProps {
  users: UserListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  search: string;
  sort: string;
  order: "asc" | "desc";
  roleFilter: string;
  statusFilter: string;
}

const roleBadgeVariant: Record<string, string> = {
  customer: "ghost",
  admin: "primary",
};

const statusBadgeVariant: Record<string, string> = {
  active: "success",
  suspended: "warning",
  disabled: "error",
};

const ROLE_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "All Roles" },
  ...Object.entries(USER_ROLE_LABEL).map(([value, label]) => ({ value, label })),
];

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "All Statuses" },
  ...Object.entries(USER_STATUS_LABEL).map(([value, label]) => ({ value, label })),
];

export function UsersTable({
  users: items,
  total,
  page,
  pageSize,
  totalPages,
  search,
  sort,
  order,
  roleFilter,
  statusFilter,
}: UsersTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createUrl = (params: Record<string, string>) => {
    const sp = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(params)) {
      if (value) sp.set(key, value);
      else sp.delete(key);
    }
    return `/admin/users?${sp.toString()}`;
  };

  const navigate = (url: string) => {
    router.push(url as any);
  };

  const toggleSort = (column: string) => {
    const newOrder = sort === column && order === "asc" ? "desc" : "asc";
    navigate(createUrl({ sort: column, order: newOrder, page: "1" }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const sp = new URLSearchParams(searchParams);
    if (value) sp.set("search", value);
    else sp.delete("search");
    sp.set("page", "1");
    navigate(`/admin/users?${sp.toString()}`);
  };

  const handleFilterChange = (key: string, value: string) => {
    navigate(createUrl({ [key]: value, page: "1" }));
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-base-content/40" />
          <input
            type="text"
            defaultValue={search}
            onChange={handleSearch}
            placeholder="Search users..."
            className="input input-sm w-full max-w-xs pl-9"
            aria-label="Search users"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => handleFilterChange("role", e.target.value)}
          className="select select-sm w-36"
          aria-label="Filter by role"
        >
          {ROLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="select select-sm w-36"
          aria-label="Filter by status"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-base-200">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-base-200 text-xs uppercase tracking-wider text-base-content/50">
              <th className="w-12">Avatar</th>
              <th>
                <button
                  type="button"
                  onClick={() => toggleSort("name")}
                  className="flex items-center gap-1"
                >
                  Name
                  {sort === "name" &&
                    (order === "asc" ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />)}
                </button>
              </th>
              <th>Email</th>
              <th>
                <button
                  type="button"
                  onClick={() => toggleSort("role")}
                  className="flex items-center gap-1"
                >
                  Role
                  {sort === "role" &&
                    (order === "asc" ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />)}
                </button>
              </th>
              <th className="hidden sm:table-cell">
                <button
                  type="button"
                  onClick={() => toggleSort("status")}
                  className="flex items-center gap-1"
                >
                  Status
                  {sort === "status" &&
                    (order === "asc" ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />)}
                </button>
              </th>
              <th className="hidden md:table-cell">Verified</th>
              <th className="hidden lg:table-cell">
                <button
                  type="button"
                  onClick={() => toggleSort("orderCount")}
                  className="flex items-center gap-1"
                >
                  Orders
                  {sort === "orderCount" &&
                    (order === "asc" ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />)}
                </button>
              </th>
              <th className="hidden xl:table-cell">Registered</th>
              <th className="w-20 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-16 text-center text-sm text-base-content/40">
                  {search || roleFilter || statusFilter
                    ? "No users match your filters"
                    : "No users yet"}
                </td>
              </tr>
            ) : (
              items.map((user) => (
                <tr key={user.id} className="hover">
                  <td>
                    <Avatar
                      src={user.image ?? undefined}
                      alt={user.name ?? user.email}
                      size="sm"
                    />
                  </td>
                  <td>
                    <span className="text-sm font-medium">
                      {user.name ?? (
                        <span className="text-base-content/30">Unnamed</span>
                      )}
                    </span>
                  </td>
                  <td className="text-sm text-base-content/60">{user.email}</td>
                  <td>
                    <Badge variant={roleBadgeVariant[user.role] as any} size="xs">
                      {USER_ROLE_LABEL[user.role]}
                    </Badge>
                  </td>
                  <td className="hidden sm:table-cell">
                    <Badge variant={statusBadgeVariant[user.status] as any} size="xs">
                      {USER_STATUS_LABEL[user.status]}
                    </Badge>
                  </td>
                  <td className="hidden text-xs md:table-cell">
                    {user.emailVerified ? (
                      <span className="text-success">Verified</span>
                    ) : (
                      <span className="text-base-content/30">Not verified</span>
                    )}
                  </td>
                  <td className="hidden text-sm lg:table-cell">{user.orderCount}</td>
                  <td className="hidden text-xs text-base-content/50 xl:table-cell">
                    {formatDate(user.createdAt)}
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="btn btn-ghost btn-square btn-sm"
                        aria-label="View user"
                      >
                        <Eye className="size-4" />
                      </Link>
                      <Link
                        href={`/admin/users/${user.id}?edit=true`}
                        className="btn btn-ghost btn-square btn-sm"
                        aria-label="Edit user"
                      >
                        <Pencil className="size-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-base-content/50">
            Page {page} of {totalPages} ({total} users)
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => navigate(createUrl({ page: String(page - 1) }))}
              className="btn btn-outline btn-sm"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => navigate(createUrl({ page: String(page + 1) }))}
              className="btn btn-outline btn-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
