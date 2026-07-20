import type { Product, StockStatus } from "@/types/product";
import { getProductDiscount, isProductInStock } from "@/types/product";

/* ── Filter State ── */

export interface FilterState {
  categories: string[];
  brands: string[];
  minPrice: number | null;
  maxPrice: number | null;
  minRating: number | null;
  availability: StockStatus[];
  minDiscount: number | null;
}

/* ── Parse URL params into FilterState ── */

export function parseFilterParams(searchParams: URLSearchParams): FilterState {
  return {
    categories: searchParams.get("category")?.split(",").filter(Boolean) ?? [],
    brands: searchParams.get("brand")?.split(",").filter(Boolean) ?? [],
    minPrice: searchParams.has("minPrice")
      ? Number(searchParams.get("minPrice"))
      : null,
    maxPrice: searchParams.has("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : null,
    minRating: searchParams.has("rating")
      ? Number(searchParams.get("rating"))
      : null,
    availability: (searchParams
      .get("availability")
      ?.split(",")
      .filter(Boolean) ?? []) as StockStatus[],
    minDiscount: searchParams.has("discount")
      ? Number(searchParams.get("discount"))
      : null,
  };
}

/* ── Build URLSearchParams from FilterState ── */

export function buildFilterParams(filters: FilterState): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.categories.length > 0)
    params.set("category", filters.categories.join(","));
  if (filters.brands.length > 0) params.set("brand", filters.brands.join(","));
  if (filters.minPrice != null)
    params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice != null)
    params.set("maxPrice", String(filters.maxPrice));
  if (filters.minRating != null)
    params.set("rating", String(filters.minRating));
  if (filters.availability.length > 0)
    params.set("availability", filters.availability.join(","));
  if (filters.minDiscount != null)
    params.set("discount", String(filters.minDiscount));
  return params;
}

/* ── Apply filters to product array ── */

export function applyFilters(
  products: Product[],
  filters: FilterState,
): Product[] {
  return products.filter((product) => {
    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(product.categorySlug)
    )
      return false;

    if (
      filters.brands.length > 0 &&
      !filters.brands.includes(product.brand.toLowerCase())
    )
      return false;

    if (filters.minPrice != null && product.price < filters.minPrice)
      return false;

    if (filters.maxPrice != null && product.price > filters.maxPrice)
      return false;

    if (filters.minRating != null && product.rating < filters.minRating)
      return false;

    if (filters.availability.length > 0) {
      const inStock = isProductInStock(product);
      const selectedInStock = filters.availability.includes("in_stock");
      const selectedOutOfStock = filters.availability.includes("out_of_stock");
      if (selectedInStock && selectedOutOfStock) {
        /* both selected — no filter */
      } else if (selectedInStock && !inStock) return false;
      else if (selectedOutOfStock && inStock) return false;
    }
    if (filters.minDiscount != null) {
      const discount = getProductDiscount(product);
      if (discount < filters.minDiscount) return false;
    }
    return true;
  });
}

/* ── Count active filters ── */

export function getActiveFilterCount(filters: FilterState): number {
  let count = 0;
  if (filters.categories.length > 0) count++;
  if (filters.brands.length > 0) count++;
  if (filters.minPrice != null || filters.maxPrice != null) count++;
  if (filters.minRating != null) count++;
  if (filters.availability.length > 0) count++;
  if (filters.minDiscount != null) count++;
  return count;
}
