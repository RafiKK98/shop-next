import { SITE } from "@/constants";
import type { Metadata } from "next";
import { Container, Section } from "@/components/ui";
import { LoginForm, GoogleButton } from "@/components/auth";
import { AuthPageShell } from "./auth-shell";

export const metadata: Metadata = {
  title: `Sign In | ${SITE.name}`,
  description: "Sign in to your account",
};

export default async function LoginPage(props: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const searchParams = await props.searchParams;
  const callbackUrl = searchParams.callbackUrl || "/";

  return (
    <Section>
      <Container className="max-w-md">
        <AuthPageShell>
          <LoginForm callbackUrl={callbackUrl} />
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-base-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-base-100 px-2 text-base-content/40">or continue with</span>
            </div>
          </div>
          <GoogleButton />
        </AuthPageShell>
      </Container>
    </Section>
  );
}
