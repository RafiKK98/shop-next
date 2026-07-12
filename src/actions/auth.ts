"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { signIn, signOut } from "@/lib/auth";
import { CredentialsSignin } from "next-auth";
import { hashPassword } from "@/lib/auth/password";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import { eq } from "drizzle-orm";
import { redirect as nextRedirect } from "next/navigation";

function safeRedirect(url: string): never {
  if (!url.startsWith("/")) url = "/";
  return nextRedirect(url as never);
}

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Invalid form data" };
  }

  const callbackUrl = (formData.get("callbackUrl") as string) || "/";

  try {
    const result = await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });

    if (result?.error) {
      return { error: "Invalid email or password" };
    }
  } catch (error) {
    if (error instanceof CredentialsSignin) {
      return { error: "Invalid email or password" };
    }
    return { error: "An unexpected error occurred. Please try again." };
  }

  safeRedirect(callbackUrl);
}

export async function registerAction(formData: FormData) {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    terms: formData.get("terms") === "on",
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const firstError = Object.values(fieldErrors).flat()[0];
    return { error: firstError || "Please check your form inputs" };
  }

  const { name, email, password } = parsed.data;
  const callbackUrl = (formData.get("callbackUrl") as string) || "/";

  const existingUser = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .then((res) => res[0] ?? null);

  if (existingUser) {
    return { error: "An account with this email already exists" };
  }

  const hashedPassword = await hashPassword(password);

  await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
  });

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch {
    safeRedirect(callbackUrl);
  }

  safeRedirect(callbackUrl);
}

export async function logoutAction() {
  await signOut({ redirect: false });
  safeRedirect("/");
}

export async function googleSignInAction() {
  await signIn("google", { redirectTo: "/" });
}
