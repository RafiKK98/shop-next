import { SITE } from "@/constants";
import type { Metadata } from "next";
import { RegisterForm, GoogleButton } from "@/components/auth";

export const metadata: Metadata = {
  title: `Create Account | ${SITE.name}`,
  description: "Create your account",
};

export default async function RegisterPage(props: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const searchParams = await props.searchParams;
  const callbackUrl = searchParams.callbackUrl || "/";

  return (
    <>
      <RegisterForm callbackUrl={callbackUrl} />
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-base-300" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-base-100 px-2 text-base-content/40">or continue with</span>
        </div>
      </div>
      <GoogleButton />
    </>
  );
}
