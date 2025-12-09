import { PageContentSchema } from "../page-content-schema";

export const GOVERNANCE_SCHEMA: PageContentSchema = {
  pageType: "GOVERNANCE",
  sections: [
    "Hero",
    "Values & Principles",
    "Values",
    "Guiding Principles",
    "Funders",
    "Committees",
  ],
  fields: [
    // Hero Section
    {
      key: "hero.title",
      label: "Page Title",
      type: "text",
      section: "Hero",
      required: true,
    },
    {
      key: "hero.subtitle",
      label: "Page Subtitle",
      type: "textarea",
      section: "Hero",
    },
    {
      key: "hero.backgroundImage",
      label: "Hero Background Image",
      type: "image",
      section: "Hero",
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
    // Values & Principles Section
    {
      key: "valuesPrinciples.title",
      label: "Section Title",
      type: "text",
      section: "Values & Principles",
      defaultValue: "Our Values & Principles",
      helpText: "Main heading for the values and principles section",
    },
    {
      key: "valuesPrinciples.subtitle",
      label: "Section Subtitle",
      type: "text",
      section: "Values & Principles",
      defaultValue:
        "Built with partners, attentive to power and accountability in all we do",
      helpText: "Subtitle displayed below the title",
    },
    {
      key: "valuesPrinciples.description",
      label: "Description",
      type: "textarea",
      section: "Values & Principles",
      defaultValue:
        "Our values and principles were built through consultation with partners, discussion with the Steering Committee, and established practices of liberatory grantmaking. They guide our decisions, interactions, and approach to our work—they are foundational to who we are as an organization.",
      helpText: "Description text displayed below the subtitle",
    },
    {
      key: "valuesPrinciples.buttonText",
      label: "Button Text",
      type: "text",
      section: "Values & Principles",
      defaultValue: "Learn More About Our Strategy",
      helpText: "Text displayed on the button",
    },
    {
      key: "valuesPrinciples.buttonLink",
      label: "Button Link",
      type: "text",
      section: "Values & Principles",
      defaultValue: "/strategy",
      helpText: "URL for the button",
    },
    {
      key: "valuesPrinciples.image",
      label: "Image",
      type: "image",
      section: "Values & Principles",
      defaultValue: "/assets/principles.webp",
      helpText: "Image displayed on the right side",
    },
    {
      key: "valuesPrinciples.imageAlt",
      label: "Image Alt Text",
      type: "text",
      section: "Values & Principles",
      defaultValue: "Our Values & Principles",
      helpText: "Alternative text for the image (accessibility)",
    },
  ],
};
