import { Container, Section, Avatar, Rating } from "@/components/ui";
import { testimonials } from "@/data/home";

export function Testimonials() {
  return (
    <Section className="bg-base-200/50">
      <Container>
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">What Our Customers Say</h2>
          <p className="mt-2 text-base-content/60">Real reviews from real people</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t) => (
            <div key={t.id} className="card bg-base-100 shadow-sm">
              <div className="card-body p-5">
                <Rating value={t.rating} size="xs" />
                <p className="mt-3 text-sm leading-relaxed text-base-content/80 line-clamp-4">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <Avatar src={t.avatar} alt={t.name} size="sm" />
                  <span className="text-sm font-semibold">{t.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
