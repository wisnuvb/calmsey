import { PageContentSchema } from "../page-content-schema";

export const CONTACT_SCHEMA: PageContentSchema = {
  pageType: "CONTACT",
  sections: ["Hero", "Contact Information", "Office Hours"],
  fields: [
    // Hero
    {
      key: "hero.title",
      label: "Page Title",
      type: "text",
      section: "Hero",
      required: true,
      defaultValue: "Contact Us",
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

    // Contact Information
    {
      key: "contact.email",
      label: "Email Address",
      type: "email",
      section: "Contact Information",
      required: true,
      placeholder: "info@turningtides.org",
    },
    {
      key: "contact.phone",
      label: "Phone Number",
      type: "phone",
      section: "Contact Information",
      placeholder: "+1 (555) 123-4567",
    },
    {
      key: "contact.address",
      label: "Physical Address",
      type: "textarea",
      section: "Contact Information",
    },
    {
      key: "contact.mapEmbed",
      label: "Google Maps Embed Code",
      type: "textarea",
      section: "Contact Information",
      helpText: "Paste the iframe embed code from Google Maps",
    },

    // Office Hours
    {
      key: "hours.weekdays",
      label: "Weekday Hours",
      type: "text",
      section: "Office Hours",
      defaultValue: "8:00 AM - 6:00 PM",
    },
    {
      key: "hours.saturday",
      label: "Saturday Hours",
      type: "text",
      section: "Office Hours",
      defaultValue: "9:00 AM - 4:00 PM",
    },
    {
      key: "hours.sunday",
      label: "Sunday Hours",
      type: "text",
      section: "Office Hours",
      defaultValue: "Closed",
    },
  ],
};
