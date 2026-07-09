"use client";

import { Suspense } from "react";
import { Container, Breadcrumb, Section } from "@/components/ui";
import { NoResults } from "@/components/ui/empty-state";
import { FilterSidebar, MobileFilterDrawer, Toolbar, ProductGrid, CatalogPagination } from "@/components/catalog";
import { ProductListView } from "@/components/catalog/product-list-view";
import { useFilters } from "@/hooks/use-filters";
import { catalogProducts } from "@/data/catalog";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";

function SearchContentInner() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const view = searchParams.get("view") || "grid";

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

  const hasQuery = searchQuery.length > 0;

  return (
    <Section>
      <Container>
        <Breadcrumb
          className="mb-6"
          items={[
            { label: "Home", href: "/" },
            { label: "Search" },
          ]}
        />

        <div className="mb-6">
          <div className="flex items-center gap-3">
            <Search size={28} className="text-base-content/40" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                {hasQuery ? `Results for "${searchQuery}"` : "Search Products"}
              </h1>
              <p className="mt-1 text-base-content/60">
                {hasQuery
                  ? `${pagination.total} result${pagination.total === 1 ? "" : "s"} found`
                  : "Enter a search term to find products"}
              </p>
            </div>
          </div>
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

            {!hasQuery && displayedProducts.length === catalogProducts.length ? (
              <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
                <Search size={48} className="text-base-content/20" />
                <h3 className="text-lg font-semibold">Search our catalog</h3>
                <p className="max-w-sm text-sm text-base-content/60">
                  Use the search bar above to find products by name, brand, or keyword.
                </p>
              </div>
            ) : displayedProducts.length > 0 ? (
              <>
                {view === "list" ? (
                  <ProductListView products={displayedProducts} />
                ) : (
                  <ProductGrid products={displayedProducts} />
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
  );
}

export function SearchContent() {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchContentInner />
    </Suspense>
  );
}

function SearchSkeleton() {
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
