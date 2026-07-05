interface ProductCardBadgesProps {
  discount: number;
  isNew: boolean;
  isFeatured: boolean;
  stockStatus: "in_stock" | "low_stock" | "out_of_stock";
}

export function ProductCardBadges({ discount, isNew, isFeatured, stockStatus }: ProductCardBadgesProps) {
  return (
    <div className="pointer-events-none absolute left-2 top-2 flex flex-col gap-1">
      {stockStatus === "out_of_stock" && (
        <span className="badge badge-neutral badge-sm">Out of Stock</span>
      )}
      {discount > 0 && (
        <span className="badge badge-error badge-sm">-{discount}%</span>
      )}
      {isNew && !discount && (
        <span className="badge badge-success badge-sm">New</span>
      )}
      {isFeatured && (
        <span className="badge badge-warning badge-sm">Featured</span>
      )}
    </div>
  );
}
