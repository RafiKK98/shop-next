import { cn } from "@/utils/cn";

/* ── Alert ── */

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "error";
}

const alertVariantClass: Record<string, string> = {
  info: "alert-info",
  success: "alert-success",
  warning: "alert-warning",
  error: "alert-error",
};

export function Alert({ className, variant, children, ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn("alert", variant && alertVariantClass[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}

/* ── Badge ── */

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "neutral"
    | "primary"
    | "secondary"
    | "accent"
    | "ghost"
    | "outline"
    | "success"
    | "error"
    | "warning"
    | "info";
  size?: "xs" | "sm" | "md" | "lg";
}

const badgeVariantClass: Record<string, string> = {
  neutral: "badge-neutral",
  primary: "badge-primary",
  secondary: "badge-secondary",
  accent: "badge-accent",
  ghost: "badge-ghost",
  outline: "badge-outline",
  success: "badge-success",
  error: "badge-error",
  warning: "badge-warning",
  info: "badge-info",
};

const badgeSizeClass: Record<string, string> = {
  xs: "badge-xs",
  sm: "badge-sm",
  md: "",
  lg: "badge-lg",
};

export function Badge({
  className,
  variant,
  size = "sm",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "badge",
        variant && badgeVariantClass[variant],
        badgeSizeClass[size],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function DiscountBadge({
  discount,
  className,
}: {
  discount: number | string;
  className?: string;
}) {
  const numericDiscount =
    typeof discount === "string" ? Number(discount) : discount;
  if (numericDiscount <= 0) return null;

  return (
    <span className={cn("badge badge-error badge-sm", className)}>
      -{numericDiscount}%
    </span>
  );
}

/* ── Spinner ── */

interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: "sm" | "md" | "lg";
}

const spinnerSizeClass: Record<string, string> = {
  sm: "loading-sm",
  md: "",
  lg: "loading-lg",
};

export function Spinner({ className, size = "md", ...props }: SpinnerProps) {
  return (
    <span
      className={cn(
        "loading loading-spinner",
        spinnerSizeClass[size],
        className,
      )}
      aria-label="Loading"
      {...props}
    />
  );
}

/* ── Skeleton ── */

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "avatar" | "card" | "thumbnail";
}

const skeletonVariantClass: Record<string, string> = {
  text: "h-4 w-full",
  avatar: "size-12 rounded-full shrink-0",
  card: "h-48 w-full",
  thumbnail: "size-20 rounded-box",
};

export function Skeleton({
  className,
  variant = "text",
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn("skeleton", skeletonVariantClass[variant], className)}
      aria-hidden="true"
      {...props}
    />
  );
}

/* ── Progress ── */

interface ProgressProps extends React.ProgressHTMLAttributes<HTMLProgressElement> {
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "success"
    | "warning"
    | "error";
}

const progressVariantClass: Record<string, string> = {
  primary: "progress-primary",
  secondary: "progress-secondary",
  accent: "progress-accent",
  success: "progress-success",
  warning: "progress-warning",
  error: "progress-error",
};

export function Progress({
  className,
  variant,
  value,
  max = 100,
  ...props
}: ProgressProps) {
  return (
    <progress
      className={cn(
        "progress w-full",
        variant && progressVariantClass[variant],
        className,
      )}
      value={value}
      max={max}
      {...props}
    />
  );
}
