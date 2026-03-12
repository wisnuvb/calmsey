import {
  FieldDefinition,
  type HtmlEditorOptions,
} from "@/lib/page-content-schema";
import { TinyMCEEditor } from "@/components/admin/TinyMCEEditor";

interface HtmlFieldProps {
  field: FieldDefinition;
  value: string;
  onChange: (value: string) => void;
  onImageUpload: (file: File) => Promise<string>;
  /** Override editor options (e.g. when used inside multiple field with item editorOptions) */
  editorOptions?: HtmlEditorOptions;
}

export function HtmlField({
  field,
  value,
  onChange,
  onImageUpload,
  editorOptions: editorOptionsOverride,
}: HtmlFieldProps) {
  const opts = editorOptionsOverride ?? field.editorOptions;
  return (
    <div>
      <TinyMCEEditor
        value={value}
        onChange={onChange}
        placeholder={field.placeholder}
        height={opts?.height ?? 500}
        minHeight={opts?.minHeight}
        menubar={opts?.menubar}
        resize={opts?.resize}
        toolbar={opts?.toolbar}
        onImageUpload={onImageUpload}
      />
      {field.helpText && (
        <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>
      )}
    </div>
  );
}
