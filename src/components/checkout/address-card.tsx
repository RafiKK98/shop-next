"use client";

import { useTransition } from "react";
import { Pencil, Trash2, Star } from "lucide-react";
import { cn } from "@/utils/cn";
import { deleteAddress, setDefaultAddress } from "@/actions/address";
import type { Address } from "./checkout-page";

interface AddressCardProps {
  address: Address;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
}

export function AddressCard({ address, isSelected, onSelect, onEdit }: AddressCardProps) {
  const [deletePending, startDelete] = useTransition();
  const [defaultPending, startDefault] = useTransition();

  const handleDelete = () => {
    if (!confirm("Delete this address?")) return;
    startDelete(async () => {
      const fd = new FormData();
      fd.set("addressId", address.id);
      await deleteAddress(fd);
    });
  };

  const handleSetDefault = () => {
    startDefault(async () => {
      const fd = new FormData();
      fd.set("addressId", address.id);
      await setDefaultAddress(fd);
    });
  };

  return (
    <div
      className={cn(
        "relative cursor-pointer rounded-xl border p-4 transition-all",
        isSelected
          ? "border-primary bg-primary/5 ring-1 ring-primary"
          : "border-base-200 hover:border-base-300",
        deletePending && "opacity-50 pointer-events-none",
      )}
      onClick={onSelect}
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(); } }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          <input
            type="radio"
            name="selectedAddress"
            className="radio radio-primary mt-1"
            checked={isSelected}
            onChange={onSelect}
            aria-label={`Select ${address.fullName || "this address"}`}
          />
          <div>
            {address.fullName && (
              <p className="font-medium">{address.fullName}</p>
            )}
            <p className="text-sm text-base-content/70">
              {address.street}
              {address.addressLine2 && `, ${address.addressLine2}`}
            </p>
            <p className="text-sm text-base-content/70">
              {address.city}, {address.state} {address.postalCode}
            </p>
            <p className="text-sm text-base-content/70">{address.country}</p>
            {address.phone && (
              <p className="mt-1 text-sm text-base-content/50">{address.phone}</p>
            )}
            {address.label && (
              <span className="badge badge-ghost badge-xs mt-2">{address.label}</span>
            )}
            {address.isDefault && (
              <span className="badge badge-primary badge-xs mt-2 ml-1">Default</span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            className="btn btn-ghost btn-xs btn-square"
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            aria-label="Edit address"
          >
            <Pencil className="size-3.5" />
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-xs btn-square"
            disabled={defaultPending}
            onClick={(e) => { e.stopPropagation(); handleSetDefault(); }}
            aria-label="Set as default address"
          >
            <Star className={cn("size-3.5", address.isDefault && "fill-yellow-500 text-yellow-500")} />
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-xs btn-square text-error"
            disabled={deletePending}
            onClick={(e) => { e.stopPropagation(); handleDelete(); }}
            aria-label="Delete address"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
