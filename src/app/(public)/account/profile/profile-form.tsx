"use client";

import { updateProfile } from "@/actions/profile";
import { Button, Input, Label } from "@/components/ui";
import { profileSchema, type ProfileInput } from "@/lib/validations/profile";
import { formatDate } from "@/utils/format";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import type { Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";

interface ProfileFormProps {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
    phone?: string | null;
    createdAt?: Date | string | null;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema) as Resolver<ProfileInput>,
    defaultValues: {
      name: user.name || "",
      phone: user.phone || "",
    },
  });

  const onSubmit = handleSubmit((data) => {
    setServerError(null);
    setSuccess(false);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("name", data.name);
      fd.set("phone", data.phone || "");
      const result = await updateProfile(fd);
      if (result?.error) {
        setServerError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    });
  });

  return (
    <div className="rounded-xl border border-base-200 bg-base-100">
      <div className="flex flex-col items-center gap-4 border-b border-base-200 px-6 py-8 sm:flex-row">
        <div className="flex relative size-20 items-center justify-center rounded-full bg-base-200">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name || "Avatar"}
              fill
              className="size-20 rounded-full object-cover"
            />
          ) : (
            <User className="size-8 text-base-content/30" />
          )}
        </div>
        <div className="text-center sm:text-left">
          <p className="text-lg font-semibold">{user.name || "No name set"}</p>
          <p className="text-sm text-base-content/50">{user.email}</p>
          <p className="mt-1 text-xs text-base-content/40">
            Member since {user.createdAt ? formatDate(user.createdAt) : "N/A"}
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-5 p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-xs text-error">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={user.email || ""}
              disabled
              className="bg-base-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              {...register("phone")}
              placeholder="+1 (555) 000-0000"
            />
            {errors.phone && (
              <p className="text-xs text-error">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Account Role</Label>
            <Input
              id="role"
              value={
                user.role
                  ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                  : ""
              }
              disabled
              className="bg-base-200"
            />
          </div>
        </div>

        {serverError && (
          <div className="alert alert-error text-sm" role="alert">
            {serverError}
          </div>
        )}

        {success && (
          <div className="alert alert-success text-sm" role="status">
            Profile updated successfully.
          </div>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            size="lg"
            disabled={isPending}
            loading={isPending}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
