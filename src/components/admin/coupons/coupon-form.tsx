"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { couponFormSchema, type CouponFormValues } from "@/lib/validations/coupon";
import { createCouponAction, updateCouponAction } from "@/actions/admin/coupons";
import { Button, Label, FormError } from "@/components/ui";

interface CouponFormProps {
  defaultValues?: Partial<CouponFormValues & { startDate?: string | Date | null; expiresAt?: string | Date | null }>;
  mode: "create" | "edit";
  couponId?: string;
}

export function CouponForm({ defaultValues, mode, couponId }: CouponFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const action = mode === "create" ? createCouponAction : (fd: FormData) => updateCouponAction(couponId!, fd);

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponFormSchema) as any,
    defaultValues: (defaultValues ?? {
      code: "",
      type: "percentage",
      value: 0,
      description: "",
      minPurchase: null,
      maxDiscount: null,
      maxUsage: null,
      isActive: true,
      startDate: null,
      expiresAt: null,
    }) as CouponFormValues,
  });

  const watchType = form.watch("type");

  const onSubmit = form.handleSubmit((data) => {
    setServerError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("code", data.code);
      fd.set("type", data.type);
      fd.set("value", String(data.value));
      fd.set("description", (data.description as string) ?? "");
      fd.set("minPurchase", data.minPurchase != null ? String(data.minPurchase) : "");
      fd.set("maxDiscount", data.maxDiscount != null ? String(data.maxDiscount) : "");
      fd.set("maxUsage", data.maxUsage != null ? String(data.maxUsage) : "");
      fd.set("isActive", data.isActive ? "true" : "false");
      fd.set("startDate", data.startDate instanceof Date ? data.startDate.toISOString() : "");
      fd.set("expiresAt", data.expiresAt instanceof Date ? data.expiresAt.toISOString() : "");
      const result = await action(fd);
      if (result?.error) setServerError(result.error);
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8">
      {serverError && (
        <div className="rounded-lg border border-error/30 bg-error/5 px-4 py-3 text-sm text-error" role="alert">
          {serverError}
        </div>
      )}

      <div className="rounded-xl border border-base-200 bg-base-100 p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-base-content/50">
          Coupon Details
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label required>Coupon Code</Label>
            <input
              {...form.register("code")}
              className="input w-full font-mono uppercase"
              placeholder="SAVE20"
              maxLength={50}
            />
            <FormError>{form.formState.errors.code?.message as string}</FormError>
          </div>
          <div>
            <Label required>Discount Type</Label>
            <select
              {...form.register("type")}
              className="select w-full"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>
          <div>
            <Label required>Discount Value</Label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max="999999.99"
              {...form.register("value", { valueAsNumber: true })}
              className="input w-full"
              placeholder={watchType === "percentage" ? "10" : "25.00"}
            />
            <p className="mt-1 text-xs text-base-content/40">
              {watchType === "percentage" ? "Percentage off (e.g. 10 for 10%)" : "Fixed amount off (e.g. 25.00)"}
            </p>
            <FormError>{form.formState.errors.value?.message as string}</FormError>
          </div>
          <div>
            <Label>Max Discount Amount</Label>
            <input
              type="number"
              step="0.01"
              min="0"
              {...form.register("maxDiscount", { valueAsNumber: true })}
              className="input w-full"
              placeholder="50.00"
              disabled={watchType !== "percentage"}
            />
            <p className="mt-1 text-xs text-base-content/40">
              Maximum discount for percentage coupons (optional)
            </p>
            <FormError>{form.formState.errors.maxDiscount?.message as string}</FormError>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-base-200 bg-base-100 p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-base-content/50">
          Description
        </h2>
        <div>
          <textarea
            {...form.register("description")}
            className="textarea textarea-bordered w-full"
            rows={2}
            placeholder="Brief description of this coupon..."
            maxLength={500}
          />
          <FormError>{form.formState.errors.description?.message as string}</FormError>
        </div>
      </div>

      <div className="rounded-xl border border-base-200 bg-base-100 p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-base-content/50">
          Restrictions
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Minimum Order Amount</Label>
            <input
              type="number"
              step="0.01"
              min="0"
              {...form.register("minPurchase", { valueAsNumber: true })}
              className="input w-full"
              placeholder="50.00"
            />
            <p className="mt-1 text-xs text-base-content/40">
              Minimum subtotal required (optional)
            </p>
            <FormError>{form.formState.errors.minPurchase?.message as string}</FormError>
          </div>
          <div>
            <Label>Usage Limit</Label>
            <input
              type="number"
              min="1"
              {...form.register("maxUsage", { valueAsNumber: true })}
              className="input w-full"
              placeholder="100"
            />
            <p className="mt-1 text-xs text-base-content/40">
              Maximum number of uses (optional)
            </p>
            <FormError>{form.formState.errors.maxUsage?.message as string}</FormError>
          </div>
          <div>
            <Label>Start Date</Label>
            <input
              type="datetime-local"
              {...form.register("startDate")}
              className="input w-full"
            />
            <p className="mt-1 text-xs text-base-content/40">
              When the coupon becomes valid (optional)
            </p>
          </div>
          <div>
            <Label>End Date</Label>
            <input
              type="datetime-local"
              {...form.register("expiresAt")}
              className="input w-full"
            />
            <p className="mt-1 text-xs text-base-content/40">
              When the coupon expires (optional)
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-base-200 bg-base-100 p-5">
        <label className="label cursor-pointer justify-start gap-3">
          <input
            type="checkbox"
            {...form.register("isActive")}
            className="checkbox"
          />
          <span className="label-text">Active (coupon can be used immediately)</span>
        </label>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" loading={isPending}>
          {mode === "create" ? "Create Coupon" : "Save Changes"}
        </Button>
        <button
          type="button"
          className="btn btn-ghost btn-lg"
          onClick={() => router.push("/admin/coupons")}
          disabled={isPending}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
