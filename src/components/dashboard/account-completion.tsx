import { cn } from "@/utils/cn";

interface AccountCompletionProps {
  hasName: boolean;
  hasPhone: boolean;
  hasAddress: boolean;
}

export function AccountCompletion({ hasName, hasPhone, hasAddress }: AccountCompletionProps) {
  const items = [
    { label: "Name added", done: hasName },
    { label: "Phone added", done: hasPhone },
    { label: "Address added", done: hasAddress },
  ];

  const completed = items.filter((i) => i.done).length;
  const total = items.length;
  const percentage = Math.round((completed / total) * 100);

  return (
    <div className="rounded-xl border border-base-200 bg-base-100 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-base-content/50">
          Profile Completion
        </h2>
        <span className="text-xs font-medium text-base-content/50">
          {completed}/{total}
        </span>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-base-200">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            percentage === 100 ? "bg-success" : "bg-primary",
          )}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      <ul className="mt-3 space-y-1.5">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2 text-xs">
            <span
              className={cn(
                "flex size-4 items-center justify-center rounded-full",
                item.done ? "bg-success/10 text-success" : "bg-base-200 text-base-content/30",
              )}
            >
              {item.done ? (
                <svg className="size-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              ) : (
                <span className="text-[10px]">&ndash;</span>
              )}
            </span>
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
