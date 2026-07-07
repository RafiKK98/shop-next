"use client";

import { createProduct, updateProduct } from "@/actions/admin/products";
import { Button, Checkbox, FormError, Label, Select, ImageUpload } from "@/components/ui";
import {
  productFormSchema,
  type ProductFormValues,
} from "@/lib/validations/product";
import { notify, crud } from "@/lib/notifications";
import { slugify } from "@/utils/slug";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { useForm } from "react-hook-form";

interface CategoryOption {
  id: string;
  name: string;
}

interface ProductFormProps {
  defaultValues?: ProductFormValues;
  categories: CategoryOption[];
  mode: "create" | "edit";
  productId?: string;
}

export function ProductForm({
  defaultValues,
  categories,
  mode,
  productId,
}: ProductFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema) as any,
    defaultValues: defaultValues ?? {
      title: "",
      slug: "",
      description: "",
      categoryId: "",
      brand: "",
      price: 0,
      discount: 0,
      stock: 0,
      featured: false,
      images: [],
    },
  });

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const title = e.target.value;
      if (
        !form.getValues("slug") ||
        form.getValues("slug") ===
          slugify(form.formState.defaultValues?.title ?? "")
      ) {
        form.setValue("slug", slugify(title));
      }
    },
    [form],
  );

  const onSubmit = form.handleSubmit((data) => {
    setServerError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("title", data.title);
      fd.set("slug", data.slug);
      fd.set("description", data.description ?? "");
      fd.set("categoryId", data.categoryId ?? "");
      fd.set("brand", data.brand ?? "");
      fd.set("price", String(data.price));
      fd.set("discount", String(data.discount ?? 0));
      fd.set("stock", String(data.stock ?? 0));
      fd.set("featured", data.featured ? "true" : "false");

      for (const url of data.images ?? []) {
        fd.append("imageUrl", url);
      }

      const result =
        mode === "create"
          ? await createProduct(fd)
          : await updateProduct(productId!, fd);

      if ("error" in result) {
        setServerError(result.error);
        notify.error(result.error);
      } else if (result.success) {
        notify.success(crud[mode === "create" ? "created" : "updated"]("Product"));
        router.push("/admin/products");
        router.refresh();
      }
    });
  });

  const images = form.watch("images");

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8">
      {serverError && (
        <div
          className="rounded-lg border border-error/30 bg-error/5 px-4 py-3 text-sm text-error"
          role="alert"
        >
          {serverError}
        </div>
      )}

      <div className="rounded-xl border border-base-200 bg-base-100 p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-base-content/50">
          General
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Name</Label>
            <input
              {...form.register("title")}
              className="input w-full"
              placeholder="Product name"
              onChange={handleTitleChange}
            />
            <FormError>{form.formState.errors.title?.message}</FormError>
          </div>
          <div>
            <Label>Slug</Label>
            <input
              {...form.register("slug")}
              className="input w-full"
              placeholder="product-slug"
            />
            <FormError>{form.formState.errors.slug?.message}</FormError>
          </div>
          <div>
            <Label>Brand</Label>
            <input
              {...form.register("brand")}
              className="input w-full"
              placeholder="Brand name"
            />
            <FormError>{form.formState.errors.brand?.message}</FormError>
          </div>
          <div>
            <Select
              label="Category"
              options={[
                { value: "", label: "No category" },
                ...categories.map((c) => ({ value: c.id, label: c.name })),
              ]}
              {...form.register("categoryId")}
            />
          </div>
        </div>
        <div className="mt-4">
          <Label>Description</Label>
          <textarea
            {...form.register("description")}
            className="textarea textarea-bordered w-full"
            rows={4}
            placeholder="Product description"
          />
          <FormError>{form.formState.errors.description?.message}</FormError>
        </div>
      </div>

      <div className="rounded-xl border border-base-200 bg-base-100 p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-base-content/50">
          Pricing
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label required>Price ($)</Label>
            <input
              type="number"
              step="0.01"
              min="0"
              {...form.register("price", { valueAsNumber: true })}
              className="input w-full"
              placeholder="0.00"
            />
            <FormError>{form.formState.errors.price?.message}</FormError>
          </div>
          <div>
            <Label>Discount (%)</Label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              {...form.register("discount", { valueAsNumber: true })}
              className="input w-full"
              placeholder="0"
            />
            <FormError>{form.formState.errors.discount?.message}</FormError>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-base-200 bg-base-100 p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-base-content/50">
          Inventory
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Stock</Label>
            <input
              type="number"
              step="1"
              min="0"
              {...form.register("stock", { valueAsNumber: true })}
              className="input w-full"
              placeholder="0"
            />
            <FormError>{form.formState.errors.stock?.message}</FormError>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-base-200 bg-base-100 p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-base-content/50">
          Organization
        </h2>
        <div className="flex flex-wrap gap-6">
          <Checkbox label="Featured product" {...form.register("featured")} />
        </div>
      </div>

      <div className="rounded-xl border border-base-200 bg-base-100 p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-base-content/50">
          Images
        </h2>
        <ImageUpload
          value={images}
          onChange={(urls) => form.setValue("images", urls, { shouldDirty: true })}
          maxFiles={10}
        />
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
        >
          Cancel
        </Button>
        <Button type="submit" loading={isPending}>
          {mode === "create" ? "Create Product" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
