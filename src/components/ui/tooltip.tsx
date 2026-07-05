import { cn } from "@/utils/cn";

interface TooltipProps {
  tip: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

const positionClass: Record<string, string> = {
  top: "tooltip-top",
  bottom: "tooltip-bottom",
  left: "tooltip-left",
  right: "tooltip-right",
};

export function Tooltip({ tip, children, position = "top", className }: TooltipProps) {
  return (
    <div
      className={cn("tooltip", positionClass[position], className)}
      data-tip={tip}
    >
      {children}
    </div>
  );
}
