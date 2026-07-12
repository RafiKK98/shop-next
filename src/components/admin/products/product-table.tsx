"use client";

import { Badge, Button } from "@/components/ui";
import type { ProductListItem } from "@/services/admin/products";
import { cn } from "@/utils/cn";
import { formatCurrency, formatDate } from "@/utils/format";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  Package,
  Pencil,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { DeleteProductButton } from "./delete-product-button";
import { ProductDetailModal } from "./product-detail-modal";

interface ProductTableProps {
  products: ProductListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  search: string;
  sort: string;
  order: "asc" | "desc";
}

export function ProductTable({
  products,
  total,
  page,
  pageSize,
  totalPages,
  search,
  sort,
  order,
}: ProductTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [detailProductId, setDetailProductId] = useState<string | null>(null);

  const createUrl = (params: Record<string, string>) => {
    const sp = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(params)) {
      if (value) sp.set(key, value);
      else sp.delete(key);
    }
    return `/admin/products?${sp.toString()}`;
  };

  const navigate = (url: string) => {
    router.push(url as never);
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
    navigate(`/admin/products?${sp.toString()}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-base-content/40" />
          <input
            type="text"
            defaultValue={search}
            onChange={handleSearch}
            placeholder="Search products..."
            className="input input-sm w-full max-w-xs pl-9"
            aria-label="Search products"
          />
        </div>
        <Link href="/admin/products/new">
          <Button size="sm">New Product</Button>
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-base-200">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-base-200 text-xs uppercase tracking-wider text-base-content/50">
              <th className="w-12">Image</th>
              <th>
                <button
                  type="button"
                  onClick={() => toggleSort("title")}
                  className="flex items-center gap-1"
                >
                  Product
                  {sort === "title" &&
                    (order === "asc" ? (
                      <ChevronUp className="size-3" />
                    ) : (
                      <ChevronDown className="size-3" />
                    ))}
                </button>
              </th>
              <th className="hidden md:table-cell">Category</th>
              <th className="hidden lg:table-cell">Brand</th>
              <th>
                <button
                  type="button"
                  onClick={() => toggleSort("price")}
                  className="flex items-center gap-1"
                >
                  Price
                  {sort === "price" &&
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
                  onClick={() => toggleSort("stock")}
                  className="flex items-center gap-1"
                >
                  Stock
                  {sort === "stock" &&
                    (order === "asc" ? (
                      <ChevronUp className="size-3" />
                    ) : (
                      <ChevronDown className="size-3" />
                    ))}
                </button>
              </th>
              <th className="hidden sm:table-cell">
                <button
                  type="button"
                  onClick={() => toggleSort("featured")}
                  className="flex items-center gap-1"
                >
                  Featured
                  {sort === "featured" &&
                    (order === "asc" ? (
                      <ChevronUp className="size-3" />
                    ) : (
                      <ChevronDown className="size-3" />
                    ))}
                </button>
              </th>
              <th className="hidden xl:table-cell">Created</th>
              <th className="w-28 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="py-16 text-center text-sm text-base-content/40"
                >
                  {search ? "No products match your search" : "No products yet"}
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover">
                  <td>
                    <div className="flex size-10 items-center justify-center overflow-hidden rounded-lg bg-base-200">
                      {product.thumbnail ? (
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="size-full object-cover"
                        />
                      ) : (
                        <Package className="size-5 text-base-content/30" />
                      )}
                    </div>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => setDetailProductId(product.id)}
                      className="text-sm font-medium hover:text-primary"
                    >
                      {product.title}
                    </button>
                    <p className="text-xs text-base-content/40">
                      {product.slug}
                    </p>
                  </td>
                  <td className="hidden text-sm md:table-cell">
                    {product.categoryName ?? (
                      <span className="text-base-content/30">&mdash;</span>
                    )}
                  </td>
                  <td className="hidden text-sm lg:table-cell">
                    {product.brand ?? (
                      <span className="text-base-content/30">&mdash;</span>
                    )}
                  </td>
                  <td className="text-sm font-medium">
                    {formatCurrency(product.price)}
                    {product.discount && Number(product.discount) > 0 && (
                      <span className="ml-1 text-xs text-error">
                        -{product.discount}%
                      </span>
                    )}
                  </td>
                  <td>
                    <span
                      className={cn(
                        "text-sm",
                        (product.stock ?? 0) === 0
                          ? "text-error"
                          : (product.stock ?? 0) < 10
                            ? "text-warning"
                            : "text-success",
                      )}
                    >
                      {product.stock ?? 0}
                    </span>
                  </td>
                  <td className="hidden sm:table-cell">
                    {product.featured ? (
                      <Badge variant="primary" size="xs">
                        Yes
                      </Badge>
                    ) : (
                      <span className="text-xs text-base-content/30">No</span>
                    )}
                  </td>
                  <td className="hidden text-xs text-base-content/50 xl:table-cell">
                    {formatDate(product.createdAt)}
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => setDetailProductId(product.id)}
                        className="btn btn-ghost btn-square btn-sm"
                        aria-label="View product"
                      >
                        <Eye className="size-4" />
                      </button>
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="btn btn-ghost btn-square btn-sm"
                        aria-label="Edit product"
                      >
                        <Pencil className="size-4" />
                      </Link>
                      <DeleteProductButton
                        productId={product.id}
                        productTitle={product.title}
                      />
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
            Page {page} of {totalPages} ({total} products)
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

      {detailProductId && (
        <ProductDetailModal
          productId={detailProductId}
          onClose={() => setDetailProductId(null)}
        />
      )}
    </div>
  );
}
