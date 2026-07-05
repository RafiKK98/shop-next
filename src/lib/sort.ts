import type { Product } from "@/types/product";

export type SortKey =
  | "featured"
  | "newest"
  | "best-selling"
  | "rating"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc";

export function sortProducts(products: Product[], sortKey: string): Product[] {
  const sorted = [...products];

  switch (sortKey) {
    case "featured":
      sorted.sort((a, b) => {
        if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
        return b.reviewCount - a.reviewCount;
      });
      break;
    case "newest":
      break;
    case "best-selling":
      sorted.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    case "rating":
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "name-asc":
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "name-desc":
      sorted.sort((a, b) => b.title.localeCompare(a.title));
      break;
    default:
      break;
  }

  return sorted;
}
