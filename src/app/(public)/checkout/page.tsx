import { CheckoutPage } from "@/components/checkout";
import { Breadcrumb, Container, Section } from "@/components/ui";
import { db } from "@/db";
import { addresses } from "@/db/schema";
import { auth } from "@/lib/auth";
import { getCartItems } from "@/lib/cart";
import { validateCart } from "@/lib/checkout";
import { createMetadata } from "@/lib/seo";
import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    title: "Checkout",
    description: "Complete your purchase",
    noIndex: true,
  });
}

export default async function CheckoutRoute() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/checkout");

  const items = await getCartItems(session.user.id);
  const cartValidation = await validateCart(session.user.id);

  const userAddresses = await db
    .select({
      id: addresses.id,
      label: addresses.label,
      fullName: addresses.fullName,
      phone: addresses.phone,
      street: addresses.street,
      addressLine2: addresses.addressLine2,
      city: addresses.city,
      state: addresses.state,
      postalCode: addresses.postalCode,
      country: addresses.country,
      isDefault: addresses.isDefault,
    })
    .from(addresses)
    .where(eq(addresses.userId, session.user.id))
    .orderBy(addresses.isDefault);

  return (
    <Section>
      <Container>
        <Breadcrumb
          className="mb-6"
          items={[
            { label: "Home", href: "/" },
            { label: "Cart", href: "/cart" },
            { label: "Checkout" },
          ]}
        />

        <h1 className="mb-8 text-2xl font-bold tracking-tight md:text-3xl">
          Checkout
        </h1>

        <CheckoutPage
          items={items}
          addresses={userAddresses}
          cartValidation={{
            valid: cartValidation.valid,
            errors: cartValidation.errors,
          }}
        />
      </Container>
    </Section>
  );
}
