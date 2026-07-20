import type { UserRole } from "@/types/auth";
import { redirect } from "next/navigation";
import { auth } from "./config";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return session;
}

export async function requireRole(role: UserRole) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  if (session.user.role !== role) redirect("/");

  return session;
}

export async function requireAdmin() {
  return requireRole("admin");
}

export async function optionalAuth() {
  try {
    const session = await auth();
    return session ?? null;
  } catch {
    return null;
  }
}

export type AuthenticatedSession = Awaited<ReturnType<typeof requireAuth>>;
