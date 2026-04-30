import { PageContentSchema } from "../page-content-schema";

export const GET_INVOLVED_SCHEMA: PageContentSchema = {
  pageType: "GET_INVOLVED",
  sections: ["Hero", "How to Help", "Opportunities", "Contact CTA"],
  fields: [
    {
      key: "hero.title",
      label: "Form headline (right column)",
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
      key: "hero.backgroundImage",
      label: "Left column background image",
      type: "image",
      section: "Hero",
    },
    {
      key: "hero.backgroundImageAlt",
      label: "Left column image alt text",
      type: "text",
      section: "Hero",
    },
    {
      key: "hero.overlayTitle",
      label: "Left column headline",
      type: "text",
      section: "Hero",
    },
    {
      key: "hero.overlayDescription",
      label: "Left column description",
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
      label: "Submit button label",
      type: "text",
      section: "Contact CTA",
      defaultValue: "Send Message",
    },
    {
      key: "cta.bannerLeftParagraph",
      label: "Blue banner — left paragraph",
      type: "textarea",
      section: "Contact CTA",
      helpText: "Shown in the navy strip below the form.",
    },
    {
      key: "cta.bannerRightParagraph",
      label: "Blue banner — right paragraph",
      type: "textarea",
      section: "Contact CTA",
      helpText: 'Use **emphasized phrase** for optional bold styling.',
    },
  ],
};
