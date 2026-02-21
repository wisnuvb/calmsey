import { PageContentSchema } from "../page-content-schema";

export const OUR_FUND_SCHEMA: PageContentSchema = {
  pageType: "OUR_FUND",
  sections: [
    "Hero",
    "Grantmaking",
    "Our Four Funds",
    "Our Partners",
    "Fund Details",
    "Feedback Callout",
  ],
  fields: [
    // Hero Section
    {
      key: "hero.title",
      label: "Page Title",
      type: "text",
      section: "Hero",
      defaultValue: "How we fund change",
      helpText: "Main title for the hero section",
    },
    {
      key: "hero.backgroundImage",
      label: "Hero Background Image",
      type: "image",
      section: "Hero",
      defaultValue: "/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png",
      helpText: "Background image for the hero section",
    },

    // Grantmaking Section
    {
      key: "grantmaking.navigationItems",
      label: "Navigation Items",
      type: "multiple",
      section: "Grantmaking",
      helpText:
        "Manage navigation items for the Grantmaking section. Each item represents a tab with its own content.",
      itemLabel: "Navigation Item",
      itemSchema: [
        {
          key: "id",
          label: "Item ID",
          type: "text",
          required: true,
          placeholder: "approach",
          helpText:
            "Unique identifier for this navigation item (e.g., approach, tenure, framework)",
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
          helpText: "Optional practices list. Add practices with check icon.",
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
          label: "Numbered List Title/Sub-header",
          type: "text",
          required: false,
          placeholder: "We consider tenure to encompass",
          helpText:
            "Optional title/sub-header displayed before the numbered list. Leave empty if not needed.",
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
          label: "Numbered List Footer/Concluding Text",
          type: "textarea",
          required: false,
          placeholder:
            "Additional text after numbered list (supports **bold** text)",
          helpText:
            "Optional concluding text displayed after the numbered list. Supports **bold** formatting. Leave empty if not needed.",
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
          helpText: "Optional label text displayed before the download button",
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
      defaultValue: JSON.stringify(
        [
          {
            id: "approach",
            label: "Our approach to Grantmaking",
            contentTitle: "Our approach to Grantmaking",
            imageSrc:
              "/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png",
            imageAlt: "Grantmaking approach",
            paragraphs:
              "Turning Tides implements and advocates for liberatory approaches to partnership and grant-making. This means working together with Indigenous Peoples, local communities, small-scale fishers and fish workers through reciprocal transformation where both we and our partners work to change the systems and power structures that create barriers to tenure security.\n\nOur practices include multi-year flexible funding, streamlined processes, and partnership support that extends beyond financial contributions.",
            practicesTitle: "",
            practices: [
              {
                id: "1",
                text: "Shared decision-making in strategy and grantmaking",
              },
              {
                id: "2",
                text: "Partner-centered grantmaking processes (language justice, administrative burden shifting, feedback integration)",
              },
              {
                id: "3",
                text: "Rights-based safeguarding and ethical engagement (FPIC, data sovereignty, cultural protocols)",
              },
              {
                id: "4",
                text: "Multi-year flexible funding with partnership support beyond financial contributions",
              },
            ],
          },
          {
            id: "tenure",
            label: "What we understand by tenure",
            contentTitle: "What we understand by tenure",
            paragraphs: "",
            infoBlocks: [
              {
                id: "1",
                icon: "shield",
                text: "Turning Tides' investments will be designed to **support the conditions and processes** necessary to move from rights and tenure insecurity, toward tenure security and full recognition of associated rights (e.g., the right to a healthy environment, the right to food, the right to self-determination, the right to maintain cultural tradition and knowledge).",
              },
              {
                id: "2",
                icon: "flag",
                text: 'We use a broad definition to accommodate the multiple ways that tenure can be viewed and experienced. We consider tenure as: "The ways in which societies define and govern (including through cultures and laws) people\'s relationships with land, coasts, shores, waterbodies, and associated natural resources."',
              },
            ],
            numberedListTitle: "We consider tenure to encompass",
            numberedList: [
              {
                id: "1",
                number: "01",
                text: "A bundle of rights, powers and relationships - including, but often extending beyond, access and use rights",
              },
              {
                id: "2",
                number: "02",
                text: "Community-based and collective tenure, incorporating the systems that govern them",
              },
              {
                id: "3",
                number: "03",
                text: "Self-determination in defining relationships and futures within territories and across environments.",
              },
            ],
            numberedListFooter:
              "**Tenure security** is a critical foundation, and often a precursor for other **human rights** (i.e., to food, cultural practice, self-determination) and as the critical enabler to effective locally-led environmental stewardship, climate adaptation, and inclusive economies.",
            infoBlockFooterIcon: "info",
            infoBlockFooterText:
              "Read more about the diverse ways in which we have come to consider tenure, and tenure security and rights recognition, in our Scoping Study and our brief (**forthcoming**).",
          },
          {
            id: "framework",
            label: "Our Grantmaking Framework",
            contentTitle: "Our Grantmaking Framework",
            paragraphs:
              "Our grantmaking framework outlines Turning Tides' funding priorities and approach. It explains what work we support, what we don't fund, and why - all organized around pathways toward tenure security for Indigenous Peoples, local communities, small-scale fishers and fish workers. Groups interested in partnering with Turning Tides can use it to assess mutual fit for partnership.\n\nTurning Tides aims to provide fiscal and other supports that lead local communities, small-scale fishers and fish workers, and Indigenous Peoples to fully experiencing their rights and agency in the allocation, use, conservation, management and development of coastal lands, shorelines, oceans, lakes, rivers, and associated resources - toward better environmental and societal outcomes. The Turning Tides' Grantmaking Framework is intended to keep focus on the niche, need and opportunity.\n\nThe strategies and actions that we consider within our funding priorities are those that are known to contribute toward tenure security. We recognise that strategies used likely vary based on specific contexts.\n\nWe are also very deliberate and considered in what we reflect as being outside of our funding scope. Whilst we recognise those actions, and their proponents have values and benefits of their own (even toward the security of certain rights) they are - in our assessment - relatively well funded and supported.",
            downloadButtonLabel:
              "Read the full-version of our Grantmaking Framework",
            downloadButtonText: "Download Now",
            downloadButtonUrl: "/downloads/grantmaking-framework.pdf",
          },
        ],
        null,
        2,
      ),
    },

    // Our Four Funds Section
    {
      key: "fourFunds.title",
      label: "Section Title",
      type: "text",
      section: "Our Four Funds",
      defaultValue: "Our Four Funds",
      helpText: "Main heading for the four funds section",
    },
    {
      key: "fourFunds.description",
      label: "Section Description",
      type: "textarea",
      section: "Our Four Funds",
      defaultValue:
        "Turning Tides supports partners through four interacting funds, each of which supports different pathways toward change. Each fund is governed separately to increase responsiveness to partners' expressed needs and opportunities to create change.",
      helpText: "Description text displayed below the title",
    },
    {
      key: "fourFunds.funds",
      label: "Funds List",
      type: "multiple",
      section: "Our Four Funds",
      helpText:
        "Manage the four funds displayed in this section. Each fund represents a different funding pathway.",
      itemLabel: "Fund",
      itemSchema: [
        {
          key: "id",
          label: "Fund ID",
          type: "text",
          required: true,
          placeholder: "grassroot-fund",
          helpText:
            "Unique identifier for this fund (lowercase, use hyphens for spaces)",
        },
        {
          key: "title",
          label: "Fund Title",
          type: "text",
          required: true,
          placeholder: "Grassroot Fund",
          helpText: "Display title for the fund",
        },
        {
          key: "description",
          label: "Fund Description",
          type: "html",
          required: true,
          placeholder: "Description of what this fund supports...",
          helpText: "Detailed description of the fund's purpose and focus",
        },
        {
          key: "imageSrc",
          label: "Image URL",
          type: "image",
          required: true,
          placeholder: "/assets/demo/image.png",
          helpText: "URL to the fund's featured image",
        },
        {
          key: "imageAlt",
          label: "Image Alt Text",
          type: "text",
          required: true,
          placeholder: "Description of the image",
          helpText: "Alternative text for the image (for accessibility)",
        },
        {
          key: "icon",
          label: "Icon Name",
          type: "text",
          required: true,
          placeholder: "Waves",
          helpText:
            'Icon to display. Options: "Waves", "Globe", "Zap", or "Lightbulb"',
        },
        {
          key: "learnMoreLink",
          label: "Learn More Link",
          type: "text",
          required: true,
          placeholder: "/our-fund/grassroot",
          helpText: "URL to the detailed fund page",
        },
        {
          key: "imagePosition",
          label: "Image Position",
          type: "text",
          required: true,
          placeholder: "left",
          helpText: 'Position of the image. Options: "left" or "right"',
        },
      ],
      defaultValue: JSON.stringify(
        [
          {
            id: "grassroot-fund",
            title: "Grassroot Fund",
            description:
              "Turning Tides deploys the majority of its resources through the Grassroots Fund supporting actions at regional, national, and local levels.",
            imageSrc:
              "/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png",
            imageAlt: "People drying fish on racks",
            icon: "Waves",
            learnMoreLink: "/funds/grassroot",
            imagePosition: "left",
          },
          {
            id: "civic-space-capacity-fund",
            title: "Civic Space and Capacity Fund",
            description:
              "We deploy funding to support the self-identified capacity needs of our partners and to, more broadly, protect civic space. Our team will work in close collaboration with partners to identify needs and craft appropriate responses.",
            imageSrc:
              "/assets/demo/61d49ae554575244d2db7ab0551faf2183798c04.png",
            imageAlt: "Aerial view of coastal community",
            icon: "Globe",
            learnMoreLink: "/our-fund/civic-space",
            imagePosition: "right",
          },
          {
            id: "rapid-response-fund",
            title: "Rapid Response Fund",
            description:
              "The Rapid Response Fund addresses urgent needs, supporting partners and organizations facing threats that require timely financial intervention, particularly in contexts of shrinking civic space, political repression, and sudden crises.",
            imageSrc:
              "/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png",
            imageAlt: "Traditional boats in calm water",
            icon: "Zap",
            learnMoreLink: "/our-fund/rapid-response",
            imagePosition: "left",
          },
          {
            id: "knowledge-action-fund",
            title: "Knowledge Action Fund",
            description:
              "The Knowledge Action Fund is designed to challenge and change dominant narratives, elevate rights holder voices and perspectives, and influence global, regional, and national systems, creating the necessary enabling environment to support secure tenure globally.",
            imageSrc:
              "/assets/demo/61d49ae554575244d2db7ab0551faf2183798c04.png",
            imageAlt: "Person arranging fish on drying rack",
            icon: "Lightbulb",
            learnMoreLink: "/our-fund/knowledge-action",
            imagePosition: "right",
          },
        ],
        null,
        2,
      ),
    },

    // Our Partners Section
    {
      key: "partners.title",
      label: "Section Title",
      type: "text",
      section: "Our Partners",
      defaultValue: "Our Partners",
      helpText: "Main heading for the partners section",
    },
    {
      key: "partners.description",
      label: "Section Description",
      type: "textarea",
      section: "Our Partners",
      defaultValue:
        "Turning Tides engages with a diversity of partners – across multiple levels",
      helpText: "Description text displayed below the title",
    },
    {
      key: "partners.partners",
      label: "Partners List",
      type: "multiple",
      section: "Our Partners",
      helpText:
        "Manage the list of partners displayed in this section. Add, edit, or remove partners as needed.",
      itemLabel: "Partner",
      itemSchema: [
        {
          key: "id",
          label: "Partner ID",
          type: "text",
          required: true,
          placeholder: "ledars",
          helpText:
            "Unique identifier for this partner (lowercase, use hyphens for spaces)",
        },
        {
          key: "name",
          label: "Partner Name",
          type: "text",
          required: true,
          placeholder: "LEDARS",
          helpText: "Display name of the partner organization",
        },
        {
          key: "logo",
          label: "Logo URL",
          type: "image",
          required: true,
          placeholder: "/assets/partners/ledars-logo.png",
          helpText: "URL to the partner's logo image",
        },
        {
          key: "logoAlt",
          label: "Logo Alt Text",
          type: "text",
          required: true,
          placeholder: "LEDARS Logo",
          helpText: "Alternative text for the logo (for accessibility)",
        },
        {
          key: "website",
          label: "Website URL",
          type: "url",
          required: false,
          placeholder: "https://ledars.org",
          helpText: "Optional: Partner's website URL",
        },
      ],
      defaultValue: JSON.stringify(
        [
          {
            id: "ledars",
            name: "LEDARS",
            logo: "/assets/partners/ledars-logo.png",
            logoAlt: "LEDARS Logo",
            website: "https://ledars.org",
          },
          {
            id: "university-waterloo",
            name: "University of Waterloo",
            logo: "/assets/partners/university-waterloo-logo.png",
            logoAlt: "University of Waterloo Logo",
            website: "https://uwaterloo.ca",
          },
          {
            id: "southern-fisherfolk",
            name: "Southern Fisherfolk Women Association",
            logo: "/assets/partners/southern-fisherfolk-logo.png",
            logoAlt: "Southern Fisherfolk Women Association Logo",
            website: "https://southernfisherfolk.org",
          },
          {
            id: "solidar",
            name: "SOLIDAR",
            logo: "/assets/partners/solidar-logo.png",
            logoAlt: "SOLIDAR Logo",
            website: "https://solidar.org",
          },
          {
            id: "save-andaman",
            name: "Save Andaman Network",
            logo: "/assets/partners/save-andaman-logo.png",
            logoAlt: "Save Andaman Network Logo",
            website: "https://saveandaman.org",
          },
          {
            id: "iccas",
            name: "ICCAs",
            logo: "/assets/partners/iccas-logo.png",
            logoAlt: "ICCAs Logo",
            website: "https://iccas.org",
          },
          {
            id: "ulab",
            name: "ULAB",
            logo: "/assets/partners/ulab-logo.png",
            logoAlt: "University of Liberal Arts Bangladesh Logo",
            website: "https://ulab.edu.bd",
          },
          {
            id: "jnus",
            name: "JNUS",
            logo: "/assets/partners/jnus-logo.png",
            logoAlt: "Jaringan Nelayan Tradisional Indonesia Logo",
            website: "https://jnus.org",
          },
          {
            id: "mercado-del-mar",
            name: "Mercado del Mar",
            logo: "/assets/partners/mercado-del-mar-logo.png",
            logoAlt: "Mercado del Mar Logo",
            website: "https://mercadodelmar.org",
          },
          {
            id: "larecoturh",
            name: "LARECOTURH",
            logo: "/assets/partners/larecoturh-logo.png",
            logoAlt: "LARECOTURH Logo",
            website: "https://larecoturh.org",
          },
          {
            id: "caopa",
            name: "CAOPA",
            logo: "/assets/partners/caopa-logo.png",
            logoAlt: "CAOPA Logo",
            website: "https://caopa.org",
          },
          {
            id: "brwa",
            name: "BRWA",
            logo: "/assets/partners/brwa-logo.png",
            logoAlt: "BRWA Logo",
            website: "https://brwa.org",
          },
          {
            id: "ykl-konservasi",
            name: "YKL Konservasi Laut Indonesia",
            logo: "/assets/partners/ykl-konservasi-logo.png",
            logoAlt: "YKL Konservasi Laut Indonesia Logo",
            website: "https://ykl.org",
          },
        ],
        null,
        2,
      ),
    },
    {
      key: "partners.callToActionText",
      label: "Call to Action Text",
      type: "textarea",
      section: "Our Partners",
      defaultValue:
        "Interested Working Together With Us to Transforming Coastal Right?",
      helpText: "Text displayed above the button",
    },
    {
      key: "partners.buttonText",
      label: "Button Text",
      type: "text",
      section: "Our Partners",
      defaultValue: "Get Involved",
      helpText: "Text displayed on the button",
    },
    {
      key: "partners.buttonLink",
      label: "Button Link",
      type: "text",
      section: "Our Partners",
      defaultValue: "/get-involved",
      helpText: "URL for the button",
    },
    {
      key: "partners.backgroundColor",
      label: "Background Color",
      type: "text",
      section: "Our Partners",
      defaultValue: "bg-white",
      helpText: "Background color class (e.g., 'bg-white', 'bg-gray-50')",
    },
    // Feedback Callout Section
    {
      key: "feedbackCallout.title",
      label: "Feedback Callout Title",
      type: "text",
      section: "Feedback Callout",
      defaultValue: "We value your support",
      helpText: "Main title displayed in the feedback callout section",
    },
    {
      key: "feedbackCallout.description",
      label: "Feedback Callout Description",
      type: "textarea",
      section: "Feedback Callout",
      defaultValue:
        "Connect with us to co-create solutions that protect rights, sustain livelihoods, and centre local voices.",
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
      helpText: "URL for the feedback button",
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
      helpText: "URL for the learn more button",
    },

    // Fund Details Section (for detail pages: /our-fund/[id])
    {
      key: "fundDetails.funds",
      label: "Fund Details",
      type: "multiple",
      section: "Fund Details",
      helpText:
        "Manage fund detail pages. Each fund represents a detail page accessible at /our-fund/{slug}. The slug is used in the URL path.",
      itemLabel: "Fund Detail",
      itemSchema: [
        {
          key: "slug",
          label: "Fund Slug",
          type: "text",
          required: true,
          placeholder: "grassroot",
          helpText:
            "URL slug for this fund (e.g., 'grassroot' for /our-fund/grassroot). Use lowercase, no spaces, use hyphens.",
        },
        {
          key: "id",
          label: "Fund ID",
          type: "text",
          required: false,
          placeholder: "grassroot-fund",
          helpText:
            "Optional: Unique identifier for this fund. If not provided, slug will be used as ID.",
        },
        // Header Fields
        {
          key: "headerSmallHeading",
          label: "Header Small Heading",
          type: "text",
          required: true,
          placeholder: "OUR FOUR GRANTMAKING FUNDS",
          helpText: "Small heading text displayed above the main title",
        },
        {
          key: "headerTitle",
          label: "Header Title",
          type: "text",
          required: true,
          placeholder: "Grassroot Fund",
          helpText: "Main title for the fund detail page",
        },
        {
          key: "headerSubtitle",
          label: "Header Subtitle",
          type: "textarea",
          required: false,
          placeholder:
            "Supporting actions at regional, national, and local levels",
          helpText:
            "Optional subtitle displayed below the main title. Leave empty if not needed.",
        },
        {
          key: "headerHeroImageSrc",
          label: "Header Hero Image",
          type: "image",
          required: true,
          placeholder: "/assets/demo/image.png",
          helpText: "Hero image displayed in the header section",
        },
        {
          key: "headerHeroImageAlt",
          label: "Header Hero Image Alt Text",
          type: "text",
          required: true,
          placeholder: "Description of the image",
          helpText: "Alternative text for the hero image (for accessibility)",
        },
        // Content Type
        {
          key: "contentType",
          label: "Content Type",
          type: "select",
          required: true,
          placeholder: "Select content type...",
          helpText: "Choose the type of content structure for this fund",
          options: [
            {
              value: "supported-unsupported",
              label: "Supported / Unsupported",
            },
            {
              value: "partners-will",
              label: "Partners Will",
            },
            {
              value: "custom",
              label: "Custom",
            },
          ],
        },
        // Intro paragraphs (for supported-unsupported and partners-will)
        {
          key: "intro",
          label: "Intro Paragraphs",
          type: "textarea",
          required: false,
          placeholder: "First paragraph.\n\nSecond paragraph.",
          helpText:
            "Intro paragraphs (separated by double newline). Used for 'supported-unsupported' and 'partners-will' types.",
        },
        // Supported Section (for supported-unsupported type)
        {
          key: "supportedSectionTitle",
          label: "Supported Section Title",
          type: "text",
          required: false,
          placeholder:
            "The fund will support work in the following categories:",
          helpText:
            "Title for the supported section (supported-unsupported type only)",
        },
        {
          key: "supportedItems",
          label: "Supported Items",
          type: "multiple",
          required: false,
          itemLabel: "Supported Item",
          helpText: "List of supported items (supported-unsupported type only)",
          itemSchema: [
            {
              key: "id",
              label: "ID",
              type: "text",
              required: true,
              placeholder: "1",
            },
            {
              key: "icon",
              label: "Icon",
              type: "text",
              required: true,
              placeholder: "check",
              helpText: 'Icon type: "check" or "x"',
            },
            {
              key: "title",
              label: "Title",
              type: "text",
              required: false,
              placeholder: "Item title",
              helpText: "Optional title for the item",
            },
            {
              key: "description",
              label: "Description",
              type: "textarea",
              required: true,
              placeholder: "Item description",
            },
          ],
        },
        // Unsupported Section (for supported-unsupported type)
        {
          key: "unsupportedSectionTitle",
          label: "Unsupported Section Title",
          type: "text",
          required: false,
          placeholder: "What the fund typically does NOT cover:",
          helpText:
            "Title for the unsupported section (supported-unsupported type only)",
        },
        {
          key: "unsupportedItems",
          label: "Unsupported Items",
          type: "multiple",
          required: false,
          itemLabel: "Unsupported Item",
          helpText:
            "List of unsupported items (supported-unsupported type only)",
          itemSchema: [
            {
              key: "id",
              label: "ID",
              type: "text",
              required: true,
              placeholder: "1",
            },
            {
              key: "icon",
              label: "Icon",
              type: "text",
              required: true,
              placeholder: "x",
              helpText: 'Icon type: "check" or "x"',
            },
            {
              key: "description",
              label: "Description",
              type: "textarea",
              required: true,
              placeholder: "Item description",
            },
          ],
        },
        // Partners Will Section (for partners-will type)
        {
          key: "partnersWillSectionTitle",
          label: "Partners Will Section Title",
          type: "text",
          required: false,
          placeholder: "Partners supported by this fund will:",
          helpText:
            "Title for the partners will section (partners-will type only)",
        },
        {
          key: "partnersWillItems",
          label: "Partners Will Items",
          type: "multiple",
          required: false,
          itemLabel: "Partners Will Item",
          helpText: "List of partners will items (partners-will type only)",
          itemSchema: [
            {
              key: "id",
              label: "ID",
              type: "text",
              required: true,
              placeholder: "1",
            },
            {
              key: "icon",
              label: "Icon",
              type: "text",
              required: true,
              placeholder: "check",
              helpText: 'Icon type: "check" or "x"',
            },
            {
              key: "description",
              label: "Description",
              type: "textarea",
              required: true,
              placeholder: "Item description",
            },
          ],
        },
        // Concluding paragraphs (for partners-will type)
        {
          key: "concluding",
          label: "Concluding Paragraphs",
          type: "textarea",
          required: false,
          placeholder: "First paragraph.\n\nSecond paragraph.",
          helpText:
            "Concluding paragraphs (separated by double newline). Used for 'partners-will' type.",
        },
        // Custom Sections (for custom type)
        {
          key: "customSections",
          label: "Custom Sections",
          type: "multiple",
          required: false,
          itemLabel: "Custom Section",
          helpText: "Custom sections (custom type only)",
          itemSchema: [
            {
              key: "id",
              label: "Section ID",
              type: "text",
              required: true,
              placeholder: "section-1",
            },
            {
              key: "title",
              label: "Section Title",
              type: "text",
              required: false,
              placeholder: "Section title",
            },
            {
              key: "content",
              label: "Section Content",
              type: "textarea",
              required: false,
              placeholder: "Content paragraph.\n\nAnother paragraph.",
              helpText: "Content paragraphs (separated by double newline)",
            },
            {
              key: "items",
              label: "Section Items",
              type: "multiple",
              required: false,
              itemLabel: "Item",
              helpText: "Optional items for this section",
              itemSchema: [
                {
                  key: "id",
                  label: "ID",
                  type: "text",
                  required: true,
                  placeholder: "1",
                },
                {
                  key: "icon",
                  label: "Icon",
                  type: "text",
                  required: false,
                  placeholder: "check",
                  helpText: 'Optional icon: "check" or "x"',
                },
                {
                  key: "title",
                  label: "Title",
                  type: "text",
                  required: false,
                  placeholder: "Item title",
                },
                {
                  key: "description",
                  label: "Description",
                  type: "textarea",
                  required: true,
                  placeholder: "Item description",
                },
              ],
            },
          ],
        },
        // CTA
        {
          key: "ctaType",
          label: "CTA Type",
          type: "text",
          required: false,
          placeholder: "button",
          helpText: 'CTA type: "button", "pdf-download", or "link"',
        },
        {
          key: "ctaText",
          label: "CTA Text",
          type: "text",
          required: false,
          placeholder: "Request Support",
          helpText: "Text displayed on the CTA button",
        },
        {
          key: "ctaLink",
          label: "CTA Link",
          type: "url",
          required: false,
          placeholder: "/our-fund/rapid-response/request",
          helpText: "URL for the CTA button (for button/link type)",
        },
        {
          key: "ctaFile",
          label: "CTA File URL",
          type: "file",
          required: false,
          placeholder: "/downloads/file.pdf",
          helpText: "File URL for download (for pdf-download type)",
        },
        {
          key: "ctaIcon",
          label: "CTA Icon",
          type: "text",
          required: false,
          placeholder: "file-pdf",
          helpText: 'Optional icon: "check", "x", "arrow", or "file-pdf"',
        },
        {
          key: "ctaStyle",
          label: "CTA Style",
          type: "text",
          required: false,
          placeholder: "primary",
          helpText: 'Button style: "primary", "secondary", or "outline"',
        },
      ],
      defaultValue: JSON.stringify(
        [
          {
            slug: "rapid-response",
            id: "rapid-response-fund",
            headerSmallHeading: "OUR FOUR GRANTMAKING FUNDS",
            headerTitle: "Rapid Response Fund",
            headerSubtitle:
              "Rapid support for partners facing legal, physical, or political threats to their safety and operations",
            headerHeroImageSrc:
              "/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png",
            headerHeroImageAlt: "Traditional boats on calm water",
            contentType: "supported-unsupported",
            intro:
              "Funding from the Rapid Response Fund will be available to existing partners as well as groups and individuals working directly with them. We will prioritize recipients operating in restricted, high-risk, or rapidly shifting political contexts. In all cases, recipients must demonstrate a commitment to values in line with Turning Tides' commitment to the rights of Indigenous Peoples, local communities, small-scale fishers and fish workers and be actively working for the protection of rights and tenure across oceans, rivers, lakes, coasts, and shorelines.",
            supportedSectionTitle:
              "The Rapid Response Fund will support work in the following categories:",
            supportedItems: JSON.stringify(
              [
                {
                  id: "security-costs",
                  icon: "check",
                  title: "Security-related costs",
                  description:
                    "Emergency legal aid, secure communication tools, preparing for digital and physical protection.",
                },
                {
                  id: "reputation-defense",
                  icon: "check",
                  title: "Reputation defense",
                  description:
                    "Crisis communications, media strategy, counter-disinformation efforts.",
                },
                {
                  id: "operations",
                  icon: "check",
                  title: "Operations",
                  description:
                    "Bridge funding due to sudden funding cuts, office repairs after raids, equipment replacement.",
                },
                {
                  id: "wellbeing-support",
                  icon: "check",
                  title: "Wellbeing support",
                  description:
                    "Psychosocial care, burnout recovery, or protective rest for rights holders.",
                },
                {
                  id: "geographic-focus",
                  icon: "check",
                  title: "Geographic focus",
                  description:
                    "During the first year of grantmaking, the fund will operate exclusively in the regions and countries in which Turning Tides is working. Following this initial phase, we will consider opening to applicants outside our active regions of focus on a case-by-case basis.",
                },
              ],
              null,
              2,
            ),
            unsupportedSectionTitle: "What the fund typically does NOT cover:",
            unsupportedItems: JSON.stringify(
              [
                {
                  id: "long-term-operations",
                  icon: "x",
                  description:
                    "Long-term salaries, programmatic expansion, infrastructure development, ongoing operations, armed protection and weapons.",
                },
                {
                  id: "relocation-emergency",
                  icon: "x",
                  description:
                    "The fund will also not be used to relocate individuals/groups under threat nor provide direct emergency response. Turning Tides, and the fund, is not designed to respond quickly enough to meet emergency response needs, nor are we skilled in emergency response and protection, potentially opening our partners up to increased risk. We plan, instead, to provide funds to a third party with expertise in emergency response and extraction to be an on-call support mechanism for our partners.",
                },
              ],
              null,
              2,
            ),
            ctaType: "button",
            ctaText: "Request Support",
            ctaLink: "/our-fund/rapid-response/request",
            ctaStyle: "primary",
          },
          {
            slug: "knowledge-action",
            id: "knowledge-action-fund",
            headerSmallHeading: "OUR FOUR GRANTMAKING FUNDS",
            headerTitle: "Knowledge Action Fund",
            headerSubtitle: "",
            headerHeroImageSrc:
              "/assets/demo/61d49ae554575244d2db7ab0551faf2183798c04.png",
            headerHeroImageAlt: "Knowledge Action Fund",
            contentType: "partners-will",
            intro:
              "The recognition of tenure and surrounding human rights (i.e., the rights to a healthy environment, to food, to self-determination) affects who is involved, holds power and can have impact in the governance, management and development of oceans, coasts, rivers, lakes and their shores. The same spaces that support tenure systems are now objects of intensifying conservation, food production, energy, commercial investments and climate responses. The risk that these ignore and overrule existing tenure regimes and rights is real. However, there is also opportunity to ensure processes of planning, development, climate response, conservation and funding commitments are sensitive to tenure and the agency of rights holders.\n\nThis fund is designed to support a shift toward more enabling conditions by increasing the depth and diversity of knowledge, perspectives, and voices that hold prominence and experience power in pathways toward favourable change.",
            partnersWillSectionTitle: "Partners supported by this fund will:",
            partnersWillItems: JSON.stringify(
              [
                {
                  id: "generate-knowledge",
                  icon: "check",
                  description:
                    "Generate Strategic Knowledge, Perspectives and Commentaries for Advocacy",
                },
                {
                  id: "uplift-evidence",
                  icon: "check",
                  description: "Uplift Evidence and Experience from Partners",
                },
                {
                  id: "advocate-tenure",
                  icon: "check",
                  description:
                    "Advocate for Tenure Sensitivity in Funding, Policy and Practices",
                },
                {
                  id: "seize-windows",
                  icon: "check",
                  description: "Seize time-sensitive advocacy windows",
                },
              ],
              null,
              2,
            ),
            concluding:
              "By elevating diverse knowledge and strengthening advocacy capacity, the fund aims to increase the influence that local communities, fisher peoples and Indigenous Peoples have over distant policy decisions that affect their tenure and rights - decisions typically made at global, regional and national levels beyond their usual reach.\n\nPartners to this fund are nominated by our trusted partners and advisors.",
            ctaType: "pdf-download",
            ctaText: "Knowledge Action Fund Action Plan",
            ctaFile: "/assets/funds/knowledge-action-fund-action-plan.pdf",
            ctaIcon: "file-pdf",
            ctaStyle: "primary",
          },
          {
            slug: "grassroot",
            id: "grassroot-fund",
            headerSmallHeading: "OUR FOUR GRANTMAKING FUNDS",
            headerTitle: "Grassroot Fund",
            headerSubtitle:
              "Supporting actions at regional, national, and local levels",
            headerHeroImageSrc:
              "/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png",
            headerHeroImageAlt: "People drying fish on racks",
            contentType: "custom",
            customSections: JSON.stringify(
              [
                {
                  id: "intro",
                  content:
                    "Turning Tides deploys the majority of its resources through the Grassroots Fund supporting actions at regional, national, and local levels. This fund is designed to empower communities, small-scale fishers, fish workers, and Indigenous Peoples in their efforts to secure and strengthen tenure rights.",
                },
                {
                  id: "focus-areas",
                  title: "The Grassroot Fund focuses on:",
                  items: JSON.stringify(
                    [
                      {
                        id: "community-led",
                        icon: "check",
                        title: "Community-led initiatives",
                        description:
                          "Supporting grassroots organizations and community groups working directly with rights holders to advance tenure security.",
                      },
                      {
                        id: "capacity-building",
                        icon: "check",
                        title: "Capacity building",
                        description:
                          "Strengthening organizational capacity, leadership development, and community organizing skills.",
                      },
                      {
                        id: "advocacy",
                        icon: "check",
                        title: "Local and national advocacy",
                        description:
                          "Supporting advocacy efforts at regional, national, and local levels to influence policy and practice.",
                      },
                      {
                        id: "documentation",
                        icon: "check",
                        title: "Tenure documentation",
                        description:
                          "Supporting efforts to document, map, and secure recognition of traditional tenure systems.",
                      },
                    ],
                    null,
                    2,
                  ),
                },
                {
                  id: "approach",
                  title: "Our Approach",
                  content:
                    "The Grassroot Fund operates through flexible, multi-year grants that respond to partners' expressed needs and priorities. We work in close collaboration with partners to ensure funding supports their self-determined goals and strategies for achieving tenure security and rights recognition.",
                },
              ],
              null,
              2,
            ),
            ctaType: "button",
            ctaText: "Learn More",
            ctaLink: "/our-fund/grassroot",
            ctaStyle: "primary",
          },
          {
            slug: "civic-space",
            id: "civic-space-capacity-fund",
            headerSmallHeading: "OUR FOUR GRANTMAKING FUNDS",
            headerTitle: "Civic Space and Capacity Fund",
            headerSubtitle:
              "Protecting civic space and strengthening partner capacity",
            headerHeroImageSrc:
              "/assets/demo/61d49ae554575244d2db7ab0551faf2183798c04.png",
            headerHeroImageAlt: "Aerial view of coastal community",
            contentType: "custom",
            customSections: JSON.stringify(
              [
                {
                  id: "intro",
                  content:
                    "We deploy funding to support the self-identified capacity needs of our partners and to, more broadly, protect civic space. Our team will work in close collaboration with partners to identify needs and craft appropriate responses.",
                },
                {
                  id: "capacity-support",
                  title: "Capacity Support",
                  items: JSON.stringify(
                    [
                      {
                        id: "organizational-development",
                        icon: "check",
                        title: "Organizational development",
                        description:
                          "Supporting organizational strengthening, strategic planning, and institutional capacity building.",
                      },
                      {
                        id: "leadership-development",
                        icon: "check",
                        title: "Leadership development",
                        description:
                          "Investing in leadership training, mentorship, and skills development for rights holders and their organizations.",
                      },
                      {
                        id: "technical-capacity",
                        icon: "check",
                        title: "Technical capacity",
                        description:
                          "Building technical skills in areas such as legal advocacy, community organizing, financial management, and communications.",
                      },
                    ],
                    null,
                    2,
                  ),
                },
                {
                  id: "civic-space-protection",
                  title: "Civic Space Protection",
                  items: JSON.stringify(
                    [
                      {
                        id: "advocacy-support",
                        icon: "check",
                        title: "Advocacy support",
                        description:
                          "Supporting partners' ability to advocate for their rights and interests in increasingly restrictive environments.",
                      },
                      {
                        id: "legal-protection",
                        icon: "check",
                        title: "Legal protection",
                        description:
                          "Providing resources for legal defense, policy advocacy, and protection of civic space.",
                      },
                      {
                        id: "network-building",
                        icon: "check",
                        title: "Network building",
                        description:
                          "Supporting coalition building and network strengthening to amplify voices and increase collective power.",
                      },
                    ],
                    null,
                    2,
                  ),
                },
                {
                  id: "approach",
                  title: "Our Approach",
                  content:
                    "The Civic Space and Capacity Fund responds directly to partners' self-identified needs. We work collaboratively to understand capacity gaps and develop tailored support that strengthens partners' ability to achieve their goals while protecting the space in which they operate.",
                },
              ],
              null,
              2,
            ),
            ctaType: "button",
            ctaText: "Learn More",
            ctaLink: "/our-fund/civic-space",
            ctaStyle: "primary",
          },
        ],
        null,
        2,
      ),
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
      helpText:
        "URL for the feedback button (can be relative path like /feedback or full URL)",
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
      helpText:
        "URL for the learn more button (can be relative path like /governance or full URL)",
    },
    {
      key: "feedbackCallout.backgroundColor",
      label: "Background Color",
      type: "text",
      section: "Feedback Callout",
      defaultValue: "bg-[#3C62ED]",
      helpText:
        "Background color class for the section (e.g., bg-[#3C62ED], bg-blue-500)",
    },
  ],
};
