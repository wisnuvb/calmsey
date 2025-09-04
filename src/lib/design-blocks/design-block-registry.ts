/* eslint-disable @typescript-eslint/no-explicit-any */
import { PageSectionType } from "@/types/page-builder";

export enum DesignBlockCategory {
  NAVIGATION = "navigation",
  LAYOUT = "layout",
  CONTENT = "content",
  INTERACTIVE = "interactive",
  DYNAMIC = "dynamic",
  SOCIAL = "social",
  ADVANCED = "advanced",
  CUSTOM = "custom",
}

export interface DesignBlockConfig {
  type: PageSectionType;
  name: string;
  description: string;
  icon: string;
  category: DesignBlockCategory;
  tags: string[];

  // Template variants for this block
  variants: DesignBlockVariant[];

  // Default configuration
  defaultSettings: {
    layout: any;
    style: any;
    responsive: any;
    animation: any;
    content: any;
  };

  // Configuration options
  configOptions: {
    hasVariants: boolean;
    hasAnimation: boolean;
    hasResponsive: boolean;
    hasBrandkitIntegration: boolean;
    supportedTemplateTypes: string[];
  };

  // Content schema
  contentSchema: ContentFieldSchema[];

  // Preview data
  previewData: {
    title?: string;
    content?: string;
    image?: string;
    metadata?: Record<string, any>;
  };
}

export interface DesignBlockVariant {
  id: string;
  name: string;
  description: string;
  previewImage?: string;
  styleOverrides: any;
  layoutOverrides: any;
  contentDefaults: any;
  isProVariant?: boolean;
}

export interface ContentFieldSchema {
  key: string;
  type:
    | "text"
    | "textarea"
    | "richtext"
    | "image"
    | "url"
    | "select"
    | "checkbox"
    | "number"
    | "color"
    | "json";
  label: string;
  description?: string;
  required: boolean;
  defaultValue?: any;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    options?: Array<{ label: string; value: any }>;
  };
  conditional?: {
    field: string;
    value: any;
    operator: "equals" | "not_equals" | "contains";
  };
}

// Extended design blocks - adding missing navigation blocks
export const DESIGN_BLOCK_REGISTRY: Record<string, DesignBlockConfig> = {
  // === NAVIGATION BLOCKS ===
  NAVIGATION_BLOCK: {
    type: PageSectionType.NAVIGATION_BLOCK,
    name: "Navigation",
    description: "Customizable navigation menu with multiple layouts",
    icon: "🧭",
    category: DesignBlockCategory.NAVIGATION,
    tags: ["navigation", "menu", "header", "links"],
    variants: [
      {
        id: "horizontal",
        name: "Horizontal Menu",
        description: "Traditional horizontal navigation bar",
        styleOverrides: { display: "flex", flexDirection: "row" },
        layoutOverrides: { alignment: "center" },
        contentDefaults: { showLogo: true, showCTA: true },
      },
      {
        id: "vertical",
        name: "Vertical Menu",
        description: "Sidebar-style vertical navigation",
        styleOverrides: { display: "flex", flexDirection: "column" },
        layoutOverrides: { alignment: "left" },
        contentDefaults: { showLogo: true, showCTA: false },
      },
      {
        id: "mega",
        name: "Mega Menu",
        description: "Full-width dropdown navigation",
        styleOverrides: { display: "block", width: "100%" },
        layoutOverrides: { alignment: "center" },
        contentDefaults: { showDropdown: true, showIcons: true },
        isProVariant: true,
      },
    ],
    defaultSettings: {
      layout: { alignment: "center", sticky: true },
      style: { background: { type: "color" }, padding: "1rem" },
      responsive: { hideOnMobile: false, mobileBreakpoint: 768 },
      animation: { transition: "smooth" },
      content: { menuItems: [], showLogo: true, showCTA: false },
    },
    configOptions: {
      hasVariants: true,
      hasAnimation: true,
      hasResponsive: true,
      hasBrandkitIntegration: true,
      supportedTemplateTypes: ["all"],
    },
    contentSchema: [
      {
        key: "menuItems",
        type: "json",
        label: "Menu Items",
        description: "Navigation menu items",
        required: true,
        defaultValue: [],
      },
      {
        key: "logoUrl",
        type: "image",
        label: "Logo",
        description: "Navigation logo image",
        required: false,
        defaultValue: "",
      },
      {
        key: "ctaText",
        type: "text",
        label: "CTA Button Text",
        description: "Call-to-action button text",
        required: false,
        defaultValue: "Get Started",
      },
      {
        key: "ctaUrl",
        type: "url",
        label: "CTA Button URL",
        description: "Call-to-action button link",
        required: false,
        defaultValue: "",
      },
    ],
    previewData: {
      title: "Site Navigation",
      content: "Home | About | Services | Contact",
      metadata: { menuStyle: "horizontal" },
    },
  },

  BREADCRUMB_BLOCK: {
    type: PageSectionType.BREADCRUMB_BLOCK,
    name: "Breadcrumb",
    description: "Navigation breadcrumb trail",
    icon: "🍞",
    category: DesignBlockCategory.NAVIGATION,
    tags: ["breadcrumb", "navigation", "path"],
    variants: [
      {
        id: "simple",
        name: "Simple Breadcrumb",
        description: "Basic breadcrumb with separators",
        styleOverrides: { separator: ">" },
        layoutOverrides: {},
        contentDefaults: { showHome: true },
      },
      {
        id: "styled",
        name: "Styled Breadcrumb",
        description: "Enhanced breadcrumb with background",
        styleOverrides: { separator: "/", hasBackground: true },
        layoutOverrides: { padding: "0.5rem 1rem" },
        contentDefaults: { showHome: true, showIcons: true },
      },
    ],
    defaultSettings: {
      layout: { alignment: "left" },
      style: { separator: ">", textColor: "#666" },
      responsive: { hideOnMobile: false },
      animation: {},
      content: { showHome: true, homeText: "Home" },
    },
    configOptions: {
      hasVariants: true,
      hasAnimation: false,
      hasResponsive: true,
      hasBrandkitIntegration: true,
      supportedTemplateTypes: ["BLOG_SINGLE", "CATEGORY", "PAGE"],
    },
    contentSchema: [
      {
        key: "showHome",
        type: "checkbox",
        label: "Show Home Link",
        description: "Display home link in breadcrumb",
        required: false,
        defaultValue: true,
      },
      {
        key: "homeText",
        type: "text",
        label: "Home Text",
        description: "Text for home breadcrumb",
        required: false,
        defaultValue: "Home",
      },
      {
        key: "separator",
        type: "select",
        label: "Separator Style",
        description: "Breadcrumb separator character",
        required: false,
        defaultValue: ">",
        validation: {
          options: [
            { label: "Arrow (>)", value: ">" },
            { label: "Slash (/)", value: "/" },
            { label: "Pipe (|)", value: "|" },
            { label: "Dot (•)", value: "•" },
          ],
        },
      },
    ],
    previewData: {
      title: "Breadcrumb Navigation",
      content: "Home > Blog > Article Title",
      metadata: { depth: 3 },
    },
  },

  // === ENHANCED LAYOUT BLOCKS ===
  SIDEBAR_BLOCK: {
    type: PageSectionType.SIDEBAR_BLOCK,
    name: "Sidebar",
    description: "Flexible sidebar layout with multiple content areas",
    icon: "📋",
    category: DesignBlockCategory.LAYOUT,
    tags: ["sidebar", "layout", "columns", "widget"],
    variants: [
      {
        id: "left",
        name: "Left Sidebar",
        description: "Sidebar positioned on the left",
        styleOverrides: { position: "left", width: "25%" },
        layoutOverrides: {},
        contentDefaults: { showWidgets: true },
      },
      {
        id: "right",
        name: "Right Sidebar",
        description: "Sidebar positioned on the right",
        styleOverrides: { position: "right", width: "25%" },
        layoutOverrides: {},
        contentDefaults: { showWidgets: true },
      },
      {
        id: "sticky",
        name: "Sticky Sidebar",
        description: "Sidebar that sticks on scroll",
        styleOverrides: { position: "sticky", top: "2rem" },
        layoutOverrides: {},
        contentDefaults: { showWidgets: true },
        isProVariant: true,
      },
    ],
    defaultSettings: {
      layout: { position: "right", width: "300px", gap: "2rem" },
      style: { background: { type: "none" }, padding: "1rem" },
      responsive: { hideOnTablet: true, hideOnMobile: true },
      animation: {},
      content: { widgets: [], showTitle: false },
    },
    configOptions: {
      hasVariants: true,
      hasAnimation: false,
      hasResponsive: true,
      hasBrandkitIntegration: true,
      supportedTemplateTypes: ["BLOG_SINGLE", "PAGE", "PORTFOLIO"],
    },
    contentSchema: [
      {
        key: "widgets",
        type: "json",
        label: "Sidebar Widgets",
        description: "Content widgets for sidebar",
        required: false,
        defaultValue: [],
      },
      {
        key: "title",
        type: "text",
        label: "Sidebar Title",
        description: "Optional sidebar title",
        required: false,
        defaultValue: "",
      },
    ],
    previewData: {
      title: "Sidebar Content",
      content: "Recent Posts, Categories, Tags",
      metadata: { widgetCount: 3 },
    },
  },

  // === ENHANCED CONTENT BLOCKS ===
  CTA_BLOCK: {
    type: PageSectionType.CTA_BLOCK,
    name: "Call to Action",
    description: "Compelling call-to-action section with buttons and content",
    icon: "🎯",
    category: DesignBlockCategory.CONTENT,
    tags: ["cta", "button", "conversion", "action"],
    variants: [
      {
        id: "banner",
        name: "Banner CTA",
        description: "Full-width banner call-to-action",
        styleOverrides: { display: "block", padding: "3rem 2rem" },
        layoutOverrides: { textAlign: "center" },
        contentDefaults: { showButton: true, showIcon: false },
      },
      {
        id: "card",
        name: "Card CTA",
        description: "Card-style call-to-action",
        styleOverrides: {
          border: "1px solid",
          borderRadius: "8px",
          padding: "2rem",
        },
        layoutOverrides: { textAlign: "center" },
        contentDefaults: { showButton: true, showIcon: true },
      },
      {
        id: "inline",
        name: "Inline CTA",
        description: "Inline call-to-action within content",
        styleOverrides: { display: "inline-block", padding: "1rem" },
        layoutOverrides: { textAlign: "left" },
        contentDefaults: { showButton: true, showIcon: false },
      },
    ],
    defaultSettings: {
      layout: { alignment: "center", spacing: "2rem" },
      style: { background: { type: "color" }, padding: "2rem" },
      responsive: { stackOnMobile: true },
      animation: { hover: true },
      content: {
        title: "",
        description: "",
        buttonText: "Learn More",
        buttonUrl: "",
      },
    },
    configOptions: {
      hasVariants: true,
      hasAnimation: true,
      hasResponsive: true,
      hasBrandkitIntegration: true,
      supportedTemplateTypes: ["all"],
    },
    contentSchema: [
      {
        key: "title",
        type: "text",
        label: "CTA Title",
        description: "Main call-to-action heading",
        required: true,
        defaultValue: "Ready to Get Started?",
      },
      {
        key: "description",
        type: "textarea",
        label: "CTA Description",
        description: "Supporting text for the CTA",
        required: false,
        defaultValue: "",
      },
      {
        key: "buttonText",
        type: "text",
        label: "Button Text",
        description: "Text for the action button",
        required: true,
        defaultValue: "Get Started",
      },
      {
        key: "buttonUrl",
        type: "url",
        label: "Button URL",
        description: "Link for the action button",
        required: true,
        defaultValue: "",
      },
      {
        key: "buttonStyle",
        type: "select",
        label: "Button Style",
        description: "Visual style of the button",
        required: false,
        defaultValue: "primary",
        validation: {
          options: [
            { label: "Primary", value: "primary" },
            { label: "Secondary", value: "secondary" },
            { label: "Outline", value: "outline" },
            { label: "Ghost", value: "ghost" },
          ],
        },
      },
    ],
    previewData: {
      title: "Ready to Transform Your Business?",
      content:
        "Join thousands of satisfied customers who have already made the switch.",
      metadata: { hasButton: true, buttonText: "Start Free Trial" },
    },
  },
};

// Add missing enum values to PageSectionType
export enum ExtendedPageSectionType {
  // Navigation blocks
  NAVIGATION_BLOCK = "NAVIGATION_BLOCK",
  BREADCRUMB_BLOCK = "BREADCRUMB_BLOCK",
  PAGINATION_BLOCK = "PAGINATION_BLOCK",

  // Layout blocks
  SIDEBAR_BLOCK = "SIDEBAR_BLOCK",

  // Content blocks
  CTA_BLOCK = "CTA_BLOCK",
  FOOTER_BLOCK = "FOOTER_BLOCK",
}

// Helper functions
export class DesignBlockRegistry {
  static getBlocksByCategory(
    category: DesignBlockCategory
  ): DesignBlockConfig[] {
    return Object.values(DESIGN_BLOCK_REGISTRY).filter(
      (block) => block.category === category
    );
  }

  static getBlockByType(type: PageSectionType): DesignBlockConfig | null {
    return DESIGN_BLOCK_REGISTRY[type] || null;
  }

  static getBlockVariants(blockType: PageSectionType): DesignBlockVariant[] {
    const block = this.getBlockByType(blockType);
    return block?.variants || [];
  }

  static getBlocksForTemplate(templateType: string): DesignBlockConfig[] {
    return Object.values(DESIGN_BLOCK_REGISTRY).filter(
      (block) =>
        block.configOptions.supportedTemplateTypes.includes("all") ||
        block.configOptions.supportedTemplateTypes.includes(templateType)
    );
  }

  static searchBlocks(query: string): DesignBlockConfig[] {
    const searchTerm = query.toLowerCase();
    return Object.values(DESIGN_BLOCK_REGISTRY).filter(
      (block) =>
        block.name.toLowerCase().includes(searchTerm) ||
        block.description.toLowerCase().includes(searchTerm) ||
        block.tags.some((tag) => tag.includes(searchTerm))
    );
  }
}
