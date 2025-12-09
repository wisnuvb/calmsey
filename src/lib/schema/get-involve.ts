import { PageContentSchema } from "../page-content-schema";

export const GET_INVOLVED_SCHEMA: PageContentSchema = {
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
