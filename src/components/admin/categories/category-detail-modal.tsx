"use client";

import { useEffect, useState } from "react";
import { FolderTree, X } from "lucide-react";
import { Badge, Spinner } from "@/components/ui";
import { formatDate } from "@/utils/format";
import type { CategoryListItem } from "@/services/admin/categories";

interface CategoryDetailModalProps {
  categoryId: string;
  onClose: () => void;
}

export function CategoryDetailModal({
  categoryId,
  onClose,
}: CategoryDetailModalProps) {
  const [category, setCategory] = useState<CategoryListItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/categories/${categoryId}`)
      .then((res) => res.json())
      .then((data) => {
        setCategory(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [categoryId]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Category details"
    >
      <div
        className="mx-4 w-full max-w-lg rounded-xl bg-base-100 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-base-200 px-5 py-4">
          <div className="flex items-center gap-2">
            <FolderTree className="size-4 text-base-content/50" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-base-content/50">
              Category Details
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-square btn-sm"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : !category ? (
            <p className="py-8 text-center text-sm text-base-content/40">
              Category not found
            </p>
          ) : (
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-base-content/50">Name</dt>
                <dd className="font-medium">{category.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-base-content/50">Slug</dt>
                <dd className="font-mono text-base-content/70">
                  {category.slug}
                </dd>
              </div>
              {category.description && (
                <div className="flex justify-between">
                  <dt className="text-base-content/50">Description</dt>
                  <dd className="max-w-[60%] text-right text-base-content/70">
                    {category.description}
                  </dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-base-content/50">Products</dt>
                <dd className="font-medium">{category.productCount}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-base-content/50">Featured</dt>
                <dd>
                  {category.featured ? (
                    <Badge variant="primary" size="xs">
                      Yes
                    </Badge>
                  ) : (
                    <span className="text-xs text-base-content/30">No</span>
                  )}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-base-content/50">Status</dt>
                <dd>
                  {category.active ? (
                    <Badge variant="success" size="xs">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="ghost" size="xs">
                      Inactive
                    </Badge>
                  )}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-base-content/50">Created</dt>
                <dd className="text-base-content/70">
                  {formatDate(category.createdAt)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-base-content/50">Updated</dt>
                <dd className="text-base-content/70">
                  {formatDate(category.updatedAt)}
                </dd>
              </div>
            </dl>
          )}
        </div>
      </div>
    </div>
  );
}
