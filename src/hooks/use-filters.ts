"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { Product } from "@/types/product";
import type { FilterState } from "@/lib/filters";
import { parseFilterParams, applyFilters, getActiveFilterCount } from "@/lib/filters";
import { sortProducts } from "@/lib/sort";
import { DEFAULT_SORT } from "@/constants";

interface UseFiltersReturn {
  filters: FilterState;
  displayedProducts: Product[];
  activeFilterCount: number;
  sortKey: string;
  setSortKey: (key: string) => void;
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

  const filteredProducts = useMemo(() => applyFilters(products, filters), [products, filters]);

  const displayedProducts = useMemo(
    () => sortProducts(filteredProducts, sortKey),
    [filteredProducts, sortKey],
  );

  const activeFilterCount = useMemo(() => getActiveFilterCount(filters), [filters]);

  const navigateWithParams = useCallback(
    (newParams: URLSearchParams) => {
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
      navigateWithParams(newParams);
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
      navigateWithParams(newParams);
    },
    [filters, searchParams, navigateWithParams],
  );

  const toggleRating = useCallback(
    (value: number) => {
      const current = filters.minRating;
      if (current === value) {
        setFilter("rating", null);
      } else {
        setFilter("rating", String(value));
      }
    },
    [filters.minRating, setFilter],
  );

  const toggleDiscount = useCallback(
    (value: number) => {
      const current = filters.minDiscount;
      if (current === value) {
        setFilter("discount", null);
      } else {
        setFilter("discount", String(value));
      }
    },
    [filters.minDiscount, setFilter],
  );

  const setPriceRange = useCallback(
    (min: number | null, max: number | null) => {
      const newParams = new URLSearchParams(searchParams.toString());
      if (min != null) newParams.set("minPrice", String(min));
      else newParams.delete("minPrice");
      if (max != null) newParams.set("maxPrice", String(max));
      else newParams.delete("maxPrice");
      navigateWithParams(newParams);
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

  const clearFilters = useCallback(() => {
    router.replace(baseUrl as any, { scroll: false });
  }, [baseUrl, router]);

  return {
    filters,
    displayedProducts,
    activeFilterCount,
    sortKey,
    setSortKey,
    setFilter,
    toggleFilter,
    toggleRating,
    toggleDiscount,
    setPriceRange,
    clearFilters,
  };
}
