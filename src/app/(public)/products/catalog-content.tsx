"use client";

import { Suspense, useState } from "react";
import { Container, Breadcrumb, Section } from "@/components/ui";
import { NoResults } from "@/components/ui/empty-state";
import { FilterSidebar, MobileFilterDrawer, Toolbar, ProductGrid, ProductListView, CatalogPagination } from "@/components/catalog";
import { ProductQuickViewModal } from "@/components/product/product-quick-view-modal";
import { useFilters } from "@/hooks/use-filters";
import { catalogProducts } from "@/data/catalog";
import { useSearchParams } from "next/navigation";

function CatalogContentInner() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "grid";
  const [quickViewSlug, setQuickViewSlug] = useState<string | null>(null);
  const quickViewProduct = quickViewSlug
    ? catalogProducts.find((p) => p.slug === quickViewSlug) ?? null
    : null;

  const {
    filters,
    displayedProducts,
    activeFilterCount,
    sortKey,
    pagination,
    searchQuery,
    setSearchQuery,
    setSortKey,
    setPage,
    toggleFilter,
    toggleRating,
    toggleDiscount,
    setPriceRange,
    clearFilters,
  } = useFilters(catalogProducts);

  return (
    <>
      <Section>
        <Container>
          <Breadcrumb
            className="mb-6"
            items={[
              { label: "Home", href: "/" },
              { label: "Products" },
            ]}
          />

          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Products</h1>
            <p className="mt-1 text-base-content/60">Browse our complete collection</p>
          </div>

          <div className="flex gap-8">
            <div className="hidden w-64 shrink-0 lg:block">
              <FilterSidebar
                filters={filters}
                onToggleCategory={(v) => toggleFilter("categories", v)}
                onToggleBrand={(v) => toggleFilter("brands", v)}
                onToggleRating={toggleRating}
                onToggleAvailability={(v) => toggleFilter("availability", v)}
                onToggleDiscount={toggleDiscount}
                onPriceChange={setPriceRange}
              />
            </div>

            <div className="min-w-0 flex-1">
              <Toolbar
                totalProducts={catalogProducts.length}
                activeFilterCount={activeFilterCount}
                pagination={pagination}
                sortKey={sortKey}
                searchQuery={searchQuery}
                mobileFilterButton={
                  <MobileFilterDrawer
                    filters={filters}
                    activeFilterCount={activeFilterCount}
                    onToggleCategory={(v) => toggleFilter("categories", v)}
                    onToggleBrand={(v) => toggleFilter("brands", v)}
                    onToggleRating={toggleRating}
                    onToggleAvailability={(v) => toggleFilter("availability", v)}
                    onToggleDiscount={toggleDiscount}
                    onPriceChange={setPriceRange}
                  />
                }
                onSortChange={setSortKey}
                onClearFilters={clearFilters}
                onSearchChange={setSearchQuery}
              />

              {displayedProducts.length > 0 ? (
                <>
                  {view === "list" ? (
                    <ProductListView products={displayedProducts} onQuickView={setQuickViewSlug} />
                  ) : (
                    <ProductGrid products={displayedProducts} onQuickView={setQuickViewSlug} />
                  )}
                  <CatalogPagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={setPage}
                  />
                </>
              ) : (
                <NoResults query={searchQuery} />
              )}
            </div>
          </div>
        </Container>
      </Section>

      {quickViewProduct && (
        <ProductQuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewSlug(null)}
        />
      )}
    </>
  );
}

export function CatalogContent() {
  return (
    <Suspense fallback={<ProductsPageSkeleton />}>
      <CatalogContentInner />
    </Suspense>
  );
}

function ProductsPageSkeleton() {
  return (
    <Section>
      <Container>
        <div className="mb-6 h-4 w-48 skeleton" />
        <div className="mb-6 h-10 w-64 skeleton" />
        <div className="flex gap-8">
          <div className="hidden w-64 shrink-0 lg:block">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 skeleton" />
              ))}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-6 h-8 skeleton" />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-3 lg:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-[3/4] skeleton" />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
