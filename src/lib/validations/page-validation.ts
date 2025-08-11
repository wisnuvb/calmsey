/* eslint-disable @typescript-eslint/no-explicit-any */

import { PageTemplate, PageStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export interface PageValidationRule {
  template: PageTemplate;
  maxInstances?: number;
  requiresUniqueSlug?: boolean;
  restrictedSlugs?: string[];
  autoGenerateSlug?: boolean;
  defaultStatus?: PageStatus;
  customValidation?: (data: any) => Promise<string[]>;
}

export const PAGE_VALIDATION_RULES: Record<PageTemplate, PageValidationRule> = {
  LANDING: {
    template: "LANDING",
    maxInstances: 1, // Only one landing page (home)
    requiresUniqueSlug: true,
    restrictedSlugs: ["home", "", "/"],
    autoGenerateSlug: false,
    defaultStatus: "DRAFT",
    customValidation: async (data) => {
      const errors: string[] = [];

      // Check if landing page already exists
      const existingLanding = await prisma.page.findFirst({
        where: {
          template: "LANDING",
          status: { in: ["PUBLISHED", "DRAFT"] },
          ...(data.id ? { id: { not: data.id } } : {}),
        },
      });

      if (existingLanding) {
        errors.push(
          "Only one landing page is allowed. Please update the existing one or set it to archived."
        );
      }

      // Landing page must have root slug or 'home'
      if (data.slug && !["", "/", "home"].includes(data.slug)) {
        errors.push('Landing page must have root slug (/) or "home"');
      }

      return errors;
    },
  },

  CONTACT: {
    template: "CONTACT",
    maxInstances: 3, // Allow multiple contact pages (different languages/purposes)
    requiresUniqueSlug: true,
    restrictedSlugs: [],
    autoGenerateSlug: true,
    defaultStatus: "DRAFT",
    customValidation: async (data) => {
      const errors: string[] = [];

      // Contact page should have contact-related slug
      if (
        data.slug &&
        !data.slug.includes("contact") &&
        !data.slug.includes("kontak")
      ) {
        errors.push('Contact page slug should contain "contact" or "kontak"');
      }

      return errors;
    },
  },

  ABOUT: {
    template: "ABOUT",
    maxInstances: 2, // One for each language
    requiresUniqueSlug: true,
    restrictedSlugs: [],
    autoGenerateSlug: true,
    defaultStatus: "DRAFT",
  },

  BASIC: {
    template: "BASIC",
    maxInstances: undefined, // Unlimited
    requiresUniqueSlug: true,
    restrictedSlugs: ["admin", "api", "auth", "dashboard"],
    autoGenerateSlug: true,
    defaultStatus: "DRAFT",
  },

  FULL_WIDTH: {
    template: "FULL_WIDTH",
    maxInstances: undefined, // Unlimited
    requiresUniqueSlug: true,
    restrictedSlugs: ["admin", "api", "auth", "dashboard"],
    autoGenerateSlug: true,
    defaultStatus: "DRAFT",
  },

  CUSTOM: {
    template: "CUSTOM",
    maxInstances: undefined, // Unlimited
    requiresUniqueSlug: true,
    restrictedSlugs: ["admin", "api", "auth", "dashboard"],
    autoGenerateSlug: false,
    defaultStatus: "DRAFT",
  },
};

export class PageValidationService {
  static async validatePageCreation(data: {
    template: PageTemplate;
    slug: string;
    status: PageStatus;
    id?: string;
  }): Promise<{ valid: boolean; errors: string[]; warnings: string[] }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    const rule = PAGE_VALIDATION_RULES[data.template];
    if (!rule) {
      errors.push(`Invalid page template: ${data.template}`);
      return { valid: false, errors, warnings };
    }

    // Check max instances
    if (rule.maxInstances !== undefined) {
      const existingCount = await prisma.page.count({
        where: {
          template: data.template,
          status: { in: ["PUBLISHED", "DRAFT"] },
          ...(data.id ? { id: { not: data.id } } : {}),
        },
      });

      if (existingCount >= rule.maxInstances) {
        errors.push(
          `Maximum ${
            rule.maxInstances
          } ${data.template.toLowerCase()} page(s) allowed`
        );
      }
    }

    // Check restricted slugs
    if (rule.restrictedSlugs?.includes(data.slug)) {
      errors.push(`Slug "${data.slug}" is reserved and cannot be used`);
    }

    // Check slug uniqueness
    if (rule.requiresUniqueSlug) {
      const existingPage = await prisma.page.findFirst({
        where: {
          slug: data.slug,
          ...(data.id ? { id: { not: data.id } } : {}),
        },
      });

      if (existingPage) {
        errors.push(`Page with slug "${data.slug}" already exists`);
      }
    }

    // Run custom validation
    if (rule.customValidation) {
      const customErrors = await rule.customValidation(data);
      errors.push(...customErrors);
    }

    // Generate warnings
    if (data.template === "LANDING" && data.status === "PUBLISHED") {
      const otherPublishedPages = await prisma.page.count({
        where: {
          status: "PUBLISHED",
          template: { not: "LANDING" },
          ...(data.id ? { id: { not: data.id } } : {}),
        },
      });

      if (otherPublishedPages === 0) {
        warnings.push("Publishing landing page without other content pages");
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  static async generateSuggestedSlug(
    template: PageTemplate,
    title: string
  ): Promise<string> {
    const rule = PAGE_VALIDATION_RULES[template];

    // For landing page, always suggest root
    if (template === "LANDING") {
      return "/";
    }

    // Generate base slug from title
    let baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    // Add template prefix for certain types
    if (template === "CONTACT" && !baseSlug.includes("contact")) {
      baseSlug = `contact-${baseSlug}`;
    }
    if (template === "ABOUT" && !baseSlug.includes("about")) {
      baseSlug = `about-${baseSlug}`;
    }

    // Ensure uniqueness
    let finalSlug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await prisma.page.findFirst({
        where: { slug: finalSlug },
      });

      if (!existing) break;

      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    return finalSlug;
  }

  static getTemplateRestrictions(template: PageTemplate): {
    description: string;
    maxInstances?: number;
    examples: string[];
  } {
    const rule = PAGE_VALIDATION_RULES[template];

    const restrictions: Record<PageTemplate, any> = {
      LANDING: {
        description: "Main homepage/landing page. Only one allowed per site.",
        maxInstances: 1,
        examples: ["/", "/home"],
      },
      CONTACT: {
        description: "Contact pages with forms and contact information.",
        maxInstances: 3,
        examples: ["/contact", "/kontak", "/contact-us"],
      },
      ABOUT: {
        description: "About pages describing company/organization.",
        maxInstances: 2,
        examples: ["/about", "/tentang", "/about-us"],
      },
      BASIC: {
        description: "Standard content pages with flexible layouts.",
        examples: ["/services", "/products", "/blog"],
      },
      FULL_WIDTH: {
        description: "Full-width pages without sidebar constraints.",
        examples: ["/portfolio", "/gallery", "/showcase"],
      },
      CUSTOM: {
        description: "Fully customizable pages with advanced features.",
        examples: ["/custom-landing", "/special-page"],
      },
    };

    return restrictions[template];
  }
}

// Usage in API routes and forms:
/*
// In page creation API
const validation = await PageValidationService.validatePageCreation({
  template: 'LANDING',
  slug: '/',
  status: 'PUBLISHED'
});

if (!validation.valid) {
  return res.status(400).json({ errors: validation.errors });
}

// Generate suggested slug
const suggestedSlug = await PageValidationService.generateSuggestedSlug(
  'CONTACT', 
  'Contact Us Form'
);
*/
