'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageType } from '@prisma/client';
import {
  getPageSchema,
  getFieldsBySection,
  validateFieldValue,
  type FieldDefinition,
} from '@/lib/page-content-schema';

interface PageContentEditorProps {
  pageType: PageType;
  language?: string;
  initialContent?: Record<string, string>;
  onSave?: (content: Record<string, string>) => void;
}

export function PageContentEditor({
  pageType,
  language = 'en',
  initialContent = {},
  onSave,
}: PageContentEditorProps) {
  const router = useRouter();
  const [content, setContent] = useState<Record<string, string>>(initialContent);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const schema = getPageSchema(pageType);
  const fieldsBySection = getFieldsBySection(pageType);

  useEffect(() => {
    // Fetch existing content when component mounts
    fetchContent();
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
      console.error('Error fetching content:', error);
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
      const value = content[field.key] || '';
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
      return;
    }

    setSaving(true);
    setSaveSuccess(false);

    try {
      const response = await fetch(`/api/admin/page-content/${pageType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save content');
      }

      setSaveSuccess(true);

      if (onSave) {
        onSave(content);
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Failed to save content. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const renderField = (field: FieldDefinition) => {
    const value = content[field.key] || field.defaultValue || '';
    const error = errors[field.key];

    const commonClasses = `w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      error ? 'border-red-500' : 'border-gray-300'
    }`;

    switch (field.type) {
      case 'text':
      case 'url':
      case 'email':
      case 'phone':
        return (
          <input
            type={field.type === 'url' ? 'url' : field.type === 'email' ? 'email' : 'text'}
            value={value}
            onChange={(e) => handleChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className={commonClasses}
            required={field.required}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            min={field.validation?.min}
            max={field.validation?.max}
            className={commonClasses}
            required={field.required}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className={commonClasses}
            required={field.required}
          />
        );

      case 'html':
        return (
          <div>
            <textarea
              value={value}
              onChange={(e) => handleChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              rows={10}
              className={`${commonClasses} font-mono text-sm`}
              required={field.required}
            />
            <p className="text-xs text-gray-500 mt-1">
              HTML content - you can use a rich text editor later
            </p>
          </div>
        );

      case 'image':
        return (
          <div>
            <input
              type="text"
              value={value}
              onChange={(e) => handleChange(field.key, e.target.value)}
              placeholder="/images/example.jpg"
              className={commonClasses}
              required={field.required}
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter image URL or upload via Media Library
            </p>
            {value && (
              <div className="mt-2">
                <img
                  src={value}
                  alt="Preview"
                  className="max-w-xs h-auto rounded border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        );

      case 'json':
        return (
          <div>
            <textarea
              value={value}
              onChange={(e) => handleChange(field.key, e.target.value)}
              placeholder='{"key": "value"}'
              rows={6}
              className={`${commonClasses} font-mono text-sm`}
              required={field.required}
            />
            <p className="text-xs text-gray-500 mt-1">
              JSON format - must be valid JSON
            </p>
          </div>
        );

      case 'boolean':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={value === 'true' || value === '1'}
              onChange={(e) => handleChange(field.key, e.target.checked ? 'true' : 'false')}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm text-gray-700">
              {field.label}
            </label>
          </div>
        );

      case 'color':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={value || '#000000'}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="w-12 h-10 border rounded cursor-pointer"
            />
            <input
              type="text"
              value={value}
              onChange={(e) => handleChange(field.key, e.target.value)}
              placeholder="#000000"
              className={commonClasses}
              pattern="^#[0-9A-Fa-f]{6}$"
            />
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(field.key, e.target.value)}
            className={commonClasses}
          />
        );
    }
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
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Edit {pageType.replace(/_/g, ' ')} Page
        </h1>
        <p className="text-gray-600">
          Update content for this page. Changes will be reflected on the frontend immediately.
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
        {/* Render fields grouped by section */}
        {schema.sections.map((sectionName) => {
          const fields = fieldsBySection[sectionName] || [];

          if (fields.length === 0) return null;

          return (
            <div key={sectionName} className="mb-8">
              {/* Section Header */}
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                {sectionName}
              </h2>

              {/* Section Fields */}
              <div className="space-y-6">
                {fields.map((field) => (
                  <div key={field.key}>
                    {field.type !== 'boolean' && (
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
                    {field.helpText && (
                      <p className="text-xs text-gray-500 mt-1">
                        {field.helpText}
                      </p>
                    )}

                    {/* Error Message */}
                    {errors[field.key] && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors[field.key]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-6 -mb-6 mt-8">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
