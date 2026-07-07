"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronUp, ChevronDown, Search, Eye, Pencil, Trash2, FolderTree } from "lucide-react";
import { formatDate } from "@/utils/format";
import { Badge } from "@/components/ui";
import type { CategoryListItem } from "@/services/admin/categories";
import { DeleteCategoryButton } from "./delete-category-button";
import { CategoryDetailModal } from "./category-detail-modal";
import { useState } from "react";

interface CategoriesTableProps {
  categories: CategoryListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  search: string;
  sort: string;
  order: "asc" | "desc";
}

export function CategoriesTable({
  categories: items,
  total,
  page,
  pageSize,
  totalPages,
  search,
  sort,
  order,
}: CategoriesTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [detailId, setDetailId] = useState<string | null>(null);

  const createUrl = (params: Record<string, string>) => {
    const sp = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(params)) {
      if (value) sp.set(key, value);
      else sp.delete(key);
    }
    return `/admin/categories?${sp.toString()}`;
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
    navigate(`/admin/categories?${sp.toString()}`);
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
            placeholder="Search categories..."
            className="input input-sm w-full max-w-xs pl-9"
            aria-label="Search categories"
          />
        </div>
        <Link href="/admin/categories/new">
          <button type="button" className="btn btn-primary btn-sm">
            New Category
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-base-200">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-base-200 text-xs uppercase tracking-wider text-base-content/50">
              <th>
                <button
                  type="button"
                  onClick={() => toggleSort("name")}
                  className="flex items-center gap-1"
                >
                  Name
                  {sort === "name" &&
                    (order === "asc" ? (
                      <ChevronUp className="size-3" />
                    ) : (
                      <ChevronDown className="size-3" />
                    ))}
                </button>
              </th>
              <th>Slug</th>
              <th>
                <button
                  type="button"
                  onClick={() => toggleSort("productCount")}
                  className="flex items-center gap-1"
                >
                  Products
                  {sort === "productCount" &&
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
                  onClick={() => toggleSort("active")}
                  className="flex items-center gap-1"
                >
                  Status
                  {sort === "active" &&
                    (order === "asc" ? (
                      <ChevronUp className="size-3" />
                    ) : (
                      <ChevronDown className="size-3" />
                    ))}
                </button>
              </th>
              <th className="hidden md:table-cell">
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
              <th className="hidden lg:table-cell">Created</th>
              <th className="w-28 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-16 text-center text-sm text-base-content/40"
                >
                  {search
                    ? "No categories match your search"
                    : "No categories yet"}
                </td>
              </tr>
            ) : (
              items.map((cat) => (
                <tr key={cat.id} className="hover">
                  <td>
                    <button
                      type="button"
                      onClick={() => setDetailId(cat.id)}
                      className="text-sm font-medium hover:text-primary"
                    >
                      {cat.name}
                    </button>
                  </td>
                  <td className="text-sm text-base-content/50">{cat.slug}</td>
                  <td className="text-sm">{cat.productCount}</td>
                  <td className="hidden sm:table-cell">
                    {cat.active ? (
                      <Badge variant="success" size="xs">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="ghost" size="xs">
                        Inactive
                      </Badge>
                    )}
                  </td>
                  <td className="hidden md:table-cell">
                    {cat.featured ? (
                      <Badge variant="primary" size="xs">
                        Yes
                      </Badge>
                    ) : (
                      <span className="text-xs text-base-content/30">No</span>
                    )}
                  </td>
                  <td className="hidden text-xs text-base-content/50 lg:table-cell">
                    {formatDate(cat.createdAt)}
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => setDetailId(cat.id)}
                        className="btn btn-ghost btn-square btn-sm"
                        aria-label="View category"
                      >
                        <Eye className="size-4" />
                      </button>
                      <Link
                        href={`/admin/categories/${cat.id}/edit`}
                        className="btn btn-ghost btn-square btn-sm"
                        aria-label="Edit category"
                      >
                        <Pencil className="size-4" />
                      </Link>
                      <DeleteCategoryButton
                        categoryId={cat.id}
                        categoryName={cat.name}
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
            Page {page} of {totalPages} ({total} categories)
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() =>
                navigate(createUrl({ page: String(page - 1) }))
              }
              className="btn btn-outline btn-sm"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() =>
                navigate(createUrl({ page: String(page + 1) }))
              }
              className="btn btn-outline btn-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {detailId && (
        <CategoryDetailModal
          categoryId={detailId}
          onClose={() => setDetailId(null)}
        />
      )}
    </div>
  );
}
