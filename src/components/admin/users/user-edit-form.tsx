"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateUser } from "@/actions/admin/users";
import { Button, Label } from "@/components/ui";
import { notify, crud, errors } from "@/lib/notifications";
import {
  USER_ROLE_LABEL,
  USER_STATUS_LABEL,
  type UserRole,
  type UserStatus,
} from "@/services/admin/user-types";

interface UserEditFormProps {
  userId: string;
  currentName: string | null;
  currentEmail: string;
  currentPhone: string | null;
  currentRole: UserRole;
  currentStatus: UserStatus;
  isSelf: boolean;
}

const ROLE_OPTIONS = Object.entries(USER_ROLE_LABEL).map(([value, label]) => ({
  value,
  label,
}));

const STATUS_OPTIONS = Object.entries(USER_STATUS_LABEL).map(([value, label]) => ({
  value,
  label,
}));

export function UserEditForm({
  userId,
  currentName,
  currentEmail,
  currentPhone,
  currentRole,
  currentStatus,
  isSelf,
}: UserEditFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    if (!formData.get("name")?.toString().trim()) {
      setServerError("Name is required");
      return;
    }

    startTransition(async () => {
      const result = await updateUser(formData);
      if ("error" in result) {
        setServerError(result.error);
        notify.error(result.error);
      } else {
        notify.success(crud.updated("User"));
        router.push(`/admin/users/${userId}`);
        router.refresh();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <input type="hidden" name="userId" value={userId} />

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
          Profile
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Name</Label>
            <input
              name="name"
              defaultValue={currentName ?? ""}
              className="input w-full"
              required
            />
          </div>
          <div>
            <Label>Email</Label>
            <input
              type="email"
              value={currentEmail}
              className="input w-full"
              disabled
              aria-readonly
            />
          </div>
          <div>
            <Label>Phone</Label>
            <input
              name="phone"
              defaultValue={currentPhone ?? ""}
              className="input w-full"
              placeholder="No phone on file"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-base-200 bg-base-100 p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-base-content/50">
          Permissions
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Role</Label>
            <select
              name="role"
              defaultValue={currentRole}
              className="select w-full"
              aria-label="Select role"
            >
              {ROLE_OPTIONS.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  disabled={isSelf && opt.value !== "admin"}
                >
                  {opt.label}
                  {isSelf && opt.value !== "admin" ? " (cannot demote self)" : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Status</Label>
            <select
              name="status"
              defaultValue={currentStatus}
              className="select w-full"
              aria-label="Select status"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {isSelf && (
          <p className="mt-3 text-xs text-warning">
            You are editing your own account. Your admin role cannot be removed.
          </p>
        )}
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/admin/users/${userId}`)}
        >
          Cancel
        </Button>
        <Button type="submit" loading={isPending}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}
