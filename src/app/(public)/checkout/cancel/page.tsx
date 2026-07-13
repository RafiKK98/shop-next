import { Button, Container, Section, Breadcrumb } from "@/components/ui";
import { SITE } from "@/constants";
import { AlertCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: `Payment Cancelled | ${SITE.name}`,
};

interface Props {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function CheckoutCancelPage({ searchParams }: Props) {
  const { orderId } = await searchParams;

  return (
    <Section>
      <Container className="max-w-lg">
        <Breadcrumb
          className="mb-6"
          items={[
            { label: "Home", href: "/" },
            { label: "Cart", href: "/cart" },
            { label: "Checkout", href: "/checkout" },
            { label: "Payment Cancelled" },
          ]}
        />

        <div className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-warning/10">
            <AlertCircle className="size-8 text-warning" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Payment Cancelled
          </h1>
          <p className="mt-2 text-base-content/60">
            Your payment was not processed. Your items are still in your cart
            and no charges have been made.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href={orderId ? `/checkout` : "/cart"}>
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              {orderId ? "Try Again" : "Return to Cart"}
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </Container>
    </Section>
  );
}
