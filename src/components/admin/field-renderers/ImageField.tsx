import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";
import { FieldDefinition } from "@/lib/page-content-schema";
import { getImageUrl } from "@/lib/utils";

interface ImageFieldProps {
  field: FieldDefinition;
  value: string;
  onChange: (value: string) => void;
  onOpenMediaPicker: () => void;
  error?: string;
}

export function ImageField({
  field,
  value,
  onChange,
  onOpenMediaPicker,
  error,
}: ImageFieldProps) {
  const commonClasses = `w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    error ? "border-red-500" : "border-gray-300"
  }`;

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/images/example.jpg"
          className={`${commonClasses} flex-1`}
          required={field.required}
        />
        <button
          type="button"
          onClick={onOpenMediaPicker}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap"
        >
          <ImageIcon className="w-4 h-4" />
          Select from Media
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Enter image URL or select from Media
      </p>
      {value && value.trim() && (
        <div className="mt-2">
          <Image
            width={200}
            height={200}
            src={getImageUrl(value)}
            alt="Preview"
            className="max-w-xs h-auto rounded border"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
            unoptimized={
              !value.startsWith("http://") &&
              !value.startsWith("https://") &&
              !value.startsWith("/")
            }
          />
        </div>
      )}
    </div>
  );
}
