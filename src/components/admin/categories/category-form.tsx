"use client";

import { createCategory, updateCategory } from "@/actions/admin/categories";
import { Button, Checkbox, FormError, Label, ImageUpload } from "@/components/ui";
import {
  categoryFormSchema,
  type CategoryFormValues,
} from "@/lib/validations/category";
import { notify, crud } from "@/lib/notifications";
import { UPLOAD_FOLDERS } from "@/lib/upload";
import { slugify } from "@/utils/slug";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { useForm, type Resolver } from "react-hook-form";

interface CategoryFormProps {
  defaultValues?: CategoryFormValues;
  mode: "create" | "edit";
  categoryId?: string;
}

export function CategoryForm({
  defaultValues,
  mode,
  categoryId,
}: CategoryFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema) as unknown as Resolver<CategoryFormValues>,
    defaultValues: defaultValues ?? {
      name: "",
      slug: "",
      description: "",
      image: "",
      featured: false,
      active: true,
    },
  });

  const [categoryImage, setCategoryImage] = useState<string>(
    defaultValues?.image ?? "",
  );

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const name = e.target.value;
      if (
        !form.getValues("slug") ||
        form.getValues("slug") ===
          slugify(form.formState.defaultValues?.name ?? "")
      ) {
        form.setValue("slug", slugify(name));
      }
    },
    [form],
  );

  const onSubmit = form.handleSubmit((data) => {
    setServerError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("name", data.name);
      fd.set("slug", data.slug);
      fd.set("description", data.description ?? "");
      fd.set("image", categoryImage);
      fd.set("featured", data.featured ? "true" : "false");
      fd.set("active", data.active ? "true" : "false");

      const result =
        mode === "create"
          ? await createCategory(fd)
          : await updateCategory(categoryId!, fd);

      if ("error" in result) {
        setServerError(result.error);
        notify.error(result.error);
      } else if (result.success) {
        notify.success(crud[mode === "create" ? "created" : "updated"]("Category"));
        router.push("/admin/categories");
        router.refresh();
      }
    });
  });

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
          Details
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label required>Name</Label>
            <input
              {...form.register("name")}
              className="input w-full"
              placeholder="Category name"
              onChange={handleNameChange}
            />
            <FormError>{form.formState.errors.name?.message}</FormError>
          </div>
          <div>
            <Label required>Slug</Label>
            <input
              {...form.register("slug")}
              className="input w-full"
              placeholder="category-slug"
            />
            <FormError>{form.formState.errors.slug?.message}</FormError>
          </div>
        </div>
        <div className="mt-4">
          <Label>Description</Label>
          <textarea
            {...form.register("description")}
            className="textarea textarea-bordered w-full"
            rows={3}
            placeholder="Category description (optional)"
          />
          <FormError>{form.formState.errors.description?.message}</FormError>
        </div>
      </div>

      <div className="rounded-xl border border-base-200 bg-base-100 p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-base-content/50">
          Media
        </h2>
        <ImageUpload
          value={categoryImage ? [categoryImage] : []}
          onChange={(urls) => setCategoryImage(urls[0] ?? "")}
          maxFiles={1}
          folder={UPLOAD_FOLDERS.categories}
        />
      </div>

      <div className="rounded-xl border border-base-200 bg-base-100 p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-base-content/50">
          Settings
        </h2>
        <div className="flex flex-wrap gap-6">
          <Checkbox label="Featured" {...form.register("featured")} />
          <Checkbox label="Active" {...form.register("active")} />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/categories")}
        >
          Cancel
        </Button>
        <Button type="submit" loading={isPending}>
          {mode === "create" ? "Create Category" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
