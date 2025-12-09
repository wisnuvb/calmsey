import { FieldDefinition } from "@/lib/page-content-schema";
import { TinyMCEEditor } from "@/components/admin/TinyMCEEditor";

interface HtmlFieldProps {
  field: FieldDefinition;
  value: string;
  onChange: (value: string) => void;
  onImageUpload: (file: File) => Promise<string>;
}

export function HtmlField({
  field,
  value,
  onChange,
  onImageUpload,
}: HtmlFieldProps) {
  return (
    <div>
      <TinyMCEEditor
        value={value}
        onChange={onChange}
        placeholder={field.placeholder}
        height={500}
        onImageUpload={onImageUpload}
      />
      {field.helpText && (
        <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>
      )}
    </div>
  );
}
