import { Button, Container } from "@/components/ui";
import { Route } from "next";
import Link from "next/link";

const heroContent = {
  title: "Discover What's Next in Style & Innovation",
  description:
    "Shop the latest trends, cutting-edge electronics, and everyday essentials — all curated for quality and crafted for your lifestyle.",
  primaryCta: { label: "Shop Now", href: "/products" },
  secondaryCta: { label: "Learn More", href: "/about" },
};

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-primary/10 via-base-100 to-secondary/5">
      <Container className="relative z-10 py-16 md:py-24 lg:py-32">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-16">
          <div className="flex-1 space-y-6 text-center lg:text-left">
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
              <Button variant="outline" size="lg">
                {heroContent.secondaryCta.label}
              </Button>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="aspect-4/3 w-full max-w-lg rounded-2xl bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="mx-auto mb-4 size-20 rounded-full bg-primary/30 flex items-center justify-center">
                  <svg
                    className="size-10 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
                    />
                  </svg>
                </div>
                <p className="text-base-content/50 text-sm font-medium tracking-wide uppercase">
                  Hero Image
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
    </section>
  );
}
