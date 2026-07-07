"use server";

import { requireAdmin } from "@/lib/auth/guards";
import { auth } from "@/lib/auth/config";
import { updateUserDb, type UpdateUserData } from "@/services/admin/users";
import { userRoleEnum, userStatusEnum } from "@/db/schema";
import { revalidatePath } from "next/cache";

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
  const role = formData.get("role") as string;
  const status = formData.get("status") as string;

  if (!userId) return { error: "User ID is required" };

  if (!name?.trim()) return { error: "Name is required" };

  const validRoles = userRoleEnum.enumValues;
  if (!validRoles.includes(role as any)) {
    return { error: "Invalid role" };
  }

  const validStatuses = userStatusEnum.enumValues;
  if (!validStatuses.includes(status as any)) {
    return { error: "Invalid status" };
  }

  try {
    await updateUserDb(
      userId,
      { name: name.trim(), phone: phone.trim(), role: role as any, status: status as any },
      session.user.id,
    );

    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${userId}`);
    return { success: true };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to update user",
    };
  }
}
