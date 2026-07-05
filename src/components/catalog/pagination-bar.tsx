"use client";

import { Pagination } from "@/components/ui";

export function CatalogPagination() {
  return (
    <div className="mt-10">
      <Pagination
        currentPage={1}
        totalPages={3}
        onPageChange={() => {}}
      />
    </div>
  );
}
