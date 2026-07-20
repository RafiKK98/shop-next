import { cn } from "@/utils/cn";
import {
  forwardRef,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  type SelectHTMLAttributes,
} from "react";

/* ── Label ── */

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function Label({ className, required, children, ...props }: LabelProps) {
  return (
    <label className={cn("label", className)} {...props}>
      <span className="label-text">
        {children}
        {required && <span className="text-error ml-0.5">*</span>}
      </span>
    </label>
  );
}

/* ── FormError ── */

export function FormError({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  if (!children) return null;
  return (
    <span className={cn("label-text-alt text-error", className)} {...props}>
      {children}
    </span>
  );
}

/* ── HelperText ── */

export function HelperText({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  if (!children) return null;
  return (
    <span
      className={cn("label-text-alt text-base-content/60", className)}
      {...props}
    >
      {children}
    </span>
  );
}

/* ── Checkbox ── */

interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const checkId =
      id ||
      (label
        ? `checkbox-${label.toLowerCase().replace(/\s+/g, "-")}`
        : undefined);
    return (
      <label
        htmlFor={checkId}
        className="label cursor-pointer justify-start gap-3"
      >
        <input
          ref={ref}
          id={checkId}
          type="checkbox"
          className={cn("checkbox", className)}
          {...props}
        />
        {label && <span className="label-text">{label}</span>}
      </label>
    );
  },
);
Checkbox.displayName = "Checkbox";

/* ── Radio ── */

interface RadioProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, id, ...props }, ref) => {
    const radioId =
      id ||
      (label ? `radio-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);
    return (
      <label
        htmlFor={radioId}
        className="label cursor-pointer justify-start gap-3"
      >
        <input
          ref={ref}
          id={radioId}
          type="radio"
          className={cn("radio", className)}
          {...props}
        />
        {label && <span className="label-text">{label}</span>}
      </label>
    );
  },
);
Radio.displayName = "Radio";

/* ── Switch ── */

interface SwitchProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, id, ...props }, ref) => {
    const switchId =
      id ||
      (label
        ? `switch-${label.toLowerCase().replace(/\s+/g, "-")}`
        : undefined);
    return (
      <label
        htmlFor={switchId}
        className="label cursor-pointer justify-start gap-3"
      >
        <input
          ref={ref}
          id={switchId}
          type="checkbox"
          className={cn("toggle", className)}
          {...props}
        />
        {label && <span className="label-text">{label}</span>}
      </label>
    );
  },
);
Switch.displayName = "Switch";

/* ── Select ── */

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <fieldset className="fieldset">
        {label && (
          <label htmlFor={selectId} className="fieldset-label">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn("select w-full", error && "select-error", className)}
          aria-invalid={!!error}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="fieldset-label text-error">{error}</span>}
      </fieldset>
    );
  },
);
Select.displayName = "Select";
