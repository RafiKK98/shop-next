import { Container, Section } from "@/components/ui";
import { ProductCard } from "@/components/product";
import { featuredProducts } from "@/data/home";

export function FeaturedProducts() {
  return (
    <Section>
      <Container>
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Featured Products</h2>
          <p className="mt-2 text-base-content/60">Handpicked favorites you won&apos;t want to miss</p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {featuredProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i < 4} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
