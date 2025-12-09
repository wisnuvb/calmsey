import { FieldDefinition } from "@/lib/page-content-schema";

interface ColorFieldProps {
  field: FieldDefinition;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function ColorField({ value, onChange, error }: ColorFieldProps) {
  const commonClasses = `w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    error ? "border-red-500" : "border-gray-300"
  }`;

  return (
    <div className="flex items-center space-x-2">
      <input
        type="color"
        value={value || "#000000"}
        onChange={(e) => onChange(e.target.value)}
        className="w-12 h-10 border rounded cursor-pointer"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#000000"
        className={commonClasses}
        pattern="^#[0-9A-Fa-f]{6}$"
      />
    </div>
  );
}
