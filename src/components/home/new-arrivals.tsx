import { Container, Section, Badge } from "@/components/ui";
import { newArrivals } from "@/data/home";
import { HomeProductCard } from "./home-product-card";

export function NewArrivals() {
  return (
    <Section>
      <Container>
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">New Arrivals</h2>
            <Badge variant="primary" size="sm">Hot</Badge>
          </div>
          <p className="mt-2 text-base-content/60">Fresh off the truck — be the first to snag these</p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {newArrivals.map((product) => (
            <HomeProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
