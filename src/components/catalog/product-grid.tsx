import { ProductCard } from "@/components/product";
import type { Product } from "@/types/product";

interface ProductGridProps {
  products: Product[];
  onQuickView?: (slug: string) => void;
}

export function ProductGrid({ products, onQuickView }: ProductGridProps) {
  if (products.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-3 lg:gap-6">
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={i < 4}
          onQuickView={onQuickView ? () => onQuickView(product.slug) : undefined}
        />
      ))}
    </div>
  );
}
