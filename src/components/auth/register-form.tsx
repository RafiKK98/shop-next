"use client";

import { useState, useActionState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { registerAction } from "@/actions/auth";
import { Button } from "@/components/ui";
import Link from "next/link";

interface RegisterFormProps {
  callbackUrl?: string;
}

export function RegisterForm({ callbackUrl = "/" }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      return registerAction(formData);
    },
    null,
  );

  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", terms: false },
  });

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit(() => {
          const formData = new FormData(formRef.current!);
          formData.set("callbackUrl", callbackUrl);
          formAction(formData);
        })(e);
      }}
      className="space-y-5"
    >
      <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
      <p className="text-sm text-base-content/60">
        Join us today and start shopping!
      </p>

      {state?.error && (
        <div className="alert alert-error" role="alert">
          <span>{state.error}</span>
        </div>
      )}

      <fieldset className="fieldset">
        <label htmlFor="name" className="fieldset-label">
          Full Name
        </label>
        <input
          {...form.register("name")}
          id="name"
          type="text"
          autoComplete="name"
          className={`input w-full ${form.formState.errors.name ? "input-error" : ""}`}
          placeholder="John Doe"
        />
        {form.formState.errors.name && (
          <span className="fieldset-label text-error">
            {form.formState.errors.name.message}
          </span>
        )}
      </fieldset>

      <fieldset className="fieldset">
        <label htmlFor="reg-email" className="fieldset-label">
          Email
        </label>
        <input
          {...form.register("email")}
          id="reg-email"
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
        <label htmlFor="reg-password" className="fieldset-label">
          Password
        </label>
        <div className="relative">
          <input
            {...form.register("password")}
            id="reg-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            className={`input w-full pr-10 ${form.formState.errors.password ? "input-error" : ""}`}
            placeholder="Min. 8 characters"
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

      <fieldset className="fieldset">
        <label htmlFor="confirmPassword" className="fieldset-label">
          Confirm Password
        </label>
        <input
          {...form.register("confirmPassword")}
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          className={`input w-full ${form.formState.errors.confirmPassword ? "input-error" : ""}`}
          placeholder="Re-enter your password"
        />
        {form.formState.errors.confirmPassword && (
          <span className="fieldset-label text-error">
            {form.formState.errors.confirmPassword.message}
          </span>
        )}
      </fieldset>

      <label className="label cursor-pointer justify-start gap-3">
        <input
          {...form.register("terms")}
          type="checkbox"
          className={`checkbox ${form.formState.errors.terms ? "checkbox-error" : ""}`}
        />
        <span className="label-text">
          I accept the{" "}
          <Link href="#" className="link link-primary">
            Terms & Conditions
          </Link>
        </span>
      </label>
      {form.formState.errors.terms && (
        <span className="fieldset-label text-error -mt-3">
          {form.formState.errors.terms.message}
        </span>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Creating account..." : "Create account"}
      </Button>

      <p className="text-center text-sm text-base-content/60">
        Already have an account?{" "}
        <Link
          href={`/login${callbackUrl !== "/" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}` as any}
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
