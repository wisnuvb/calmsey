import { FieldDefinition } from "@/lib/page-content-schema";

interface TextareaFieldProps {
  field: FieldDefinition;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function TextareaField({
  field,
  value,
  onChange,
  error,
}: TextareaFieldProps) {
  const commonClasses = `w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    error ? "border-red-500" : "border-gray-300"
  }`;

  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      rows={4}
      className={commonClasses}
      required={field.required}
    />
  );
}
