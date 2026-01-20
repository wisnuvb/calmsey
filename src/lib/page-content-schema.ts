/**
 * Page Content Schema Definitions
 * Defines editable fields for each page type in the CMS
 */

import {
  ABOUT_US_SCHEMA,
  CONTACT_SCHEMA,
  GET_INVOLVED_SCHEMA,
  GOVERNANCE_SCHEMA,
  HOME_SCHEMA,
  OUR_APPROACH_SCHEMA,
  OUR_FUND_SCHEMA,
  PARTNER_STORIES_SCHEMA,
} from "./schema";

export type ContentFieldType =
  | "text"
  | "file"
  | "textarea"
  | "html"
  | "image"
  | "number"
  | "url"
  | "email"
  | "phone"
  | "json"
  | "color"
  | "boolean"
  | "multiple"
  | "markdown";

export interface MultipleItemField {
  key: string;
  label: string;
  type:
    | "text"
    | "textarea"
    | "html"
    | "image"
    | "number"
    | "url"
    | "email"
    | "boolean"
    | "file"
    | "multiple";
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  defaultValue?: string;
  itemSchema?: MultipleItemField[]; // For nested multiple fields
  itemLabel?: string; // Label for nested multiple items
}

export interface FieldDefinition {
  key: string;
  label: string;
  type: ContentFieldType;
  section: string; // Group fields by section for better UX
  required?: boolean;
  defaultValue?: string;
  helpText?: string;
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  // For multiple type fields
  itemSchema?: MultipleItemField[]; // Schema for each item in the array
  itemLabel?: string; // Label for each item (e.g., "Image", "Story", "Partner")
}

export type PageContentSchema = {
  pageType: string;
  fields: FieldDefinition[];
  sections: string[]; // Order of sections for display
};

/**
 * All Page Schemas
 */
export const PAGE_CONTENT_SCHEMAS: Record<string, PageContentSchema> = {
  HOME: HOME_SCHEMA,
  ABOUT_US: ABOUT_US_SCHEMA,
  CONTACT: CONTACT_SCHEMA,
  OUR_APPROACH: OUR_APPROACH_SCHEMA,
  OUR_FUND: OUR_FUND_SCHEMA,
  GOVERNANCE: GOVERNANCE_SCHEMA,
  GET_INVOLVED: GET_INVOLVED_SCHEMA,
  STORIES: PARTNER_STORIES_SCHEMA,
};

/**
 * Get schema for a specific page type
 */
export function getPageSchema(pageType: string): PageContentSchema | null {
  return PAGE_CONTENT_SCHEMAS[pageType] || null;
}

/**
 * Get fields grouped by section
 */
export function getFieldsBySection(
  pageType: string
): Record<string, FieldDefinition[]> {
  const schema = getPageSchema(pageType);
  if (!schema) return {};

  const grouped: Record<string, FieldDefinition[]> = {};

  schema.fields.forEach((field) => {
    if (!grouped[field.section]) {
      grouped[field.section] = [];
    }
    grouped[field.section].push(field);
  });

  return grouped;
}

/**
 * Validate field value against its definition
 */
export function validateFieldValue(
  field: FieldDefinition,
  value: string
): { valid: boolean; error?: string } {
  // Required check
  if (field.required && !value) {
    return { valid: false, error: `${field.label} is required` };
  }

  // Type-specific validation
  switch (field.type) {
    case "email":
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        return { valid: false, error: "Invalid email address" };
      }
      break;

    case "url":
      try {
        if (value && !value.startsWith("/")) {
          new URL(value);
        }
      } catch {
        return { valid: false, error: "Invalid URL" };
      }
      break;

    case "number":
      const num = Number(value);
      if (value && isNaN(num)) {
        return { valid: false, error: "Must be a number" };
      }
      if (field.validation?.min !== undefined && num < field.validation.min) {
        return {
          valid: false,
          error: `Must be at least ${field.validation.min}`,
        };
      }
      if (field.validation?.max !== undefined && num > field.validation.max) {
        return {
          valid: false,
          error: `Must be at most ${field.validation.max}`,
        };
      }
      break;

    case "json":
      if (value) {
        try {
          JSON.parse(value);
        } catch {
          return { valid: false, error: "Invalid JSON format" };
        }
      }
      break;
  }

  return { valid: true };
}
