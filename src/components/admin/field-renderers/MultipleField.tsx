/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import {
  Plus,
  Trash2,
  GripVertical,
  Image as ImageIcon,
  File,
  Download,
} from "lucide-react";
import { FieldDefinition, MultipleItemField } from "@/lib/page-content-schema";
import { TextField } from "./TextField";
import { TextareaField } from "./TextareaField";
import { NumberField } from "./NumberField";
import { BooleanField } from "./BooleanField";
import { HtmlField } from "./HtmlField";
import { SelectField } from "./SelectField";
import { getImageUrl } from "@/lib/utils";

interface MultipleFieldProps {
  field: FieldDefinition;
  value: string;
  onChange: (value: string) => void;
  onOpenMediaPicker: (
    fieldKey: string,
    itemIndex: number,
    itemFieldKey: string,
    nestedIndex?: number,
    nestedFieldKey?: string
  ) => void;
  error?: string;
}

export function MultipleField({
  field,
  value,
  onChange,
  onOpenMediaPicker,
  error,
}: MultipleFieldProps) {
  if (!field.itemSchema || field.itemSchema.length === 0) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-yellow-800 text-sm">
          Multiple field requires itemSchema configuration
        </p>
      </div>
    );
  }

  // Helper function to transform nested structure to flat structure
  const transformNestedToFlat = (item: any): any => {
    // If item has nested content structure (old format), transform it
    if (item.content && typeof item.content === "object") {
      const transformed: any = {
        id: item.id || "",
        label: item.label || "",
        contentTitle: item.content.title || item.contentTitle || "",
        imageSrc: item.content.imageSrc || item.imageSrc || "",
        imageAlt: item.content.imageAlt || item.imageAlt || "",
        practicesTitle:
          item.content.practicesTitle || item.practicesTitle || "",
      };

      // Transform paragraphs array to string (separated by double newline)
      if (Array.isArray(item.content.paragraphs)) {
        transformed.paragraphs = item.content.paragraphs.join("\n\n");
      } else if (typeof item.content.paragraphs === "string") {
        transformed.paragraphs = item.content.paragraphs;
      } else if (item.paragraphs) {
        transformed.paragraphs = item.paragraphs;
      } else {
        transformed.paragraphs = "";
      }

      // Transform practices array to string (one JSON object per line)
      if (Array.isArray(item.content.practices)) {
        transformed.practices = item.content.practices
          .map((p: any) =>
            JSON.stringify({
              id: String(p.id || ""),
              text: String(p.text || ""),
            })
          )
          .join("\n");
      } else if (typeof item.content.practices === "string") {
        transformed.practices = item.content.practices;
      } else if (item.practices) {
        transformed.practices = item.practices;
      } else {
        transformed.practices = "";
      }

      return transformed;
    }

    // If already in flat format, return as is
    return item;
  };

  // Parse current value as JSON array
  let items: Record<string, any>[] = [];
  try {
    if (value && value.trim()) {
      const parsed = JSON.parse(value);
      // Ensure parsed value is an array
      if (Array.isArray(parsed)) {
        // Ensure all items in array are objects and transform if needed
        items = parsed.map((item) => {
          if (
            typeof item === "object" &&
            item !== null &&
            !Array.isArray(item)
          ) {
            // Transform nested structure to flat if needed
            return transformNestedToFlat(item);
          }
          // If item is not an object, return empty object
          return {};
        });
      } else {
        // If parsed value is not an array, reset to empty array
        items = [];
      }
    }
  } catch {
    // If parsing fails, reset to empty array
    items = [];
  }

  const handleMultipleAdd = () => {
    const newItem: Record<string, any> = {};
    field.itemSchema?.forEach((itemField) => {
      newItem[itemField.key] = itemField.defaultValue || "";
    });
    const newItems = [...items, newItem];
    onChange(JSON.stringify(newItems, null, 2));
  };

  const handleMultipleRemove = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(JSON.stringify(newItems, null, 2));
  };

  const handleMultipleItemChange = (
    index: number,
    itemFieldKey: string,
    itemValue: string
  ) => {
    // Ensure items is an array
    if (!Array.isArray(items)) {
      items = [];
    }

    const newItems = [...items];

    // Ensure the item at index is an object
    if (
      !newItems[index] ||
      typeof newItems[index] !== "object" ||
      Array.isArray(newItems[index])
    ) {
      newItems[index] = {};
    }

    // Now safely set the property
    newItems[index][itemFieldKey] = itemValue;
    onChange(JSON.stringify(newItems, null, 2));
  };

  const renderMultipleItemField = (
    itemField: MultipleItemField,
    itemValue: any,
    itemIndex: number
  ) => {
    // Ensure itemValue is an object
    const safeItemValue =
      typeof itemValue === "object" &&
        itemValue !== null &&
        !Array.isArray(itemValue)
        ? itemValue
        : {};

    const itemFieldValue =
      safeItemValue[itemField.key] || itemField.defaultValue || "";

    const itemCommonClasses = `w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-500" : "border-gray-300"
      }`;

    switch (itemField.type) {
      case "text":
      case "url":
      case "email":
        return (
          <TextField
            field={itemField as FieldDefinition}
            value={itemFieldValue}
            onChange={(val) =>
              handleMultipleItemChange(itemIndex, itemField.key, val)
            }
            error={error}
          />
        );

      case "textarea":
        return (
          <TextareaField
            field={itemField as FieldDefinition}
            value={itemFieldValue}
            onChange={(val) =>
              handleMultipleItemChange(itemIndex, itemField.key, val)
            }
            error={error}
          />
        );

      case "html":
        return (
          <HtmlField
            field={itemField as FieldDefinition}
            value={itemFieldValue}
            onChange={(val) =>
              handleMultipleItemChange(itemIndex, itemField.key, val)
            }
            onImageUpload={async (file: File): Promise<string> => {
              const formData = new FormData();
              formData.append("file", file);

              try {
                const response = await fetch("/api/admin/media/upload", {
                  method: "POST",
                  body: formData,
                });

                if (!response.ok) {
                  throw new Error("Upload failed");
                }

                const data = await response.json();
                return data.url;
              } catch (err) {
                console.error("Image upload error:", err);
                throw err;
              }
            }}
          />
        );

      case "image":
        return (
          <div>
            <div className="flex gap-2">
              <input
                type="text"
                value={itemFieldValue}
                onChange={(e) =>
                  handleMultipleItemChange(
                    itemIndex,
                    itemField.key,
                    e.target.value
                  )
                }
                placeholder="/images/example.jpg"
                className={`${itemCommonClasses} flex-1`}
                required={itemField.required}
              />
              <button
                type="button"
                onClick={() => {
                  onOpenMediaPicker(field.key, itemIndex, itemField.key);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap"
              >
                <ImageIcon className="w-4 h-4" />
                Select from Media
              </button>
            </div>
            {itemFieldValue && itemFieldValue.trim() && (
              <div className="mt-2">
                <Image
                  width={100}
                  height={100}
                  src={getImageUrl(itemFieldValue)}
                  alt="Preview"
                  className="max-w-xs h-auto rounded border"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  unoptimized={
                    !itemFieldValue.startsWith("http://") &&
                    !itemFieldValue.startsWith("https://") &&
                    !itemFieldValue.startsWith("/")
                  }
                />
              </div>
            )}
          </div>
        );

      case "number":
        return (
          <NumberField
            field={itemField as FieldDefinition}
            value={itemFieldValue}
            onChange={(val) =>
              handleMultipleItemChange(itemIndex, itemField.key, val)
            }
            error={error}
          />
        );

      case "file":
        // Helper to get file info
        const getFileInfo = (url: string) => {
          if (!url || !url.trim()) {
            return { filename: "", extension: "" };
          }

          let pathname = url;
          try {
            if (url.startsWith("http://") || url.startsWith("https://")) {
              const urlObj = new URL(url);
              pathname = urlObj.pathname;
            } else {
              pathname = url;
            }
          } catch {
            pathname = url;
          }

          const pathParts = pathname.split("/");
          const filename =
            pathParts[pathParts.length - 1] || pathname || "file";
          const lastDotIndex = filename.lastIndexOf(".");
          const extension =
            lastDotIndex > 0
              ? filename.substring(lastDotIndex + 1).toLowerCase()
              : "";

          return { filename, extension };
        };

        const fileInfo =
          itemFieldValue && itemFieldValue.trim()
            ? getFileInfo(itemFieldValue)
            : null;

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
                value={itemFieldValue}
                onChange={(e) =>
                  handleMultipleItemChange(
                    itemIndex,
                    itemField.key,
                    e.target.value
                  )
                }
                placeholder="/files/example.pdf"
                className={`${itemCommonClasses} flex-1`}
                required={itemField.required}
              />
              <button
                type="button"
                onClick={() => {
                  onOpenMediaPicker(field.key, itemIndex, itemField.key);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap"
              >
                <File className="w-4 h-4" />
                Select from Media
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter file URL or select from Media (all file types)
            </p>
            {itemFieldValue && fileInfo && (
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
                    href={itemFieldValue}
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

      case "boolean":
        return (
          <BooleanField
            field={itemField as FieldDefinition}
            value={itemFieldValue}
            onChange={(val) =>
              handleMultipleItemChange(itemIndex, itemField.key, val)
            }
          />
        );

      case "select":
        return (
          <SelectField
            field={itemField as FieldDefinition}
            value={itemFieldValue}
            onChange={(val) =>
              handleMultipleItemChange(itemIndex, itemField.key, val)
            }
            error={error}
          />
        );

      case "multiple":
        // Handle nested multiple field
        if (!itemField.itemSchema || itemField.itemSchema.length === 0) {
          return (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-yellow-800 text-sm">
                Nested multiple field requires itemSchema configuration
              </p>
            </div>
          );
        }

        // Parse nested items
        let nestedItems: Record<string, any>[] = [];
        try {
          if (itemFieldValue && typeof itemFieldValue === "string" && itemFieldValue.trim()) {
            const parsed = JSON.parse(itemFieldValue);
            if (Array.isArray(parsed)) {
              nestedItems = parsed;
            }
          }
        } catch {
          nestedItems = [];
        }

        const handleNestedAdd = () => {
          const newItem: Record<string, any> = {};
          itemField.itemSchema?.forEach((nestedField) => {
            newItem[nestedField.key] = nestedField.defaultValue || "";
          });
          const newItems = [...nestedItems, newItem];
          handleMultipleItemChange(
            itemIndex,
            itemField.key,
            JSON.stringify(newItems, null, 2)
          );
        };

        const handleNestedRemove = (nestedIndex: number) => {
          const newItems = nestedItems.filter((_, i) => i !== nestedIndex);
          handleMultipleItemChange(
            itemIndex,
            itemField.key,
            JSON.stringify(newItems, null, 2)
          );
        };

        const handleNestedItemChange = (
          nestedIndex: number,
          nestedFieldKey: string,
          nestedValue: string
        ) => {
          const newItems = [...nestedItems];
          if (!newItems[nestedIndex]) {
            newItems[nestedIndex] = {};
          }
          newItems[nestedIndex][nestedFieldKey] = nestedValue;
          handleMultipleItemChange(
            itemIndex,
            itemField.key,
            JSON.stringify(newItems, null, 2)
          );
        };

        return (
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-600">
                {itemField.helpText || "Manage nested items"}
              </p>
            </div>

            {nestedItems.length === 0 ? (
              <div className="p-4 text-center border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500 text-sm">
                  No items yet. Click &quot;Add {itemField.itemLabel || "Item"}&quot; to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {nestedItems.map((nestedItem, nestedIndex) => (
                  <div
                    key={nestedIndex}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-gray-400" />
                        <span className="text-xs font-medium text-gray-700">
                          {itemField.itemLabel || "Item"} {nestedIndex + 1}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleNestedRemove(nestedIndex)}
                        className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      {itemField.itemSchema?.map((nestedField) => {
                        const nestedFieldValue =
                          nestedItem[nestedField.key] || nestedField.defaultValue || "";

                        // Helper to get file info for file type
                        const getFileInfo = (url: string) => {
                          if (!url || !url.trim()) {
                            return { filename: "", extension: "" };
                          }

                          let pathname = url;
                          try {
                            if (url.startsWith("http://") || url.startsWith("https://")) {
                              const urlObj = new URL(url);
                              pathname = urlObj.pathname;
                            } else {
                              pathname = url;
                            }
                          } catch {
                            pathname = url;
                          }

                          const pathParts = pathname.split("/");
                          const filename =
                            pathParts[pathParts.length - 1] || pathname || "file";
                          const lastDotIndex = filename.lastIndexOf(".");
                          const extension =
                            lastDotIndex > 0
                              ? filename.substring(lastDotIndex + 1).toLowerCase()
                              : "";

                          return { filename, extension };
                        };

                        const fileInfo =
                          nestedField.type === "file" && nestedFieldValue && nestedFieldValue.trim()
                            ? getFileInfo(nestedFieldValue)
                            : null;

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
                          <div key={nestedField.key}>
                            <label className="block mb-1">
                              <span className="text-xs font-medium text-gray-700">
                                {nestedField.label}
                                {nestedField.required && (
                                  <span className="text-red-500 ml-1">*</span>
                                )}
                              </span>
                            </label>
                            {nestedField.type === "text" ||
                              nestedField.type === "url" ||
                              nestedField.type === "email" ? (
                              <input
                                type={nestedField.type === "email" ? "email" : "text"}
                                value={nestedFieldValue}
                                onChange={(e) =>
                                  handleNestedItemChange(
                                    nestedIndex,
                                    nestedField.key,
                                    e.target.value
                                  )
                                }
                                placeholder={nestedField.placeholder}
                                className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-500" : "border-gray-300"
                                  }`}
                                required={nestedField.required}
                              />
                            ) : nestedField.type === "textarea" ? (
                              <textarea
                                value={nestedFieldValue}
                                onChange={(e) =>
                                  handleNestedItemChange(
                                    nestedIndex,
                                    nestedField.key,
                                    e.target.value
                                  )
                                }
                                placeholder={nestedField.placeholder}
                                rows={3}
                                className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-500" : "border-gray-300"
                                  }`}
                                required={nestedField.required}
                              />
                            ) : nestedField.type === "file" ? (
                              <div>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={nestedFieldValue}
                                    onChange={(e) =>
                                      handleNestedItemChange(
                                        nestedIndex,
                                        nestedField.key,
                                        e.target.value
                                      )
                                    }
                                    placeholder={nestedField.placeholder || "/files/example.pdf"}
                                    className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 ${error ? "border-red-500" : "border-gray-300"
                                      }`}
                                    required={nestedField.required}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      // For nested multiple field, pass nestedIndex and nestedFieldKey
                                      // The handler will need to be updated to accept these parameters
                                      // For now, we'll use a workaround by passing them in the fieldKey
                                      onOpenMediaPicker(
                                        field.key,
                                        itemIndex,
                                        itemField.key,
                                        nestedIndex,
                                        nestedField.key
                                      );
                                    }}
                                    className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap text-sm"
                                  >
                                    <File className="w-4 h-4" />
                                    Select from Media
                                  </button>
                                </div>
                                {fileInfo && (
                                  <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded-md">
                                    <div className="flex items-center gap-2">
                                      <div className="text-lg">
                                        {getFileTypeIcon(fileInfo.extension)}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-gray-900 truncate">
                                          {fileInfo.filename}
                                        </p>
                                        <p className="text-xs text-gray-500 uppercase">
                                          {fileInfo.extension || "unknown"} file
                                        </p>
                                      </div>
                                      <a
                                        href={nestedFieldValue}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                        title="Open file"
                                        aria-label="Open file in new tab"
                                      >
                                        <Download className="w-3 h-3" />
                                      </a>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <input
                                type="text"
                                value={nestedFieldValue}
                                onChange={(e) =>
                                  handleNestedItemChange(
                                    nestedIndex,
                                    nestedField.key,
                                    e.target.value
                                  )
                                }
                                placeholder={nestedField.placeholder}
                                className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-500" : "border-gray-300"
                                  }`}
                                required={nestedField.required}
                              />
                            )}
                            {nestedField.helpText && (
                              <p className="text-xs text-gray-500 mt-1">
                                {nestedField.helpText}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={handleNestedAdd}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs font-medium mt-3 w-full"
            >
              <Plus className="w-3 h-3" />
              Add {itemField.itemLabel || "Item"}
            </button>
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={itemFieldValue}
            onChange={(e) =>
              handleMultipleItemChange(itemIndex, itemField.key, e.target.value)
            }
            className={itemCommonClasses}
          />
        );
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          {field.helpText || "Manage multiple items"}
        </p>
        <button
          type="button"
          onClick={handleMultipleAdd}
          className="items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium hidden"
        >
          <Plus className="w-4 h-4" />
          Add {field.itemLabel || "Item"}
        </button>
      </div>

      {items.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 text-sm">
            No items yet. Click &quot;Add {field.itemLabel || "Item"}&quot; to
            get started.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-6 bg-gray-50"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">
                    {field.itemLabel || "Item"} {index + 1}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleMultipleRemove(index)}
                  className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {field.itemSchema?.map((itemField) => (
                  <div key={itemField.key}>
                    <label className="block mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {itemField.label}
                        {itemField.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </span>
                    </label>
                    {renderMultipleItemField(itemField, item, index)}
                    {itemField.helpText && (
                      <p className="text-xs text-gray-500 mt-1">
                        {itemField.helpText}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={handleMultipleAdd}
        className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium mt-4 w-full text-center"
      >
        <Plus className="w-4 h-4" />
        Add {field.itemLabel || "Item"}
      </button>
    </div>
  );
}
