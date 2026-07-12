import { Container, Section, Breadcrumb } from "@/components/ui";
import { SITE } from "@/constants";
import { createMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({ title: "About Us", description: `Learn more about ${SITE.name} — your destination for quality products across electronics, fashion, home, and more.` });
}

const stats = [
  { label: "Products Available", value: "10,000+" },
  { label: "Happy Customers", value: "50,000+" },
  { label: "Brands Partnered", value: "500+" },
  { label: "Orders Shipped", value: "100,000+" },
];

const values = [
  {
    title: "Quality You Can Trust",
    description: "Every product in our catalog goes through rigorous quality checks. We partner only with verified brands and manufacturers who share our commitment to excellence.",
    icon: "M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z",
  },
  {
    title: "Fast & Free Shipping",
    description: "We offer free standard shipping on all orders over $50. Most orders are processed within 24 hours and delivered within 3–5 business days.",
    icon: "M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12",
  },
  {
    title: "24/7 Customer Support",
    description: "Our dedicated support team is here around the clock. Whether you need help with an order, have a product question, or need assistance, we've got you covered.",
    icon: "M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155",
  },
  {
    title: "Easy Returns",
    description: "Not satisfied? We offer hassle-free returns within 30 days of delivery. Simply initiate a return through your account, and we'll handle the rest.",
    icon: "M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3",
  },
];

export default function AboutPage() {
  return (
    <>
      <Section>
        <Container>
          <Breadcrumb
            className="mb-6"
            items={[
              { label: "Home", href: "/" },
              { label: "About" },
            ]}
          />

          <div className="mb-12 max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">About {SITE.name}</h1>
            <p className="mt-4 text-lg text-base-content/70 leading-relaxed">
              Founded with a simple mission — make quality products accessible to everyone. 
              {SITE.name} brings together curated collections from trusted brands across electronics, 
              fashion, home essentials, sports, beauty, and more.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl bg-base-200/50 p-6 text-center">
                <p className="text-3xl font-bold text-primary md:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm text-base-content/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-base-200/30">
        <Container>
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Why Shop With Us</h2>
            <p className="mt-2 text-base-content/60">We believe in delivering more than just products</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {values.map((value) => (
              <div key={value.title} className="card bg-base-100 shadow-sm">
                <div className="card-body p-6">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                    <svg className="size-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d={value.icon} />
                    </svg>
                  </div>
                  <h3 className="card-title text-lg">{value.title}</h3>
                  <p className="mt-1 text-sm text-base-content/70 leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Ready to Start Shopping?</h2>
          <p className="mx-auto mt-2 max-w-xl text-base-content/60">
            Join thousands of happy customers and discover your next favorite product.
          </p>
          <a href="/products" className="btn btn-primary mt-6">
            Browse Products
          </a>
        </Container>
      </Section>
    </>
  );
}
