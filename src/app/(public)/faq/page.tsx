import { Container, Section, Breadcrumb } from "@/components/ui";
import { SITE } from "@/constants";
import { createMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({ title: "FAQ", description: `Frequently asked questions about ${SITE.name} — shipping, returns, payments, and more.` });
}

const faqs = [
  {
    category: "Orders & Shipping",
    items: [
      { q: "How long does shipping take?", a: "Standard shipping takes 3–5 business days within the continental US. Express shipping (1–2 business days) is available at checkout for an additional fee. International orders typically take 7–14 business days depending on the destination." },
      { q: "Do you offer free shipping?", a: "Yes! We offer free standard shipping on all orders over $50. This is automatically applied at checkout — no coupon code needed." },
      { q: "Can I change or cancel my order?", a: "Orders can be modified or cancelled within 1 hour of placement. After that, they enter processing and cannot be changed. Contact our support team immediately if you need to make a change." },
      { q: "How do I track my order?", a: "Once your order ships, you'll receive a confirmation email with a tracking number. You can also track your order anytime from your account dashboard under 'Order History'." },
    ],
  },
  {
    category: "Returns & Refunds",
    items: [
      { q: "What is your return policy?", a: "We accept returns within 30 days of delivery for most items. Products must be unused and in their original packaging. Some exclusions apply (e.g., personal care items, final sale items)." },
      { q: "How do I start a return?", a: "Log into your account, navigate to the order containing the item you want to return, and click 'Return Items'. Print the prepaid return label, pack your item securely, and drop it off at any designated carrier location." },
      { q: "How long do refunds take?", a: "Once we receive your return, refunds are processed within 3–5 business days. The amount will be credited back to your original payment method. It may take an additional 2–5 business days for the refund to appear, depending on your bank." },
      { q: "Can I exchange an item?", a: "Yes, exchanges are available for size or color variants of the same product. The fastest way is to return the original item and place a new order. Contact support if you need assistance with an exchange." },
    ],
  },
  {
    category: "Payment & Pricing",
    items: [
      { q: "What payment methods do you accept?", a: "We accept Visa, Mastercard, American Express, Discover, PayPal, Apple Pay, and Google Pay. All transactions are processed securely through encrypted payment gateways." },
      { q: "Is my payment information secure?", a: "Absolutely. We use industry-standard SSL encryption to protect your data. Your payment details are never stored on our servers and are processed directly by our PCI-compliant payment partners." },
      { q: "Do you offer price matching?", a: "We offer price matching on identical items from major competitors. Contact our support team with a link to the lower-priced item before placing your order, and we'll match the price." },
      { q: "Are there any hidden fees?", a: "No hidden fees. The price you see at checkout is the final price, including any applicable taxes. Shipping costs are clearly displayed before you complete your purchase." },
    ],
  },
  {
    category: "Account & Support",
    items: [
      { q: "How do I create an account?", a: "Click 'Register' in the top-right corner of any page. Enter your name, email address, and a secure password. You'll be up and running in under a minute." },
      { q: "I forgot my password — what do I do?", a: "Click 'Login' and then select 'Forgot Password'. Enter your email address and we'll send you a password reset link. If you don't see the email, check your spam folder." },
      { q: "How can I contact customer support?", a: "You can reach us via the Contact page, email us at support@example.com, or use the live chat feature available Monday–Friday, 9 AM – 6 PM EST. We typically respond within 2 hours during business hours." },
      { q: "Do you have a loyalty program?", a: "Yes! Our loyalty program rewards you with points on every purchase. Points can be redeemed for discounts on future orders. Sign up for free from your account dashboard." },
    ],
  },
];

function FaqAccordion({ category, items }: { category: string; items: { q: string; a: string }[] }) {
  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body p-6">
        <h2 className="card-title mb-2 text-lg">{category}</h2>
        <div className="join join-vertical w-full">
          {items.map((item, i) => (
            <div key={i} className="collapse collapse-arrow join-item border-base-300 border-b">
              <input type="checkbox" defaultChecked={i === 0} className="peer" />
              <div className="collapse-title text-sm font-semibold peer-checked:text-primary">
                {item.q}
              </div>
              <div className="collapse-content">
                <p className="text-sm text-base-content/70 leading-relaxed">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function FaqPage() {
  return (
    <Section>
      <Container>
        <Breadcrumb
          className="mb-6"
          items={[
            { label: "Home", href: "/" },
            { label: "FAQ" },
          ]}
        />

        <div className="mb-10 max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Frequently Asked Questions</h1>
          <p className="mt-4 text-lg text-base-content/70">
            Everything you need to know about shopping at {SITE.name}. Can&apos;t find what you&apos;re looking for?{` `}
            <a href="/contact" className="text-primary hover:underline">Contact us</a>.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {faqs.map((group) => (
            <FaqAccordion key={group.category} category={group.category} items={group.items} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
