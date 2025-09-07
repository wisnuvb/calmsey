/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DesignBlockConfig,
  DesignBlockVariant,
  DESIGN_BLOCK_REGISTRY,
} from "@/lib/design-blocks/design-block-registry";
import { PageSection, PageSectionType } from "@/types/page-builder";
import { Brandkit } from "@/types/brandkit";

export interface TemplateDesignBlock {
  blockType: PageSectionType;
  variantId?: string;
  order: number;
  settings: {
    layout: any;
    style: any;
    responsive: any;
    animation: any;
    content: any;
    custom: any;
  };
  translations: Array<{
    languageId: string;
    title?: string;
    subtitle?: string;
    content?: string;
    metadata?: Record<string, any>;
  }>;
}

export interface EnhancedTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;

  // Template composition
  designBlocks: TemplateDesignBlock[];
  layout: {
    type: "single-column" | "two-column" | "multi-column" | "custom";
    containerWidth: "full" | "container" | "wide" | "narrow";
    spacing: "tight" | "normal" | "loose" | "custom";
  };

  // Design system integration
  brandkitId?: string;
  brandkitSettings: {
    applyColors: boolean;
    applyTypography: boolean;
    applySpacing: boolean;
    preserveCustomizations: boolean;
  };

  // Template metadata
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  tags: string[];
  version: string;

  // Usage and analytics
  downloadCount: number;
  rating?: number;
  ratingCount: number;

  // Author info
  author: {
    id: string;
    name: string;
  };

  createdAt: Date;
  updatedAt: Date;
}

export class TemplateDesignBlockService {
  /**
   * Create template from design blocks
   */
  static async createTemplateFromBlocks(
    templateData: {
      name: string;
      description: string;
      category: string;
      subcategory?: string;
      authorId: string;
    },
    designBlocks: Array<{
      blockType: PageSectionType;
      variantId?: string;
      customSettings?: any;
      content?: any;
    }>,
    brandkitId?: string
  ): Promise<EnhancedTemplate> {
    const templateBlocks: TemplateDesignBlock[] = [];

    // Process each design block
    for (let i = 0; i < designBlocks.length; i++) {
      const blockRequest = designBlocks[i];
      const blockConfig = DESIGN_BLOCK_REGISTRY[blockRequest.blockType];

      if (!blockConfig) {
        throw new Error(`Unknown block type: ${blockRequest.blockType}`);
      }

      // Get variant settings if specified
      let variantSettings = {};
      if (blockRequest.variantId) {
        const variant = blockConfig.variants.find(
          (v) => v.id === blockRequest.variantId
        );
        if (variant) {
          variantSettings = {
            ...variant.styleOverrides,
            ...variant.layoutOverrides,
            ...variant.contentDefaults,
          };
        }
      }

      // Merge settings: defaults < variant < custom
      const blockSettings = {
        layout: {
          ...blockConfig.defaultSettings.layout,
          ...(variantSettings as any).layout,
          ...blockRequest.customSettings?.layout,
        },
        style: {
          ...blockConfig.defaultSettings.style,
          ...(variantSettings as any).style,
          ...blockRequest.customSettings?.style,
        },
        responsive: {
          ...blockConfig.defaultSettings.responsive,
          ...(variantSettings as any).responsive,
          ...blockRequest.customSettings?.responsive,
        },
        animation: {
          ...blockConfig.defaultSettings.animation,
          ...(variantSettings as any).animation,
          ...blockRequest.customSettings?.animation,
        },
        content: {
          ...blockConfig.defaultSettings.content,
          ...(variantSettings as any).content,
          ...blockRequest.content,
        },
        custom: blockRequest.customSettings?.custom || {},
      };

      // Create default translations
      const translations = [
        {
          languageId: "en",
          title: blockConfig.previewData.title || blockConfig.name,
          subtitle: "",
          content:
            blockRequest.content?.text || blockConfig.previewData.content || "",
          metadata:
            blockRequest.content?.metadata ||
            blockConfig.previewData.metadata ||
            {},
        },
      ];

      templateBlocks.push({
        blockType: blockRequest.blockType,
        variantId: blockRequest.variantId,
        order: i,
        settings: blockSettings,
        translations,
      });
    }

    // Create template structure
    const template: EnhancedTemplate = {
      id: `template_${Date.now()}`,
      name: templateData.name,
      description: templateData.description,
      category: templateData.category,
      subcategory: templateData.subcategory,
      designBlocks: templateBlocks,
      layout: {
        type: "single-column",
        containerWidth: "container",
        spacing: "normal",
      },
      brandkitId,
      brandkitSettings: {
        applyColors: true,
        applyTypography: true,
        applySpacing: true,
        preserveCustomizations: false,
      },
      difficulty: "BEGINNER",
      tags: [],
      version: "1.0.0",
      downloadCount: 0,
      rating: 0,
      ratingCount: 0,
      author: {
        id: templateData.authorId,
        name: "Template Author",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return template;
  }

  /**
   * Convert template to page sections
   */
  static convertTemplateToPageSections(
    template: EnhancedTemplate,
    languageId: string = "en"
  ): PageSection[] {
    const sections: PageSection[] = [];

    template.designBlocks.forEach((block, index) => {
      const translation =
        block.translations.find((t) => t.languageId === languageId) ||
        block.translations[0];

      const section: PageSection = {
        id: `section_${Date.now()}_${index}`,
        type: block.blockType,
        order: block.order,
        isActive: true,
        layoutSettings: block.settings.layout,
        styleSettings: block.settings.style,
        responsiveSettings: block.settings.responsive,
        animationSettings: block.settings.animation,
        contentSettings: block.settings.content,
        customSettings: block.settings.custom,
        pageId: "", // Will be set when creating actual page
        translations: [translation] as any,
      };

      sections.push(section);
    });

    return sections;
  }

  /**
   * Apply brandkit to template
   */
  static async applyBrandkitToTemplate(
    template: EnhancedTemplate,
    brandkit: Brandkit,
    options: {
      applyColors?: boolean;
      applyTypography?: boolean;
      applySpacing?: boolean;
      preserveCustomizations?: boolean;
    } = {}
  ): Promise<EnhancedTemplate> {
    const updatedTemplate = { ...template };

    // Update brandkit settings
    updatedTemplate.brandkitSettings = {
      ...updatedTemplate.brandkitSettings,
      ...options,
    };
    updatedTemplate.brandkitId = brandkit.id;

    // Apply brandkit to each design block
    updatedTemplate.designBlocks = updatedTemplate.designBlocks.map((block) => {
      const updatedBlock = { ...block };

      // Apply brandkit colors
      if (options.applyColors !== false) {
        if (updatedBlock.settings.style.background?.type === "color") {
          updatedBlock.settings.style.background.color =
            brandkit.colors.neutral[0];
        }
        if (updatedBlock.settings.style.textColor) {
          updatedBlock.settings.style.textColor = brandkit.colors.neutral[900];
        }
        if (updatedBlock.settings.style.linkColor) {
          updatedBlock.settings.style.linkColor = brandkit.colors.primary[600];
        }
      }

      // Apply brandkit typography
      if (options.applyTypography !== false) {
        const blockConfig = DESIGN_BLOCK_REGISTRY[block.blockType];
        if (blockConfig) {
          // Apply appropriate typography based on block type
          if (
            block.blockType.includes("HEADING") ||
            block.blockType.includes("HERO")
          ) {
            updatedBlock.settings.style.typography = {
              ...updatedBlock.settings.style.typography,
              fontFamily: brandkit.typography.fontFamilies.heading,
              fontWeight: brandkit.typography.fontFamilies.heading.weights[0],
            };
          } else {
            updatedBlock.settings.style.typography = {
              ...updatedBlock.settings.style.typography,
              fontFamily: brandkit.typography.fontFamilies.body,
              fontSize: brandkit.typography.fontFamilies.body.weights[0],
              lineHeight: brandkit.typography.fontFamilies.body.lineHeight,
            };
          }
        }
      }

      // Apply brandkit spacing
      if (options.applySpacing !== false) {
        // Apply consistent spacing from brandkit
        const spacingScale = brandkit.spacing.scale;
        if (updatedBlock.settings.layout.padding) {
          updatedBlock.settings.layout.padding = spacingScale[4]; // Default medium spacing
        }
        if (updatedBlock.settings.layout.margin) {
          updatedBlock.settings.layout.margin = spacingScale[2]; // Default small margin
        }
      }

      return updatedBlock;
    });

    updatedTemplate.updatedAt = new Date();

    return updatedTemplate;
  }

  /**
   * Get template preview data
   */
  static getTemplatePreview(template: EnhancedTemplate): {
    sections: Array<{
      type: string;
      name: string;
      preview: string;
    }>;
    stats: {
      totalBlocks: number;
      blockTypes: string[];
      hasAnimation: boolean;
      hasResponsive: boolean;
    };
  } {
    const sections = template.designBlocks.map((block) => {
      const config = DESIGN_BLOCK_REGISTRY[block.blockType];
      const translation = block.translations[0];

      return {
        type: block.blockType,
        name: config?.name || "Unknown Block",
        preview:
          translation?.content || config?.previewData.content || "No preview",
      };
    });

    const blockTypes = [
      ...new Set(template.designBlocks.map((block) => block.blockType)),
    ];
    const hasAnimation = template.designBlocks.some(
      (block) => Object.keys(block.settings.animation || {}).length > 0
    );
    const hasResponsive = template.designBlocks.some(
      (block) => Object.keys(block.settings.responsive || {}).length > 0
    );

    return {
      sections,
      stats: {
        totalBlocks: template.designBlocks.length,
        blockTypes,
        hasAnimation,
        hasResponsive,
      },
    };
  }

  /**
   * Clone template with modifications
   */
  static cloneTemplate(
    template: EnhancedTemplate,
    modifications: {
      name?: string;
      description?: string;
      authorId?: string;
      designBlockChanges?: Array<{
        blockIndex: number;
        variantId?: string;
        settings?: any;
      }>;
    }
  ): EnhancedTemplate {
    const clonedTemplate: EnhancedTemplate = {
      ...template,
      id: `template_${Date.now()}_clone`,
      name: modifications.name || `${template.name} (Copy)`,
      description: modifications.description || template.description,
      downloadCount: 0,
      rating: 0,
      ratingCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (modifications.authorId) {
      clonedTemplate.author = {
        ...clonedTemplate.author,
        id: modifications.authorId,
      };
    }

    // Apply design block modifications
    if (modifications.designBlockChanges) {
      modifications.designBlockChanges.forEach((change) => {
        if (clonedTemplate.designBlocks[change.blockIndex]) {
          const block = clonedTemplate.designBlocks[change.blockIndex];

          if (change.variantId) {
            block.variantId = change.variantId;
          }

          if (change.settings) {
            block.settings = {
              ...block.settings,
              ...change.settings,
            };
          }
        }
      });
    }

    return clonedTemplate;
  }
}

// Template categories with design block recommendations
export const TEMPLATE_CATEGORIES_WITH_BLOCKS = {
  HOMEPAGE: {
    label: "Homepage",
    icon: "🏠",
    recommendedBlocks: [
      PageSectionType.NAVIGATION_BLOCK,
      PageSectionType.HERO,
      PageSectionType.FEATURED_CONTENT,
      PageSectionType.TESTIMONIALS,
      PageSectionType.CTA_BLOCK,
      PageSectionType.FOOTER_BLOCK,
    ],
    variants: ["corporate", "startup", "portfolio", "ecommerce"],
  },

  ABOUT_PAGE: {
    label: "About Page",
    icon: "👥",
    recommendedBlocks: [
      PageSectionType.NAVIGATION_BLOCK,
      PageSectionType.BREADCRUMB_BLOCK,
      PageSectionType.HERO,
      PageSectionType.RICH_TEXT,
      PageSectionType.TEAM_SHOWCASE,
      PageSectionType.TIMELINE,
      PageSectionType.FOOTER_BLOCK,
    ],
    variants: ["personal", "company", "team", "story"],
  },

  SERVICE_PAGE: {
    label: "Service Page",
    icon: "🛠️",
    recommendedBlocks: [
      PageSectionType.NAVIGATION_BLOCK,
      PageSectionType.BREADCRUMB_BLOCK,
      PageSectionType.HERO,
      PageSectionType.FEATURED_CONTENT,
      PageSectionType.PRICING_TABLE,
      PageSectionType.TESTIMONIALS,
      PageSectionType.CTA_BLOCK,
      PageSectionType.FOOTER_BLOCK,
    ],
    variants: ["consulting", "saas", "agency", "freelance"],
  },

  CONTACT_PAGE: {
    label: "Contact Page",
    icon: "📞",
    recommendedBlocks: [
      PageSectionType.NAVIGATION_BLOCK,
      PageSectionType.BREADCRUMB_BLOCK,
      PageSectionType.HERO,
      PageSectionType.CONTACT_FORM,
      PageSectionType.MAP_EMBED,
      PageSectionType.RICH_TEXT,
      PageSectionType.FOOTER_BLOCK,
    ],
    variants: ["simple", "detailed", "multi-location", "appointment"],
  },

  BLOG_LISTING: {
    label: "Blog Listing",
    icon: "📝",
    recommendedBlocks: [
      PageSectionType.NAVIGATION_BLOCK,
      PageSectionType.BREADCRUMB_BLOCK,
      PageSectionType.HERO,
      PageSectionType.ARTICLE_LIST,
      PageSectionType.SIDEBAR_BLOCK,
      PageSectionType.PAGINATION_BLOCK,
      PageSectionType.FOOTER_BLOCK,
    ],
    variants: ["grid", "list", "magazine", "minimal"],
  },

  BLOG_SINGLE: {
    label: "Blog Single",
    icon: "📄",
    recommendedBlocks: [
      PageSectionType.NAVIGATION_BLOCK,
      PageSectionType.BREADCRUMB_BLOCK,
      PageSectionType.RICH_TEXT,
      PageSectionType.SIDEBAR_BLOCK,
      PageSectionType.SUBSCRIPTION_FORM,
      PageSectionType.FOOTER_BLOCK,
    ],
    variants: ["standard", "featured-image", "full-width", "minimal"],
  },

  PORTFOLIO: {
    label: "Portfolio",
    icon: "💼",
    recommendedBlocks: [
      PageSectionType.NAVIGATION_BLOCK,
      PageSectionType.HERO,
      PageSectionType.IMAGE_GALLERY,
      PageSectionType.FEATURED_CONTENT,
      PageSectionType.TESTIMONIALS,
      PageSectionType.CTA_BLOCK,
      PageSectionType.FOOTER_BLOCK,
    ],
    variants: ["creative", "corporate", "photography", "design"],
  },

  LANDING_PAGE: {
    label: "Landing Page",
    icon: "🎯",
    recommendedBlocks: [
      PageSectionType.NAVIGATION_BLOCK,
      PageSectionType.HERO,
      PageSectionType.FEATURED_CONTENT,
      PageSectionType.TESTIMONIALS,
      PageSectionType.PRICING_TABLE,
      PageSectionType.CTA_BLOCK,
      PageSectionType.FOOTER_BLOCK,
    ],
    variants: ["product", "event", "course", "download"],
  },
};

// Template builder helper
export class TemplateBuilder {
  private template: Partial<EnhancedTemplate>;
  private designBlocks: TemplateDesignBlock[];

  constructor(name: string, category: string) {
    this.template = {
      name,
      category,
      designBlocks: [],
      layout: {
        type: "single-column",
        containerWidth: "container",
        spacing: "normal",
      },
      brandkitSettings: {
        applyColors: true,
        applyTypography: true,
        applySpacing: true,
        preserveCustomizations: false,
      },
      difficulty: "BEGINNER",
      tags: [],
      version: "1.0.0",
      downloadCount: 0,
      rating: 0,
      ratingCount: 0,
    };
    this.designBlocks = [];
  }

  addBlock(
    blockType: PageSectionType,
    options: {
      variantId?: string;
      customSettings?: any;
      content?: any;
    } = {}
  ): TemplateBuilder {
    const blockConfig = DESIGN_BLOCK_REGISTRY[blockType];
    if (!blockConfig) {
      throw new Error(`Unknown block type: ${blockType}`);
    }

    // Get variant settings
    let variantSettings = {};
    if (options.variantId) {
      const variant = blockConfig.variants.find(
        (v) => v.id === options.variantId
      );
      if (variant) {
        variantSettings = {
          layout: variant.layoutOverrides,
          style: variant.styleOverrides,
          content: variant.contentDefaults,
        };
      }
    }

    // Create block
    const block: TemplateDesignBlock = {
      blockType,
      variantId: options.variantId,
      order: this.designBlocks.length,
      settings: {
        layout: {
          ...blockConfig.defaultSettings.layout,
          ...(variantSettings as any).layout,
          ...options.customSettings?.layout,
        },
        style: {
          ...blockConfig.defaultSettings.style,
          ...(variantSettings as any).style,
          ...options.customSettings?.style,
        },
        responsive: {
          ...blockConfig.defaultSettings.responsive,
          ...options.customSettings?.responsive,
        },
        animation: {
          ...blockConfig.defaultSettings.animation,
          ...options.customSettings?.animation,
        },
        content: {
          ...blockConfig.defaultSettings.content,
          ...(variantSettings as any).content,
          ...options.content,
        },
        custom: options.customSettings?.custom || {},
      },
      translations: [
        {
          languageId: "en",
          title: options.content?.title || blockConfig.previewData.title,
          subtitle: options.content?.subtitle || "",
          content:
            options.content?.text || blockConfig.previewData.content || "",
          metadata:
            options.content?.metadata || blockConfig.previewData.metadata || {},
        },
      ],
    };

    this.designBlocks.push(block);
    return this;
  }

  setLayout(
    type: "single-column" | "two-column" | "multi-column" | "custom",
    options: {
      containerWidth?: "full" | "container" | "wide" | "narrow";
      spacing?: "tight" | "normal" | "loose" | "custom";
    } = {}
  ): TemplateBuilder {
    this.template.layout = {
      type,
      containerWidth: options.containerWidth || "container",
      spacing: options.spacing || "normal",
    };
    return this;
  }

  setBrandkitSettings(settings: {
    applyColors?: boolean;
    applyTypography?: boolean;
    applySpacing?: boolean;
    preserveCustomizations?: boolean;
  }): TemplateBuilder {
    this.template.brandkitSettings = {
      ...this.template.brandkitSettings!,
      ...settings,
    };
    return this;
  }

  setMetadata(metadata: {
    description?: string;
    difficulty?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    tags?: string[];
    subcategory?: string;
  }): TemplateBuilder {
    Object.assign(this.template, metadata);
    return this;
  }

  build(authorId: string): EnhancedTemplate {
    const now = new Date();

    return {
      id: `template_${Date.now()}`,
      name: this.template.name!,
      description: this.template.description || "",
      category: this.template.category!,
      subcategory: this.template.subcategory,
      designBlocks: this.designBlocks,
      layout: this.template.layout!,
      brandkitId: undefined,
      brandkitSettings: this.template.brandkitSettings!,
      difficulty: this.template.difficulty!,
      tags: this.template.tags!,
      version: this.template.version!,
      downloadCount: this.template.downloadCount!,
      rating: this.template.rating,
      ratingCount: this.template.ratingCount!,
      author: {
        id: authorId,
        name: "Template Author",
      },
      createdAt: now,
      updatedAt: now,
    };
  }

  // Quick template builders for common patterns
  static createHomepageTemplate(
    name: string,
    variant: string = "corporate"
  ): TemplateBuilder {
    const builder = new TemplateBuilder(name, "HOMEPAGE").setMetadata({
      description: "Modern homepage template",
      tags: ["homepage", variant, "modern"],
      difficulty: "BEGINNER",
    });

    // Add recommended blocks for homepage
    builder
      .addBlock(PageSectionType.NAVIGATION_BLOCK, { variantId: "horizontal" })
      .addBlock(PageSectionType.HERO, {
        variantId: variant === "startup" ? "centered" : "split",
        content: {
          title: "Welcome to Our Platform",
          subtitle: "Transform your business with our innovative solutions",
        },
      })
      .addBlock(PageSectionType.FEATURED_CONTENT, {
        content: {
          title: "Why Choose Us",
          items: [
            { title: "Fast", description: "Lightning fast performance" },
            { title: "Secure", description: "Enterprise-grade security" },
            { title: "Scalable", description: "Grows with your business" },
          ],
        },
      })
      .addBlock(PageSectionType.TESTIMONIALS, {
        variantId: "carousel",
        content: {
          title: "What Our Customers Say",
        },
      })
      .addBlock(PageSectionType.CTA_BLOCK, {
        variantId: "banner",
        content: {
          title: "Ready to Get Started?",
          description: "Join thousands of satisfied customers today",
          buttonText: "Start Free Trial",
          buttonUrl: "/signup",
        },
      })
      .addBlock(PageSectionType.FOOTER_BLOCK, { variantId: "comprehensive" });

    return builder;
  }

  static createBlogTemplate(
    name: string,
    variant: string = "standard"
  ): TemplateBuilder {
    const builder = new TemplateBuilder(name, "BLOG_SINGLE")
      .setLayout("two-column")
      .setMetadata({
        description: "Clean blog post template",
        tags: ["blog", "article", variant],
        difficulty: "BEGINNER",
      });

    builder
      .addBlock(PageSectionType.NAVIGATION_BLOCK, { variantId: "horizontal" })
      .addBlock(PageSectionType.BREADCRUMB_BLOCK)
      .addBlock(PageSectionType.RICH_TEXT, {
        content: {
          title: "Blog Post Title",
          content: "Your blog post content goes here...",
        },
      })
      .addBlock(PageSectionType.SIDEBAR_BLOCK, {
        variantId: "right",
        content: {
          widgets: ["recent_posts", "categories", "tags"],
        },
      })
      .addBlock(PageSectionType.SUBSCRIPTION_FORM, {
        content: {
          title: "Subscribe to Our Newsletter",
          buttonText: "Subscribe",
        },
      })
      .addBlock(PageSectionType.FOOTER_BLOCK);

    return builder;
  }
}
