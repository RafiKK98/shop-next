import type { Product } from "@/types/product";

export function searchProducts(products: Product[], query: string): Product[] {
  const trimmed = query.trim();
  if (!trimmed) return products;

  const terms = trimmed.toLowerCase().split(/\s+/).filter(Boolean);

  return products.filter((product) => {
    const searchable = [
      product.title.toLowerCase(),
      product.brand.toLowerCase(),
      product.categorySlug.toLowerCase(),
    ].join(" ");

    return terms.every((term) => searchable.includes(term));
  });
}
