import Link from "next/link";
import { Rating, Price } from "@/components/ui";
import { ProductCardImage } from "./product-card-image";
import { ProductCardBadges } from "./product-card-badges";
import { ProductCardActions } from "./product-card-actions";
import { type Product, getProductDiscount } from "@/types/product";
import { ROUTES } from "@/constants";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority }: ProductCardProps) {
  const discount = getProductDiscount(product);
  const primaryImage = product.images[0];
  const href = ROUTES.productDetail(product.slug);

  return (
    <div className="group card card-compact bg-base-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <Link href={href as any} className="relative">
        <ProductCardImage src={primaryImage} alt={product.title} priority={priority} />
        <ProductCardBadges
          discount={discount}
          isNew={product.isNew}
          isFeatured={product.isFeatured}
          stockStatus={product.stockStatus}
        />
        <div className="absolute right-2 top-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <span className="btn btn-ghost btn-square btn-sm" aria-label={`Add ${product.title} to wishlist`}>
            <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </span>
        </div>
      </Link>
      <div className="card-body p-3 md:p-4">
        <Link href={href as any} className="text-xs font-medium uppercase tracking-wider text-base-content/50 hover:text-base-content transition-colors">
          {product.brand}
        </Link>
        <h3 className="card-title text-sm md:text-base leading-tight line-clamp-2">
          <Link href={href as any} className="hover:text-primary transition-colors">
            {product.title}
          </Link>
        </h3>
        <div className="flex items-center gap-2">
          <Rating value={product.rating} size="xs" />
          <span className="text-xs text-base-content/50">({product.reviewCount})</span>
        </div>
        <Price price={product.price} discount={discount || null} size="sm" />
        <div className="mt-1">
          <ProductCardActions title={product.title} stockStatus={product.stockStatus} slug={product.slug} />
        </div>
      </div>
    </div>
  );
}
