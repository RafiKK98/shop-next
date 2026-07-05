export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface Product {
  id: string;
  title: string;
  slug: string;
  images: string[];
  price: number;
  compareAtPrice: number | null;
  rating: number;
  reviewCount: number;
  brand: string;
  stockStatus: StockStatus;
  isNew: boolean;
  isFeatured: boolean;
}

export function getProductDiscount(product: Product): number {
  if (!product.compareAtPrice || product.compareAtPrice <= product.price) return 0;
  return Math.round((1 - product.price / product.compareAtPrice) * 100);
}
