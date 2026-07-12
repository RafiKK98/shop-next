import { Breadcrumb, Container, Section } from "@/components/ui";
import { SITE } from "@/constants";
import type { Metadata } from "next";
import { CategoriesPageContent } from "./categories-page-content";

export const metadata: Metadata = {
  title: `Categories | ${SITE.name}`,
  description: "Browse products by category",
};

export default function CategoriesPage() {
  return (
    <Section>
      <Container>
        <Breadcrumb
          className="mb-6"
          items={[{ label: "Home", href: "/" }, { label: "Categories" }]}
        />

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Categories
          </h1>
          <p className="mt-1 text-base-content/60">
            Browse our curated collections
          </p>
        </div>

        <CategoriesPageContent />
      </Container>
    </Section>
  );
}
