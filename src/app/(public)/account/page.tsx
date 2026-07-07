import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/account");

  redirect("/account/dashboard");
}
