/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageType } from "@prisma/client";
import {
  getPageSchema,
  getFieldsBySection,
  validateFieldValue,
  type FieldDefinition,
} from "@/lib/page-content-schema";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import { useToast } from "@/components/ui/toast";
import {
  TextField,
  TextareaField,
  NumberField,
  HtmlField,
  ImageField,
  JsonField,
  BooleanField,
  ColorField,
  MultipleField,
  FileField,
  MarkdownField,
} from "@/components/admin/field-renderers";

interface PageContentEditorProps {
  pageType: PageType;
  language?: string;
  initialContent?: Record<string, string>;
  onSave?: (content: Record<string, string>) => void;
}

export function PageContentEditor({
  pageType,
  language = "en",
  initialContent = {},
  onSave,
}: PageContentEditorProps) {
  const router = useRouter();
  const [content, setContent] =
    useState<Record<string, string>>(initialContent);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [currentImageField, setCurrentImageField] = useState<string | null>(
    null
  );
  const [currentFileField, setCurrentFileField] = useState<string | null>(null);
  const [currentMultipleField, setCurrentMultipleField] = useState<{
    fieldKey: string;
    itemIndex: number;
    itemFieldKey: string;
  } | null>(null);

  const { addToast } = useToast();

  // Tab state
  const [activeTab, setActiveTab] = useState(0);

  const schema = getPageSchema(pageType);
  const fieldsBySection = getFieldsBySection(pageType);

  useEffect(() => {
    // Fetch existing content when component mounts
    fetchContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageType, language]);

  const fetchContent = async () => {
    try {
      const response = await fetch(
        `/api/admin/page-content/${pageType}?language=${language}`
      );
      if (response.ok) {
        const data = await response.json();
        setContent(data.content || {});
      }
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  };

  const handleChange = (key: string, value: string) => {
    setContent((prev) => ({ ...prev, [key]: value }));

    // Clear error for this field
    if (errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    if (!schema) return false;

    const newErrors: Record<string, string> = {};

    schema.fields.forEach((field) => {
      const value = content[field.key] || "";
      const validation = validateFieldValue(field, value);

      if (!validation.valid && validation.error) {
        newErrors[field.key] = validation.error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      // Find first tab with error
      if (schema) {
        for (let i = 0; i < schema.sections.length; i++) {
          const sectionName = schema.sections[i];
          const fields = fieldsBySection[sectionName] || [];
          const hasError = fields.some((field) => errors[field.key]);
          if (hasError) {
            setActiveTab(i);
            break;
          }
        }
      }

      addToast({
        type: "error",
        title: "Validation Failed",
        description: "Please fix the errors before saving.",
        duration: 4000,
      });
      return;
    }

    setSaving(true);
    setSaveSuccess(false);

    try {
      const response = await fetch(`/api/admin/page-content/${pageType}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save content");
      }

      setSaveSuccess(true);

      addToast({
        type: "success",
        title: "Content Saved!",
        description: "Your changes have been saved successfully.",
        duration: 3000,
      });

      if (onSave) {
        onSave(content);
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      addToast({
        type: "error",
        title: "Save Failed",
        description: "Failed to save content. Please try again.",
        duration: 4000,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
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
  };

  const renderField = (field: FieldDefinition) => {
    const value = content[field.key] || field.defaultValue || "";
    const error = errors[field.key];

    const handleFieldChange = (newValue: string) => {
      handleChange(field.key, newValue);
    };

    const handleImageFieldOpen = () => {
      setCurrentImageField(field.key);
      setCurrentFileField(null);
      setMediaPickerOpen(true);
    };

    const handleFileFieldOpen = () => {
      setCurrentFileField(field.key);
      setCurrentImageField(null);
      setMediaPickerOpen(true);
    };

    const handleMultipleFieldOpen = (
      fieldKey: string,
      itemIndex: number,
      itemFieldKey: string
    ) => {
      setCurrentMultipleField({
        fieldKey,
        itemIndex,
        itemFieldKey,
      });
      setCurrentImageField(null);
      setCurrentFileField(null);
      setMediaPickerOpen(true);
    };

    switch (field.type) {
      case "text":
      case "url":
      case "email":
      case "phone":
        return (
          <TextField
            field={field}
            value={value}
            onChange={handleFieldChange}
            error={error}
          />
        );

      case "number":
        return (
          <NumberField
            field={field}
            value={value}
            onChange={handleFieldChange}
            error={error}
          />
        );

      case "textarea":
        return (
          <TextareaField
            field={field}
            value={value}
            onChange={handleFieldChange}
            error={error}
          />
        );

      case "markdown":
        return (
          <MarkdownField
            field={field}
            value={value}
            onChange={handleFieldChange}
            error={error}
          />
        );

      case "html":
        return (
          <HtmlField
            field={field}
            value={value}
            onChange={handleFieldChange}
            onImageUpload={handleImageUpload}
          />
        );

      case "image":
        return (
          <ImageField
            field={field}
            value={value}
            onChange={handleFieldChange}
            onOpenMediaPicker={handleImageFieldOpen}
            error={error}
          />
        );

      case "file":
        return (
          <FileField
            field={field}
            value={value}
            onChange={handleFieldChange}
            onOpenMediaPicker={handleFileFieldOpen}
            error={error}
          />
        );

      case "json":
        return (
          <JsonField
            field={field}
            value={value}
            onChange={handleFieldChange}
            error={error}
          />
        );

      case "boolean":
        return (
          <BooleanField
            field={field}
            value={value}
            onChange={handleFieldChange}
          />
        );

      case "color":
        return (
          <ColorField
            field={field}
            value={value}
            onChange={handleFieldChange}
            error={error}
          />
        );

      case "multiple":
        return (
          <MultipleField
            field={field}
            value={value}
            onChange={handleFieldChange}
            onOpenMediaPicker={handleMultipleFieldOpen}
            error={error}
          />
        );

      default:
        return (
          <TextField
            field={field}
            value={value}
            onChange={handleFieldChange}
            error={error}
          />
        );
    }
  };

  // Check if section has errors
  const sectionHasErrors = (sectionName: string): boolean => {
    const fields = fieldsBySection[sectionName] || [];
    return fields.some((field) => errors[field.key]);
  };

  if (!schema) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-yellow-800">
          No schema found for page type: {pageType}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Edit {pageType.replace(/_/g, " ")} Page
        </h1>
        <p className="text-gray-600">
          Update content for this page. Changes will be reflected on the
          frontend immediately.
        </p>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-green-600 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-green-800 font-medium">
              Content saved successfully!
            </span>
          </div>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav
            className="-mb-px flex space-x-4 overflow-x-auto"
            aria-label="Tabs"
          >
            {schema.sections.map((sectionName, index) => {
              const fields = fieldsBySection[sectionName] || [];
              if (fields.length === 0) return null;

              const isActive = activeTab === index;
              const hasErrors = sectionHasErrors(sectionName);

              return (
                <button
                  key={sectionName}
                  type="button"
                  onClick={() => setActiveTab(index)}
                  className={`
                    whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors
                    ${
                      isActive
                        ? "border-blue-600 text-blue-600"
                        : hasErrors
                        ? "border-red-300 text-red-600 hover:border-red-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }
                  `}
                >
                  <span className="flex items-center gap-2">
                    {sectionName}
                    {hasErrors && (
                      <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                        !
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 min-h-[500px]">
          {schema.sections.map((sectionName, index) => {
            const fields = fieldsBySection[sectionName] || [];
            if (fields.length === 0 || activeTab !== index) return null;

            return (
              <div key={sectionName} className="space-y-6">
                {/* Section Title */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {sectionName}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Configure the content for this section
                  </p>
                </div>

                {/* Section Fields */}
                {fields.map((field) => (
                  <div
                    key={field.key}
                    className="pb-6 border-b border-gray-100 last:border-0"
                  >
                    {field.type !== "boolean" && (
                      <label className="block mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {field.label}
                          {field.required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </span>
                      </label>
                    )}

                    {renderField(field)}

                    {/* Help Text */}
                    {field.helpText && field.type !== "html" && (
                      <p className="text-xs text-gray-500 mt-1">
                        {field.helpText}
                      </p>
                    )}

                    {/* Error Message */}
                    {errors[field.key] && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <span className="font-bold">⚠</span>
                        {errors[field.key]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-6 mt-8 flex items-center justify-between z-50">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>

            {/* Tab Navigation Buttons */}
            <div className="flex gap-2">
              {activeTab > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab - 1)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  ← Previous
                </button>
              )}
              {activeTab < schema.sections.length - 1 && (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab + 1)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Next →
                </button>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => {
          setMediaPickerOpen(false);
          setCurrentImageField(null);
          setCurrentFileField(null);
          setCurrentMultipleField(null);
        }}
        onSelect={(selectedUrls) => {
          if (currentMultipleField && selectedUrls.length > 0) {
            // Handle multiple field
            const field = schema?.fields.find(
              (f) => f.key === currentMultipleField.fieldKey
            );
            if (field?.type === "multiple" && field.itemSchema) {
              let items: Record<string, any>[] = [];
              try {
                const currentValue =
                  content[currentMultipleField.fieldKey] || "[]";
                items = JSON.parse(currentValue);
                if (!Array.isArray(items)) items = [];
              } catch {
                items = [];
              }

              if (items[currentMultipleField.itemIndex]) {
                items[currentMultipleField.itemIndex][
                  currentMultipleField.itemFieldKey
                ] = selectedUrls[0];
                handleChange(
                  currentMultipleField.fieldKey,
                  JSON.stringify(items, null, 2)
                );
              }
            }
          } else if (currentFileField && selectedUrls.length > 0) {
            // Handle file field - all file types
            handleChange(currentFileField, selectedUrls[0]);
          } else if (currentImageField && selectedUrls.length > 0) {
            // Handle regular image field
            handleChange(currentImageField, selectedUrls[0]);
          }
        }}
        mode="single"
        allowedTypes={
          currentFileField
            ? ["all"]
            : currentMultipleField
            ? (() => {
                // Check if the current field in multiple is file type
                const field = schema?.fields.find(
                  (f) => f.key === currentMultipleField.fieldKey
                );
                const itemField = field?.itemSchema?.find(
                  (f) => f.key === currentMultipleField.itemFieldKey
                );
                return itemField?.type === "file" ? ["all"] : ["images"];
              })()
            : ["images"]
        }
        initialFilter={
          currentFileField
            ? "all"
            : currentMultipleField
            ? (() => {
                // Check if the current field in multiple is file type
                const field = schema?.fields.find(
                  (f) => f.key === currentMultipleField.fieldKey
                );
                const itemField = field?.itemSchema?.find(
                  (f) => f.key === currentMultipleField.itemFieldKey
                );
                return itemField?.type === "file" ? "all" : "images";
              })()
            : "images"
        }
      />
    </div>
  );
}
