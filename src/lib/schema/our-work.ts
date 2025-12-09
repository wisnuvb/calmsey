import { PageContentSchema } from "../page-content-schema";

export const OUR_WORK_SCHEMA: PageContentSchema = {
  pageType: "OUR_WORK",
  sections: [
    "Hero",
    "Case Studies",
    "Approach",
    "Relationships",
    "Latest Activity",
    "Partner Stories",
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
      key: "approach.title",
      label: "Approach Title",
      type: "text",
      section: "Approach",
    },
    {
      key: "approach.content",
      label: "Approach Content",
      type: "html",
      section: "Approach",
    },
    // Relationships Section
    {
      key: "relationships.titleLines",
      label: "Title Lines",
      type: "json",
      section: "Relationships",
      defaultValue: JSON.stringify(
        [
          "Building relationships.",
          "Staying connected.",
          "Supporting partners.",
        ],
        null,
        2
      ),
      helpText:
        'Array of title lines displayed as separate headings. Example: ["Line 1", "Line 2", "Line 3"]',
    },
    {
      key: "relationships.description",
      label: "Description",
      type: "textarea",
      section: "Relationships",
      defaultValue:
        "Our team works to build and maintain strong relationships with local communities, small-scale fishers and fish workers, Indigenous Peoples and their supporting organizations. We stay connected, listen actively, and respond to what partners need—not just with funding, but with the full range of support that makes their work possible.",
      helpText: "Description text displayed in the right column",
    },
    {
      key: "relationships.images",
      label: "Gallery Images",
      type: "multiple",
      section: "Relationships",
      defaultValue: JSON.stringify(
        [
          {
            id: "1",
            src: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
            alt: "Four individuals engaged in conversation indoors",
          },
          {
            id: "2",
            src: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
            alt: "Person casting fishing net from boat at sunset",
          },
          {
            id: "3",
            src: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
            alt: "Person smiling while holding string of dried fish",
          },
          {
            id: "4",
            src: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
            alt: "Aerial view of coastal area with palm trees and boats",
          },
          {
            id: "5",
            src: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
            alt: "Group of five diverse people smiling outdoors",
          },
          {
            id: "6",
            src: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
            alt: "Sunset over water with fishing boats and person holding fish",
          },
        ],
        null,
        2
      ),
      itemLabel: "Image",
      itemSchema: [
        {
          key: "src",
          label: "Image URL",
          type: "image",
          required: true,
          placeholder: "/path/to/image.jpg",
        },
        {
          key: "alt",
          label: "Alt Text",
          type: "text",
          required: true,
          placeholder: "Image description",
          helpText: "Alternative text for accessibility",
        },
      ],
      helpText:
        "Gallery images displayed in masonry grid layout. Each image should have a unique id, src, and alt text.",
    },
    // Latest Activity Section
    {
      key: "latestActivity.title",
      label: "Section Title",
      type: "text",
      section: "Latest Activity",
      defaultValue: "Latest Activity",
      helpText: "Main heading for the latest activity section",
    },
    {
      key: "latestActivity.categorySlug",
      label: "Category Slug",
      type: "text",
      section: "Latest Activity",
      defaultValue: "",
      helpText:
        "Category slug to filter articles. Leave empty to show all articles. Example: 'activities' or 'updates'",
    },
    {
      key: "latestActivity.filterOptions",
      label: "Filter Options",
      type: "text",
      section: "Latest Activity",
      defaultValue: "Latest,All,2025,2024",
      helpText:
        "Comma-separated list of filter options. Example: 'Latest,All,2025,2024'",
    },
    {
      key: "latestActivity.itemsPerPage",
      label: "Items Per Page",
      type: "number",
      section: "Latest Activity",
      defaultValue: "9",
      helpText: "Number of activities to display per page",
    },
    // Partner Stories Section
    {
      key: "partnerStories.tag",
      label: "Section Tag",
      type: "text",
      section: "Partner Stories",
      defaultValue: "COMMUNITY ECHOES",
      helpText: "Tag label displayed above the title",
    },
    {
      key: "partnerStories.title",
      label: "Section Title",
      type: "text",
      section: "Partner Stories",
      defaultValue: "Stories From Our Partners",
      helpText: "Main section title",
    },
    {
      key: "partnerStories.description",
      label: "Section Description",
      type: "textarea",
      section: "Partner Stories",
      defaultValue: "Turning Tides engages with a diversity of partners",
      helpText: "Description text below the title",
    },
    {
      key: "partnerStories.buttonText",
      label: "Button Text",
      type: "text",
      section: "Partner Stories",
      defaultValue: "All Stories",
      helpText: "Text for the view all button",
    },
    {
      key: "partnerStories.buttonUrl",
      label: "Button URL",
      type: "text",
      section: "Partner Stories",
      defaultValue: "/stories",
      helpText: "URL for the view all button",
    },
    {
      key: "partnerStories.backgroundColor",
      label: "Background Color",
      type: "text",
      section: "Partner Stories",
      defaultValue: "blue",
      helpText: 'Background color: "blue" or "white"',
      placeholder: "blue",
    },
    {
      key: "partnerStories.categorySlug",
      label: "Category Slug",
      type: "text",
      section: "Partner Stories",
      defaultValue: "",
      helpText:
        "Category slug to filter articles. Leave empty to show all articles. Example: 'stories' or 'videos'",
    },
    {
      key: "partnerStories.limit",
      label: "Number of Stories",
      type: "number",
      section: "Partner Stories",
      defaultValue: "3",
      helpText: "Number of stories to display (default: 3)",
    },
    {
      key: "stories.title",
      label: "Stories Section Title",
      type: "text",
      section: "Stories",
    },
  ],
};
