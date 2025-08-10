/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/template-system/template-utils.ts
import { Template, PageSection, TemplateAsset } from "@/types/page-builder";

export class TemplateUtils {
  /**
   * Generate unique section IDs
   */
  static generateSectionId(): string {
    return `sect_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate unique template ID
   */
  static generateTemplateId(): string {
    return `tmpl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Calculate template file size
   */
  static calculateTemplateSize(template: Template): number {
    const templateJson = JSON.stringify(template);
    return new Blob([templateJson]).size;
  }

  /**
   * Extract all text content from template for search indexing
   */
  static extractSearchableContent(template: Template): string {
    const content: string[] = [];

    // Basic template info
    content.push(template.name);
    if (template.description) content.push(template.description);
    if (template.subcategory) content.push(template.subcategory);
    content.push(...template.tags);

    // Section content
    template.sections.forEach((section) => {
      section.translations.forEach((translation) => {
        if (translation.title) content.push(translation.title);
        if (translation.subtitle) content.push(translation.subtitle);
        if (translation.content) {
          // Strip HTML tags for search
          const strippedContent = translation.content.replace(/<[^>]*>/g, "");
          content.push(strippedContent);
        }
      });
    });

    return content.join(" ").toLowerCase();
  }

  /**
   * Validate template structure
   */
  static isValidTemplateStructure(template: any): boolean {
    return (
      typeof template === "object" &&
      typeof template.name === "string" &&
      typeof template.category === "string" &&
      Array.isArray(template.sections) &&
      Array.isArray(template.tags) &&
      Array.isArray(template.assets)
    );
  }

  /**
   * Clean template for export (remove sensitive data)
   */
  static cleanTemplateForExport(template: Template): Partial<Template> {
    const {
      id,
      author,
      createdAt,
      updatedAt,
      downloadCount,
      viewCount,
      rating,
      ratingCount,
      ...cleanTemplate
    } = template;

    return {
      ...cleanTemplate,
      sections: template.sections.map((section) => ({
        ...section,
        id: this.generateSectionId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    };
  }

  /**
   * Merge template translations
   */
  static mergeTemplateTranslations(
    originalTemplate: Template,
    translatedTemplate: Partial<Template>
  ): Template {
    const merged = { ...originalTemplate };

    if (translatedTemplate.sections) {
      merged.sections = originalTemplate.sections.map((originalSection) => {
        const translatedSection = translatedTemplate.sections?.find(
          (s) =>
            s.type === originalSection.type && s.order === originalSection.order
        );

        if (translatedSection && translatedSection.translations) {
          return {
            ...originalSection,
            translations: [
              ...originalSection.translations,
              ...translatedSection.translations,
            ],
          };
        }

        return originalSection;
      });
    }

    return merged;
  }

  /**
   * Get template statistics
   */
  static getTemplateStats(template: Template) {
    const sectionTypes = new Map<string, number>();
    let totalTranslations = 0;
    let totalAssetSize = 0;

    template.sections.forEach((section) => {
      const count = sectionTypes.get(section.type) || 0;
      sectionTypes.set(section.type, count + 1);
      totalTranslations += section.translations.length;
    });

    template.assets.forEach((asset) => {
      totalAssetSize += asset.size;
    });

    return {
      sectionCount: template.sections.length,
      sectionTypes: Object.fromEntries(sectionTypes),
      translationCount: totalTranslations,
      assetCount: template.assets.length,
      totalAssetSize,
      estimatedFileSize: this.calculateTemplateSize(template),
    };
  }

  /**
   * Compare two templates for changes
   */
  static compareTemplates(template1: Template, template2: Template) {
    const changes: string[] = [];

    if (template1.name !== template2.name) {
      changes.push("name");
    }
    if (template1.description !== template2.description) {
      changes.push("description");
    }
    if (template1.category !== template2.category) {
      changes.push("category");
    }
    if (JSON.stringify(template1.tags) !== JSON.stringify(template2.tags)) {
      changes.push("tags");
    }
    if (template1.sections.length !== template2.sections.length) {
      changes.push("sections");
    }
    if (template1.assets.length !== template2.assets.length) {
      changes.push("assets");
    }

    return changes;
  }

  /**
   * Generate template preview data
   */
  static generatePreviewData(template: Template) {
    const firstSection = template.sections[0];
    const firstTranslation = firstSection?.translations[0];

    return {
      title: template.name,
      description:
        template.description || firstTranslation?.title || "No description",
      previewImage: template.previewImage || template.previewImages[0],
      sectionCount: template.sections.length,
      category: template.category,
      difficulty: template.difficulty,
      tags: template.tags.slice(0, 5), // Show max 5 tags
      author: template.author.name,
    };
  }

  /**
   * Validate asset references in template
   */
  static validateAssetReferences(template: Template): string[] {
    const missingAssets: string[] = [];
    const assetUrls = new Set(template.assets.map((asset) => asset.url));

    const checkContent = (content: string) => {
      // Extract image URLs from content
      const imageRegex = /<img[^>]+src=["']([^"']+)["']/g;
      let match;
      while ((match = imageRegex.exec(content)) !== null) {
        const url = match[1];
        if (!assetUrls.has(url) && !url.startsWith("http")) {
          missingAssets.push(url);
        }
      }

      // Extract CSS background images
      const cssRegex = /background-image:\s*url\(['"]?([^'"]+)['"]?\)/g;
      while ((match = cssRegex.exec(content)) !== null) {
        const url = match[1];
        if (!assetUrls.has(url) && !url.startsWith("http")) {
          missingAssets.push(url);
        }
      }
    };

    // Check section content
    template.sections.forEach((section) => {
      section.translations.forEach((translation) => {
        if (translation.content) {
          checkContent(translation.content);
        }
      });

      // Check custom CSS
      if (section.customSettings?.customCSS) {
        checkContent(section.customSettings.customCSS);
      }
    });

    // Check global styles
    if (template.globalStyles?.customCSS) {
      checkContent(template.globalStyles.customCSS);
    }

    return [...new Set(missingAssets)];
  }
}

// src/lib/template-system/template-config.ts
export const TEMPLATE_CONFIG = {
  // File size limits
  MAX_TEMPLATE_SIZE: 50 * 1024 * 1024, // 50MB
  MAX_ASSET_SIZE: 10 * 1024 * 1024, // 10MB per asset
  MAX_TOTAL_ASSETS: 100,

  // Content limits
  MAX_SECTIONS: 100,
  MAX_TRANSLATIONS_PER_SECTION: 10,
  MAX_TEMPLATE_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 1000,
  MAX_TAGS: 20,

  // Security settings
  ALLOWED_HTML_TAGS: [
    "div",
    "span",
    "p",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "a",
    "img",
    "ul",
    "ol",
    "li",
    "br",
    "hr",
    "strong",
    "em",
    "blockquote",
    "code",
    "pre",
    "table",
    "thead",
    "tbody",
    "tr",
    "td",
    "th",
    "section",
    "article",
    "header",
    "footer",
  ],

  ALLOWED_CSS_PROPERTIES: [
    "color",
    "background-color",
    "background-image",
    "background-size",
    "background-position",
    "background-repeat",
    "font-family",
    "font-size",
    "font-weight",
    "text-align",
    "text-decoration",
    "line-height",
    "margin",
    "padding",
    "border",
    "border-radius",
    "width",
    "height",
    "max-width",
    "max-height",
    "min-width",
    "min-height",
    "display",
    "position",
    "top",
    "right",
    "bottom",
    "left",
    "z-index",
    "opacity",
    "transform",
    "transition",
    "animation",
    "box-shadow",
    "text-shadow",
  ],

  // Asset types
  SUPPORTED_IMAGE_TYPES: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ],
  SUPPORTED_VIDEO_TYPES: ["video/mp4", "video/webm", "video/ogg"],
  SUPPORTED_AUDIO_TYPES: ["audio/mp3", "audio/wav", "audio/ogg"],
  SUPPORTED_FONT_TYPES: ["font/woff", "font/woff2", "font/ttf", "font/otf"],

  // Template categories
  CATEGORIES: {
    HOMEPAGE: { label: "Homepage", icon: "🏠" },
    ABOUT_PAGE: { label: "About Page", icon: "👥" },
    SERVICE_PAGE: { label: "Service Page", icon: "🛠️" },
    CONTACT_PAGE: { label: "Contact Page", icon: "📞" },
    PORTFOLIO: { label: "Portfolio", icon: "💼" },
    BLOG_LISTING: { label: "Blog Listing", icon: "📝" },
    BLOG_SINGLE: { label: "Blog Single", icon: "📄" },
    HERO_SECTIONS: { label: "Hero Sections", icon: "🎯" },
    CONTENT_BLOCKS: { label: "Content Blocks", icon: "🧱" },
    FOOTER_VARIANTS: { label: "Footer Variants", icon: "🦶" },
    HEADER_VARIANTS: { label: "Header Variants", icon: "🗂️" },
    CARD_DESIGNS: { label: "Card Designs", icon: "🃏" },
    FORM_LAYOUTS: { label: "Form Layouts", icon: "📋" },
    FULL_WEBSITE: { label: "Full Website", icon: "🌐" },
    INDUSTRY_SPECIFIC: { label: "Industry Specific", icon: "🏭" },
  },

  // Difficulty levels
  DIFFICULTIES: {
    BEGINNER: {
      label: "Beginner",
      color: "green",
      description: "Easy to customize",
    },
    INTERMEDIATE: {
      label: "Intermediate",
      color: "yellow",
      description: "Some technical knowledge required",
    },
    ADVANCED: {
      label: "Advanced",
      color: "red",
      description: "Advanced customization skills needed",
    },
  },

  // Status types
  STATUSES: {
    DRAFT: { label: "Draft", color: "gray" },
    REVIEW: { label: "Under Review", color: "yellow" },
    APPROVED: { label: "Approved", color: "blue" },
    PUBLISHED: { label: "Published", color: "green" },
    REJECTED: { label: "Rejected", color: "red" },
    ARCHIVED: { label: "Archived", color: "gray" },
  },
};

// src/lib/template-system/template-constants.ts
export const TEMPLATE_ERRORS = {
  INVALID_FORMAT: "Invalid template format",
  SIZE_TOO_LARGE: "Template size exceeds maximum limit",
  INVALID_SECTIONS: "Template contains invalid sections",
  SECURITY_VIOLATION: "Template contains security violations",
  MISSING_REQUIRED_FIELDS: "Template is missing required fields",
  INVALID_ASSETS: "Template contains invalid assets",
  COMPATIBILITY_ERROR: "Template version is not compatible",
  IMPORT_FAILED: "Failed to import template",
  EXPORT_FAILED: "Failed to export template",
  VALIDATION_FAILED: "Template validation failed",
};

export const TEMPLATE_SUCCESS_MESSAGES = {
  CREATED: "Template created successfully",
  UPDATED: "Template updated successfully",
  DELETED: "Template deleted successfully",
  IMPORTED: "Template imported successfully",
  EXPORTED: "Template exported successfully",
  CLONED: "Template cloned successfully",
  PUBLISHED: "Template published successfully",
  ARCHIVED: "Template archived successfully",
};

// src/lib/template-system/template-validators.ts
export class TemplateValidators {
  static validateTemplateName(name: string): string | null {
    if (!name || name.trim().length === 0) {
      return "Template name is required";
    }
    if (name.length > TEMPLATE_CONFIG.MAX_TEMPLATE_NAME_LENGTH) {
      return `Template name must be less than ${TEMPLATE_CONFIG.MAX_TEMPLATE_NAME_LENGTH} characters`;
    }
    return null;
  }

  static validateTemplateDescription(description?: string): string | null {
    if (
      description &&
      description.length > TEMPLATE_CONFIG.MAX_DESCRIPTION_LENGTH
    ) {
      return `Description must be less than ${TEMPLATE_CONFIG.MAX_DESCRIPTION_LENGTH} characters`;
    }
    return null;
  }

  static validateTemplateTags(tags: string[]): string | null {
    if (tags.length > TEMPLATE_CONFIG.MAX_TAGS) {
      return `Maximum ${TEMPLATE_CONFIG.MAX_TAGS} tags allowed`;
    }

    for (const tag of tags) {
      if (tag.length > 50) {
        return "Tag must be less than 50 characters";
      }
      if (!/^[a-zA-Z0-9\s-_]+$/.test(tag)) {
        return "Tags can only contain letters, numbers, spaces, hyphens, and underscores";
      }
    }

    return null;
  }

  static validateSectionCount(sectionCount: number): string | null {
    if (sectionCount > TEMPLATE_CONFIG.MAX_SECTIONS) {
      return `Maximum ${TEMPLATE_CONFIG.MAX_SECTIONS} sections allowed`;
    }
    return null;
  }

  static validateAssetSize(size: number): string | null {
    if (size > TEMPLATE_CONFIG.MAX_ASSET_SIZE) {
      return `Asset size must be less than ${Math.round(
        TEMPLATE_CONFIG.MAX_ASSET_SIZE / 1024 / 1024
      )}MB`;
    }
    return null;
  }

  static validateAssetType(
    mimeType: string,
    type: "image" | "video" | "audio" | "font"
  ): string | null {
    const allowedTypes = {
      image: TEMPLATE_CONFIG.SUPPORTED_IMAGE_TYPES,
      video: TEMPLATE_CONFIG.SUPPORTED_VIDEO_TYPES,
      audio: TEMPLATE_CONFIG.SUPPORTED_AUDIO_TYPES,
      font: TEMPLATE_CONFIG.SUPPORTED_FONT_TYPES,
    };

    if (!allowedTypes[type].includes(mimeType)) {
      return `Unsupported ${type} type: ${mimeType}`;
    }

    return null;
  }
}

// src/lib/template-system/template-formatters.ts
export class TemplateFormatters {
  static formatFileSize(bytes: number): string {
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  static formatTemplateCategory(category: string): string {
    return (
      TEMPLATE_CONFIG.CATEGORIES[
        category as keyof typeof TEMPLATE_CONFIG.CATEGORIES
      ]?.label || category
    );
  }

  static formatTemplateDifficulty(difficulty: string): string {
    return (
      TEMPLATE_CONFIG.DIFFICULTIES[
        difficulty as keyof typeof TEMPLATE_CONFIG.DIFFICULTIES
      ]?.label || difficulty
    );
  }

  static formatTemplateStatus(status: string): string {
    return (
      TEMPLATE_CONFIG.STATUSES[status as keyof typeof TEMPLATE_CONFIG.STATUSES]
        ?.label || status
    );
  }

  static formatDownloadCount(count: number): string {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  }

  static formatRating(rating: number | null): string {
    if (rating === null || rating === undefined) {
      return "No rating";
    }
    return `${rating.toFixed(1)} ⭐`;
  }

  static formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  static formatRelativeTime(date: Date | string): string {
    const now = new Date();
    const then = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "just now";
    }
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    }
    if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }

    return this.formatDate(date);
  }
}

// Export all utilities
// export {
//   TemplateUtils,
//   TEMPLATE_CONFIG,
//   TEMPLATE_ERRORS,
//   TEMPLATE_SUCCESS_MESSAGES,
//   TemplateValidators,
//   TemplateFormatters,
// };
