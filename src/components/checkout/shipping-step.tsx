"use client";

import { useState } from "react";
import { Plus, ArrowRight, ShoppingCart } from "lucide-react";
import { Button, EmptyState } from "@/components/ui";
import { AddressCard } from "./address-card";
import { AddressForm } from "./address-form";
import { ROUTES } from "@/constants";
import type { Address } from "./checkout-page";

interface ShippingStepProps {
  addresses: Address[];
  selectedAddressId: string | null;
  onSelectAddress: (id: string) => void;
  onContinue: () => void;
  cartEmpty: boolean;
}

export function ShippingStep({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onContinue,
  cartEmpty,
}: ShippingStepProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  if (cartEmpty) {
    return (
      <EmptyState
        icon={<ShoppingCart className="size-16" />}
        title="Your cart is empty"
        description="Add some items to your cart before checking out."
        action={
          <a href={ROUTES.products}>
            <Button variant="primary" size="lg">
              Continue Shopping
            </Button>
          </a>
        }
      />
    );
  }

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

  if (showForm || editingAddress) {
    return (
      <AddressForm
        initialData={editingAddress}
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Shipping Address</h2>
        <p className="mt-1 text-sm text-base-content/60">
          Select a shipping address or add a new one.
        </p>
      </div>

      <div className="space-y-3">
        {addresses.length > 0 ? (
          addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              isSelected={addr.id === selectedAddressId}
              onSelect={() => onSelectAddress(addr.id)}
              onEdit={() => handleEdit(addr)}
            />
          ))
        ) : (
          <p className="py-4 text-center text-sm text-base-content/40">
            No saved addresses. Add one below.
          </p>
        )}

        <button
          type="button"
          className="btn btn-outline btn-sm w-full gap-2"
          onClick={() => setShowForm(true)}
        >
          <Plus className="size-4" />
          Add New Address
        </button>
      </div>

      <div className="border-t border-base-200 pt-4">
        <Button
          className="w-full sm:w-auto"
          size="lg"
          disabled={!selectedAddressId}
          onClick={onContinue}
        >
          Continue to Review
          <ArrowRight className="ml-2 size-4" />
        </Button>
      </div>
    </div>
  );
}
