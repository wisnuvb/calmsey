import { FieldDefinition } from "@/lib/page-content-schema";

interface BooleanFieldProps {
  field: FieldDefinition;
  value: string;
  onChange: (value: string) => void;
}

export function BooleanField({ field, value, onChange }: BooleanFieldProps) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        checked={value === "true" || value === "1"}
        onChange={(e) => onChange(e.target.checked ? "true" : "false")}
        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
      <label className="ml-2 text-sm text-gray-700">{field.label}</label>
    </div>
  );
}
