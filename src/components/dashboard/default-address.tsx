import Link from "next/link";
import { MapPin, Plus } from "lucide-react";
import { ROUTES } from "@/constants";

interface AddressData {
  id: string;
  street: string;
  addressLine2: string | null;
  city: string;
  state: string | null;
  postalCode: string | null;
  country: string;
}

interface DefaultAddressProps {
  address: AddressData | null;
}

export function DefaultAddress({ address }: DefaultAddressProps) {
  return (
    <div className="rounded-xl border border-base-200 bg-base-100 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-base-content/50">
          Default Address
        </h2>
        <Link
          href={ROUTES.accountAddresses}
          className="text-xs font-medium text-primary hover:underline"
        >
          {address ? "Manage" : "Add Address"}
        </Link>
      </div>

      <div className="mt-3">
        {address ? (
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-5 shrink-0 text-base-content/40" />
            <div className="text-sm">
              <p>{address.street}</p>
              {address.addressLine2 && <p>{address.addressLine2}</p>}
              <p>
                {address.city}
                {address.state && `, ${address.state}`}
                {address.postalCode && ` ${address.postalCode}`}
              </p>
              <p>{address.country}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-sm text-base-content/50">
            <MapPin className="size-5 shrink-0" />
            <span>No default address set</span>
          </div>
        )}
      </div>
    </div>
  );
}
