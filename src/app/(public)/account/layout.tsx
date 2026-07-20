import { AccountMobileNav, AccountSidebar } from "@/components/account";
import { Container, Section } from "@/components/ui";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { type ReactNode } from "react";

interface AccountLayoutProps {
  children: ReactNode;
}

export default async function AccountLayout({ children }: AccountLayoutProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/account");

  return (
    <Section>
      <Container>
        <AccountMobileNav />

        <div className="mt-4 flex gap-8 md:mt-0">
          <div className="hidden md:block">
            <AccountSidebar />
          </div>

          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </Container>
    </Section>
  );
}
