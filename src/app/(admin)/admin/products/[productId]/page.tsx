import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Badge, Button } from "@/components/ui";
import { SITE } from "@/constants";
import { getAdminProductById } from "@/services/admin/products";
import { formatCurrency, formatDate } from "@/utils/format";
import { Package, Star } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: `Product Details | Admin | ${SITE.name}`,
};

interface PageProps {
  params: Promise<{ productId: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { productId } = await params;
  const product = await getAdminProductById(productId);

  if (!product) notFound();

  return (
    <>
      <AdminPageHeader
        title={product.title}
        description={`Slug: ${product.slug}`}
        actions={
          <Link href={`/admin/products/${product.id}/edit`}>
            <Button size="sm">Edit Product</Button>
          </Link>
        }
      />

      <div className="rounded-xl border border-base-200 bg-base-100 p-6">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            {product.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {product.images.map((img) => (
                  <div
                    key={img.id}
                    className="flex relative aspect-square items-center justify-center overflow-hidden rounded-lg border border-base-200"
                  >
                    <Image
                      src={img.url}
                      alt={img.alt ?? product.title}
                      className="size-full object-cover"
                      fill
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex aspect-square items-center justify-center rounded-lg bg-base-200">
                <Package className="size-16 text-base-content/20" />
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-base-content/40">
                  Price
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(product.price)}
                </p>
                {product.discount && Number(product.discount) > 0 && (
                  <p className="text-sm text-error">-{product.discount}% off</p>
                )}
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-base-content/40">
                  Stock
                </p>
                <p className="text-lg font-semibold">
                  {product.stock ?? 0} units
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-base-content/40">
                  Category
                </p>
                <p>
                  {product.categoryName ?? (
                    <span className="text-base-content/30">None</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-base-content/40">
                  Brand
                </p>
                <p>
                  {product.brand ?? (
                    <span className="text-base-content/30">None</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-base-content/40">
                  Featured
                </p>
                {product.featured ? (
                  <Badge variant="primary">Yes</Badge>
                ) : (
                  <span className="text-base-content/40">No</span>
                )}
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-base-content/40">
                  Rating
                </p>
                <p className="flex items-center gap-1">
                  {product.avgRating ? (
                    <>
                      <Star className="size-4 fill-warning text-warning" />
                      {product.avgRating.toFixed(1)} ({product.reviewCount}{" "}
                      reviews)
                    </>
                  ) : (
                    <span className="text-base-content/30">No reviews</span>
                  )}
                </p>
              </div>
            </div>

            {product.description && (
              <div className="mt-6">
                <p className="text-xs font-medium uppercase tracking-wider text-base-content/40">
                  Description
                </p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-base-content/70">
                  {product.description}
                </p>
              </div>
            )}

            <div className="mt-6 flex gap-4 text-xs text-base-content/40">
              <p>Created: {formatDate(product.createdAt)}</p>
              <p>Updated: {formatDate(product.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
