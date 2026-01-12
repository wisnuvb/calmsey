import { PageContentSchema } from "../page-content-schema";

export const OUR_APPROACH_SCHEMA: PageContentSchema = {
  pageType: "OUR_APPROACH",
  sections: ["Hero", "Support", "Theory of Change"],
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
    // Note: SupportSection memiliki konten hardcoded dalam navigationItems array
    // Jika ingin dynamic, bisa tambahkan field untuk customize navigation items
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
      defaultValue: JSON.stringify(
        [
          {
            id: "what-we-support",
            title: "Our approach to Grantmaking​",
            content: {
              title: "Our approach to Grantmaking​",
              description: [
                "Turning Tides implements and advocates for liberatory approaches to partnership and grant-making. This means working together with Indigenous Peoples, local communities, small-scale fishers and fish workers through reciprocal transformation where both we and our partners work to change the systems and power structures that create barriers to tenure security.",
                "Our practices include multi-year flexible funding, streamlined processes, and partnership support that extends beyond financial contributions.",
              ],
              titleItem: "What we practice",
              items: [
                {
                  icon: "CheckCircle2",
                  text: "Empowering local communities, small-scale fishers and fish workers, and Indigenous peoples to experience security of tenure, certainty of livelihoods and leadership in environmental stewardship.",
                },
                {
                  icon: "CheckCircle2",
                  text: "Promoting awareness and action on rights and tenure in aquatic environments.",
                },
                {
                  icon: "CheckCircle2",
                  text: "Advocating for diverse knowledge systems and inclusive decision-making.",
                },
                {
                  icon: "CheckCircle2",
                  text: "Challenging inequitable policies, practices and processes influencing aquatic governance.",
                },
                {
                  icon: "CheckCircle2",
                  text: "Enhancing services for negotiation, conflict resolution, and accountability.",
                },
              ],
            },
          },
          {
            id: "tenure-rights",
            title: "What we understand by tenure",
            content: {
              title:
                "What we understand by tenure security and rights recognition",
              descriptionAsCards: true,
              description: [
                {
                  icon: "Shield",
                  text: "Turning Tides' investments will be designed to support the conditions and processes necessary to move from rights and tenure insecurity, toward tenure security and full recognition of associated rights (e.g., the right to a healthy environment, the right to food, the right to self-determination, the right to maintain cultural tradition and knowledge).",
                },
                {
                  icon: "BookMarked",
                  text: 'We use a broad definition to accommodate the multiple ways that tenure can be viewed and experienced. We consider tenure as: "The ways in which societies define and govern (including through cultures and laws) people\'s relationships with land, coasts, shores, waterbodies, and associated natural resources."',
                },
              ],
              titleItem: "We consider tenure to encompass",
              numberedItems: [
                {
                  number: "01",
                  text: "A bundle of rights, powers and relationships – including, but often extending beyond, access and use rights",
                },
                {
                  number: "02",
                  text: "Community-based and collective tenure, incorporating the systems that govern them",
                },
                {
                  number: "03",
                  text: "Self-determination in defining relationships and futures within territories and across environments",
                },
              ],
              calloutText:
                "Tenure security is a critical foundation, and often a precursor for other human rights",
              infoBox: {
                text: "Read more about the diverse ways in which we have come to consider tenure, and tenure security and rights recognition, in our Scoping Study and our brief ",
                linkText: "(forthcoming)",
              },
            },
          },
          {
            id: "tenure-security",
            title: "Our Grantmaking Framework",
            content: {
              title: "Our Grantmaking Framework",
              description: [
                "Our grantmaking framework outlines Turning Tides' funding priorities and approach. It explains what work we support, what we don't fund, and why - all organized around pathways toward tenure security for Indigenous Peoples, local communities, small-scale fishers and fish workers. Groups interested in partnering with Turning Tides can use it to assess mutual fit for partnership",
                "Turning Tides aims to provide fiscal and other supports that lead local communities, small-scale fishers and fish workers, and Indigenous Peoples to fully experiencing their rights and agency in the allocation, use, conservation, management and development of coastal lands, shorelines, oceans, lakes, rivers, and associated resources - toward better environmental and societal outcomes. The Turning Tides' Grantmaking Framework is intended to keep focus on the niche, need and opportunity.",
                "The strategies and actions that we consider within our funding priorities are those that are known to contribute toward tenure security. We recognise that strategies used likely vary based on specific contexts.",
                "We are also very deliberate and considered in what we reflect as being outside of our funding scope. Whilst we recognise those actions, and their proponents have values and benefits of their own (even toward the security of certain rights) they are – in our assessment – relatively well funded and supported.",
              ],
              downloadSection: {
                text: "Read the full-version of our Grantmaking Framework",
                buttonText: "Download Now",
                buttonUrl: "/downloads/grantmaking-framework.pdf",
              },
            },
          },
        ],
        null,
        2
      ),
      itemLabel: "Navigation Item",
      itemSchema: [
        {
          key: "title",
          label: "Navigation Title",
          type: "text",
          required: true,
          placeholder: "Our approach to Grantmaking",
        },
        {
          key: "content.title",
          label: "Content Title",
          type: "text",
          required: true,
          placeholder: "Our approach to Grantmaking​",
        },
        {
          key: "content.descriptionAsCards",
          label: "Render Descriptions as Cards",
          type: "boolean",
          required: false,
          helpText:
            "Enable card-based layout for descriptions (used in tenure tab)",
        },
        {
          key: "content.description",
          label: "Description Content",
          type: "textarea",
          required: true,
          placeholder: "Description text or card items",
          helpText:
            "Can be paragraphs (when descriptionAsCards=false) or card items with icon and text",
        },
        {
          key: "content.titleItem",
          label: "Items Section Title",
          type: "text",
          required: false,
          placeholder: "What we practice",
        },
        {
          key: "content.items",
          label: "Items List",
          type: "textarea",
          required: false,
          placeholder: "List of items (one per line)",
          helpText:
            "For regular list with icons (what-we-support tab). Format: text only",
        },
        {
          key: "content.numberedItems",
          label: "Numbered Items",
          type: "textarea",
          required: false,
          placeholder: "Numbered list items (one per line)",
          helpText:
            "For numbered list display (tenure-rights tab). Automatically numbered 01, 02, 03...",
        },
        {
          key: "content.calloutText",
          label: "Callout Text",
          type: "text",
          required: false,
          placeholder: "Bold text to emphasize",
          helpText: "Text to display as bold callout (tenure-rights tab)",
        },
        {
          key: "content.infoBox",
          label: "Info Box",
          type: "textarea",
          required: false,
          placeholder: "Info box text with optional link",
          helpText:
            'Info box with green accent. Format: text|linkText (e.g., "Read more|(forthcoming)")',
        },
        {
          key: "content.downloadSection",
          label: "Download Section",
          type: "textarea",
          required: false,
          placeholder: "Download section info",
          helpText:
            'Download button section. Format: text|buttonText|buttonUrl (e.g., "Read full framework|Download Now|/path/to/file.pdf")',
        },
      ],
      helpText:
        "Navigation items for the support section tabs. Supports multiple layout types: regular items, numbered items, card descriptions, callout text, info box, and download section.",
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
  ],
};
