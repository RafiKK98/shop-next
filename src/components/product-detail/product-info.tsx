import { cn } from "@/utils/cn";
import { Rating, Price, Badge } from "@/components/ui";
import type { Product } from "@/types/product";
import { getProductDiscount } from "@/types/product";
import { getProductDetail } from "@/data/product-detail";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const discount = getProductDiscount(product);
  const detail = getProductDetail(product.slug);

  const stockBadgeVariant =
    product.stockStatus === "in_stock" ? "primary" :
    product.stockStatus === "low_stock" ? "warning" :
    "neutral";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {product.stockStatus === "out_of_stock" && (
          <Badge variant="neutral" size="sm">Out of Stock</Badge>
        )}
        {product.isNew && <Badge variant="primary" size="sm">New Arrival</Badge>}
        {product.isFeatured && <Badge variant="accent" size="sm">Featured</Badge>}
      </div>

      <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
        {product.title}
      </h1>

      <p className="text-sm font-medium uppercase tracking-wider text-base-content/50">
        {product.brand}
      </p>

      <div className="flex items-center gap-3">
        <Rating value={product.rating} showValue size="sm" />
        <span className="text-sm text-base-content/50">
          ({product.reviewCount} reviews)
        </span>
      </div>

      <div className="flex items-baseline gap-3">
        <Price price={product.price} discount={discount || null} size="lg" />
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span className={cn(
          "badge badge-sm",
          stockBadgeVariant === "primary" ? "badge-primary" :
          stockBadgeVariant === "warning" ? "badge-warning" :
          "badge-neutral"
        )}>
          {product.stockStatus === "in_stock" ? "In Stock" :
           product.stockStatus === "low_stock" ? "Low Stock" :
           "Out of Stock"}
        </span>
        {detail && (
          <span className="text-base-content/40">SKU: {detail.sku}</span>
        )}
      </div>

      {detail && (
        <p className="text-base leading-relaxed text-base-content/80">
          {detail.shortDescription}
        </p>
      )}
    </div>
  );
}
