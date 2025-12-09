import { FieldDefinition } from "@/lib/page-content-schema";

interface NumberFieldProps {
  field: FieldDefinition;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function NumberField({
  field,
  value,
  onChange,
  error,
}: NumberFieldProps) {
  const commonClasses = `w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    error ? "border-red-500" : "border-gray-300"
  }`;

  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      min={field.validation?.min}
      max={field.validation?.max}
      className={commonClasses}
      required={field.required}
    />
  );
}
