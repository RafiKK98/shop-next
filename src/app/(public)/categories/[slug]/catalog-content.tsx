"use client";

import { Suspense } from "react";
import { Container, Breadcrumb, Section } from "@/components/ui";
import { NoResults } from "@/components/ui/empty-state";
import { FilterSidebar, MobileFilterDrawer, Toolbar, ProductGrid, CatalogPagination } from "@/components/catalog";
import { ProductListView } from "@/components/catalog/product-list-view";
import { useFilters } from "@/hooks/use-filters";
import { useSearchParams } from "next/navigation";
import type { Product } from "@/types/product";
import type { FilterCategory } from "@/data/catalog";

interface Props {
  category: FilterCategory;
  products: Product[];
}

function CategoryInner({ category, products }: Props) {
  const searchParams = useSearchParams();
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
  } = useFilters(products);

  return (
    <Section>
      <Container>
        <Breadcrumb
          className="mb-6"
          items={[
            { label: "Home", href: "/" },
            { label: "Categories", href: "/categories" },
            { label: category.name },
          ]}
        />

        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{category.name}</h1>
          <p className="mt-1 text-base-content/60">{category.count} products</p>
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
              totalProducts={products.length}
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

export function CategoryDetailContent({ category, products }: Props) {
  return (
    <Suspense fallback={<CategorySkeleton />}>
      <CategoryInner category={category} products={products} />
    </Suspense>
  );
}

function CategorySkeleton() {
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
