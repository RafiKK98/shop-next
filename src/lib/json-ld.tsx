import { getStoreSettings } from "@/services/store-settings";

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export async function OrganizationJsonLd() {
  const settings = await getStoreSettings();
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: settings.storeName,
        url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
        logo: settings.storeLogo || undefined,
        contactPoint: settings.supportEmail
          ? {
              "@type": "ContactPoint",
              email: settings.supportEmail,
              contactType: "customer service",
            }
          : undefined,
      }}
    />
  );
}

export async function WebsiteJsonLd() {
  const settings = await getStoreSettings();
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: settings.storeName,
        url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
        description: settings.storeDescription || undefined,
      }}
    />
  );
}

export function ProductJsonLd({
  name,
  description,
  image,
  price,
  currency = "USD",
  availability = "InStock",
  sku,
  url,
}: {
  name: string;
  description: string | null;
  image: string | null;
  price: number | string;
  currency?: string;
  availability?: string;
  sku?: string;
  url?: string;
}) {
  const priceStr = typeof price === "number" ? price.toFixed(2) : price;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name,
        description: description || undefined,
        image: image || undefined,
        sku: sku || undefined,
        url: url || undefined,
        offers: {
          "@type": "Offer",
          price: priceStr,
          priceCurrency: currency,
          availability: `https://schema.org/${availability}`,
        },
      }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; href?: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          ...(item.href
            ? {
                item: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}${item.href}`,
              }
            : {}),
        })),
      }}
    />
  );
}
