"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { loginAction } from "@/actions/auth";
import { Button } from "@/components/ui";
import Link from "next/link";
import type { Route } from "next";

interface LoginFormProps {
  callbackUrl?: string;
}

export function LoginForm({ callbackUrl = "/" }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = form.handleSubmit((data) => {
    setServerError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("email", data.email);
      fd.set("password", data.password);
      fd.set("callbackUrl", callbackUrl);

      const result = await loginAction(fd);
      if (result?.error) {
        setServerError(result.error);
      }
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <h1 className="text-2xl font-bold tracking-tight">Sign in to your account</h1>
      <p className="text-sm text-base-content/60">
        Welcome back! Enter your credentials to continue.
      </p>

      {serverError && (
        <div className="alert alert-error" role="alert">
          <span>{serverError}</span>
        </div>
      )}

      <fieldset className="fieldset">
        <label htmlFor="email" className="fieldset-label">
          Email
        </label>
        <input
          {...form.register("email")}
          id="email"
          type="email"
          autoComplete="email"
          className={`input w-full ${form.formState.errors.email ? "input-error" : ""}`}
          placeholder="you@example.com"
        />
        {form.formState.errors.email && (
          <span className="fieldset-label text-error">
            {form.formState.errors.email.message}
          </span>
        )}
      </fieldset>

      <fieldset className="fieldset">
        <label htmlFor="password" className="fieldset-label">
          Password
        </label>
        <div className="relative">
          <input
            {...form.register("password")}
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            className={`input w-full pr-10 ${form.formState.errors.password ? "input-error" : ""}`}
            placeholder="Enter your password"
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs btn-square text-base-content/40 hover:text-base-content"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {form.formState.errors.password && (
          <span className="fieldset-label text-error">
            {form.formState.errors.password.message}
          </span>
        )}
      </fieldset>

      <div className="flex items-center justify-between">
        <label className="label cursor-pointer justify-start gap-3">
          <input
            {...form.register("rememberMe")}
            type="checkbox"
            className="checkbox"
          />
          <span className="label-text">Remember me</span>
        </label>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Signing in..." : "Sign in"}
      </Button>

      <p className="text-center text-sm text-base-content/60">
        Don&apos;t have an account?{" "}
        <Link
          href={`/register${callbackUrl !== "/" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}` as Route}
          className="font-medium text-primary hover:underline"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
