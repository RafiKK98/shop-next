"use client";

import { moderateReview } from "@/actions/admin/reviews";
import { notify } from "@/lib/notifications";
import { formatDate } from "@/utils/format";
import { Badge, Button } from "@/components/ui";
import { Pagination } from "@/components/ui";
import type { Route } from "next";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, ChevronUp, ChevronDown } from "lucide-react";
import { useCallback, useState } from "react";
import type { AdminReviewListItem } from "@/services/admin/reviews";

interface ReviewsTableProps {
  reviews: AdminReviewListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  search: string;
  statusFilter: string;
  sort: string;
  order: "asc" | "desc";
}

const STATUS_BADGE: Record<string, string> = {
  pending: "warning",
  approved: "success",
  rejected: "error",
  hidden: "neutral",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  hidden: "Hidden",
};

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "hidden", label: "Hidden" },
];

function SortIcon({
  column,
  sort,
  order,
}: {
  column: string;
  sort: string;
  order: "asc" | "desc";
}) {
  if (sort !== column) return <ChevronUp className="size-3 text-base-content/20" />;
  return order === "asc" ? (
    <ChevronUp className="size-3" />
  ) : (
    <ChevronDown className="size-3" />
  );
}

export function ReviewsTable({
  reviews,
  page,
  totalPages,
  search: initialSearch,
  statusFilter,
  sort,
  order,
}: ReviewsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialSearch);
  const [moderatingId, setModeratingId] = useState<string | null>(null);

  const buildHref = useCallback(
    (params: Record<string, string>) => {
      const sp = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(params)) {
        if (value) sp.set(key, value);
        else sp.delete(key);
      }
      return `/admin/reviews?${sp.toString()}`;
    },
    [searchParams],
  );

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      router.push(buildHref({ search, page: "1" }) as Route);
    },
    [router, buildHref, search],
  );

  const handleSort = useCallback(
    (column: string) => {
      const newOrder = sort === column && order === "asc" ? "desc" : "asc";
      router.push(buildHref({ sort: column, order: newOrder, page: "1" }) as Route);
    },
    [router, buildHref, sort, order],
  );

  const handleStatusFilter = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      router.push(buildHref({ status: e.target.value, page: "1" }) as Route);
    },
    [router, buildHref],
  );

  const handleModerate = useCallback(
    async (reviewId: string, status: "pending" | "approved" | "rejected" | "hidden") => {
      setModeratingId(reviewId);
      const result = await moderateReview(reviewId, status);
      setModeratingId(null);
      if ("error" in result) {
        notify.error(result.error);
      } else {
        notify.success(`Review ${STATUS_LABEL[status]?.toLowerCase() ?? status}`);
        router.refresh();
      }
    },
    [router],
  );

  return (
    <div className="space-y-4">
      {/* Search + Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearch} className="join flex-1 max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products, users..."
            className="input input-bordered join-item w-full"
          />
          <Button type="submit" variant="primary" className="join-item">
            <Search className="size-4" />
          </Button>
        </form>

        <select
          value={statusFilter}
          onChange={handleStatusFilter}
          className="select select-bordered w-full sm:w-44"
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
        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>User</th>
              <th>
                <button
                  onClick={() => handleSort("rating")}
                  className="inline-flex items-center gap-1"
                >
                  Rating <SortIcon column="rating" sort={sort} order={order} />
                </button>
              </th>
              <th>Review</th>
              <th>
                <button
                  onClick={() => handleSort("status")}
                  className="inline-flex items-center gap-1"
                >
                  Status <SortIcon column="status" sort={sort} order={order} />
                </button>
              </th>
              <th>
                <button
                  onClick={() => handleSort("createdAt")}
                  className="inline-flex items-center gap-1"
                >
                  Date <SortIcon column="createdAt" sort={sort} order={order} />
                </button>
              </th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-sm text-base-content/40">
                  No reviews found
                </td>
              </tr>
            ) : (
              reviews.map((review) => (
                <tr key={review.id}>
                  <td>
                    <Link
                      href={`/admin/products/${review.productId}`}
                      className="link link-hover text-sm font-medium"
                    >
                      {review.productTitle}
                    </Link>
                  </td>
                  <td>
                    <div className="text-sm">
                      <p>{review.userName || "—"}</p>
                      <p className="text-xs text-base-content/40">{review.userEmail}</p>
                    </div>
                  </td>
                  <td>
                    <span className="font-semibold">{review.rating}</span>
                    <span className="text-xs text-base-content/40"> / 5</span>
                  </td>
                  <td className="max-w-xs">
                    <div className="text-sm">
                      {review.title && (
                        <p className="font-medium">{review.title}</p>
                      )}
                      {review.comment && (
                        <p className="line-clamp-2 text-xs text-base-content/60">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  </td>
                  <td>
                    <Badge variant={STATUS_BADGE[review.status] as "warning" | "success" | "error" | "neutral"}>
                      {STATUS_LABEL[review.status] ?? review.status}
                    </Badge>
                  </td>
                  <td className="text-xs text-base-content/50">
                    {formatDate(review.createdAt)}
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {review.status !== "approved" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          loading={moderatingId === review.id}
                          onClick={() => handleModerate(review.id, "approved")}
                        >
                          Approve
                        </Button>
                      )}
                      {review.status !== "rejected" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          loading={moderatingId === review.id}
                          onClick={() => handleModerate(review.id, "rejected")}
                        >
                          Reject
                        </Button>
                      )}
                      {review.status !== "hidden" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          loading={moderatingId === review.id}
                          onClick={() => handleModerate(review.id, "hidden")}
                        >
                          Hide
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => router.push(buildHref({ page: String(p) }) as Route)}
      />
    </div>
  );
}
