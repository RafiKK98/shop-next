import { Container, Section } from "@/components/ui";
import { ProductCard } from "@/components/product";
import type { Product } from "@/types/product";

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <Section>
      <Container>
        <h2 className="mb-6 text-xl font-bold">Related Products</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
