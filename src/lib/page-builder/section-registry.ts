/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  PageSectionType,
  LayoutSettings,
  StyleSettings,
  ResponsiveSettings,
  AnimationSettings,
  ContentSettings,
  CustomSettings,
  PageSection,
} from "@/types/page-builder";

// ===== SECTION CONFIGURATION INTERFACE =====
export interface SectionConfig {
  type: PageSectionType;
  name: string;
  description: string;
  icon: string;
  category: SectionCategory;
  isAdvanced: boolean;

  // Default settings
  defaultLayout: LayoutSettings;
  defaultStyle: StyleSettings;
  defaultResponsive: ResponsiveSettings;
  defaultAnimation: AnimationSettings;
  defaultContent: ContentSettings;
  defaultCustom: CustomSettings;

  // Configuration options
  availableSettings: SectionSettingsConfig;
  requiredFields: string[];

  // Content schema
  contentSchema: ContentFieldSchema[];

  // Preview data for template/example
  previewData: SectionPreviewData;
}

enum SectionCategory {
  LAYOUT = "Layout",
  CONTENT = "Content",
  INTERACTIVE = "Interactive",
  DYNAMIC = "Dynamic",
  SOCIAL = "Social & Engagement",
  ADVANCED = "Advanced",
  CUSTOM = "Custom & Extensions",
}

export interface SectionSettingsConfig {
  layout: LayoutConfigOptions;
  style: StyleConfigOptions;
  responsive: boolean;
  animation: boolean;
  content: ContentConfigOptions;
  custom: CustomConfigOptions;
}

export interface LayoutConfigOptions {
  width: boolean;
  spacing: boolean;
  alignment: boolean;
  display: boolean;
  grid: boolean;
  positioning: boolean;
}

export interface StyleConfigOptions {
  background: boolean;
  typography: boolean;
  colors: boolean;
  borders: boolean;
  shadows: boolean;
  effects: boolean;
}

export interface ContentConfigOptions {
  text: boolean;
  media: boolean;
  forms: boolean;
  interactive: boolean;
  dynamic: boolean;
}

export interface CustomConfigOptions {
  css: boolean;
  javascript: boolean;
  attributes: boolean;
  seo: boolean;
  accessibility: boolean;
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
    operator: "equals" | "not_equals" | "contains" | "not_contains";
  };
}

export interface SectionPreviewData {
  title?: string;
  subtitle?: string;
  content?: string;
  image?: string;
  metadata?: Record<string, any>;
}

// ===== DEFAULT SETTINGS CREATORS =====
export const createDefaultLayoutSettings = (): LayoutSettings => ({
  width: "container",
  customWidth: 1200,
  maxWidth: 1400,

  padding: {
    top: 80,
    right: 20,
    bottom: 80,
    left: 20,
    unit: "px",
  },
  margin: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    unit: "px",
  },

  alignment: "center",
  verticalAlignment: "center",

  display: "block",
  overflow: "visible",
});

export const createDefaultStyleSettings = (): StyleSettings => ({
  background: {
    type: "none",
  },

  border: {
    width: { top: 0, right: 0, bottom: 0, left: 0, unit: "px" },
    style: "none",
    color: "#000000",
  },
  borderRadius: 0,
  boxShadow: [],

  typography: {
    fontFamily: "inherit",
    fontSize: 16,
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: 0,
    textAlign: "left",
    textDecoration: "none",
    textTransform: "none",
    fontStyle: "normal",
  },

  textColor: "#333333",
  linkColor: "#007bff",
  linkHoverColor: "#0056b3",

  opacity: 1,
  transform: {
    translateX: 0,
    translateY: 0,
    scaleX: 1,
    scaleY: 1,
    rotate: 0,
    skewX: 0,
    skewY: 0,
  },
  filter: {
    blur: 0,
    brightness: 100,
    contrast: 100,
    saturate: 100,
    hueRotate: 0,
    grayscale: 0,
    sepia: 0,
    invert: 0,
  },

  visibility: "visible",
  display: "block",
});

export const createDefaultResponsiveSettings = (): ResponsiveSettings => ({
  desktop: {},
  tablet: {},
  mobile: {},
});

export const createDefaultAnimationSettings = (): AnimationSettings => ({
  entrance: {
    enabled: false,
    type: "fadeIn",
    duration: 600,
    delay: 0,
    easing: "ease-out",
  },
  scroll: {
    enabled: false,
    type: "none",
    trigger: "viewport",
    triggerOffset: 10,
    speed: 1,
  },
  hover: {
    enabled: false,
    type: "none",
    duration: 300,
    easing: "ease",
  },
  custom: [],
  enabled: false,
});

export const createDefaultContentSettings = (): ContentSettings => ({
  general: {
    showTitle: true,
    showSubtitle: false,
    showDescription: true,
    showButton: false,
    buttonStyle: {
      variant: "primary",
      size: "md",
      fullWidth: false,
      iconPosition: "left",
    },
  },
});

export const createDefaultCustomSettings = (): CustomSettings => ({
  cssClasses: [],
  customCSS: "",
  customJS: "",
  attributes: {},
  seoSettings: {
    enableStructuredData: false,
    noIndex: false,
    noFollow: false,
  },
  accessibilitySettings: {
    enableKeyboardNavigation: true,
    enableScreenReaderSupport: true,
    highContrast: false,
    reducedMotion: false,
  },
});

// ===== SECTION CONFIGURATIONS =====
export const SECTION_CONFIGS: Partial<Record<PageSectionType, SectionConfig>> =
  {
    // export const SECTION_CONFIGS: Record<PageSectionType, SectionConfig> = {
    // ===== LAYOUT SECTIONS =====
    [PageSectionType.CONTAINER]: {
      type: PageSectionType.CONTAINER,
      name: "Container",
      description: "Wrapper section untuk mengelompokkan konten lainnya",
      icon: "📦",
      category: SectionCategory.LAYOUT,
      isAdvanced: false,

      defaultLayout: createDefaultLayoutSettings(),
      defaultStyle: createDefaultStyleSettings(),
      defaultResponsive: createDefaultResponsiveSettings(),
      defaultAnimation: createDefaultAnimationSettings(),
      defaultContent: createDefaultContentSettings(),
      defaultCustom: createDefaultCustomSettings(),

      availableSettings: {
        layout: {
          width: true,
          spacing: true,
          alignment: true,
          display: true,
          grid: false,
          positioning: true,
        },
        style: {
          background: true,
          typography: false,
          colors: false,
          borders: true,
          shadows: true,
          effects: true,
        },
        responsive: true,
        animation: true,
        content: {
          text: false,
          media: false,
          forms: false,
          interactive: false,
          dynamic: false,
        },
        custom: {
          css: true,
          javascript: true,
          attributes: true,
          seo: false,
          accessibility: true,
        },
      },

      requiredFields: [],
      contentSchema: [],

      previewData: {
        content: "Container for grouping content",
      },
    },

    [PageSectionType.GRID]: {
      type: PageSectionType.GRID,
      name: "Grid Layout",
      description: "CSS Grid layout to arrange content in a flexible grid",
      icon: "⚏",
      category: SectionCategory.LAYOUT,
      isAdvanced: true,

      defaultLayout: {
        ...createDefaultLayoutSettings(),
        display: "grid",
        gridColumns: 3,
        gridRows: 1,
        gridGap: { top: 20, right: 20, bottom: 20, left: 20, unit: "px" },
      },
      defaultStyle: createDefaultStyleSettings(),
      defaultResponsive: createDefaultResponsiveSettings(),
      defaultAnimation: createDefaultAnimationSettings(),
      defaultContent: createDefaultContentSettings(),
      defaultCustom: createDefaultCustomSettings(),

      availableSettings: {
        layout: {
          width: true,
          spacing: true,
          alignment: true,
          display: true,
          grid: true,
          positioning: false,
        },
        style: {
          background: true,
          typography: false,
          colors: false,
          borders: true,
          shadows: false,
          effects: false,
        },
        responsive: true,
        animation: true,
        content: {
          text: false,
          media: false,
          forms: false,
          interactive: false,
          dynamic: false,
        },
        custom: {
          css: true,
          javascript: false,
          attributes: true,
          seo: false,
          accessibility: true,
        },
      },

      requiredFields: [],
      contentSchema: [
        {
          key: "gridColumns",
          type: "number",
          label: "Grid Columns",
          description: "Number of columns in the grid",
          required: true,
          defaultValue: 3,
          validation: { min: 1, max: 12 },
        },
        {
          key: "gridRows",
          type: "number",
          label: "Grid Rows",
          description: "Number of rows in the grid",
          required: false,
          defaultValue: 1,
          validation: { min: 1, max: 10 },
        },
      ],

      previewData: {
        content: "Grid layout with 3 columns",
      },
    },

    // ===== CONTENT SECTIONS =====
    [PageSectionType.HERO]: {
      type: PageSectionType.HERO,
      name: "Hero Section",
      description:
        "Section hero with background image/video and call-to-action",
      icon: "🚀",
      category: SectionCategory.CONTENT,
      isAdvanced: false,

      defaultLayout: {
        ...createDefaultLayoutSettings(),
        width: "full",
        padding: { top: 120, right: 20, bottom: 120, left: 20, unit: "px" },
      },
      defaultStyle: {
        ...createDefaultStyleSettings(),
        background: {
          type: "image",
          image: {
            url: "/images/hero-bg.jpg",
            size: "cover",
            position: "center center",
            repeat: "no-repeat",
            attachment: "scroll",
            parallax: false,
            parallaxSpeed: 0.5,
          },
          overlay: {
            color: "#000000",
            opacity: 0.4,
            blendMode: "normal",
          },
        },
        typography: {
          fontFamily: "inherit",
          fontSize: 48,
          fontWeight: 700,
          lineHeight: 1.2,
          letterSpacing: -0.5,
          textAlign: "center",
          textDecoration: "none",
          textTransform: "none",
          fontStyle: "normal",
        },
        textColor: "#ffffff",
      },
      defaultResponsive: createDefaultResponsiveSettings(),
      defaultAnimation: {
        ...createDefaultAnimationSettings(),
        entrance: {
          enabled: true,
          type: "fadeIn",
          duration: 800,
          delay: 200,
          easing: "ease-out",
        },
      },
      defaultContent: {
        ...createDefaultContentSettings(),
        general: {
          showTitle: true,
          showSubtitle: true,
          showDescription: true,
          showButton: true,
          buttonText: "Get Started",
          buttonUrl: "#",
          buttonStyle: {
            variant: "primary",
            size: "lg",
            fullWidth: false,
            iconPosition: "right",
          },
        },
        hero: {
          height: "viewport",
          showTitle: true,
          showSubtitle: true,
          showDescription: true,
          showButton: true,
          contentPosition: "center",
          contentVerticalAlign: "center",
          showScrollIndicator: true,
          overlayOpacity: 0.4,
        },
      },
      defaultCustom: createDefaultCustomSettings(),

      availableSettings: {
        layout: {
          width: true,
          spacing: true,
          alignment: true,
          display: false,
          grid: false,
          positioning: false,
        },
        style: {
          background: true,
          typography: true,
          colors: true,
          borders: false,
          shadows: false,
          effects: true,
        },
        responsive: true,
        animation: true,
        content: {
          text: true,
          media: true,
          forms: false,
          interactive: true,
          dynamic: false,
        },
        custom: {
          css: true,
          javascript: true,
          attributes: true,
          seo: true,
          accessibility: true,
        },
      },

      requiredFields: ["title"],
      contentSchema: [
        {
          key: "title",
          type: "text",
          label: "Hero Title",
          description: "Main title of the hero section",
          required: true,
          defaultValue: "Welcome to Our Amazing Service",
        },
        {
          key: "subtitle",
          type: "text",
          label: "Hero Subtitle",
          description: "Subtitle of the hero section",
          required: false,
          defaultValue: "Discover what makes us different",
        },
        {
          key: "description",
          type: "textarea",
          label: "Hero Description",
          description: "Short description of the service or product",
          required: false,
          defaultValue:
            "We provide exceptional services that help your business grow and succeed in today's competitive market.",
        },
        {
          key: "backgroundType",
          type: "select",
          label: "Background Type",
          description: "Type of background for the hero section",
          required: true,
          defaultValue: "image",
          validation: {
            options: [
              { label: "Image", value: "image" },
              { label: "Video", value: "video" },
              { label: "Gradient", value: "gradient" },
              { label: "Color", value: "color" },
            ],
          },
        },
        {
          key: "backgroundImage",
          type: "image",
          label: "Background Image",
          description: "Upload background image for the hero",
          required: false,
          conditional: {
            field: "backgroundType",
            value: "image",
            operator: "equals",
          },
        },
        {
          key: "enableParallax",
          type: "checkbox",
          label: "Enable Parallax Effect",
          description: "Enable parallax effect on the background",
          required: false,
          defaultValue: false,
        },
      ],

      previewData: {
        title: "Welcome to Our Amazing Service",
        subtitle: "Discover what makes us different",
        content:
          "We provide exceptional services that help your business grow.",
        image: "/images/hero-preview.jpg",
      },
    },

    [PageSectionType.RICH_TEXT]: {
      type: PageSectionType.RICH_TEXT,
      name: "Rich Text",
      description: "Advanced text editor with full formatting",
      icon: "📝",
      category: SectionCategory.CONTENT,
      isAdvanced: false,

      defaultLayout: createDefaultLayoutSettings(),
      defaultStyle: {
        ...createDefaultStyleSettings(),
        typography: {
          fontFamily: "inherit",
          fontSize: 16,
          fontWeight: 400,
          lineHeight: 1.6,
          letterSpacing: 0,
          textAlign: "left",
          textDecoration: "none",
          textTransform: "none",
          fontStyle: "normal",
        },
      },
      defaultResponsive: createDefaultResponsiveSettings(),
      defaultAnimation: createDefaultAnimationSettings(),
      defaultContent: {
        ...createDefaultContentSettings(),
        richText: {
          enableDropCap: false,
          enableTableOfContents: false,
          enableReadingTime: false,
          maxWidth: 800,
          columnCount: 1,
          columnGap: 40,
        },
      },
      defaultCustom: createDefaultCustomSettings(),

      availableSettings: {
        layout: {
          width: true,
          spacing: true,
          alignment: true,
          display: false,
          grid: false,
          positioning: false,
        },
        style: {
          background: true,
          typography: true,
          colors: true,
          borders: true,
          shadows: false,
          effects: false,
        },
        responsive: true,
        animation: true,
        content: {
          text: true,
          media: false,
          forms: false,
          interactive: false,
          dynamic: false,
        },
        custom: {
          css: true,
          javascript: false,
          attributes: true,
          seo: true,
          accessibility: true,
        },
      },

      requiredFields: ["content"],
      contentSchema: [
        {
          key: "content",
          type: "richtext",
          label: "Content",
          description: "Konten rich text dengan formatting",
          required: true,
          defaultValue: "<p>Enter your content here...</p>",
        },
        {
          key: "enableDropCap",
          type: "checkbox",
          label: "Enable Drop Cap",
          description: "Enable drop cap for the first letter",
          required: false,
          defaultValue: false,
        },
        {
          key: "maxWidth",
          type: "number",
          label: "Max Width (px)",
          description: "Maximum width of the text content",
          required: false,
          defaultValue: 800,
          validation: { min: 300, max: 1200 },
        },
      ],

      previewData: {
        content:
          "<h2>Lorem Ipsum</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>",
      },
    },

    // ===== INTERACTIVE SECTIONS =====
    [PageSectionType.CONTACT_FORM]: {
      type: PageSectionType.CONTACT_FORM,
      name: "Contact Form",
      description: "Contact form with customizable fields",
      icon: "📧",
      category: SectionCategory.INTERACTIVE,
      isAdvanced: false,

      defaultLayout: createDefaultLayoutSettings(),
      defaultStyle: createDefaultStyleSettings(),
      defaultResponsive: createDefaultResponsiveSettings(),
      defaultAnimation: createDefaultAnimationSettings(),
      defaultContent: {
        ...createDefaultContentSettings(),
        form: {
          formType: "contact",
          fields: [
            {
              id: "name",
              type: "text",
              label: "Full Name",
              placeholder: "Enter your full name",
              required: true,
            },
            {
              id: "email",
              type: "email",
              label: "Email Address",
              placeholder: "Enter your email",
              required: true,
            },
            {
              id: "subject",
              type: "text",
              label: "Subject",
              placeholder: "Message subject",
              required: false,
            },
            {
              id: "message",
              type: "textarea",
              label: "Message",
              placeholder: "Enter your message",
              required: true,
            },
          ],
          submitButtonText: "Send Message",
          successMessage: "Thank you! Your message has been sent.",
          errorMessage: "Sorry, there was an error sending your message.",
          enableRecaptcha: false,
          emailNotifications: true,
        },
      },
      defaultCustom: createDefaultCustomSettings(),

      availableSettings: {
        layout: {
          width: true,
          spacing: true,
          alignment: true,
          display: false,
          grid: false,
          positioning: false,
        },
        style: {
          background: true,
          typography: true,
          colors: true,
          borders: true,
          shadows: true,
          effects: false,
        },
        responsive: true,
        animation: true,
        content: {
          text: true,
          media: false,
          forms: true,
          interactive: true,
          dynamic: false,
        },
        custom: {
          css: true,
          javascript: true,
          attributes: true,
          seo: false,
          accessibility: true,
        },
      },

      requiredFields: ["fields"],
      contentSchema: [
        {
          key: "title",
          type: "text",
          label: "Form Title",
          description: "Contact form title",
          required: false,
          defaultValue: "Get In Touch",
        },
        {
          key: "description",
          type: "textarea",
          label: "Form Description",
          description: "Contact form description",
          required: false,
          defaultValue:
            "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
        },
        {
          key: "submitButtonText",
          type: "text",
          label: "Submit Button Text",
          description: "Text for the submit button",
          required: true,
          defaultValue: "Send Message",
        },
        {
          key: "enableRecaptcha",
          type: "checkbox",
          label: "Enable reCAPTCHA",
          description: "Enable reCAPTCHA for security",
          required: false,
          defaultValue: false,
        },
      ],

      previewData: {
        title: "Get In Touch",
        content: "Contact form with name, email, and message fields",
      },
    },

    // ===== ADVANCED COMPONENTS =====
    [PageSectionType.STATS_COUNTER]: {
      type: PageSectionType.STATS_COUNTER,
      name: "Stats Counter",
      description: "Animated statistics counters",
      icon: "📊",
      category: SectionCategory.ADVANCED,
      isAdvanced: true,

      defaultLayout: createDefaultLayoutSettings(),
      defaultStyle: {
        ...createDefaultStyleSettings(),
        typography: {
          fontFamily: "inherit",
          fontSize: 48,
          fontWeight: 700,
          lineHeight: 1.2,
          letterSpacing: -0.5,
          textAlign: "center",
          textDecoration: "none",
          textTransform: "none",
          fontStyle: "normal",
        },
      },
      defaultResponsive: createDefaultResponsiveSettings(),
      defaultAnimation: {
        ...createDefaultAnimationSettings(),
        scroll: {
          enabled: true,
          type: "fade",
          trigger: "viewport",
          triggerOffset: 20,
          speed: 1,
        },
      },
      defaultContent: {
        ...createDefaultContentSettings(),
        stats: {
          counters: [
            {
              label: "Happy Clients",
              value: 500,
              suffix: "+",
              prefix: "",
              duration: 2000,
            },
            {
              label: "Projects Completed",
              value: 1200,
              suffix: "+",
              prefix: "",
              duration: 2500,
            },
            {
              label: "Years Experience",
              value: 10,
              suffix: "",
              prefix: "",
              duration: 1500,
            },
            {
              label: "Team Members",
              value: 50,
              suffix: "+",
              prefix: "",
              duration: 2000,
            },
          ],
          layout: "grid",
          columns: 4,
          enableAnimation: true,
          animationDuration: 2000,
        },
      },
      defaultCustom: createDefaultCustomSettings(),

      availableSettings: {
        layout: {
          width: true,
          spacing: true,
          alignment: true,
          display: true,
          grid: true,
          positioning: false,
        },
        style: {
          background: true,
          typography: true,
          colors: true,
          borders: true,
          shadows: false,
          effects: true,
        },
        responsive: true,
        animation: true,
        content: {
          text: true,
          media: false,
          forms: false,
          interactive: true,
          dynamic: false,
        },
        custom: {
          css: true,
          javascript: true,
          attributes: true,
          seo: false,
          accessibility: true,
        },
      },

      requiredFields: ["counters"],
      contentSchema: [
        {
          key: "title",
          type: "text",
          label: "Section Title",
          description: "Section statistics title",
          required: false,
          defaultValue: "Our Achievements",
        },
        {
          key: "layout",
          type: "select",
          label: "Layout Style",
          description: "Layout style for the statistics counter",
          required: true,
          defaultValue: "grid",
          validation: {
            options: [
              { label: "Grid", value: "grid" },
              { label: "Horizontal", value: "horizontal" },
              { label: "Vertical", value: "vertical" },
            ],
          },
        },
        {
          key: "columns",
          type: "number",
          label: "Columns",
          description: "Number of columns (for grid layout)",
          required: false,
          defaultValue: 4,
          validation: { min: 1, max: 6 },
        },
        {
          key: "enableAnimation",
          type: "checkbox",
          label: "Enable Animation",
          description: "Enable animation for counting",
          required: false,
          defaultValue: true,
        },
      ],

      previewData: {
        title: "Our Achievements",
        content: "500+ Happy Clients | 1200+ Projects | 10 Years Experience",
      },
    },

    // ===== CUSTOM SECTIONS =====
    [PageSectionType.CUSTOM_HTML]: {
      type: PageSectionType.CUSTOM_HTML,
      name: "Custom HTML",
      description: "Raw HTML/CSS/JavaScript for full customization",
      icon: "🔧",
      category: SectionCategory.CUSTOM,
      isAdvanced: true,

      defaultLayout: createDefaultLayoutSettings(),
      defaultStyle: createDefaultStyleSettings(),
      defaultResponsive: createDefaultResponsiveSettings(),
      defaultAnimation: createDefaultAnimationSettings(),
      defaultContent: createDefaultContentSettings(),
      defaultCustom: {
        ...createDefaultCustomSettings(),
        customCSS:
          "/* Custom CSS untuk section ini */\n.custom-section {\n  /* your styles */\n}",
        customJS:
          '// Custom JavaScript untuk section ini\nconsole.log("Custom section loaded");',
      },

      availableSettings: {
        layout: {
          width: true,
          spacing: true,
          alignment: true,
          display: true,
          grid: false,
          positioning: true,
        },
        style: {
          background: false,
          typography: false,
          colors: false,
          borders: false,
          shadows: false,
          effects: false,
        },
        responsive: true,
        animation: false,
        content: {
          text: false,
          media: false,
          forms: false,
          interactive: false,
          dynamic: false,
        },
        custom: {
          css: true,
          javascript: true,
          attributes: true,
          seo: true,
          accessibility: true,
        },
      },

      requiredFields: ["content"],
      contentSchema: [
        {
          key: "content",
          type: "textarea",
          label: "HTML Content",
          description: "Raw HTML content",
          required: true,
          defaultValue:
            '<div class="custom-section">\n  <h2>Custom HTML Section</h2>\n  <p>Add your custom HTML here</p>\n</div>',
        },
        {
          key: "enableSanitization",
          type: "checkbox",
          label: "Enable HTML Sanitization",
          description: "Enable HTML sanitization for security",
          required: false,
          defaultValue: true,
        },
      ],

      previewData: {
        content: "<div>Custom HTML content with full control</div>",
      },
    },

    [PageSectionType.SPACER]: {
      type: PageSectionType.SPACER,
      name: "Spacer",
      description: "Spacing/divider element to manage spacing between sections",
      icon: "📏",
      category: SectionCategory.LAYOUT,
      isAdvanced: false,

      defaultLayout: {
        ...createDefaultLayoutSettings(),
        padding: { top: 40, right: 0, bottom: 40, left: 0, unit: "px" },
      },
      defaultStyle: {
        ...createDefaultStyleSettings(),
        background: {
          type: "none",
        },
      },
      defaultResponsive: createDefaultResponsiveSettings(),
      defaultAnimation: createDefaultAnimationSettings(),
      defaultContent: createDefaultContentSettings(),
      defaultCustom: createDefaultCustomSettings(),

      availableSettings: {
        layout: {
          width: true,
          spacing: true,
          alignment: false,
          display: false,
          grid: false,
          positioning: false,
        },
        style: {
          background: true,
          typography: false,
          colors: false,
          borders: true,
          shadows: false,
          effects: false,
        },
        responsive: true,
        animation: false,
        content: {
          text: false,
          media: false,
          forms: false,
          interactive: false,
          dynamic: false,
        },
        custom: {
          css: true,
          javascript: false,
          attributes: true,
          seo: false,
          accessibility: false,
        },
      },

      requiredFields: [],
      contentSchema: [
        {
          key: "height",
          type: "number",
          label: "Height (px)",
          description: "Height of the spacer in pixels",
          required: true,
          defaultValue: 80,
          validation: { min: 10, max: 500 },
        },
        {
          key: "showDivider",
          type: "checkbox",
          label: "Show Divider Line",
          description: "Show divider line",
          required: false,
          defaultValue: false,
        },
        {
          key: "dividerStyle",
          type: "select",
          label: "Divider Style",
          description: "Style of the divider line",
          required: false,
          defaultValue: "solid",
          validation: {
            options: [
              { label: "Solid", value: "solid" },
              { label: "Dashed", value: "dashed" },
              { label: "Dotted", value: "dotted" },
            ],
          },
          conditional: {
            field: "showDivider",
            value: true,
            operator: "equals",
          },
        },
      ],

      previewData: {
        content: "Spacing element - 80px height",
      },
    },
  };

// ===== SECTION UTILITIES =====
export class SectionRegistry {
  static getAllSections(): SectionConfig[] {
    return Object.values(SECTION_CONFIGS);
  }

  static getSectionsByCategory(category: SectionCategory): SectionConfig[] {
    return this.getAllSections().filter(
      (section) => section.category === category
    );
  }

  static getSection(type: PageSectionType): SectionConfig | undefined {
    return SECTION_CONFIGS[type];
  }

  static getBasicSections(): SectionConfig[] {
    return this.getAllSections().filter((section) => !section.isAdvanced);
  }

  static getAdvancedSections(): SectionConfig[] {
    return this.getAllSections().filter((section) => section.isAdvanced);
  }

  static createDefaultSection(
    type: PageSectionType,
    pageId: string,
    order: number
  ): Omit<PageSection, "id" | "createdAt" | "updatedAt"> {
    const config = this.getSection(type);
    if (!config) {
      throw new Error(`Section type ${type} not found in registry`);
    }

    return {
      type,
      order,
      isActive: true,
      layoutSettings: config.defaultLayout,
      styleSettings: config.defaultStyle,
      responsiveSettings: config.defaultResponsive,
      animationSettings: config.defaultAnimation,
      contentSettings: config.defaultContent,
      customSettings: config.defaultCustom,
      translations: [
        {
          languageId: "en",
          title: config.previewData.title,
          subtitle: config.previewData.subtitle,
          content: config.previewData.content || "",
          metadata: config.previewData.metadata,
          altText: undefined,
          caption: undefined,
        },
      ],
    };
  }

  static validateSectionData(
    type: PageSectionType,
    data: any
  ): { valid: boolean; errors: string[] } {
    const config = this.getSection(type);
    if (!config) {
      return { valid: false, errors: [`Section type ${type} not found`] };
    }

    const errors: string[] = [];

    // Validate required fields
    for (const field of config.requiredFields) {
      if (
        !data[field] ||
        (typeof data[field] === "string" && data[field].trim() === "")
      ) {
        errors.push(`Field '${field}' is required`);
      }
    }

    // Validate content schema
    for (const schema of config.contentSchema) {
      if (schema.required && (!data[schema.key] || data[schema.key] === "")) {
        errors.push(`Field '${schema.label}' is required`);
      }

      // Validate field types
      if (data[schema.key] !== undefined) {
        if (!this.validateFieldType(data[schema.key], schema)) {
          errors.push(`Field '${schema.label}' has invalid type or value`);
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }

  private static validateFieldType(
    value: any,
    schema: ContentFieldSchema
  ): boolean {
    switch (schema.type) {
      case "number":
        if (typeof value !== "number") return false;
        if (
          schema.validation?.min !== undefined &&
          value < schema.validation.min
        )
          return false;
        if (
          schema.validation?.max !== undefined &&
          value > schema.validation.max
        )
          return false;
        break;

      case "text":
      case "textarea":
      case "richtext":
        if (typeof value !== "string") return false;
        if (
          schema.validation?.min !== undefined &&
          value.length < schema.validation.min
        )
          return false;
        if (
          schema.validation?.max !== undefined &&
          value.length > schema.validation.max
        )
          return false;
        break;

      case "url":
        if (typeof value !== "string") return false;
        try {
          new URL(value);
        } catch {
          return false;
        }
        break;

      case "select":
        if (schema.validation?.options) {
          const validValues = schema.validation.options.map((opt) => opt.value);
          if (!validValues.includes(value)) return false;
        }
        break;

      case "checkbox":
        if (typeof value !== "boolean") return false;
        break;

      case "color":
        if (typeof value !== "string") return false;
        if (!/^#[0-9A-F]{6}$/i.test(value)) return false;
        break;
    }

    return true;
  }

  static getAvailableSettings(
    type: PageSectionType
  ): SectionSettingsConfig | undefined {
    const config = this.getSection(type);
    return config?.availableSettings;
  }

  static getSectionIcon(type: PageSectionType): string {
    const config = this.getSection(type);
    return config?.icon || "📄";
  }

  static getSectionName(type: PageSectionType): string {
    const config = this.getSection(type);
    return config?.name || type;
  }

  static getSectionDescription(type: PageSectionType): string {
    const config = this.getSection(type);
    return config?.description || "";
  }

  static searchSections(query: string): SectionConfig[] {
    const searchTerm = query.toLowerCase();
    return this.getAllSections().filter(
      (section) =>
        section.name.toLowerCase().includes(searchTerm) ||
        section.description.toLowerCase().includes(searchTerm) ||
        section.category.toLowerCase().includes(searchTerm)
    );
  }

  static getSectionsByDifficulty(isAdvanced: boolean): SectionConfig[] {
    return this.getAllSections().filter(
      (section) => section.isAdvanced === isAdvanced
    );
  }
}

// ===== SECTION CATEGORIES HELPER =====
export const SECTION_CATEGORIES = [
  {
    key: SectionCategory.LAYOUT,
    name: "Layout",
    description: "Sections untuk mengatur layout dan struktur halaman",
    icon: "📐",
    color: "blue",
  },
  {
    key: SectionCategory.CONTENT,
    name: "Content",
    description: "Sections untuk menampilkan konten text, image, dan media",
    icon: "📄",
    color: "green",
  },
  {
    key: SectionCategory.INTERACTIVE,
    name: "Interactive",
    description: "Sections interaktif seperti form, button, dan widget",
    icon: "🎯",
    color: "purple",
  },
  {
    key: SectionCategory.DYNAMIC,
    name: "Dynamic",
    description: "Sections yang menampilkan konten dinamis dari database",
    icon: "🔄",
    color: "orange",
  },
  {
    key: SectionCategory.SOCIAL,
    name: "Social & Engagement",
    description: "Sections untuk social media dan engagement",
    icon: "💬",
    color: "pink",
  },
  {
    key: SectionCategory.ADVANCED,
    name: "Advanced",
    description: "Sections lanjutan dengan fitur kompleks",
    icon: "⚡",
    color: "red",
  },
  {
    key: SectionCategory.CUSTOM,
    name: "Custom & Extensions",
    description: "Sections untuk custom code dan eksternal embeds",
    icon: "🔧",
    color: "gray",
  },
];

// ===== DEFAULT SECTION ORDER =====
export const DEFAULT_SECTION_ORDER: PageSectionType[] = [
  // Layout sections first
  PageSectionType.CONTAINER,
  PageSectionType.GRID,
  PageSectionType.FLEXBOX,
  PageSectionType.COLUMNS,

  // Content sections
  PageSectionType.HERO,
  PageSectionType.RICH_TEXT,
  PageSectionType.IMAGE,
  PageSectionType.IMAGE_GALLERY,
  PageSectionType.VIDEO_EMBED,
  PageSectionType.SLIDER_CAROUSEL,

  // Interactive sections
  PageSectionType.CONTACT_FORM,
  PageSectionType.SUBSCRIPTION_FORM,
  PageSectionType.BUTTON_GROUP,
  PageSectionType.ACCORDION,
  PageSectionType.TABS,
  PageSectionType.MODAL_TRIGGER,

  // Dynamic content
  PageSectionType.ARTICLE_LIST,
  PageSectionType.CATEGORY_SHOWCASE,
  PageSectionType.FEATURED_CONTENT,
  PageSectionType.SEARCH_INTERFACE,

  // Social & engagement
  PageSectionType.TESTIMONIALS,
  PageSectionType.TEAM_SHOWCASE,
  PageSectionType.SOCIAL_FEED,
  PageSectionType.COUNTDOWN,
  PageSectionType.PRICING_TABLE,

  // Advanced components
  PageSectionType.TIMELINE,
  PageSectionType.STATS_COUNTER,
  PageSectionType.PROGRESS_BAR,
  PageSectionType.CHART_DISPLAY,
  PageSectionType.MAP_EMBED,

  // Custom & extensions
  PageSectionType.CUSTOM_HTML,
  PageSectionType.EMBED_CODE,
  PageSectionType.WIDGET_AREA,
  PageSectionType.SPACER,
];

// ===== EXPORT ALL =====
export { PageSectionType, SectionCategory };
