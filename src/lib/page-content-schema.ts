/**
 * Page Content Schema Definitions
 * Defines editable fields for each page type in the CMS
 */

export type ContentFieldType =
  | "text"
  | "textarea"
  | "html"
  | "image"
  | "number"
  | "url"
  | "email"
  | "phone"
  | "json"
  | "color"
  | "boolean";

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
}

export type PageContentSchema = {
  pageType: string;
  fields: FieldDefinition[];
  sections: string[]; // Order of sections for display
};

/**
 * HOME Page Schema
 */
const HOME_SCHEMA: PageContentSchema = {
  pageType: "HOME",
  sections: [
    "Hero",
    "Why TurningTides",
    "Where We Work",
    "Latest Articles",
    "Strategy",
  ],
  fields: [
    // Hero Section
    {
      key: "hero.title",
      label: "Hero Title",
      type: "text",
      section: "Hero",
      required: true,
      placeholder: "Welcome to TurningTides",
      helpText: "Main headline displayed in the hero section",
    },
    {
      key: "hero.subtitle",
      label: "Hero Subtitle",
      type: "textarea",
      section: "Hero",
      placeholder: "Protecting coastal communities worldwide",
    },
    {
      key: "hero.backgroundImage",
      label: "Hero Background Image",
      type: "image",
      section: "Hero",
      helpText: "Recommended size: 1920x1080px",
    },
    {
      key: "hero.ctaText",
      label: "CTA Button Text",
      type: "text",
      section: "Hero",
      defaultValue: "Learn More",
    },
    {
      key: "hero.ctaLink",
      label: "CTA Button Link",
      type: "text",
      section: "Hero",
      defaultValue: "/about-us",
    },

    // Why TurningTides Section
    {
      key: "whyUs.title",
      label: "Section Title",
      type: "text",
      section: "Why TurningTides",
      defaultValue: "Why TurningTides",
    },
    {
      key: "whyUs.content",
      label: "Section Content",
      type: "html",
      section: "Why TurningTides",
      helpText: "Use the rich text editor to format content",
    },

    // Where We Work Section
    {
      key: "whereWeWork.title",
      label: "Section Title",
      type: "text",
      section: "Where We Work",
      defaultValue: "Where We Work",
    },
    {
      key: "whereWeWork.description",
      label: "Description",
      type: "textarea",
      section: "Where We Work",
    },
    {
      key: "whereWeWork.mapImage",
      label: "Map Image",
      type: "image",
      section: "Where We Work",
      helpText: "Map showing regions of operation",
    },

    // Latest Articles Section
    {
      key: "articles.title",
      label: "Section Title",
      type: "text",
      section: "Latest Articles",
      defaultValue: "Latest Articles",
    },
    {
      key: "articles.limit",
      label: "Number of Articles to Display",
      type: "number",
      section: "Latest Articles",
      defaultValue: "6",
      validation: { min: 1, max: 12 },
    },

    // Strategy Download Section
    {
      key: "strategy.title",
      label: "Section Title",
      type: "text",
      section: "Strategy",
      defaultValue: "Download Our Strategy",
    },
    {
      key: "strategy.description",
      label: "Description",
      type: "textarea",
      section: "Strategy",
    },
    {
      key: "strategy.downloadUrl",
      label: "PDF Download URL",
      type: "url",
      section: "Strategy",
      helpText: "Link to the strategy PDF file",
    },
    {
      key: "strategy.buttonText",
      label: "Download Button Text",
      type: "text",
      section: "Strategy",
      defaultValue: "Download PDF",
    },
  ],
};

/**
 * ABOUT US Page Schema
 */
const ABOUT_US_SCHEMA: PageContentSchema = {
  pageType: "ABOUT_US",
  sections: [
    "Hero",
    "Our Vision",
    "What We Want to Achieve",
    "Our Goal",
    "Team",
    "Support",
  ],
  fields: [
    // Hero Section
    {
      key: "hero.title",
      label: "Page Title",
      type: "text",
      section: "Hero",
      required: true,
      placeholder: "About Us",
    },
    {
      key: "hero.backgroundImage",
      label: "Hero Background Image",
      type: "image",
      section: "Hero",
    },

    // Our Vision Section
    {
      key: "vision.title",
      label: "Vision Title",
      type: "text",
      section: "Our Vision",
      defaultValue: "Our Vision",
    },
    {
      key: "vision.content",
      label: "Vision Content",
      type: "html",
      section: "Our Vision",
    },

    // What We Want to Achieve Section
    {
      key: "achieve.title",
      label: "Section Title",
      type: "text",
      section: "What We Want to Achieve",
    },
    {
      key: "achieve.content",
      label: "Content",
      type: "html",
      section: "What We Want to Achieve",
    },

    // Our Goal Section
    {
      key: "goal.title",
      label: "Goal Title",
      type: "text",
      section: "Our Goal",
    },
    {
      key: "goal.content",
      label: "Goal Content",
      type: "html",
      section: "Our Goal",
    },

    // Team Section
    {
      key: "team.title",
      label: "Team Section Title",
      type: "text",
      section: "Team",
      defaultValue: "Our Team",
    },
    {
      key: "team.members",
      label: "Team Members (JSON)",
      type: "json",
      section: "Team",
      helpText: "Array of team member objects with name, role, image, bio",
    },

    // Support Section
    {
      key: "support.title",
      label: "Support Title",
      type: "text",
      section: "Support",
    },
    {
      key: "support.content",
      label: "Support Content",
      type: "html",
      section: "Support",
    },
  ],
};

/**
 * CONTACT Page Schema
 */
const CONTACT_SCHEMA: PageContentSchema = {
  pageType: "CONTACT",
  sections: ["Hero", "Contact Information", "Office Hours"],
  fields: [
    // Hero
    {
      key: "hero.title",
      label: "Page Title",
      type: "text",
      section: "Hero",
      required: true,
      defaultValue: "Contact Us",
    },
    {
      key: "hero.description",
      label: "Page Description",
      type: "textarea",
      section: "Hero",
    },

    // Contact Information
    {
      key: "contact.email",
      label: "Email Address",
      type: "email",
      section: "Contact Information",
      required: true,
      placeholder: "info@turningtides.org",
    },
    {
      key: "contact.phone",
      label: "Phone Number",
      type: "phone",
      section: "Contact Information",
      placeholder: "+1 (555) 123-4567",
    },
    {
      key: "contact.address",
      label: "Physical Address",
      type: "textarea",
      section: "Contact Information",
    },
    {
      key: "contact.mapEmbed",
      label: "Google Maps Embed Code",
      type: "textarea",
      section: "Contact Information",
      helpText: "Paste the iframe embed code from Google Maps",
    },

    // Office Hours
    {
      key: "hours.weekdays",
      label: "Weekday Hours",
      type: "text",
      section: "Office Hours",
      defaultValue: "8:00 AM - 6:00 PM",
    },
    {
      key: "hours.saturday",
      label: "Saturday Hours",
      type: "text",
      section: "Office Hours",
      defaultValue: "9:00 AM - 4:00 PM",
    },
    {
      key: "hours.sunday",
      label: "Sunday Hours",
      type: "text",
      section: "Office Hours",
      defaultValue: "Closed",
    },
  ],
};

/**
 * OUR WORK Page Schema
 */
const OUR_WORK_SCHEMA: PageContentSchema = {
  pageType: "OUR_WORK",
  sections: ["Hero", "Case Studies", "Approach", "Stories"],
  fields: [
    {
      key: "hero.title",
      label: "Page Title",
      type: "text",
      section: "Hero",
      required: true,
    },
    {
      key: "hero.backgroundImage",
      label: "Hero Background",
      type: "image",
      section: "Hero",
    },
    {
      key: "approach.title",
      label: "Approach Title",
      type: "text",
      section: "Approach",
    },
    {
      key: "approach.content",
      label: "Approach Content",
      type: "html",
      section: "Approach",
    },
    {
      key: "stories.title",
      label: "Stories Section Title",
      type: "text",
      section: "Stories",
    },
  ],
};

/**
 * GOVERNANCE Page Schema
 */
const GOVERNANCE_SCHEMA: PageContentSchema = {
  pageType: "GOVERNANCE",
  sections: ["Hero", "Values", "Guiding Principles", "Funders", "Committees"],
  fields: [
    {
      key: "hero.title",
      label: "Page Title",
      type: "text",
      section: "Hero",
      required: true,
    },
    {
      key: "values.title",
      label: "Values Title",
      type: "text",
      section: "Values",
    },
    {
      key: "values.content",
      label: "Values Content",
      type: "html",
      section: "Values",
    },
    {
      key: "principles.title",
      label: "Principles Title",
      type: "text",
      section: "Guiding Principles",
    },
    {
      key: "principles.content",
      label: "Principles Content",
      type: "html",
      section: "Guiding Principles",
    },
  ],
};

/**
 * GET INVOLVED Page Schema
 */
const GET_INVOLVED_SCHEMA: PageContentSchema = {
  pageType: "GET_INVOLVED",
  sections: ["Hero", "How to Help", "Opportunities", "Contact CTA"],
  fields: [
    {
      key: "hero.title",
      label: "Page Title",
      type: "text",
      section: "Hero",
      required: true,
    },
    {
      key: "hero.subtitle",
      label: "Hero Subtitle",
      type: "textarea",
      section: "Hero",
    },
    {
      key: "help.title",
      label: "How to Help Title",
      type: "text",
      section: "How to Help",
    },
    {
      key: "help.content",
      label: "How to Help Content",
      type: "html",
      section: "How to Help",
    },
    {
      key: "cta.title",
      label: "CTA Title",
      type: "text",
      section: "Contact CTA",
    },
    {
      key: "cta.buttonText",
      label: "CTA Button Text",
      type: "text",
      section: "Contact CTA",
      defaultValue: "Get in Touch",
    },
  ],
};

/**
 * All Page Schemas
 */
export const PAGE_CONTENT_SCHEMAS: Record<string, PageContentSchema> = {
  HOME: HOME_SCHEMA,
  ABOUT_US: ABOUT_US_SCHEMA,
  CONTACT: CONTACT_SCHEMA,
  OUR_WORK: OUR_WORK_SCHEMA,
  GOVERNANCE: GOVERNANCE_SCHEMA,
  GET_INVOLVED: GET_INVOLVED_SCHEMA,
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
