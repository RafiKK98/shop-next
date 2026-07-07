import { cn } from "@/utils/cn";

interface AdminContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function AdminContainer({ children, className }: AdminContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}
