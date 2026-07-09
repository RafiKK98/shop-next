import Link from "next/link";
import { Rating, Price } from "@/components/ui";
import { ProductCardImage } from "@/components/product/product-card-image";
import { ProductCardBadges } from "@/components/product/product-card-badges";
import { WishlistButton } from "@/components/wishlist";
import { type Product, getProductDiscount } from "@/types/product";
import { ROUTES } from "@/constants";

interface ProductListViewProps {
  products: Product[];
}

export function ProductListView({ products }: ProductListViewProps) {
  if (products.length === 0) return null;

  return (
    <div className="divide-y divide-base-200 border-y border-base-200">
      {products.map((product) => {
        const discount = getProductDiscount(product);
        const primaryImage = product.images[0];
        const href = ROUTES.productDetail(product.slug);

        return (
          <div
            key={product.id}
            className="flex flex-col gap-4 py-5 sm:flex-row sm:items-start"
          >
            <Link href={href as any} className="relative w-full shrink-0 sm:w-48">
              <div className="aspect-[4/3] overflow-hidden rounded-lg bg-base-200">
                <ProductCardImage src={primaryImage} alt={product.title} />
              </div>
              <ProductCardBadges
                discount={discount}
                isNew={product.isNew}
                isFeatured={product.isFeatured}
                stockStatus={product.stockStatus}
              />
            </Link>

            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Link
                    href={href as any}
                    className="text-xs font-medium uppercase tracking-wider text-base-content/50 hover:text-base-content transition-colors"
                  >
                    {product.brand}
                  </Link>
                  <h3 className="mt-1 text-lg font-semibold leading-tight">
                    <Link href={href as any} className="hover:text-primary transition-colors">
                      {product.title}
                    </Link>
                  </h3>
                </div>
                <div className="shrink-0 sm:hidden">
                  <WishlistButton slug={product.slug} aria-label={`Add ${product.title} to wishlist`} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Rating value={product.rating} size="xs" />
                <span className="text-xs text-base-content/50">({product.reviewCount})</span>
              </div>

              <p className="line-clamp-2 text-sm text-base-content/60">
                High-quality {product.title} from {product.brand}. Shop now for the best prices.
              </p>

              <div className="mt-auto flex items-center justify-between gap-4 pt-2">
                <Price price={product.price} discount={discount || null} />
                <div className="flex items-center gap-2">
                  <div className="hidden sm:block">
                    <WishlistButton slug={product.slug} aria-label={`Add ${product.title} to wishlist`} />
                  </div>
                  <Link
                    href={href as any}
                    className="btn btn-primary btn-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
