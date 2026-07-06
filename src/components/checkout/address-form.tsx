"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { X } from "lucide-react";
import { addressSchema, type AddressInput } from "@/lib/validations/checkout";
import { createAddress, updateAddress } from "@/actions/address";
import { Button } from "@/components/ui";
import type { Address } from "./checkout-page";

interface AddressFormProps {
  initialData?: Address | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddressForm({ initialData, onSuccess, onCancel }: AddressFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<AddressInput>({
    resolver: zodResolver(addressSchema) as unknown as Resolver<AddressInput>,
    defaultValues: {
      label: initialData?.label || "",
      fullName: initialData?.fullName || "",
      phone: initialData?.phone || "",
      street: initialData?.street || "",
      addressLine2: initialData?.addressLine2 || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      postalCode: initialData?.postalCode || "",
      country: initialData?.country || "",
      isDefault: initialData?.isDefault ?? false,
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    setServerError(null);
    startTransition(async () => {
      const fd = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "isDefault") {
          fd.set(key, value ? "on" : "");
        } else {
          fd.set(key, String(value));
        }
      });

      if (initialData) {
        fd.set("addressId", initialData.id);
      }

      const result = initialData
        ? await updateAddress(fd)
        : await createAddress(fd);

      if (result?.error) {
        setServerError(result.error);
        return;
      }

      onSuccess();
    });
  });

  const renderField = (
    name: keyof AddressInput,
    label: string,
    options?: { type?: string; placeholder?: string; required?: boolean },
  ) => {
    const { type = "text", placeholder, required = true } = options || {};
    const error = form.formState.errors[name]?.message;

    return (
      <fieldset className="fieldset">
        <label htmlFor={name} className="fieldset-label">
          {label}
          {required && <span className="text-error ml-0.5">*</span>}
        </label>
        <input
          {...form.register(name)}
          id={name}
          type={type}
          placeholder={placeholder}
          className={`input w-full ${error ? "input-error" : ""}`}
          aria-invalid={!!error}
        />
        {error && (
          <span className="fieldset-label text-error">{error}</span>
        )}
      </fieldset>
    );
  };

  return (
    <div className="rounded-xl border border-base-200 bg-base-100 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">
          {initialData ? "Edit Address" : "Add New Address"}
        </h3>
        <button
          type="button"
          className="btn btn-ghost btn-sm btn-square"
          onClick={onCancel}
          aria-label="Close form"
        >
          <X className="size-4" />
        </button>
      </div>

      <form onSubmit={onSubmit} noValidate className="space-y-4">
        {serverError && (
          <div className="alert alert-error" role="alert">
            <span>{serverError}</span>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {renderField("fullName", "Full Name", { placeholder: "John Doe" })}
          {renderField("phone", "Phone Number", { placeholder: "+1 (555) 000-0000" })}
        </div>

        {renderField("label", "Address Label", { placeholder: "Home, Work, etc." })}
        {renderField("street", "Address Line 1", { placeholder: "123 Main Street" })}
        {renderField("addressLine2", "Address Line 2 (optional)", { required: false, placeholder: "Apt, Suite, etc." })}

        <div className="grid gap-4 sm:grid-cols-2">
          {renderField("city", "City", { placeholder: "New York" })}
          {renderField("state", "State / Division", { placeholder: "NY" })}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {renderField("postalCode", "Postal Code", { placeholder: "10001" })}
          {renderField("country", "Country", { placeholder: "United States" })}
        </div>

        <label className="label cursor-pointer justify-start gap-3">
          <input
            {...form.register("isDefault")}
            type="checkbox"
            className="checkbox"
          />
          <span className="label-text">Set as default address</span>
        </label>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={isPending}>
            {isPending
              ? "Saving..."
              : initialData
                ? "Update Address"
                : "Add Address"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
