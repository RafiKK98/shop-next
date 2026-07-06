"use client";

import { cn } from "@/utils/cn";
import { Check } from "lucide-react";

interface Step {
  label: string;
}

interface CheckoutStepperProps {
  steps: Step[];
  currentStep: number;
}

export function CheckoutStepper({ steps, currentStep }: CheckoutStepperProps) {
  return (
    <nav aria-label="Checkout progress" className="mb-8">
      <ol className="flex items-center gap-2 md:gap-4">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isActive = idx === currentStep;
          const isLast = idx === steps.length - 1;

          return (
            <li key={idx} className={cn("flex items-center gap-2", !isLast && "flex-1")}>
              <div
                className={cn(
                  "flex items-center gap-2",
                  isActive && "font-semibold",
                  isCompleted && "text-success",
                  !isActive && !isCompleted && "text-base-content/40",
                )}
                aria-current={isActive ? "step" : undefined}
              >
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full text-sm font-medium",
                    isCompleted && "bg-success text-success-content",
                    isActive && "bg-primary text-primary-content",
                    !isActive && !isCompleted && "bg-base-200 text-base-content/40",
                  )}
                >
                  {isCompleted ? <Check className="size-4" /> : idx + 1}
                </span>
                <span className="hidden text-sm md:inline">{step.label}</span>
              </div>

              {!isLast && (
                <div
                  className={cn(
                    "h-px flex-1",
                    isCompleted ? "bg-success" : "bg-base-200",
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-2 text-center md:hidden">
        <span className="text-sm text-base-content/60">
          Step {currentStep + 1} of {steps.length}: {steps[currentStep]?.label}
        </span>
      </div>
    </nav>
  );
}
