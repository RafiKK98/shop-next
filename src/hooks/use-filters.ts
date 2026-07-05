"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { Product } from "@/types/product";
import type { FilterState } from "@/lib/filters";
import { parseFilterParams, applyFilters, getActiveFilterCount } from "@/lib/filters";
import { sortProducts } from "@/lib/sort";
import { paginateProducts, getPaginationInfo, type PaginationInfo } from "@/lib/pagination";
import { DEFAULT_SORT, PAGINATION as PAGE_CONST } from "@/constants";

interface UseFiltersReturn {
  filters: FilterState;
  displayedProducts: Product[];
  activeFilterCount: number;
  sortKey: string;
  pagination: PaginationInfo;
  setSortKey: (key: string) => void;
  setPage: (page: number) => void;
  setFilter: (key: string, value: string | string[] | null) => void;
  toggleFilter: (group: keyof Pick<FilterState, "categories" | "brands" | "availability">, value: string) => void;
  toggleRating: (value: number) => void;
  toggleDiscount: (value: number) => void;
  setPriceRange: (min: number | null, max: number | null) => void;
  clearFilters: () => void;
}

export function useFilters(products: Product[]): UseFiltersReturn {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const baseUrl = pathname;

  const filters = useMemo(() => parseFilterParams(searchParams), [searchParams]);

  const sortKey = searchParams.get("sort") || DEFAULT_SORT;

  const pageFromUrl = Math.max(1, Number(searchParams.get("page")) || 1);

  const pageSize = PAGE_CONST.defaultPageSize;

  const filteredProducts = useMemo(() => applyFilters(products, filters), [products, filters]);

  const sortedProducts = useMemo(
    () => sortProducts(filteredProducts, sortKey),
    [filteredProducts, sortKey],
  );

  const pagination = useMemo(
    () => getPaginationInfo(sortedProducts.length, pageFromUrl, pageSize),
    [sortedProducts.length, pageFromUrl, pageSize],
  );

  const displayedProducts = useMemo(
    () => paginateProducts(sortedProducts, pagination.currentPage, pageSize),
    [sortedProducts, pagination.currentPage, pageSize],
  );

  const activeFilterCount = useMemo(() => getActiveFilterCount(filters), [filters]);

  const navigateWithParams = useCallback(
    (newParams: URLSearchParams, options?: { resetPage?: boolean }) => {
      if (options?.resetPage) newParams.delete("page");
      const qs = newParams.toString();
      router.replace((qs ? `${baseUrl}?${qs}` : baseUrl) as any, { scroll: false });
    },
    [baseUrl, router],
  );

  const setFilter = useCallback(
    (key: string, value: string | string[] | null) => {
      const newParams = new URLSearchParams(searchParams.toString());
      if (value === null || (Array.isArray(value) && value.length === 0)) {
        newParams.delete(key);
      } else if (Array.isArray(value)) {
        newParams.set(key, value.join(","));
      } else {
        newParams.set(key, value);
      }
      navigateWithParams(newParams, { resetPage: true });
    },
    [searchParams, navigateWithParams],
  );

  const toggleFilter = useCallback(
    (group: keyof Pick<FilterState, "categories" | "brands" | "availability">, value: string) => {
      const current = filters[group] as string[];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      const urlKey = group === "categories" ? "category" : group === "brands" ? "brand" : "availability";
      const newParams = new URLSearchParams(searchParams.toString());
      if (next.length > 0) newParams.set(urlKey, next.join(","));
      else newParams.delete(urlKey);
      navigateWithParams(newParams, { resetPage: true });
    },
    [filters, searchParams, navigateWithParams],
  );

  const toggleRating = useCallback(
    (value: number) => {
      const current = filters.minRating;
      const newParams = new URLSearchParams(searchParams.toString());
      if (current === value) {
        newParams.delete("rating");
      } else {
        newParams.set("rating", String(value));
      }
      navigateWithParams(newParams, { resetPage: true });
    },
    [filters.minRating, searchParams, navigateWithParams],
  );

  const toggleDiscount = useCallback(
    (value: number) => {
      const current = filters.minDiscount;
      const newParams = new URLSearchParams(searchParams.toString());
      if (current === value) {
        newParams.delete("discount");
      } else {
        newParams.set("discount", String(value));
      }
      navigateWithParams(newParams, { resetPage: true });
    },
    [filters.minDiscount, searchParams, navigateWithParams],
  );

  const setPriceRange = useCallback(
    (min: number | null, max: number | null) => {
      const newParams = new URLSearchParams(searchParams.toString());
      if (min != null) newParams.set("minPrice", String(min));
      else newParams.delete("minPrice");
      if (max != null) newParams.set("maxPrice", String(max));
      else newParams.delete("maxPrice");
      navigateWithParams(newParams, { resetPage: true });
    },
    [searchParams, navigateWithParams],
  );

  const setSortKey = useCallback(
    (key: string) => {
      const newParams = new URLSearchParams(searchParams.toString());
      if (key === DEFAULT_SORT) {
        newParams.delete("sort");
      } else {
        newParams.set("sort", key);
      }
      navigateWithParams(newParams);
    },
    [searchParams, navigateWithParams],
  );

  const setPage = useCallback(
    (page: number) => {
      const newParams = new URLSearchParams(searchParams.toString());
      if (page <= 1) {
        newParams.delete("page");
      } else {
        newParams.set("page", String(page));
      }
      navigateWithParams(newParams);
    },
    [searchParams, navigateWithParams],
  );

  const clearFilters = useCallback(() => {
    router.replace(baseUrl as any, { scroll: false });
  }, [baseUrl, router]);

  return {
    filters,
    displayedProducts,
    activeFilterCount,
    sortKey,
    pagination,
    setSortKey,
    setPage,
    setFilter,
    toggleFilter,
    toggleRating,
    toggleDiscount,
    setPriceRange,
    clearFilters,
  };
}
