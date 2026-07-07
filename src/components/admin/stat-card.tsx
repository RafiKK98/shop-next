import { type LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    direction: "up" | "down";
    value: string;
  };
  variant?: "default" | "primary" | "success" | "warning" | "danger";
}

const variantStyles: Record<string, string> = {
  default: "bg-base-100 border-base-200",
  primary: "bg-primary/5 border-primary/20",
  success: "bg-success/5 border-success/20",
  warning: "bg-warning/5 border-warning/20",
  danger: "bg-error/5 border-error/20",
};

const iconVariantStyles: Record<string, string> = {
  default: "text-base-content/50 bg-base-200",
  primary: "text-primary bg-primary/10",
  success: "text-success bg-success/10",
  warning: "text-warning bg-warning/10",
  danger: "text-error bg-error/10",
};

export function StatCard({ label, value, icon: Icon, trend, variant = "default" }: StatCardProps) {
  return (
    <div className={cn("rounded-xl border p-5", variantStyles[variant])}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-base-content/50">{label}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
          {trend && (
            <p
              className={cn(
                "mt-1 text-xs",
                trend.direction === "up" ? "text-success" : "text-error",
              )}
            >
              {trend.direction === "up" ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        <span className={cn("flex size-11 items-center justify-center rounded-xl", iconVariantStyles[variant])}>
          <Icon className="size-5" />
        </span>
      </div>
    </div>
  );
}
