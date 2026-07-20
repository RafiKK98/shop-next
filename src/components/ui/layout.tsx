import { cn } from "@/utils/cn";
import type { HTMLAttributes } from "react";

/* ── Container ── */

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  as?: "div" | "section" | "article" | "main" | "header" | "footer";
}

export function Container({
  className,
  as: Tag = "div",
  children,
  ...props
}: ContainerProps) {
  return (
    <Tag
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
      {...props}
    >
      {children}
    </Tag>
  );
}

/* ── Section ── */

interface SectionProps extends HTMLAttributes<HTMLElement> {
  as?: "section" | "div";
}

export function Section({
  className,
  as: Tag = "section",
  children,
  ...props
}: SectionProps) {
  return (
    <Tag className={cn("py-8 md:py-12", className)} {...props}>
      {children}
    </Tag>
  );
}

/* ── Stack ── */

interface StackProps extends HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "column";
  gap?: 0 | 1 | 2 | 3 | 4 | 6 | 8 | 12 | 16;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
}

const gapClass: Record<number, string> = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  6: "gap-6",
  8: "gap-8",
  12: "gap-12",
  16: "gap-16",
};

const alignClass: Record<string, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

const justifyClass: Record<string, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
};

export function Stack({
  className,
  direction = "column",
  gap = 4,
  align,
  justify,
  children,
  ...props
}: StackProps) {
  return (
    <div
      className={cn(
        "flex",
        direction === "row" ? "flex-row" : "flex-col",
        gapClass[gap],
        align && alignClass[align],
        justify && justifyClass[justify],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/* ── Divider ── */

interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

export function Divider({
  className,
  orientation = "horizontal",
  children,
  ...props
}: DividerProps) {
  if (orientation === "vertical")
    return (
      <div className={cn("divider divider-horizontal", className)} {...props} />
    );

  return (
    <div className={cn("divider", className)} {...props}>
      {children}
    </div>
  );
}
