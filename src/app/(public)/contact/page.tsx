import { Container, Section, Breadcrumb, Button } from "@/components/ui";
import { createMetadata } from "@/lib/seo";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    title: "Contact Us",
    description: "Get in touch with our team",
  });
}

const contactInfo = [
  { icon: Mail, label: "Email", value: "support@shopnext.com" },
  { icon: Phone, label: "Phone", value: "+1 (555) 123-4567" },
  { icon: MapPin, label: "Address", value: "123 Commerce St, Suite 100" },
  { icon: Clock, label: "Hours", value: "Mon–Fri, 9AM – 6PM EST" },
];

export default function ContactPage() {
  return (
    <>
      <Section>
        <Container>
          <Breadcrumb
            className="mb-6"
            items={[{ label: "Home", href: "/" }, { label: "Contact" }]}
          />

          <div className="mb-10 max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Contact Us
            </h1>
            <p className="mt-3 text-lg text-base-content/70 leading-relaxed">
              Have a question, feedback, or need assistance? We&apos;re here to
              help. Fill out the form and we&apos;ll get back to you within 24
              hours.
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <form className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">First Name</legend>
                    <input
                      type="text"
                      className="input w-full"
                      placeholder="John"
                      required
                    />
                  </fieldset>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Last Name</legend>
                    <input
                      type="text"
                      className="input w-full"
                      placeholder="Doe"
                      required
                    />
                  </fieldset>
                </div>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Email</legend>
                  <input
                    type="email"
                    className="input w-full"
                    placeholder="john@example.com"
                    required
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Subject</legend>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="How can we help?"
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Message</legend>
                  <textarea
                    className="textarea h-36 w-full"
                    placeholder="Tell us more about your inquiry..."
                    required
                  />
                </fieldset>

                <Button type="submit" size="lg">
                  Send Message
                </Button>
              </form>
            </div>

            <div className="space-y-4">
              {contactInfo.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-start gap-3 rounded-xl border border-base-200 bg-base-100 p-4"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-base-content/50">
                        {item.label}
                      </p>
                      <p className="mt-0.5 text-sm font-medium">
                        {item.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
