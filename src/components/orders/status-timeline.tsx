"use client";

import { cn } from "@/utils/cn";
import { Check } from "lucide-react";

type OrderStatus = "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";

interface StatusTimelineProps {
  status: OrderStatus;
}

const ORDER_FLOW: { status: OrderStatus; label: string }[] = [
  { status: "pending", label: "Pending" },
  { status: "processing", label: "Processing" },
  { status: "shipped", label: "Shipped" },
  { status: "delivered", label: "Delivered" },
];

const STATUS_INDEX: Record<OrderStatus, number> = {
  pending: 0,
  paid: 1,
  processing: 1,
  shipped: 2,
  delivered: 3,
  cancelled: -1,
};

export function StatusTimeline({ status }: StatusTimelineProps) {
  const isCancelled = status === "cancelled";
  const currentIndex = STATUS_INDEX[status] ?? -1;

  return (
    <div className="rounded-xl border border-base-200 bg-base-100 p-4">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-base-content/50">
        Order Status
      </h3>

      {isCancelled ? (
        <div className="flex items-center gap-3 text-error">
          <span className="flex size-10 items-center justify-center rounded-full bg-error/10">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
          <div>
            <p className="font-medium">Order Cancelled</p>
            <p className="text-sm text-base-content/50">This order has been cancelled</p>
          </div>
        </div>
      ) : (
        <ol className="space-y-4">
          {ORDER_FLOW.map((step, idx) => {
            const isCompleted = idx <= currentIndex;
            const isActive = idx === currentIndex && !isCompleted;
            const isFuture = idx > currentIndex;

            return (
              <li key={step.status} className="flex items-start gap-3">
                <span
                  className={cn(
                    "flex mt-0.5 size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                    isCompleted && "bg-success text-success-content",
                    isActive && "bg-primary text-primary-content",
                    isFuture && "bg-base-200 text-base-content/30",
                  )}
                >
                  {isCompleted ? <Check className="size-3.5" /> : idx + 1}
                </span>
                <span
                  className={cn(
                    "text-sm",
                    isCompleted && "font-medium text-success",
                    isActive && "font-semibold",
                    isFuture && "text-base-content/30",
                  )}
                >
                  {step.label}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
