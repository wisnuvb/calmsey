import { PageSectionType, PageType } from "@prisma/client";

export type PageTypeConfig = {
  type: PageType;
  slug: string;
  name: string;
  description: string;
  requiredSections: PageSectionType[];
  optionalSections: PageSectionType[];
  allowedSettings: string[]; // Field that can be customized
  isStatic: boolean; // Whether the page is static or dynamic
};

export const PAGE_TYPE_CONFIGS: Record<PageType, PageTypeConfig> = {
  [PageType.HOME]: {
    type: PageType.HOME,
    slug: "",
    name: "Homepage",
    description: "Homepage of the website",
    requiredSections: [PageSectionType.HERO, PageSectionType.CTA_BLOCK],
    optionalSections: [
      PageSectionType.FEATURED_CONTENT,
      PageSectionType.TESTIMONIALS,
    ],
    allowedSettings: ["layout", "colorScheme", "showBreadcrumb"],
    isStatic: false,
  },

  [PageType.ABOUT_US]: {
    type: PageType.ABOUT_US,
    slug: "about-us",
    name: "About Us",
    description: "About us page",
    requiredSections: [
      PageSectionType.RICH_TEXT,
      PageSectionType.TEAM_SHOWCASE,
    ],
    optionalSections: [PageSectionType.IMAGE_GALLERY],
    allowedSettings: ["layout", "showTeamFilters"],
    isStatic: true,
  },

  [PageType.OUR_WORK]: {
    type: PageType.OUR_WORK,
    slug: "our-work",
    name: "Our Work",
    description: "Portfolio or project showcase",
    requiredSections: [PageSectionType.FEATURED_CONTENT],
    optionalSections: [
      PageSectionType.CATEGORY_SHOWCASE,
      PageSectionType.SEARCH_INTERFACE,
    ],
    allowedSettings: ["layout", "showFilters", "itemsPerPage"],
    isStatic: false,
  },

  [PageType.GOVERNANCE]: {
    type: PageType.GOVERNANCE,
    slug: "governance",
    name: "Governance",
    description: "Governance page",
    requiredSections: [PageSectionType.RICH_TEXT],
    optionalSections: [
      PageSectionType.ACCORDION,
      PageSectionType.DOCUMENT_LIST,
    ],
    allowedSettings: ["layout", "downloadOptions"],
    isStatic: true,
  },

  [PageType.STORIES]: {
    type: PageType.STORIES,
    slug: "stories",
    name: "Stories",
    description: "Blog or article stories",
    requiredSections: [PageSectionType.ARTICLE_LIST],
    optionalSections: [
      PageSectionType.SEARCH_INTERFACE,
      PageSectionType.CATEGORY_SHOWCASE,
    ],
    allowedSettings: ["layout", "itemsPerPage", "sortBy"],
    isStatic: false,
  },

  [PageType.GET_INVOLVED]: {
    type: PageType.GET_INVOLVED,
    slug: "get-involved",
    name: "Get Involved",
    description: "Call-to-action for participation",
    requiredSections: [PageSectionType.CTA_BLOCK, PageSectionType.CONTACT_FORM],
    optionalSections: [PageSectionType.RICH_TEXT],
    allowedSettings: ["layout", "formType"],
    isStatic: true,
  },

  [PageType.CUSTOM]: {
    type: PageType.CUSTOM,
    slug: "custom",
    name: "Custom",
    description: "Custom page for any purpose",
    requiredSections: [],
    optionalSections: [],
    allowedSettings: [],
    isStatic: false,
  },
};

// Helper functions
export const getPageConfig = (type: PageType): PageTypeConfig => {
  return PAGE_TYPE_CONFIGS[type];
};

export const validatePageSections = (
  type: PageType,
  sections: PageSectionType[]
): { valid: boolean; errors: string[] } => {
  const config = getPageConfig(type);
  const errors: string[] = [];

  // Check required sections
  config.requiredSections.forEach((required) => {
    if (!sections.includes(required)) {
      errors.push(`Missing required section: ${required}`);
    }
  });

  // Check if sections are allowed
  const allowedSections = [
    ...config.requiredSections,
    ...config.optionalSections,
  ];
  sections.forEach((section) => {
    if (!allowedSections.includes(section)) {
      errors.push(`Section ${section} not allowed for ${type}`);
    }
  });

  return { valid: errors.length === 0, errors };
};
