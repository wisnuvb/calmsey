/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import { Plus, Trash2, GripVertical, Image as ImageIcon } from "lucide-react";
import { FieldDefinition, MultipleItemField } from "@/lib/page-content-schema";
import { TextField } from "./TextField";
import { TextareaField } from "./TextareaField";
import { NumberField } from "./NumberField";
import { BooleanField } from "./BooleanField";
import { getImageUrl } from "@/lib/utils";

interface MultipleFieldProps {
  field: FieldDefinition;
  value: string;
  onChange: (value: string) => void;
  onOpenMediaPicker: (
    fieldKey: string,
    itemIndex: number,
    itemFieldKey: string
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

  // Parse current value as JSON array
  let items: Record<string, any>[] = [];
  try {
    if (value && value.trim()) {
      const parsed = JSON.parse(value);
      // Ensure parsed value is an array
      if (Array.isArray(parsed)) {
        // Ensure all items in array are objects
        items = parsed.map((item) => {
          if (
            typeof item === "object" &&
            item !== null &&
            !Array.isArray(item)
          ) {
            return item;
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

    const itemCommonClasses = `w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      error ? "border-red-500" : "border-gray-300"
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
