import { auth } from "@/lib/auth";
import { getCartItems } from "@/lib/cart";
import { Container, Section, Breadcrumb } from "@/components/ui";
import { CartPageContent } from "@/components/cart";
import { createMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({ title: "Cart", description: "Review your shopping cart", noIndex: true });
}

export default async function CartPage() {
  const session = await auth();

  let items: Awaited<ReturnType<typeof getCartItems>> = [];
  if (session?.user?.id) {
    items = await getCartItems(session.user.id);
  }

  return (
    <Section>
      <Container>
        <Breadcrumb
          className="mb-6"
          items={[
            { label: "Home", href: "/" },
            { label: "Cart" },
          ]}
        />
        <CartPageContent items={items} />
      </Container>
    </Section>
  );
}
