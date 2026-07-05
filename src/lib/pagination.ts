import type { Product } from "@/types/product";
import { PAGINATION } from "@/constants";

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  rangeStart: number;
  rangeEnd: number;
  total: number;
}

export function paginateProducts(products: Product[], page: number, pageSize: number = PAGINATION.defaultPageSize): Product[] {
  const start = (page - 1) * pageSize;
  return products.slice(start, start + pageSize);
}

export function getPaginationInfo(total: number, page: number, pageSize: number = PAGINATION.defaultPageSize): PaginationInfo {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const rangeStart = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, total);

  return { currentPage, totalPages, pageSize, rangeStart, rangeEnd, total };
}
