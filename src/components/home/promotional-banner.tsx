import { Section, Button } from "@/components/ui";

export function PromotionalBanner() {
  return (
    <Section className="bg-gradient-to-r from-secondary/10 via-accent/5 to-secondary/10">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="space-y-4">
          <span className="badge badge-secondary badge-lg uppercase tracking-wider">Limited Time Offer</span>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            Summer Sale — Up to <span className="text-secondary">50% Off</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base-content/70 text-lg">
            Beat the heat with sizzling deals on electronics, fashion, home essentials, and more. Don&apos;t wait — these prices won&apos;t last.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button size="lg">Shop the Sale</Button>
            <Button variant="outline" size="lg">View Details</Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
