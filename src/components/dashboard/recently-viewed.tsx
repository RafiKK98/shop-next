import { Eye } from "lucide-react";
import { ROUTES } from "@/constants";
import Link from "next/link";

// TODO: Implement recently viewed products
// Currently a placeholder section.
// Future implementation should:
// - Track viewed products via cookies or server-side
// - Display 6 most recently viewed products with thumbnails
// - Link to product detail pages

export function RecentlyViewed() {
  return (
    <div className="rounded-xl border border-base-200 bg-base-100 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-base-content/50">
          Recently Viewed
        </h2>
      </div>

      <div className="mt-4 flex flex-col items-center gap-3 py-8 text-center">
        <Eye className="size-10 text-base-content/20" />
        <div>
          <p className="text-sm text-base-content/50">
            Recently viewed products will appear here
          </p>
          <Link
            href={ROUTES.products}
            className="mt-1 inline-block text-xs font-medium text-primary hover:underline"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
