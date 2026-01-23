import { File, Download } from "lucide-react";
import { FieldDefinition } from "@/lib/page-content-schema";

interface FileFieldProps {
  field: FieldDefinition;
  value: string;
  onChange: (value: string) => void;
  onOpenMediaPicker: () => void;
  error?: string;
}

export function FileField({
  field,
  value,
  onChange,
  onOpenMediaPicker,
  error,
}: FileFieldProps) {
  const commonClasses = `w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    error ? "border-red-500" : "border-gray-300"
  }`;

  // Get file extension and name from URL
  const getFileInfo = (url: string) => {
    if (!url || !url.trim()) {
      return { filename: "", extension: "" };
    }

    // Handle relative paths and absolute URLs
    let pathname = url;

    // Try to parse as absolute URL, but don't throw if it fails
    try {
      // If it starts with http:// or https://, try to parse as URL
      if (url.startsWith("http://") || url.startsWith("https://")) {
        const urlObj = new URL(url);
        pathname = urlObj.pathname;
      } else {
        // For relative paths, use as is
        pathname = url;
      }
    } catch {
      // If URL parsing fails, treat as relative path
      pathname = url;
    }

    // Extract filename from path
    const pathParts = pathname.split("/");
    const filename = pathParts[pathParts.length - 1] || pathname || "file";

    // Extract extension
    const lastDotIndex = filename.lastIndexOf(".");
    const extension =
      lastDotIndex > 0
        ? filename.substring(lastDotIndex + 1).toLowerCase()
        : "";

    return { filename, extension };
  };

  const fileInfo = value && value.trim() ? getFileInfo(value) : null;

  const getFileTypeIcon = (extension: string) => {
    const imageExts = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"];
    const videoExts = ["mp4", "webm", "ogg", "mov", "avi"];
    const audioExts = ["mp3", "wav", "ogg", "m4a", "aac"];
    const docExts = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"];

    if (imageExts.includes(extension)) return "🖼️";
    if (videoExts.includes(extension)) return "🎥";
    if (audioExts.includes(extension)) return "🎵";
    if (docExts.includes(extension)) return "📄";
    return "📎";
  };

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/files/example.pdf"
          className={`${commonClasses} flex-1`}
          required={field.required}
        />
        <button
          type="button"
          onClick={onOpenMediaPicker}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap"
        >
          <File className="w-4 h-4" />
          Select from Media
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Enter file URL or select from Media (all file types)
      </p>
      {value && fileInfo && (
        <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-md">
          <div className="flex items-center gap-3">
            <div className="text-2xl">
              {getFileTypeIcon(fileInfo.extension)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {fileInfo.filename}
              </p>
              <p className="text-xs text-gray-500 uppercase">
                {fileInfo.extension || "unknown"} file
              </p>
            </div>
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Open file"
              aria-label="Open file in new tab"
            >
              <Download className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
