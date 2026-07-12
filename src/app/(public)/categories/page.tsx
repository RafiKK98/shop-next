import Image from "next/image";
import Link from "next/link";
import { Container, Section, Breadcrumb } from "@/components/ui";
import { ROUTES, SITE } from "@/constants";
import { catalogCategories } from "@/data/catalog";
import { featuredCategories } from "@/data/home";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Categories | ${SITE.name}`,
  description: "Browse products by category",
};

const categoryImages: Record<string, string> = {};
for (const fc of featuredCategories) {
  categoryImages[fc.slug] = fc.image;
}

export default function CategoriesPage() {
  return (
    <Section>
      <Container>
        <Breadcrumb
          className="mb-6"
          items={[
            { label: "Home", href: "/" },
            { label: "Categories" },
          ]}
        />

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Categories</h1>
          <p className="mt-1 text-base-content/60">Browse our curated collections</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {catalogCategories.map((category) => {
            const image = categoryImages[category.slug] || "https://picsum.photos/seed/" + category.slug + "/640/480";
            return (
              <Link
                key={category.id}
                href={ROUTES.categoryDetail(category.slug)}
                className="group relative overflow-hidden rounded-xl bg-base-200 transition-all duration-300 hover:shadow-lg"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <Image
                    src={image}
                    alt={category.name}
                    width={640}
                    height={360}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h2 className="text-xl font-semibold text-white">{category.name}</h2>
                  <p className="mt-1 text-sm text-white/80">{category.count} products</p>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
