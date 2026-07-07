import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { addresses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { AddressList } from "./address-list";
import { SITE } from "@/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Addresses | ${SITE.name}`,
};

export default async function AddressesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/account/addresses");

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
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
        Addresses
      </h1>
      <AddressList addresses={userAddresses} />
    </div>
  );
}
