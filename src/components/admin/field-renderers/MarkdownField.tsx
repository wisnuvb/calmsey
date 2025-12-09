"use client";

import { useState } from "react";
import { FieldDefinition } from "@/lib/page-content-schema";
import { Eye, Code2, Maximize2, Minimize2 } from "lucide-react";

interface MarkdownFieldProps {
  field: FieldDefinition;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function MarkdownField({
  field,
  value,
  onChange,
  error,
}: MarkdownFieldProps) {
  const [viewMode, setViewMode] = useState<"split" | "edit" | "preview">(
    "split"
  );
  const [isFullscreen, setIsFullscreen] = useState(false);

  const commonClasses = `w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm ${
    error ? "border-red-500" : "border-gray-300"
  }`;

  // Simple markdown preview (basic rendering)
  const renderMarkdownPreview = (text: string) => {
    if (!text)
      return <p className="text-gray-400 italic">No content to preview</p>;

    // Basic markdown rendering
    let html = text
      // Headers
      .replace(
        /^### (.*$)/gim,
        '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>'
      )
      .replace(
        /^## (.*$)/gim,
        '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>'
      )
      .replace(
        /^# (.*$)/gim,
        '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>'
      )
      // Bold
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold">$1</strong>')
      .replace(/__(.*?)__/gim, '<strong class="font-bold">$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
      .replace(/_(.*?)_/gim, '<em class="italic">$1</em>')
      // Links
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/gim,
        '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'
      )
      // Code blocks
      .replace(
        /```([\s\S]*?)```/gim,
        '<pre class="bg-gray-100 p-4 rounded my-4 overflow-x-auto"><code>$1</code></pre>'
      )
      // Inline code
      .replace(
        /`([^`]+)`/gim,
        '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>'
      )
      // Lists
      .replace(/^\* (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
      // Line breaks
      .replace(/\n\n/gim, '</p><p class="mb-4">')
      .replace(/\n/gim, "<br />");

    // Wrap list items
    html = html.replace(
      /(<li.*<\/li>)/gim,
      '<ul class="list-disc ml-6 mb-4">$1</ul>'
    );

    // Wrap in paragraph if not already wrapped
    if (!html.startsWith("<")) {
      html = `<p class="mb-4">${html}</p>`;
    }

    return (
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  };

  return (
    <div
      className={`border rounded-md ${
        error ? "border-red-500" : "border-gray-300"
      } ${isFullscreen ? "fixed inset-4 z-50 bg-white shadow-2xl" : ""}`}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200 rounded-t-md">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode("edit")}
            className={`p-2 rounded transition-colors ${
              viewMode === "edit"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-200"
            }`}
            title="Edit mode"
          >
            <Code2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("split")}
            className={`p-2 rounded transition-colors ${
              viewMode === "split"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-200"
            }`}
            title="Split view"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("preview")}
            className={`p-2 rounded transition-colors ${
              viewMode === "preview"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-200"
            }`}
            title="Preview mode"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Editor/Preview Area */}
      <div
        className="flex"
        style={{ height: isFullscreen ? "calc(100vh - 120px)" : "500px" }}
      >
        {/* Editor */}
        {(viewMode === "edit" || viewMode === "split") && (
          <div
            className={
              viewMode === "split" ? "w-1/2 border-r border-gray-200" : "w-full"
            }
          >
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={field.placeholder || "Enter markdown content..."}
              className={`${commonClasses} h-full resize-none rounded-none border-0`}
              required={field.required}
              style={{ minHeight: "100%" }}
            />
          </div>
        )}

        {/* Preview */}
        {(viewMode === "preview" || viewMode === "split") && (
          <div
            className={`overflow-y-auto p-4 bg-white ${
              viewMode === "split" ? "w-1/2" : "w-full"
            }`}
          >
            {renderMarkdownPreview(value)}
          </div>
        )}
      </div>

      {/* Help Text */}
      {field.helpText && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 rounded-b-md">
          <p className="text-xs text-gray-500">{field.helpText}</p>
        </div>
      )}
    </div>
  );
}
