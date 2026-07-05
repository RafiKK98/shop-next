import { Container, Breadcrumb, Section } from "@/components/ui";
import { NoResults } from "@/components/ui/empty-state";
import { FilterSidebar, MobileFilterDrawer, Toolbar, ProductGrid, CatalogPagination } from "@/components/catalog";
import { catalogProducts } from "@/data/catalog";

export default function ProductsPage() {
  const products = catalogProducts;

  return (
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
            <FilterSidebar />
          </div>

          <div className="min-w-0 flex-1">
            <Toolbar
              totalProducts={products.length}
              mobileFilterButton={<MobileFilterDrawer />}
            />

            {products.length > 0 ? (
              <>
                <ProductGrid products={products} />
                <CatalogPagination />
              </>
            ) : (
              <NoResults />
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
