import { Button, Container } from "@/components/ui";
import { Route } from "next";
import Image from "next/image";
import Link from "next/link";

const heroContent = {
  badge: "New Collection",
  title: "Discover What's Next in Style & Innovation",
  description:
    "Shop the latest trends, cutting-edge electronics, and everyday essentials — all curated for quality and crafted for your lifestyle.",
  primaryCta: { label: "Shop Now", href: "/products" },
  secondaryCta: { label: "Explore Categories", href: "/categories" },
  stats: [
    { value: "10K+", label: "Products" },
    { value: "5K+", label: "Happy Customers" },
    { value: "Free", label: "Shipping" },
  ],
};

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-primary/10 via-base-100 to-secondary/5">
      <Container className="relative z-10 py-16 md:py-24 lg:py-32">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              {heroContent.badge}
            </span>

            <h1 className="text-4xl font-bold tracking-tight text-base-content md:text-5xl lg:text-6xl">
              {heroContent.title}
            </h1>

            <p className="mx-auto max-w-xl text-base-content/70 text-lg leading-relaxed lg:mx-0">
              {heroContent.description}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <Link href={heroContent.primaryCta.href as Route}>
                <Button size="lg">{heroContent.primaryCta.label}</Button>
              </Link>
              <Link href={heroContent.secondaryCta.href as Route}>
                <Button variant="outline" size="lg">
                  {heroContent.secondaryCta.label}
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-8 pt-2 lg:justify-start">
              {heroContent.stats.map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-2">
                  <span className="text-lg font-bold text-base-content">
                    {stat.value}
                  </span>
                  <span className="text-sm text-base-content/50">
                    {stat.label}
                  </span>
                  {i < heroContent.stats.length - 1 && (
                    <span className="ml-2 h-4 w-px bg-base-content/20" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-full max-w-lg">
              <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-base-200 shadow-xl">
                <Image
                  src="https://picsum.photos/seed/fashion-hero/800/600"
                  alt="Featured collection"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
              </div>
              <div className="absolute -bottom-4 -left-4 z-10 rounded-xl border border-base-200 bg-base-100 p-4 shadow-lg">
                <p className="text-xs text-base-content/50">Starting from</p>
                <p className="text-lg font-bold text-primary">Up to 40% Off</p>
              </div>
              <div className="absolute -right-3 top-8 z-10 size-28 overflow-hidden rounded-xl border border-base-200 bg-base-100 shadow-md">
                <Image
                  src="https://picsum.photos/seed/fashion-detail/200/200"
                  alt="Featured product detail"
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
    </section>
  );
}
