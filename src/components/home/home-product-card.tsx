import Image from "next/image";
import { Rating, Price, Button, IconButton } from "@/components/ui";
import type { HomeProduct } from "@/data/home";

interface HomeProductCardProps {
  product: HomeProduct;
  priority?: boolean;
}

export function HomeProductCard({ product, priority }: HomeProductCardProps) {
  const discountedPrice = product.discount > 0
    ? product.price * (1 - product.discount / 100)
    : null;

  return (
    <div className="group card card-compact bg-base-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="relative aspect-square overflow-hidden rounded-t-box bg-base-200">
        <Image
          src={product.image}
          alt={product.title}
          width={640}
          height={480}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
        />
        {product.discount > 0 && (
          <div className="absolute left-2 top-2">
            <span className="badge badge-error badge-sm">-{product.discount}%</span>
          </div>
        )}
        <div className="absolute right-2 top-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <IconButton className="btn-sm" aria-label="Add to wishlist">
            <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </IconButton>
        </div>
      </div>
      <div className="card-body p-3 md:p-4">
        <h3 className="card-title text-sm md:text-base leading-tight line-clamp-2">
          {product.title}
        </h3>
        <div className="flex items-center gap-2">
          <Rating value={product.rating} size="xs" />
          <span className="text-xs text-base-content/50">({product.reviewCount})</span>
        </div>
        <Price price={product.price} discount={product.discount} size="sm" />
        <div className="mt-2">
          <Button className="w-full btn-sm" aria-label={`Add ${product.title} to cart`}>
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
