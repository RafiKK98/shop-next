import { Container, Section } from "@/components/ui";
import { ProductCard } from "@/components/product";
import { bestSellers } from "@/data/home";

export function BestSellers() {
  return (
    <Section>
      <Container>
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Best Sellers</h2>
          <p className="mt-2 text-base-content/60">Our most popular products loved by customers everywhere</p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
