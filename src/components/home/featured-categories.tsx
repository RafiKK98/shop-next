import Image from "next/image";
import { Container, Section } from "@/components/ui";
import type { HomeCategory } from "@/services/home";

function CategoryCard({ category }: { category: HomeCategory }) {
  const imageSrc = !category.image || category.image.startsWith("/images/")
    ? `https://picsum.photos/seed/cat-${category.slug}/400/300`
    : category.image;
  return (
    <a
      href={`/products?category=${category.slug}`}
      className="group relative overflow-hidden rounded-xl bg-base-200 transition-all duration-300 hover:shadow-lg"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <Image
          src={imageSrc}
          alt={category.name}
          width={400}
          height={300}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-lg font-semibold text-white">{category.name}</h3>
        <p className="text-sm text-white/80">{category.productCount} products</p>
      </div>
    </a>
  );
}

export function FeaturedCategories({ categories }: { categories: HomeCategory[] }) {
  return (
    <Section>
      <Container>
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Shop by Category</h2>
          <p className="mt-2 text-base-content/60">Find exactly what you need across our curated collections</p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6 lg:gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
