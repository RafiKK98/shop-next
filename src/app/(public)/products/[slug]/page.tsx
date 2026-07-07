import { notFound } from "next/navigation";
import { Breadcrumb, Container, Section, Divider, Button } from "@/components/ui";
import { ProductGallery, ProductInfo, PurchaseSection, DescriptionSection, ReviewsList, ReviewSummary, ReviewForm } from "@/components/product-detail";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { products, wishlistItems } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getProductReviews, getUserReviewForProduct, hasVerifiedPurchase } from "@/services/reviews";
import type { Product } from "@/types/product";
import Link from "next/link";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} | E-Commerce`,
  };
}

export default async function ProductDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const reviewPage = Number(sp.reviewPage) || 1;
  const reviewSort = (sp.reviewSort as "newest" | "highest" | "lowest") ?? "newest";

  const dbProduct = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .then((r) => r[0] ?? null);

  if (!dbProduct) notFound();

  const session = await auth();

  let isWishlisted = false;
  let userReview = null;
  let canReview = false;

  if (session?.user?.id) {
    const wl = await db
      .select({ id: wishlistItems.id })
      .from(wishlistItems)
      .where(
        and(
          eq(wishlistItems.userId, session.user.id),
          eq(wishlistItems.productId, dbProduct.id),
        ),
      )
      .then((r) => r[0] ?? null);
    isWishlisted = !!wl;

    userReview = await getUserReviewForProduct(session.user.id, dbProduct.id);
    if (!userReview) {
      canReview = await hasVerifiedPurchase(session.user.id, dbProduct.id);
    }
  }

  const reviewsData = await getProductReviews(dbProduct.id, {
    page: reviewPage,
    pageSize: 10,
    sort: reviewSort,
  });

  return (
    <>
      <Section className="pb-0">
        <Container>
          <Breadcrumb
            className="mb-6"
            items={[
              { label: "Home", href: "/" },
              { label: "Products", href: "/products" },
              { label: dbProduct.title },
            ]}
          />
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <ProductGallery images={[]} title={dbProduct.title} />
            <div className="flex flex-col gap-6">
              <ProductInfo product={dbProduct as any} />
              <PurchaseSection
                title={dbProduct.title}
                stockStatus={dbProduct.stock != null && dbProduct.stock > 0 ? "in-stock" : "out-of-stock"}
                slug={dbProduct.slug}
                isWishlisted={isWishlisted}
              />
            </div>
          </div>
        </Container>
      </Section>

      <Divider />

      <Section>
        <Container>
          <div className="mx-auto max-w-3xl">
            <DescriptionSection
              detail={{
                description: dbProduct.description ?? "",
                shortDescription: "",
                features: [],
                specifications: {},
                gallery: [],
                reviews: [],
                sku: dbProduct.id.slice(0, 8).toUpperCase(),
              }}
            />
          </div>
        </Container>
      </Section>

      <Divider />

      <Section>
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-xl font-bold">Customer Reviews</h2>

            {/* Review Summary */}
            <div className="mb-8 rounded-xl border border-base-200 bg-base-100 p-6">
              <ReviewSummary aggregate={reviewsData.aggregate} />
            </div>

            {/* Sort */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-base-content/50">
                {reviewsData.aggregate.total} review{reviewsData.aggregate.total !== 1 ? "s" : ""}
              </p>
              <div className="flex items-center gap-2">
                <label htmlFor="review-sort" className="text-sm text-base-content/50">
                  Sort:
                </label>
                <select
                  id="review-sort"
                  className="select select-bordered select-sm"
                  defaultValue={reviewSort}
                  onChange={(e) => {
                    const url = new URL(window.location.href);
                    url.searchParams.set("reviewSort", e.target.value);
                    url.searchParams.set("reviewPage", "1");
                    window.location.href = url.toString();
                  }}
                >
                  <option value="newest">Newest</option>
                  <option value="highest">Highest Rated</option>
                  <option value="lowest">Lowest Rated</option>
                </select>
              </div>
            </div>

            {/* Reviews List */}
            <ReviewsList reviews={reviewsData.items} />

            {/* Pagination */}
            {reviewsData.totalPages > 1 && (
              <div className="mt-6 flex justify-center gap-2">
                {Array.from({ length: reviewsData.totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`/products/${slug}?reviewPage=${p}&reviewSort=${reviewSort}`}
                    className={`btn btn-sm ${p === reviewPage ? "btn-primary" : "btn-ghost"}`}
                  >
                    {p}
                  </Link>
                ))}
              </div>
            )}

            {/* Review Form */}
            <div className="mt-10 rounded-xl border border-base-200 bg-base-100 p-6">
              <h3 className="mb-4 text-lg font-semibold">
                {userReview ? "Edit Your Review" : canReview ? "Write a Review" : "Write a Review"}
              </h3>
              {session?.user ? (
                userReview ? (
                  <ReviewForm
                    productId={dbProduct.id}
                    defaultValues={{
                      reviewId: userReview.id,
                      rating: userReview.rating,
                      title: userReview.title ?? "",
                      comment: userReview.comment ?? "",
                    }}
                  />
                ) : canReview ? (
                  <ReviewForm productId={dbProduct.id} />
                ) : (
                  <p className="text-sm text-base-content/50">
                    You must purchase this product before reviewing it.
                  </p>
                )
              ) : (
                <p className="text-sm text-base-content/50">
                  <Link href="/login" className="link link-primary">
                    Sign in
                  </Link>{" "}
                  to leave a review.
                </p>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
