import { cn } from "@/utils/cn";
import Image from "next/image";
import { type HTMLAttributes } from "react";

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  shape?: "circle" | "square";
  fallback?: string;
}

const sizeClass: Record<string, string> = {
  xs: "w-6",
  sm: "w-8",
  md: "w-12",
  lg: "w-16",
  xl: "w-24",
};

export function Avatar({
  className,
  src,
  alt,
  size = "md",
  shape = "circle",
  fallback,
  ...props
}: AvatarProps) {
  const initials =
    fallback ||
    alt
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div
      className={cn("avatar", shape === "circle" && "rounded-full", className)}
      title={alt}
      {...props}
    >
      {src ? (
        <div
          className={cn(
            sizeClass[size],
            "relative",
            shape === "circle" && "rounded-full",
          )}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className={cn(
              shape === "circle" ? "rounded-full" : "rounded-box",
              "object-cover",
            )}
          />
        </div>
      ) : (
        <div
          className={cn(
            sizeClass[size],
            shape === "circle" ? "rounded-full" : "rounded-box",
            "bg-base-300 flex items-center justify-center text-base-content/60 font-medium",
          )}
        >
          {initials}
        </div>
      )}
    </div>
  );
}
