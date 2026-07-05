import { Container, Section } from "@/components/ui";
import { brands } from "@/data/home";

const bgColors = [
  "from-primary/10 to-primary/5",
  "from-secondary/10 to-secondary/5",
  "from-accent/10 to-accent/5",
  "from-info/10 to-info/5",
  "from-success/10 to-success/5",
  "from-warning/10 to-warning/5",
  "from-error/10 to-error/5",
  "from-primary/10 to-secondary/5",
];

const textColors = [
  "text-primary",
  "text-secondary",
  "text-accent",
  "text-info",
  "text-success",
  "text-warning",
  "text-error",
  "text-primary",
];

export function BrandLogos() {
  return (
    <Section>
      <Container>
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Trusted by Industry Leaders</h2>
          <p className="mt-2 text-base-content/60">We partner with the best brands in the business</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
          {brands.map((brand, i) => (
            <div
              key={brand.id}
              className={`flex h-16 w-32 items-center justify-center rounded-xl bg-gradient-to-br ${bgColors[i % bgColors.length]} px-4 transition-all duration-300 hover:scale-105 hover:shadow-sm`}
            >
              <span className={`text-sm font-bold tracking-widest uppercase ${textColors[i % textColors.length]}`}>
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
