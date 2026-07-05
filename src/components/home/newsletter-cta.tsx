import { Container, Section, Button } from "@/components/ui";

export function NewsletterCta() {
  return (
    <Section className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Stay in the Loop</h2>
          <p className="mt-2 text-base-content/70">
            Subscribe to our newsletter and be the first to know about new arrivals, exclusive deals, and special offers.
          </p>
          <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              aria-label="Email address"
              className="input w-full flex-1"
            />
            <Button>Subscribe</Button>
          </div>
          <p className="mt-4 text-xs text-base-content/50">
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </Container>
    </Section>
  );
}
