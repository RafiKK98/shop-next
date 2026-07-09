"use client";

import { Checkbox } from "@/components/ui";

interface CheckboxOption {
  label: string;
  value: string;
  count?: number;
}

interface FilterCheckboxGroupProps {
  options: CheckboxOption[];
  name: string;
  selectedValues: string[];
  onToggle: (value: string) => void;
}

export function FilterCheckboxGroup({
  options,
  name,
  selectedValues,
  onToggle,
}: FilterCheckboxGroupProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <Checkbox
          key={option.value}
          name={name}
          value={option.value}
          checked={selectedValues.includes(option.value)}
          onChange={() => onToggle(option.value)}
          label={
            option.count != null
              ? `${option.label} (${option.count})`
              : option.label
          }
        />
      ))}
    </div>
  );
}
