"use client";

import { SORT_OPTIONS } from "@/constants";
import type { PaginationInfo } from "@/lib/pagination";
import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, useCallback } from "react";
import { SearchInput } from "./search-input";

interface ToolbarProps {
  totalProducts: number;
  activeFilterCount: number;
  pagination: PaginationInfo;
  sortKey: string;
  searchQuery: string;
  mobileFilterButton: ReactNode;
  onSortChange: (key: string) => void;
  onClearFilters: () => void;
  onSearchChange: (query: string) => void;
}

export function Toolbar({
  totalProducts,
  activeFilterCount,
  pagination,
  sortKey,
  searchQuery,
  mobileFilterButton,
  onSortChange,
  onClearFilters,
  onSearchChange,
}: ToolbarProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentView = searchParams.get("view") || "grid";

  const setView = useCallback(
    (view: string) => {
      const next = new URLSearchParams(searchParams.toString());
      if (view === "grid") next.delete("view");
      else next.set("view", view);
      const qs = next.toString();
      router.replace((qs ? `${pathname}?${qs}` : pathname) as Route, {
        scroll: false,
      });
    },
    [searchParams, router, pathname],
  );

  const isPaginated = pagination.totalPages > 1;

  return (
    <div className="mb-6 space-y-4">
      <SearchInput value={searchQuery} onChange={onSearchChange} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {mobileFilterButton}
          {searchQuery ? (
            <p className="text-sm text-base-content/60">
              <span className="font-medium text-base-content">
                {pagination.total}
              </span>
              {pagination.total === 1 ? " result" : " results"}
              {" for "}
              <span className="font-medium text-base-content">
                &quot;{searchQuery}&quot;
              </span>
              {activeFilterCount > 0 && (
                <span className="text-base-content/40">
                  {" "}
                  / {totalProducts} total
                </span>
              )}
            </p>
          ) : (
            <p className="text-sm text-base-content/60">
              {isPaginated ? (
                <>
                  Showing{" "}
                  <span className="font-medium text-base-content">
                    {pagination.rangeStart}–{pagination.rangeEnd}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-base-content">
                    {pagination.total}
                  </span>
                </>
              ) : (
                <>
                  <span className="font-medium text-base-content">
                    {pagination.total}
                  </span>
                </>
              )}{" "}
              products
              {activeFilterCount > 0 && (
                <span className="text-base-content/40">
                  {" "}
                  / {totalProducts} total
                </span>
              )}
            </p>
          )}
          {activeFilterCount > 0 && (
            <button
              type="button"
              className="btn btn-ghost btn-xs text-primary"
              onClick={onClearFilters}
            >
              Clear filters
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1 sm:flex">
            <button
              type="button"
              className={`btn btn-ghost btn-sm btn-square ${currentView === "grid" ? "bg-base-200" : ""}`}
              onClick={() => setView("grid")}
              aria-label="Grid view"
            >
              <svg
                className="size-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
                />
              </svg>
            </button>
            <button
              type="button"
              className={`btn btn-ghost btn-sm btn-square ${currentView === "list" ? "bg-base-200" : ""}`}
              onClick={() => setView("list")}
              aria-label="List view"
            >
              <svg
                className="size-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
            </button>
          </div>
          <select
            className="select select-sm w-auto"
            aria-label="Sort products"
            value={sortKey}
            onChange={(e) => onSortChange(e.target.value)}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
