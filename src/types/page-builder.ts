/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types/page-builder.ts
// Enhanced Page Builder Type Definitions

export enum PageSectionType {
  // Layout Sections
  CONTAINER = "CONTAINER",
  GRID = "GRID",
  FLEXBOX = "FLEXBOX",
  COLUMNS = "COLUMNS",

  // Content Sections
  HERO = "HERO",
  RICH_TEXT = "RICH_TEXT",
  IMAGE = "IMAGE",
  IMAGE_GALLERY = "IMAGE_GALLERY",
  VIDEO_EMBED = "VIDEO_EMBED",
  SLIDER_CAROUSEL = "SLIDER_CAROUSEL",

  // Interactive Sections
  CONTACT_FORM = "CONTACT_FORM",
  SUBSCRIPTION_FORM = "SUBSCRIPTION_FORM",
  ACCORDION = "ACCORDION",
  TABS = "TABS",
  MODAL_TRIGGER = "MODAL_TRIGGER",
  BUTTON_GROUP = "BUTTON_GROUP",

  // Dynamic Content
  ARTICLE_LIST = "ARTICLE_LIST",
  CATEGORY_SHOWCASE = "CATEGORY_SHOWCASE",
  FEATURED_CONTENT = "FEATURED_CONTENT",
  SEARCH_INTERFACE = "SEARCH_INTERFACE",

  // Social & Engagement
  TESTIMONIALS = "TESTIMONIALS",
  TEAM_SHOWCASE = "TEAM_SHOWCASE",
  SOCIAL_FEED = "SOCIAL_FEED",
  COUNTDOWN = "COUNTDOWN",
  PRICING_TABLE = "PRICING_TABLE",

  // Advanced Components
  TIMELINE = "TIMELINE",
  STATS_COUNTER = "STATS_COUNTER",
  PROGRESS_BAR = "PROGRESS_BAR",
  CHART_DISPLAY = "CHART_DISPLAY",
  MAP_EMBED = "MAP_EMBED",

  // Custom & Extensions
  CUSTOM_HTML = "CUSTOM_HTML",
  EMBED_CODE = "EMBED_CODE",
  WIDGET_AREA = "WIDGET_AREA",
  SPACER = "SPACER",
}

// ===== LAYOUT SETTINGS =====
export interface LayoutSettings {
  // Container Settings
  width: "full" | "container" | "narrow" | "custom";
  customWidth?: number;
  maxWidth?: number;

  // Spacing
  padding: SpacingValue;
  margin: SpacingValue;

  // Alignment & Position
  alignment: "left" | "center" | "right" | "justify";
  verticalAlignment: "top" | "center" | "bottom" | "stretch";

  // Display & Layout
  display: "block" | "flex" | "grid" | "inline" | "none";
  flexDirection?: "row" | "column" | "row-reverse" | "column-reverse";
  justifyContent?:
    | "flex-start"
    | "center"
    | "flex-end"
    | "space-between"
    | "space-around"
    | "space-evenly";
  alignItems?: "flex-start" | "center" | "flex-end" | "stretch" | "baseline";

  // Grid Layout (for GRID sections)
  gridColumns?: number;
  gridRows?: number;
  gridGap?: SpacingValue;
  gridTemplate?: string;

  // Z-Index & Positioning
  position?: "static" | "relative" | "absolute" | "fixed" | "sticky";
  zIndex?: number;

  // Overflow
  overflow?: "visible" | "hidden" | "scroll" | "auto";
}

export interface SpacingValue {
  top: number;
  right: number;
  bottom: number;
  left: number;
  unit: "px" | "rem" | "em" | "%" | "vh" | "vw";
}

// ===== STYLE SETTINGS =====
export interface StyleSettings {
  // Background
  background: BackgroundSettings;

  // Border & Shape
  border: BorderSettings;
  borderRadius: number;
  boxShadow: ShadowSettings[];

  // Typography
  typography: TypographySettings;

  // Colors
  textColor: string;
  linkColor: string;
  linkHoverColor: string;

  // Effects
  opacity: number;
  transform: TransformSettings;
  filter: FilterSettings;

  // Visibility
  visibility: "visible" | "hidden";
  display: "block" | "none" | "flex" | "grid" | "inline-block";
}

export interface BackgroundSettings {
  type: "none" | "color" | "gradient" | "image" | "video" | "pattern";
  color?: string;
  gradient?: GradientSettings;
  image?: ImageBackgroundSettings;
  video?: VideoBackgroundSettings;
  pattern?: PatternSettings;
  overlay?: OverlaySettings;
}

export interface GradientSettings {
  type: "linear" | "radial";
  direction: number; // degrees for linear
  colors: Array<{
    color: string;
    position: number; // 0-100%
  }>;
}

export interface ImageBackgroundSettings {
  url: string;
  size: "cover" | "contain" | "auto" | "custom";
  position: string; // CSS background-position
  repeat: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
  attachment: "scroll" | "fixed" | "local";
  parallax: boolean;
  parallaxSpeed: number; // 0.1 to 2.0
}

export interface VideoBackgroundSettings {
  url: string;
  muted: boolean;
  autoplay: boolean;
  loop: boolean;
  controls: boolean;
  poster?: string;
}

export interface PatternSettings {
  type: "dots" | "lines" | "grid" | "custom";
  color: string;
  opacity: number;
  size: number;
  spacing: number;
}

export interface OverlaySettings {
  color: string;
  opacity: number; // 0-1
  blendMode:
    | "normal"
    | "multiply"
    | "screen"
    | "overlay"
    | "soft-light"
    | "hard-light";
}

export interface BorderSettings {
  width: SpacingValue;
  style:
    | "none"
    | "solid"
    | "dashed"
    | "dotted"
    | "double"
    | "groove"
    | "ridge"
    | "inset"
    | "outset";
  color: string;
  enabled?: boolean;
}

export interface ShadowSettings {
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  inset: boolean;
}

export interface TypographySettings {
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  lineHeight: number;
  letterSpacing: number;
  textAlign: "left" | "center" | "right" | "justify";
  textDecoration: "none" | "underline" | "overline" | "line-through";
  textTransform: "none" | "uppercase" | "lowercase" | "capitalize";
  fontStyle: "normal" | "italic" | "oblique";
}

export interface TransformSettings {
  translateX: number;
  translateY: number;
  scaleX: number;
  scaleY: number;
  rotate: number;
  skewX: number;
  skewY: number;
}

export interface FilterSettings {
  blur: number;
  brightness: number;
  contrast: number;
  saturate: number;
  hueRotate: number;
  grayscale: number;
  sepia: number;
  invert: number;
}

// ===== RESPONSIVE SETTINGS =====
export interface ResponsiveSettings {
  desktop: DeviceSettings;
  tablet: DeviceSettings;
  mobile: DeviceSettings;
  // Custom breakpoints
  customBreakpoints?: Array<{
    name: string;
    minWidth: number;
    maxWidth?: number;
    settings: DeviceSettings;
  }>;
}

export interface DeviceSettings {
  // Override any layout/style setting for this device
  layout?: Partial<LayoutSettings>;
  style?: Partial<StyleSettings>;
  visibility?: "visible" | "hidden";

  padding?: SpacingValue;
  margin?: SpacingValue;
  display?: "block" | "none" | "flex" | "grid" | "inline-block";
  fontSize?: number;
  height?: number;

  // Content variations
  content?: {
    title?: string;
    subtitle?: string;
    content?: string;
  };
}

// ===== ANIMATION SETTINGS =====
export interface AnimationSettings {
  // Entrance animations
  entrance: EntranceAnimation;

  // Scroll-triggered animations
  scroll: ScrollAnimation;

  // Hover effects
  hover: HoverAnimation;

  // Custom animations
  custom: CustomAnimation[];

  enabled: boolean;

  customCode: string;
}

export interface EntranceAnimation {
  enabled: boolean;
  type:
    | "fadeIn"
    | "slideUp"
    | "slideDown"
    | "slideLeft"
    | "slideRight"
    | "zoomIn"
    | "zoomOut"
    | "bounceIn"
    | "flipIn"
    | "none";
  duration: number; // milliseconds
  delay: number; // milliseconds
  easing: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "custom";
  customEasing?: string; // cubic-bezier values
}

export interface ScrollAnimation {
  enabled: boolean;
  type: "parallax" | "fade" | "scale" | "rotate" | "translate" | "none";
  trigger: "viewport" | "scroll" | "hover";
  triggerOffset: number; // percentage of viewport
  speed: number; // 0.1 to 2.0
}

export interface HoverAnimation {
  enabled: boolean;
  type:
    | "scale"
    | "rotate"
    | "translate"
    | "shadow"
    | "color"
    | "opacity"
    | "none";
  duration: number;
  easing: string;
  transform?: Partial<TransformSettings>;
  style?: Partial<StyleSettings>;
}

export interface CustomAnimation {
  name: string;
  keyframes: Array<{
    offset: number; // 0-1
    properties: Record<string, any>;
  }>;
  duration: number;
  iterations: number | "infinite";
  direction: "normal" | "reverse" | "alternate" | "alternate-reverse";
  fillMode: "none" | "forwards" | "backwards" | "both";
}

// ===== CONTENT SETTINGS =====
export interface ContentSettings {
  // Common content settings
  general?: GeneralContentSettings;

  // Section-specific settings
  hero?: HeroContentSettings;
  richText?: RichTextContentSettings;
  image?: ImageContentSettings;
  gallery?: GalleryContentSettings;
  video?: VideoContentSettings;
  form?: FormContentSettings;
  carousel?: CarouselContentSettings;
  accordion?: AccordionContentSettings;
  tabs?: TabsContentSettings;
  testimonials?: TestimonialsContentSettings;
  team?: TeamContentSettings;
  pricing?: PricingContentSettings;
  timeline?: TimelineContentSettings;
  stats?: StatsContentSettings;
  countdown?: CountdownContentSettings;
  map?: MapContentSettings;
  customHtml?: CustomHtmlContentSettings;
}

export interface CountdownContentSettings {
  date: string;
  timezone: string;
}
export interface MapContentSettings {
  mapType: "google" | "mapbox" | "leaflet";
  mapData: string;
}
export interface CustomHtmlContentSettings {
  html: string;
}

export interface GeneralContentSettings {
  showTitle: boolean;
  showSubtitle: boolean;
  showDescription: boolean;
  showButton: boolean;
  buttonText?: string;
  buttonUrl?: string;
  buttonStyle?: ButtonStyle;
}

export interface ButtonStyle {
  variant: "primary" | "secondary" | "outline" | "ghost" | "link";
  size: "sm" | "md" | "lg" | "xl";
  fullWidth: boolean;
  icon?: string;
  iconPosition: "left" | "right";
}

export interface HeroContentSettings extends GeneralContentSettings {
  height: "auto" | "viewport" | "custom";
  customHeight?: number;
  contentPosition: "left" | "center" | "right";
  contentVerticalAlign: "top" | "center" | "bottom";
  showScrollIndicator: boolean;
  overlayOpacity: number;
}

export interface RichTextContentSettings {
  enableDropCap: boolean;
  enableTableOfContents: boolean;
  enableReadingTime: boolean;
  maxWidth?: number;
  columnCount?: number;
  columnGap?: number;
}

export interface ImageContentSettings {
  aspectRatio?: "auto" | "1:1" | "4:3" | "16:9" | "21:9" | "custom";
  customAspectRatio?: { width: number; height: number };
  objectFit: "cover" | "contain" | "fill" | "scale-down" | "none";
  enableLightbox: boolean;
  enableZoom: boolean;
  showCaption: boolean;
  captionPosition: "bottom" | "overlay" | "side";
  enableLazyLoading: boolean;
}

export interface GalleryContentSettings {
  layout: "grid" | "masonry" | "carousel" | "justified";
  columns: number;
  gap: number;
  enableLightbox: boolean;
  enableFilter: boolean;
  filterCategories?: string[];
  enableInfiniteScroll: boolean;
  itemsPerPage: number;
}

export interface VideoContentSettings {
  provider: "youtube" | "vimeo" | "custom" | "upload";
  videoId?: string;
  customUrl?: string;
  autoplay: boolean;
  muted: boolean;
  controls: boolean;
  loop: boolean;
  showTitle: boolean;
  showDescription: boolean;
  aspectRatio: "16:9" | "4:3" | "1:1" | "custom";
  customAspectRatio?: { width: number; height: number };
}

export interface FormContentSettings {
  formType: "contact" | "newsletter" | "custom";
  fields: FormField[];
  submitButtonText: string;
  successMessage: string;
  errorMessage: string;
  enableRecaptcha: boolean;
  emailNotifications: boolean;
  redirectUrl?: string;
}

export interface FormField {
  id: string;
  type:
    | "text"
    | "email"
    | "tel"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio"
    | "file";
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    message?: string;
  };
  options?: Array<{ label: string; value: string }>; // for select, radio
  multiple?: boolean; // for select, file
  accept?: string; // for file
}

export interface CarouselContentSettings {
  slidesToShow: number;
  slidesToScroll: number;
  autoplay: boolean;
  autoplaySpeed: number;
  arrows: boolean;
}

export interface AccordionContentSettings {
  items: AccordionItem[];
}

export interface AccordionItem {
  title: string;
  content: string;
}

export interface TabsContentSettings {
  tabs: TabItem[];
}

export interface TabItem {
  title: string;
  content: string;
}

export interface TestimonialsContentSettings {
  items: TestimonialItem[];
}

export interface TestimonialItem {
  name: string;
  position: string;
  image: string;
  content: string;
}

export interface TeamContentSettings {
  items: TeamMember[];
}

export interface TeamMember {
  name: string;
  position: string;
  image: string;
  content: string;
}

export interface PricingContentSettings {
  items: PricingItem[];
}

export interface PricingItem {
  name: string;
  price: string;
  features: string[];
}

export interface TimelineContentSettings {
  items: TimelineItem[];
}

export interface TimelineItem {
  date: string;
  content: string;
}

export interface StatsContentSettings {
  counters: StatsCounter[];
  layout: "grid" | "list";
  columns: number;
  enableAnimation: boolean;
  animationDuration: number;
}

export interface StatsCounter {
  label: string;
  value: number;
  suffix: string;
  prefix: string;
  duration: number;
}

// ===== CUSTOM SETTINGS =====
export interface CustomSettings {
  useSandbox?: boolean;
  cssClasses: string[];
  customCSS: string;
  customJS: string;
  attributes: Record<string, string>;
  seoSettings: SEOSettings;
  accessibilitySettings: AccessibilitySettings;
}

export interface SEOSettings {
  enableStructuredData: boolean;
  structuredDataType?: string;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  noIndex: boolean;
  noFollow: boolean;
}

export interface AccessibilitySettings {
  ariaLabel?: string;
  ariaDescription?: string;
  role?: string;
  tabIndex?: number;
  enableKeyboardNavigation: boolean;
  enableScreenReaderSupport: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
}

// ===== MAIN SECTION INTERFACE =====
export interface PageSection {
  id: string;
  type: PageSectionType;
  order: number;
  isActive: boolean;

  // Settings
  layoutSettings: LayoutSettings;
  styleSettings: StyleSettings;
  responsiveSettings: ResponsiveSettings;
  animationSettings: AnimationSettings;
  contentSettings: ContentSettings;
  customSettings: CustomSettings;

  // Content translations
  translations: Array<{
    languageId: string;
    title?: string;
    subtitle?: string;
    content: string;
    metadata?: Record<string, any>;
    altText?: string;
    caption?: string;
  }>;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// ===== TEMPLATE INTERFACES =====
export interface Template {
  id: string;
  name: string;
  description?: string;
  category: TemplateCategory;
  subcategory?: string;
  version: string;
  tags: string[];
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

  previewImage?: string;
  previewImages: string[];

  // Template content
  sections: PageSection[];
  globalStyles?: GlobalStyles;
  assets: TemplateAsset[];

  // Metadata
  status: "DRAFT" | "REVIEW" | "APPROVED" | "PUBLISHED";
  isPublic: boolean;
  isFeatured: boolean;
  downloadCount: number;
  viewCount: number;
  rating?: number;
  ratingCount: number;

  author: {
    id: string;
    name: string;
    avatar?: string;
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface GlobalStyles {
  cssVariables: Record<string, string>;
  customCSS: string;
  fontImports: string[];
  externalStylesheets: string[];
}

export interface TemplateAsset {
  id: string;
  type: "image" | "video" | "audio" | "document" | "font" | "icon";
  name: string;
  url: string;
  size: number;
  mimeType: string;
  alt?: string;
  description?: string;
}

export enum TemplateCategory {
  HOMEPAGE = "HOMEPAGE",
  ABOUT_PAGE = "ABOUT_PAGE",
  SERVICE_PAGE = "SERVICE_PAGE",
  CONTACT_PAGE = "CONTACT_PAGE",
  PORTFOLIO = "PORTFOLIO",
  BLOG_LISTING = "BLOG_LISTING",
  BLOG_SINGLE = "BLOG_SINGLE",
  HERO_SECTIONS = "HERO_SECTIONS",
  CONTENT_BLOCKS = "CONTENT_BLOCKS",
  FOOTER_VARIANTS = "FOOTER_VARIANTS",
  HEADER_VARIANTS = "HEADER_VARIANTS",
  CARD_DESIGNS = "CARD_DESIGNS",
  FORM_LAYOUTS = "FORM_LAYOUTS",
  FULL_WEBSITE = "FULL_WEBSITE",
  INDUSTRY_SPECIFIC = "INDUSTRY_SPECIFIC",
}

export type TemplateDifficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type TemplateStatus =
  | "DRAFT"
  | "REVIEW"
  | "APPROVED"
  | "PUBLISHED"
  | "REJECTED"
  | "ARCHIVED";

// ===== UTILITY TYPES =====
export type SectionSettingsKey =
  | "layoutSettings"
  | "styleSettings"
  | "responsiveSettings"
  | "animationSettings"
  | "contentSettings"
  | "customSettings";

export interface SectionUpdatePayload {
  sectionId: string;
  settingsKey: SectionSettingsKey;
  settings: Partial<
    | LayoutSettings
    | StyleSettings
    | ResponsiveSettings
    | AnimationSettings
    | ContentSettings
    | CustomSettings
  >;
}

export interface SectionTranslationUpdatePayload {
  sectionId: string;
  languageId: string;
  translation: {
    title?: string;
    subtitle?: string;
    content?: string;
    metadata?: Record<string, any>;
    altText?: string;
    caption?: string;
  };
}

// Section Categories
export enum SectionCategory {
  LAYOUT = "layout",
  CONTENT = "content",
  MEDIA = "media",
  FORMS = "forms",
  ADVANCED = "advanced",
}

export interface SectionType {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: SectionCategory;
  isContainer?: boolean;
  allowChildren?: boolean;
  maxChildren?: number;
  allowedChildTypes?: string[];
}

export const SECTION_TYPES: Record<string, SectionType> = {
  // Layout Sections
  container: {
    id: "container",
    name: "Container",
    description: "A flexible container that can hold other sections",
    icon: "📦",
    category: SectionCategory.LAYOUT,
    isContainer: true,
    allowChildren: true,
  },

  grid: {
    id: "grid",
    name: "Grid Layout",
    description: "Responsive grid system for organizing content",
    icon: "⚏",
    category: SectionCategory.LAYOUT,
    isContainer: true,
    allowChildren: true,
    maxChildren: 12,
  },

  spacer: {
    id: "spacer",
    name: "Spacer",
    description: "Add vertical spacing between sections",
    icon: "📏",
    category: SectionCategory.LAYOUT,
  },

  // Content Sections
  hero: {
    id: "hero",
    name: "Hero Section",
    description: "Large banner section with title, subtitle and call-to-action",
    icon: "🎯",
    category: SectionCategory.CONTENT,
  },

  text: {
    id: "text",
    name: "Text Content",
    description: "Rich text content with formatting options",
    icon: "📝",
    category: SectionCategory.CONTENT,
  },

  heading: {
    id: "heading",
    name: "Heading",
    description: "Simple heading with customizable typography",
    icon: "📰",
    category: SectionCategory.CONTENT,
  },

  button: {
    id: "button",
    name: "Button",
    description: "Call-to-action button with link",
    icon: "🔘",
    category: SectionCategory.CONTENT,
  },

  // Media Sections
  image: {
    id: "image",
    name: "Image",
    description: "Single image with caption and alignment options",
    icon: "🖼️",
    category: SectionCategory.MEDIA,
  },

  gallery: {
    id: "gallery",
    name: "Image Gallery",
    description: "Collection of images in various layouts",
    icon: "🖼️",
    category: SectionCategory.MEDIA,
  },

  video: {
    id: "video",
    name: "Video",
    description: "Embedded video player",
    icon: "🎥",
    category: SectionCategory.MEDIA,
  },

  // Form Sections
  contact_form: {
    id: "contact_form",
    name: "Contact Form",
    description: "Contact form with customizable fields",
    icon: "📨",
    category: SectionCategory.FORMS,
  },

  newsletter: {
    id: "newsletter",
    name: "Newsletter Signup",
    description: "Email subscription form",
    icon: "📧",
    category: SectionCategory.FORMS,
  },

  // Advanced Sections
  custom_html: {
    id: "custom_html",
    name: "Custom HTML",
    description: "Custom HTML/CSS/JavaScript code",
    icon: "💻",
    category: SectionCategory.ADVANCED,
  },

  embed: {
    id: "embed",
    name: "Embed Code",
    description: "Embed external content like maps, widgets, etc.",
    icon: "🔗",
    category: SectionCategory.ADVANCED,
  },
};

// Content Schema Definitions
export const SECTION_SCHEMAS: Record<string, any> = {
  hero: [
    {
      key: "buttonText",
      type: "text",
      label: "Button Text",
      placeholder: "Get Started",
      defaultValue: "Get Started",
    },
    {
      key: "buttonUrl",
      type: "url",
      label: "Button URL",
      placeholder: "https://example.com",
    },
    {
      key: "backgroundImage",
      type: "image",
      label: "Background Image",
      description: "Hero background image",
    },
  ],

  image: [
    {
      key: "imageUrl",
      type: "url",
      label: "Image URL",
      placeholder: "https://example.com/image.jpg",
      required: true,
    },
    {
      key: "alt",
      type: "text",
      label: "Alt Text",
      placeholder: "Describe the image",
      required: true,
    },
    {
      key: "caption",
      type: "text",
      label: "Caption",
      placeholder: "Image caption",
    },
    {
      key: "alignment",
      type: "select",
      label: "Alignment",
      options: [
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
        { value: "right", label: "Right" },
      ],
      defaultValue: "center",
    },
    {
      key: "size",
      type: "select",
      label: "Size",
      options: [
        { value: "small", label: "Small" },
        { value: "medium", label: "Medium" },
        { value: "large", label: "Large" },
        { value: "full", label: "Full Width" },
      ],
      defaultValue: "medium",
    },
  ],

  button: [
    {
      key: "text",
      type: "text",
      label: "Button Text",
      placeholder: "Click me",
      required: true,
      defaultValue: "Click me",
    },
    {
      key: "url",
      type: "url",
      label: "Button URL",
      placeholder: "https://example.com",
      required: true,
    },
    {
      key: "style",
      type: "select",
      label: "Button Style",
      options: [
        { value: "primary", label: "Primary" },
        { value: "secondary", label: "Secondary" },
        { value: "outline", label: "Outline" },
        { value: "text", label: "Text Only" },
      ],
      defaultValue: "primary",
    },
    {
      key: "size",
      type: "select",
      label: "Button Size",
      options: [
        { value: "small", label: "Small" },
        { value: "medium", label: "Medium" },
        { value: "large", label: "Large" },
      ],
      defaultValue: "medium",
    },
    {
      key: "openInNewTab",
      type: "checkbox",
      label: "Open in New Tab",
      defaultValue: false,
    },
  ],

  spacer: [
    {
      key: "height",
      type: "number",
      label: "Height (px)",
      placeholder: "40",
      min: 10,
      max: 500,
      step: 10,
      defaultValue: 40,
    },
  ],

  video: [
    {
      key: "videoUrl",
      type: "url",
      label: "Video URL",
      placeholder: "https://youtube.com/watch?v=...",
      required: true,
      description: "YouTube, Vimeo, or direct video file URL",
    },
    {
      key: "autoplay",
      type: "checkbox",
      label: "Autoplay",
      defaultValue: false,
      description: "Note: Most browsers block autoplay with sound",
    },
    {
      key: "controls",
      type: "checkbox",
      label: "Show Controls",
      defaultValue: true,
    },
    {
      key: "muted",
      type: "checkbox",
      label: "Muted",
      defaultValue: false,
    },
    {
      key: "loop",
      type: "checkbox",
      label: "Loop",
      defaultValue: false,
    },
  ],

  gallery: [
    {
      key: "images",
      type: "repeater",
      label: "Images",
      fields: [
        {
          key: "url",
          type: "url",
          label: "Image URL",
          required: true,
        },
        {
          key: "alt",
          type: "text",
          label: "Alt Text",
          required: true,
        },
        {
          key: "caption",
          type: "text",
          label: "Caption",
        },
      ],
    },
    {
      key: "columns",
      type: "select",
      label: "Columns",
      options: [
        { value: "2", label: "2 Columns" },
        { value: "3", label: "3 Columns" },
        { value: "4", label: "4 Columns" },
        { value: "5", label: "5 Columns" },
      ],
      defaultValue: "3",
    },
    {
      key: "spacing",
      type: "number",
      label: "Image Spacing (px)",
      min: 0,
      max: 50,
      defaultValue: 10,
    },
  ],

  contact_form: [
    {
      key: "fields",
      type: "repeater",
      label: "Form Fields",
      fields: [
        {
          key: "type",
          type: "select",
          label: "Field Type",
          options: [
            { value: "text", label: "Text" },
            { value: "email", label: "Email" },
            { value: "tel", label: "Phone" },
            { value: "textarea", label: "Textarea" },
            { value: "select", label: "Select" },
            { value: "checkbox", label: "Checkbox" },
          ],
          required: true,
        },
        {
          key: "label",
          type: "text",
          label: "Field Label",
          required: true,
        },
        {
          key: "placeholder",
          type: "text",
          label: "Placeholder",
        },
        {
          key: "required",
          type: "checkbox",
          label: "Required Field",
        },
      ],
    },
    {
      key: "submitText",
      type: "text",
      label: "Submit Button Text",
      defaultValue: "Send Message",
    },
    {
      key: "successMessage",
      type: "text",
      label: "Success Message",
      defaultValue: "Thank you for your message!",
    },
  ],

  grid: [
    {
      key: "columns",
      type: "select",
      label: "Columns",
      options: [
        { value: "1", label: "1 Column" },
        { value: "2", label: "2 Columns" },
        { value: "3", label: "3 Columns" },
        { value: "4", label: "4 Columns" },
        { value: "6", label: "6 Columns" },
      ],
      defaultValue: "2",
    },
    {
      key: "gap",
      type: "select",
      label: "Gap Size",
      options: [
        { value: "small", label: "Small" },
        { value: "medium", label: "Medium" },
        { value: "large", label: "Large" },
      ],
      defaultValue: "medium",
    },
    {
      key: "responsiveBreakpoints",
      type: "checkbox",
      label: "Responsive Columns",
      defaultValue: true,
      description: "Automatically adjust columns on smaller screens",
    },
  ],
};
