import { auth } from "@/lib/auth";
import { getWishlistItems } from "@/lib/wishlist";
import { Container, Section, Breadcrumb } from "@/components/ui";
import { WishlistPageContent } from "@/components/wishlist";

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const session = await auth();

  let items: Awaited<ReturnType<typeof getWishlistItems>> = [];
  if (session?.user?.id) {
    items = await getWishlistItems(session.user.id);
  }

  return (
    <Section>
      <Container>
        <Breadcrumb
          className="mb-6"
          items={[
            { label: "Home", href: "/" },
            { label: "Wishlist" },
          ]}
        />
        <WishlistPageContent items={items} />
      </Container>
    </Section>
  );
}
