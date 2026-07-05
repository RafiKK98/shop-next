import Link from "next/link";
import { cn } from "@/utils/cn";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps extends React.HTMLAttributes<HTMLDivElement> {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ className, items, ...props }: BreadcrumbProps) {
  return (
    <div className={cn("breadcrumbs text-sm", className)} {...props}>
      <ul>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${item.href || item.label}-${i}`}>
              {isLast || !item.href ? (
                <span className={cn(isLast && "font-medium text-base-content")}>
                  {item.label}
                </span>
              ) : (
                <Link href={item.href as unknown as any} className="text-base-content/60 hover:text-base-content">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
