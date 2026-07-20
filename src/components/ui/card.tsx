import { cn } from "@/utils/cn";
import { type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  compact?: boolean;
  bordered?: boolean;
}

export function Card({
  className,
  compact,
  bordered,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "card",
        compact && "card-compact",
        bordered && "border border-base-200",
        "bg-base-100",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBody({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("card-body", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={cn("card-title", className)} {...props}>
      {children}
    </h2>
  );
}

export function CardActions({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("card-actions justify-end", className)} {...props}>
      {children}
    </div>
  );
}

export function CardImage({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-4", className)} {...props}>
      {children}
    </div>
  );
}
