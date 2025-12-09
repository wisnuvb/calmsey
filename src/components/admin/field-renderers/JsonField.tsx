import Editor from "@monaco-editor/react";
import { FieldDefinition } from "@/lib/page-content-schema";

interface JsonFieldProps {
  field: FieldDefinition;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function JsonField({ value, onChange, error }: JsonFieldProps) {
  const isValidJSON = (str: string): boolean => {
    if (!str.trim()) return true;
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  };

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(value);
      const formatted = JSON.stringify(parsed, null, 2);
      onChange(formatted);
    } catch {
      // Invalid JSON, don't format
    }
  };

  const minifyJSON = () => {
    try {
      const parsed = JSON.parse(value);
      const minified = JSON.stringify(parsed);
      onChange(minified);
    } catch {
      // Invalid JSON, don't minify
    }
  };

  const jsonValid = isValidJSON(value);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-700">JSON Editor</span>
          {jsonValid ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
              ✓ Valid
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
              ✗ Invalid JSON
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={formatJSON}
            disabled={!jsonValid}
            className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Format JSON (Beautify)"
          >
            Format
          </button>
          <button
            type="button"
            onClick={minifyJSON}
            disabled={!jsonValid}
            className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Minify JSON"
          >
            Minify
          </button>
        </div>
      </div>

      <div
        className={`border rounded-md overflow-hidden ${
          !jsonValid && value.trim()
            ? "border-red-500"
            : error
            ? "border-red-500"
            : "border-gray-300"
        }`}
      >
        <Editor
          height="400px"
          defaultLanguage="json"
          value={value}
          onChange={(val) => onChange(val || "")}
          theme="vs-light"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            wordWrap: "on",
            automaticLayout: true,
            tabSize: 2,
            formatOnPaste: true,
            formatOnType: true,
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: "on",
            quickSuggestions: true,
            folding: true,
            bracketPairColorization: { enabled: true },
            renderValidationDecorations: "on",
          }}
        />
      </div>

      <div className="flex items-start justify-between mt-1">
        <p className="text-xs text-gray-500">
          JSON format - must be valid JSON
        </p>
        <p className="text-xs text-gray-400">
          Lines: {value.split("\n").length} | Chars: {value.length}
        </p>
      </div>
    </div>
  );
}
