"use server";

import { userRoleEnum, userStatusEnum } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/guards";
import { CACHE_TAGS } from "@/lib/cache";
import type { UserRole, UserStatus } from "@/services/admin/user-types";
import { updateUserDb } from "@/services/admin/users";
import { revalidatePath, updateTag } from "next/cache";

interface ActionSuccess {
  success: true;
}

interface ActionError {
  error: string;
}

type ActionResult = ActionSuccess | ActionError;

export async function updateUser(formData: FormData): Promise<ActionResult> {
  const session = await requireAdmin();
  const userId = formData.get("userId") as string;
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const role = formData.get("role") as UserRole;
  const status = formData.get("status") as UserStatus;

  if (!userId) return { error: "User ID is required" };

  if (!name?.trim()) return { error: "Name is required" };

  const validRoles = userRoleEnum.enumValues;
  if (!validRoles.includes(role)) return { error: "Invalid role" };

  const validStatuses = userStatusEnum.enumValues;
  if (!validStatuses.includes(status)) return { error: "Invalid status" };

  try {
    await updateUserDb(
      userId,
      { name: name.trim(), phone: phone.trim(), role, status },
      session.user.id,
    );

    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${userId}`);
    updateTag(CACHE_TAGS.USERS);
    return { success: true };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to update user",
    };
  }
}
