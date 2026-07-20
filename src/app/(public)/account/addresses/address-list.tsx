"use client";

import { AddressCard } from "@/components/checkout/address-card";
import { AddressForm } from "@/components/checkout/address-form";
import type { Address } from "@/components/checkout/checkout-page";
import { Button, EmptyState } from "@/components/ui";
import { MapPin, Plus } from "lucide-react";
import { useState } from "react";

interface AddressListProps {
  addresses: Address[];
}

export function AddressList({ addresses }: AddressListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
  };

  if (showForm || editingAddress)
    return (
      <AddressForm
        initialData={editingAddress}
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
      />
    );

  if (addresses.length === 0)
    return (
      <div className="space-y-6">
        <EmptyState
          icon={<MapPin className="size-16" />}
          title="No addresses saved"
          description="Add an address to make checkout faster."
          action={
            <Button
              variant="primary"
              size="lg"
              onClick={() => setShowForm(true)}
            >
              <Plus className="mr-2 size-4" />
              Add Address
            </Button>
          }
        />
      </div>
    );

  return (
    <div className="space-y-4">
      {addresses.map((addr) => (
        <AddressCard
          key={addr.id}
          address={addr}
          isSelected={false}
          onSelect={() => {}}
          onEdit={() => handleEdit(addr)}
        />
      ))}

      <button
        type="button"
        className="btn btn-outline w-full gap-2"
        onClick={() => setShowForm(true)}
      >
        <Plus className="size-4" />
        Add New Address
      </button>
    </div>
  );
}
