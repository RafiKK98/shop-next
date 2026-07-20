"use client";

import { toggleCouponAction } from "@/actions/admin/coupons";
import { Badge, Button } from "@/components/ui";
import { notify } from "@/lib/notifications";
import type { AdminCouponListItem } from "@/services/admin/coupons";
import { formatCurrency, formatDateShort } from "@/utils/format";
import {
  ChevronDown,
  ChevronUp,
  DollarSign,
  Eye,
  Pencil,
  Percent,
  Search,
} from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type ChangeEvent, useState, useTransition } from "react";

interface CouponsTableProps {
  coupons: AdminCouponListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  search: string;
  sort: string;
  order: "asc" | "desc";
  status: string;
}

export function CouponsTable({
  coupons,
  total,
  page,
  totalPages,
  search,
  sort,
  order,
  status,
}: CouponsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [detailCoupon, setDetailCoupon] = useState<AdminCouponListItem | null>(
    null,
  );

  const createUrl = (params: Record<string, string>) => {
    const sp = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(params)) {
      if (value) sp.set(key, value);
      else sp.delete(key);
    }
    return `/admin/coupons?${sp.toString()}`;
  };

  const navigate = (url: string) => router.push(url as Route);

  const toggleSort = (column: string) => {
    const newOrder = sort === column && order === "asc" ? "desc" : "asc";
    navigate(createUrl({ sort: column, order: newOrder, page: "1" }));
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const sp = new URLSearchParams(searchParams);
    if (value) sp.set("search", value);
    else sp.delete("search");
    sp.set("page", "1");
    navigate(`/admin/coupons?${sp.toString()}`);
  };

  const handleStatusFilter = (status: string) => {
    navigate(createUrl({ status, page: "1" }));
  };

  const handleToggle = (id: string, currentActive: boolean | null) => {
    startTransition(async () => {
      await toggleCouponAction(id, !currentActive);
      notify.success(currentActive ? "Coupon disabled" : "Coupon enabled");
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-base-content/40" />
          <input
            type="text"
            defaultValue={search}
            onChange={handleSearch}
            placeholder="Search coupons..."
            className="input input-sm w-full max-w-xs pl-9"
            aria-label="Search coupons"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={status}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="select select-sm"
            aria-label="Filter by status"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <Link href="/admin/coupons/new" className="shrink-0">
            <Button size="sm">New Coupon</Button>
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-base-200">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-base-200 text-xs uppercase tracking-wider text-base-content/50">
              <th>
                <button
                  type="button"
                  onClick={() => toggleSort("code")}
                  className="flex items-center gap-1"
                >
                  Code
                  {sort === "code" &&
                    (order === "asc" ? (
                      <ChevronUp className="size-3" />
                    ) : (
                      <ChevronDown className="size-3" />
                    ))}
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => toggleSort("type")}
                  className="flex items-center gap-1"
                >
                  Type
                  {sort === "type" &&
                    (order === "asc" ? (
                      <ChevronUp className="size-3" />
                    ) : (
                      <ChevronDown className="size-3" />
                    ))}
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => toggleSort("value")}
                  className="flex items-center gap-1"
                >
                  Value
                  {sort === "value" &&
                    (order === "asc" ? (
                      <ChevronUp className="size-3" />
                    ) : (
                      <ChevronDown className="size-3" />
                    ))}
                </button>
              </th>
              <th className="hidden md:table-cell">Usage</th>
              <th className="hidden md:table-cell">
                <button
                  type="button"
                  onClick={() => toggleSort("expiresAt")}
                  className="flex items-center gap-1"
                >
                  Expires
                  {sort === "expiresAt" &&
                    (order === "asc" ? (
                      <ChevronUp className="size-3" />
                    ) : (
                      <ChevronDown className="size-3" />
                    ))}
                </button>
              </th>
              <th>Status</th>
              <th className="w-36 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-16 text-center text-sm text-base-content/40"
                >
                  {search || status
                    ? "No coupons match your filters"
                    : "No coupons yet"}
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon.id} className="hover">
                  <td>
                    <span className="font-mono text-sm font-medium">
                      {coupon.code}
                    </span>
                  </td>
                  <td>
                    <span className="flex items-center gap-1 text-sm">
                      {coupon.type === "percentage" ? (
                        <>
                          <Percent className="size-3 text-base-content/40" />{" "}
                          Percentage
                        </>
                      ) : (
                        <>
                          <DollarSign className="size-3 text-base-content/40" />{" "}
                          Fixed
                        </>
                      )}
                    </span>
                  </td>
                  <td className="text-sm font-medium">
                    {coupon.type === "percentage"
                      ? `${coupon.value}%`
                      : formatCurrency(coupon.value)}
                    {coupon.maxDiscount && coupon.type === "percentage" && (
                      <span className="ml-1 text-xs text-base-content/40">
                        (max {formatCurrency(coupon.maxDiscount)})
                      </span>
                    )}
                  </td>
                  <td className="hidden text-sm md:table-cell">
                    {coupon.currentUsage ?? 0}
                    {coupon.maxUsage !== null && (
                      <span className="text-base-content/40">
                        {" "}
                        / {coupon.maxUsage}
                      </span>
                    )}
                  </td>
                  <td className="hidden text-sm text-base-content/50 md:table-cell">
                    {coupon.expiresAt ? (
                      formatDateShort(coupon.expiresAt)
                    ) : (
                      <span className="text-base-content/30">&mdash;</span>
                    )}
                  </td>
                  <td>
                    <Badge
                      variant={coupon.isActive ? "success" : "error"}
                      size="xs"
                    >
                      {coupon.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => setDetailCoupon(coupon)}
                        className="btn btn-ghost btn-square btn-sm"
                        aria-label="View coupon"
                      >
                        <Eye className="size-4" />
                      </button>
                      <Link
                        href={`/admin/coupons/${coupon.id}/edit`}
                        className="btn btn-ghost btn-square btn-sm"
                        aria-label="Edit coupon"
                      >
                        <Pencil className="size-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleToggle(coupon.id, coupon.isActive)}
                        disabled={isPending}
                        className="btn btn-ghost btn-square btn-sm"
                        aria-label={
                          coupon.isActive ? "Disable coupon" : "Enable coupon"
                        }
                      >
                        {coupon.isActive ? (
                          <svg
                            className="size-4 text-error"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="size-4 text-success"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.5 12.75l6 6 9-13.5"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-base-content/50">
            Page {page} of {totalPages} ({total} coupons)
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

      {detailCoupon && (
        <CouponDetail
          coupon={detailCoupon}
          onClose={() => setDetailCoupon(null)}
        />
      )}
    </div>
  );
}

function CouponDetail({
  coupon,
  onClose,
}: {
  coupon: AdminCouponListItem;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="max-w-lg w-full mx-4 rounded-xl bg-base-100 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-base-200 px-6 py-4">
          <h2 className="text-lg font-semibold">Coupon Details</h2>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-square"
          >
            <svg
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="space-y-4 px-6 py-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-base-content/50">
                Code
              </p>
              <p className="mt-0.5 font-mono font-medium">{coupon.code}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-base-content/50">
                Type
              </p>
              <p className="mt-0.5 capitalize">{coupon.type}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-base-content/50">
                Value
              </p>
              <p className="mt-0.5 font-medium">
                {coupon.type === "percentage"
                  ? `${coupon.value}%`
                  : formatCurrency(coupon.value)}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-base-content/50">
                Status
              </p>
              <p className="mt-0.5">
                <Badge
                  variant={coupon.isActive ? "success" : "error"}
                  size="xs"
                >
                  {coupon.isActive ? "Active" : "Inactive"}
                </Badge>
              </p>
            </div>
            {coupon.description && (
              <div className="col-span-2">
                <p className="text-xs font-medium uppercase tracking-wider text-base-content/50">
                  Description
                </p>
                <p className="mt-0.5">{coupon.description}</p>
              </div>
            )}
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-base-content/50">
                Usage
              </p>
              <p className="mt-0.5">
                {coupon.currentUsage ?? 0}
                {coupon.maxUsage !== null && <span> / {coupon.maxUsage}</span>}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-base-content/50">
                Min Purchase
              </p>
              <p className="mt-0.5">
                {coupon.minPurchase ? (
                  formatCurrency(coupon.minPurchase)
                ) : (
                  <span className="text-base-content/30">&mdash;</span>
                )}
              </p>
            </div>
            {coupon.maxDiscount && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-base-content/50">
                  Max Discount
                </p>
                <p className="mt-0.5">{formatCurrency(coupon.maxDiscount)}</p>
              </div>
            )}
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-base-content/50">
                Start Date
              </p>
              <p className="mt-0.5">
                {coupon.startDate ? (
                  formatDateShort(coupon.startDate)
                ) : (
                  <span className="text-base-content/30">&mdash;</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-base-content/50">
                Expires
              </p>
              <p className="mt-0.5">
                {coupon.expiresAt ? (
                  formatDateShort(coupon.expiresAt)
                ) : (
                  <span className="text-base-content/30">&mdash;</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-base-content/50">
                Created
              </p>
              <p className="mt-0.5">{formatDateShort(coupon.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-base-content/50">
                Updated
              </p>
              <p className="mt-0.5">{formatDateShort(coupon.updatedAt)}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end border-t border-base-200 px-6 py-4">
          <Link href={`/admin/coupons/${coupon.id}/edit`}>
            <Button size="sm">Edit Coupon</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
