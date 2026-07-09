import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ProfileForm } from "./profile-form";
import { createMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({ title: "Profile", description: "Manage your profile", noIndex: true });
}

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/account/profile");

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
        Profile
      </h1>
      <ProfileForm user={session.user} />
    </div>
  );
}
