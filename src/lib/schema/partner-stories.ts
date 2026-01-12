import { PageContentSchema } from "../page-content-schema";

export const PARTNER_STORIES_SCHEMA: PageContentSchema = {
  pageType: "STORIES",
  sections: ["Hero", "Community Stories", "All Stories", "Feedback Callout"],
  fields: [
    // Hero Section
    {
      key: "hero.title",
      label: "Page Title",
      type: "text",
      section: "Hero",
      required: true,
      defaultValue: "Stories From Our Partners",
    },
    {
      key: "hero.subtitle",
      label: "Page Subtitle",
      type: "textarea",
      section: "Hero",
      defaultValue:
        "These stories showcase the experiences, leadership, and voices of communities, fisher peoples, and Indigenous Peoples as they work to secure and strengthen their rights to land, water, and resources. We invite our partners to share glimpses into their journeys: experiences of struggle and tenure insecurity, and also the courage, knowledge, and actions it takes to achieve tenure security and rights recognition.",
    },
    {
      key: "hero.backgroundImage",
      label: "Hero Background Image",
      type: "image",
      section: "Hero",
      defaultValue: "/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png",
    },

    // Community Stories Section
    {
      key: "communityStories.leftText",
      label: "Left Column Text",
      type: "textarea",
      section: "Community Stories",
      defaultValue:
        "In many cases, Turning Tides plays a small part in these much longer stories of struggle, resilience, and transformation that belong to the communities themselves.",
    },
    {
      key: "communityStories.rightText",
      label: "Right Column Text",
      type: "textarea",
      section: "Community Stories",
      defaultValue:
        "**Each story celebrates communities working with allies and the supports they bring—legal services, advocacy, strategic partnerships.** Together, they are reclaiming how tenure is understood and experienced— not only as short term access and use, but as a suite of enduring rights, responsibilities, and socio-cultural relationships. Working locally, nationally, and with international processes, our partners are at the helm; ensuring that Indigenous and fisher peoples tenure security and rights recognition lead to improved social and environmental change.",
      helpText:
        "Use **text** to make portions bold. Text between ** markers will be rendered as bold.",
    },
    {
      key: "communityStories.images",
      label: "Image Gallery",
      type: "multiple",
      section: "Community Stories",
      defaultValue: JSON.stringify([
        {
          id: "1",
          src: "/assets/demo/61d49ae554575244d2db7ab0551faf2183798c04.png",
          alt: "Young Asian man on beach holding two large silver fish with wooden cart and motorcycle in background",
        },
        {
          id: "2",
          src: "/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png",
          alt: "Four women standing together with packaged food products on table in front of them",
        },
        {
          id: "3",
          src: "/assets/demo/61d49ae554575244d2db7ab0551faf2183798c04.png",
          alt: "Asian man on beach wearing conical hat holding two large marine creatures with colorful boat in background",
        },
      ]),
      itemSchema: [
        { key: "id", type: "text", label: "Image ID", required: true },
        { key: "src", type: "image", label: "Image", required: true },
        { key: "alt", type: "text", label: "Alt Text", required: true },
      ],
      helpText: "Currently hidden in the UI but can be enabled for future use.",
    },

    // All Stories List Section
    {
      key: "allStories.title",
      label: "Section Title",
      type: "text",
      section: "All Stories",
      defaultValue: "All Stories From Our Partners",
    },
    {
      key: "allStories.maxStories",
      label: "Maximum Stories to Display",
      type: "number",
      section: "All Stories",
      defaultValue: "12",
      helpText:
        "Maximum number of stories to fetch and display. Leave empty for no limit.",
    },
    {
      key: "allStories.sortOrder",
      label: "Default Sort Order",
      type: "text",
      section: "All Stories",
      defaultValue: "Latest",
      helpText:
        "Options: Latest, Oldest, A-Z, Z-A. User can change this on the frontend.",
    },
    {
      key: "allStories.filterCategories",
      label: "Enabled Filter Categories",
      type: "multiple",
      section: "All Stories",
      defaultValue: JSON.stringify([]),
      helpText:
        "List of category slugs to enable for filtering. Leave empty to show all categories. Example: community-stories, indigenous-peoples, fisher-peoples",
      itemSchema: [
        {
          key: "categorySlug",
          type: "text",
          label: "Category Slug",
          required: true,
        },
      ],
    },
    {
      key: "allStories.defaultCategory",
      label: "Default Category Filter",
      type: "text",
      section: "All Stories",
      defaultValue: "",
      helpText:
        "Category slug to filter by default. Leave empty to show all stories.",
    },
    {
      key: "allStories.showLoadMore",
      label: "Show Load More Button",
      type: "boolean",
      section: "All Stories",
      defaultValue: "true",
    },

    // Feedback Callout Section
    {
      key: "feedbackCallout.title",
      label: "Section Title",
      type: "text",
      section: "Feedback Callout",
      defaultValue: "We value your support",
    },
    {
      key: "feedbackCallout.description",
      label: "Description",
      type: "textarea",
      section: "Feedback Callout",
      defaultValue:
        "Connect with us to co-create solutions that protect rights, sustain livelihoods, and centre local voices.",
    },
    {
      key: "feedbackCallout.feedbackButtonText",
      label: "Primary Button Text",
      type: "text",
      section: "Feedback Callout",
      defaultValue: "Get Involved",
    },
    {
      key: "feedbackCallout.feedbackButtonLink",
      label: "Primary Button Link",
      type: "text",
      section: "Feedback Callout",
      defaultValue: "/get-involved",
    },
    {
      key: "feedbackCallout.learnMoreButtonText",
      label: "Secondary Button Text",
      type: "text",
      section: "Feedback Callout",
      defaultValue: "Learn More",
    },
    {
      key: "feedbackCallout.learnMoreButtonLink",
      label: "Secondary Button Link",
      type: "text",
      section: "Feedback Callout",
      defaultValue: "/about",
    },
  ],
};
