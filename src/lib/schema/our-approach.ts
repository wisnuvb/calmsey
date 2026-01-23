import { PageContentSchema } from "../page-content-schema";

export const OUR_APPROACH_SCHEMA: PageContentSchema = {
  pageType: "OUR_APPROACH",
  sections: ["Hero", "Support", "Theory of Change", "Feedback Callout"],
  fields: [
    // Hero Section
    {
      key: "hero.title",
      label: "Page Title",
      type: "text",
      section: "Hero",
      required: true,
      placeholder: "How we fund change",
      defaultValue: "How we fund change",
    },
    {
      key: "hero.subtitle",
      label: "Page Subtitle",
      type: "textarea",
      section: "Hero",
      required: true,
      placeholder:
        "Lorem ipsum dolor sit amet consectetur. Sed vel vitae vel mauris sit tempor et.",
      defaultValue:
        "Lorem ipsum dolor sit amet consectetur. Sed vel vitae vel mauris sit tempor et. Nibh bibendum amet ridiculus elementum praesent tempor nec. Nulla et enim consectetur dictum nulla laoreet neque. Risus tempor convallis hendrerit proin.",
    },
    {
      key: "hero.backgroundImage",
      label: "Hero Background Image",
      type: "image",
      section: "Hero",
      defaultValue: "/assets/hero-about-us.webp",
    },

    // Support Section
    {
      key: "support.title",
      label: "Support Section Title",
      type: "text",
      section: "Support",
      defaultValue: "What We Support",
      helpText:
        "Main title for the support section (currently hardcoded in component)",
    },
    {
      key: "support.navigationItems",
      label: "Navigation Items",
      type: "multiple",
      section: "Support",
      helpText:
        "Manage navigation items for the Support section. Each item represents a tab with its own content.",
      itemLabel: "Navigation Item",
      itemSchema: [
        {
          key: "id",
          label: "Item ID",
          type: "text",
          required: true,
          placeholder: "what-we-support",
          helpText:
            "Unique identifier for this navigation item (e.g., what-we-support, tenure-rights, framework)",
        },
        {
          key: "label",
          label: "Navigation Label",
          type: "text",
          required: true,
          placeholder: "Our approach to Grantmaking",
          helpText: "Text displayed in the navigation button",
        },
        {
          key: "contentTitle",
          label: "Content Title",
          type: "text",
          required: true,
          placeholder: "Our approach to Grantmaking",
          helpText: "Main title displayed in the content area",
        },
        {
          key: "imageSrc",
          label: "Image URL",
          type: "image",
          required: false,
          placeholder: "/images/example.jpg",
          helpText: "Optional image displayed in the content area",
        },
        {
          key: "imageAlt",
          label: "Image Alt Text",
          type: "text",
          required: false,
          placeholder: "Image description",
          helpText: "Alternative text for the image (for accessibility)",
        },
        {
          key: "paragraphs",
          label: "Content Paragraphs",
          type: "textarea",
          required: false,
          placeholder:
            "First paragraph here.\n\nSecond paragraph here.\n\nThird paragraph here.",
          helpText:
            "Content paragraphs. Separate multiple paragraphs with a blank line (double newline). Each paragraph will be displayed separately.",
        },
        {
          key: "practicesTitle",
          label: "Practices Section Title",
          type: "text",
          required: false,
          placeholder: "What we practice",
          helpText:
            "Optional title for the practices list (leave empty if no practices)",
        },
        {
          key: "practices",
          label: "Practices List",
          type: "multiple",
          required: false,
          itemLabel: "Practice",
          helpText:
            "Optional practices list. Add practices with check icon.",
          itemSchema: [
            {
              key: "id",
              label: "ID",
              type: "text",
              required: true,
              placeholder: "1",
              helpText: "Unique identifier for this practice",
            },
            {
              key: "text",
              label: "Practice Text",
              type: "textarea",
              required: true,
              placeholder: "Enter practice description",
              helpText: "Text displayed for this practice",
            },
          ],
        },
        {
          key: "infoBlocks",
          label: "Info Blocks",
          type: "multiple",
          required: false,
          itemLabel: "Info Block",
          helpText:
            "Optional info blocks (alert boxes). Add info blocks with icons.",
          itemSchema: [
            {
              key: "id",
              label: "ID",
              type: "text",
              required: true,
              placeholder: "1",
              helpText: "Unique identifier for this info block",
            },
            {
              key: "icon",
              label: "Icon",
              type: "text",
              required: true,
              placeholder: "info",
              helpText: 'Icon type: "shield", "flag", or "info"',
            },
            {
              key: "text",
              label: "Info Block Text",
              type: "textarea",
              required: true,
              placeholder: "Enter info block text",
              helpText: "Text displayed in the info block",
            },
          ],
        },
        {
          key: "numberedListTitle",
          label: "Numbered List Title",
          type: "text",
          required: false,
          placeholder: "We consider tenure to encompass",
          helpText:
            "Optional title for the numbered list (leave empty if no numbered list)",
        },
        {
          key: "numberedList",
          label: "Numbered List",
          type: "multiple",
          required: false,
          itemLabel: "Numbered Item",
          helpText:
            "Optional numbered list. Add numbered items with numbers and text.",
          itemSchema: [
            {
              key: "id",
              label: "ID",
              type: "text",
              required: true,
              placeholder: "1",
              helpText: "Unique identifier for this numbered item",
            },
            {
              key: "number",
              label: "Number",
              type: "text",
              required: true,
              placeholder: "01",
              helpText: "Number displayed (e.g., 01, 02, 03)",
            },
            {
              key: "text",
              label: "Item Text",
              type: "textarea",
              required: true,
              placeholder: "Enter item text",
              helpText: "Text displayed for this numbered item",
            },
          ],
        },
        {
          key: "numberedListFooter",
          label: "Numbered List Footer Text",
          type: "textarea",
          required: false,
          placeholder: "Footer text after numbered list",
          helpText:
            "Optional footer text displayed after the numbered list. Supports **bold** formatting.",
        },
        {
          key: "infoBlockFooterIcon",
          label: "Footer Info Block Icon",
          type: "text",
          required: false,
          placeholder: "info",
          helpText:
            'Optional icon for footer info block. Options: "shield", "flag", or "info". Leave empty if no footer info block.',
        },
        {
          key: "infoBlockFooterText",
          label: "Footer Info Block Text",
          type: "textarea",
          required: false,
          placeholder: "Footer info block text",
          helpText:
            "Optional text for footer info block (usually with green background). Supports **bold** formatting. Leave empty if no footer info block.",
        },
        {
          key: "downloadButtonLabel",
          label: "Download Button Label Text",
          type: "text",
          required: false,
          placeholder: "Read the full-version of our Grantmaking Framework",
          helpText:
            "Optional label text displayed before the download button",
        },
        {
          key: "downloadButtonText",
          label: "Download Button Text",
          type: "text",
          required: false,
          placeholder: "Download Now",
          helpText: "Text displayed on the download button",
        },
        {
          key: "downloadButtonUrl",
          label: "Download Button URL",
          type: "text",
          required: false,
          placeholder: "/documents/framework.pdf",
          helpText: "URL or path to the downloadable file",
        },
      ],
    },

    // Theory of Change Section
    {
      key: "theoryOfChange.title",
      label: "Section Tag",
      type: "text",
      section: "Theory of Change",
      defaultValue: "THEORY OF CHANGE",
      helpText: "Small uppercase heading displayed above the subtitle",
    },
    {
      key: "theoryOfChange.subtitle",
      label: "Section Subtitle",
      type: "text",
      section: "Theory of Change",
      defaultValue: "How We View Change to Happen?",
      helpText: "Main heading for the section",
    },
    {
      key: "theoryOfChange.description",
      label: "Description",
      type: "textarea",
      section: "Theory of Change",
      defaultValue:
        "Self-determination, meaningful participation and locally led action become possible diverse rights of local communities, small-scale fishers, fish workers, and Indigenous Peoples are recognized. To move toward secure tenure and recognized rights it is these peoples that must be centered in resourcing and actions – with direct funding and greater control in fund distribution. We engage with a diversity of partners – across multiple levels – who are affecting governance of oceans, coasts, rivers, lakes, climate responses, conservation and food systems.\n\nWe collaborate most closely with local communities, small-scale fishers, fish workers, Indigenous Peoples, and their representative groups and allies. Throughout these partnerships we pay particular attention to strategies that promote social inclusion and gender equity. We employ and support targeted strategies with women, non-elite and economically disadvantaged peoples. We collaborate with partners who support different social groups and peoples to improve their experiences, agency and power within established legal, economic and social systems. The work we support will lead to greater quality and accessibility of services for facilitation, negotiation, documentation, registration, conflict resolution, and remedy.\n\nWe support ongoing efforts to build accountability, respect and awareness amongst governments, NGOs, funders and the private sector, ensuring rights recognition and tenure sensitivity in the policies and processes they employ. We support work that evaluates and diversifies the values and knowledge systems that are influencing these decision makers. We support work that changes and/or challenges (including via strategic litigation) inequitable or unjust legal, economic and social conditions, processes or policies that are undermining tenure security and rights in the governance of oceans, coasts, lakes, shorelines, and other aquatic systems.",
      helpText: "Detailed description text (supports line breaks with \\n)",
    },
    {
      key: "theoryOfChange.image",
      label: "Theory of Change Diagram",
      type: "image",
      section: "Theory of Change",
      defaultValue: "/assets/our-view.webp",
      helpText: "Diagram image showing the theory of change",
    },
    {
      key: "theoryOfChange.imageAlt",
      label: "Image Alt Text",
      type: "text",
      section: "Theory of Change",
      defaultValue: "Theory of Change diagram showing how change happens",
      helpText: "Alternative text for the image (accessibility)",
    },
    {
      key: "theoryOfChange.showMoreText",
      label: "Show More Button Text",
      type: "text",
      section: "Theory of Change",
      defaultValue: "Show More",
      helpText: "Text displayed on the expand/collapse button",
    },

    // Feedback Callout Section
    {
      key: "feedbackCallout.title",
      label: "Title",
      type: "text",
      section: "Feedback Callout",
      defaultValue: "We value your feedback",
      helpText: "Main title of the feedback section",
    },
    {
      key: "feedbackCallout.description",
      label: "Description",
      type: "textarea",
      section: "Feedback Callout",
      defaultValue:
        "Share your thoughts to help us continually improve our governance, practices and accountability.",
      helpText: "Description text below the title",
    },
    {
      key: "feedbackCallout.title",
      label: "Feedback Callout Title",
      type: "text",
      section: "Feedback Callout",
      defaultValue: "We value your feedback",
      helpText: "Main title displayed in the feedback callout section",
    },
    {
      key: "feedbackCallout.description",
      label: "Feedback Callout Description",
      type: "textarea",
      section: "Feedback Callout",
      defaultValue:
        "Share your thoughts to help us continually improve our governance, practices and accountability.",
      helpText: "Description text displayed below the title",
    },
    {
      key: "feedbackCallout.feedbackButtonText",
      label: "Feedback Button Text",
      type: "text",
      section: "Feedback Callout",
      defaultValue: "Give Feedback",
      helpText: "Text displayed on the feedback button",
    },
    {
      key: "feedbackCallout.feedbackButtonLink",
      label: "Feedback Button Link",
      type: "text",
      section: "Feedback Callout",
      defaultValue: "/feedback",
      helpText: "URL for the feedback button (can be relative path like /feedback or full URL)",
    },
    {
      key: "feedbackCallout.learnMoreButtonText",
      label: "Learn More Button Text",
      type: "text",
      section: "Feedback Callout",
      defaultValue: "Learn More",
      helpText: "Text displayed on the learn more button",
    },
    {
      key: "feedbackCallout.learnMoreButtonLink",
      label: "Learn More Button Link",
      type: "text",
      section: "Feedback Callout",
      defaultValue: "/governance",
      helpText: "URL for the learn more button (can be relative path like /governance or full URL)",
    },
    {
      key: "feedbackCallout.backgroundColor",
      label: "Background Color",
      type: "text",
      section: "Feedback Callout",
      defaultValue: "bg-[#3C62ED]",
      helpText: "Background color class for the section (e.g., bg-[#3C62ED], bg-blue-500)",
    },
  ],
};
