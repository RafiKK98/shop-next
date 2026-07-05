import { Checkbox } from "@/components/ui";

interface CheckboxOption {
  label: string;
  value: string;
  count?: number;
}

interface FilterCheckboxGroupProps {
  options: CheckboxOption[];
  name: string;
}

export function FilterCheckboxGroup({ options, name }: FilterCheckboxGroupProps) {
  return (
    <div className="space-y-1">
      {options.map((option) => (
        <Checkbox
          key={option.value}
          name={name}
          value={option.value}
          label={option.count != null ? `${option.label} (${option.count})` : option.label}
        />
      ))}
    </div>
  );
}
