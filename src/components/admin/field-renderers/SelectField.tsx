"use client";

import { FieldDefinition } from "@/lib/page-content-schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectFieldProps {
  field: FieldDefinition;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function SelectField({ field, value, onChange, error }: SelectFieldProps) {
  const options = field.options || [];

  return (
    <div className="w-full">
      <Select value={value || ""} onValueChange={onChange}>
        <SelectTrigger
          className={`w-full ${error ? "border-red-500" : ""
            }`}
        >
          <SelectValue placeholder={field.placeholder || "Select an option..."} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option: { value: string; label: string }) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {field.helpText && (
        <p className="mt-1 text-sm text-gray-500">{field.helpText}</p>
      )}
    </div>
  );
}
