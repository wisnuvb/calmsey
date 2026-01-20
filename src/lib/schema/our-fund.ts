import { PageContentSchema } from "../page-content-schema";

export const OUR_FUND_SCHEMA: PageContentSchema = {
  pageType: "OUR_FUND",
  sections: ["Hero", "Grantmaking", "Our Four Funds", "Our Partners"],
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
          type: "textarea",
          required: false,
          placeholder:
            '{"id": "1", "text": "First practice"}\n{"id": "2", "text": "Second practice"}',
          helpText:
            'Optional practices list. Format: One practice per line as JSON object. Example: {"id": "1", "text": "Practice text"}. Leave empty if no practices.',
        },
        {
          key: "infoBlocks",
          label: "Info Blocks",
          type: "textarea",
          required: false,
          placeholder:
            '{"id": "1", "icon": "shield", "text": "Info block text"}\n{"id": "2", "icon": "flag", "text": "Another info block"}',
          helpText:
            'Optional info blocks with icons. Format: One block per line as JSON. Icon options: "shield", "flag", "info". Example: {"id": "1", "icon": "shield", "text": "Your text here"}. Leave empty if no info blocks.',
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
          type: "textarea",
          required: false,
          placeholder:
            '{"id": "1", "number": "01", "text": "First item"}\n{"id": "2", "number": "02", "text": "Second item"}',
          helpText:
            'Optional numbered list. Format: One item per line as JSON. Example: {"id": "1", "number": "01", "text": "Item text"}. Leave empty if no numbered list.',
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
          key: "infoBlockFooter",
          label: "Footer Info Block",
          type: "textarea",
          required: false,
          placeholder: '{"icon": "info", "text": "Read more about..."}',
          helpText:
            'Optional footer info block (usually green). Format: JSON object. Example: {"icon": "info", "text": "Your footer text"}. Leave empty if not needed.',
        },
        {
          key: "downloadButtonText",
          label: "Download Button Text",
          type: "text",
          required: false,
          placeholder: "Download Now",
          helpText:
            "Optional text for download button (for framework section). Leave empty if no download button.",
        },
        {
          key: "downloadButtonUrl",
          label: "Download Button URL",
          type: "file",
          required: false,
          placeholder: "/downloads/framework.pdf",
          helpText:
            "Optional PDF file URL for download button. Leave empty if no download button.",
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
            practices:
              '{"id": "1", "text": "Shared decision-making in strategy and grantmaking"}\n{"id": "2", "text": "Partner-centered grantmaking processes (language justice, administrative burden shifting, feedback integration)"}\n{"id": "3", "text": "Rights-based safeguarding and ethical engagement (FPIC, data sovereignty, cultural protocols)"}\n{"id": "4", "text": "Multi-year flexible funding with partnership support beyond financial contributions"}',
          },
          {
            id: "tenure",
            label: "What we understand by tenure",
            contentTitle: "What we understand by tenure",
            paragraphs: "",
            infoBlocks:
              '{"id": "1", "icon": "shield", "text": "Turning Tides\' investments will be designed to **support the conditions and processes** necessary to move from rights and tenure insecurity, toward tenure security and full recognition of associated rights (e.g., the right to a healthy environment, the right to food, the right to self-determination, the right to maintain cultural tradition and knowledge)."}\n{"id": "2", "icon": "flag", "text": "We use a broad definition to accommodate the multiple ways that tenure can be viewed and experienced. We consider tenure as: \\"The ways in which societies define and govern (including through cultures and laws) people\'s relationships with land, coasts, shores, waterbodies, and associated natural resources.\\""}',
            numberedListTitle: "We consider tenure to encompass",
            numberedList:
              '{"id": "1", "number": "01", "text": "A bundle of rights, powers and relationships - including, but often extending beyond, access and use rights"}\n{"id": "2", "number": "02", "text": "Community-based and collective tenure, incorporating the systems that govern them"}\n{"id": "3", "number": "03", "text": "Self-determination in defining relationships and futures within territories and across environments."}',
            numberedListFooter:
              "**Tenure security** is a critical foundation, and often a precursor for other **human rights** (i.e., to food, cultural practice, self-determination) and as the critical enabler to effective locally-led environmental stewardship, climate adaptation, and inclusive economies.",
            infoBlockFooter:
              '{"icon": "info", "text": "Read more about the diverse ways in which we have come to consider tenure, and tenure security and rights recognition, in our Scoping Study and our brief (**forthcoming**)."}',
          },
          {
            id: "framework",
            label: "Our Grantmaking Framework",
            contentTitle: "Our Grantmaking Framework",
            paragraphs:
              "Our grantmaking framework outlines Turning Tides' funding priorities and approach. It explains what work we support, what we don't fund, and why - all organized around pathways toward tenure security for Indigenous Peoples, local communities, small-scale fishers and fish workers. Groups interested in partnering with Turning Tides can use it to assess mutual fit for partnership.\n\nTurning Tides aims to provide fiscal and other supports that lead local communities, small-scale fishers and fish workers, and Indigenous Peoples to fully experiencing their rights and agency in the allocation, use, conservation, management and development of coastal lands, shorelines, oceans, lakes, rivers, and associated resources - toward better environmental and societal outcomes. The Turning Tides' Grantmaking Framework is intended to keep focus on the niche, need and opportunity.\n\nThe strategies and actions that we consider within our funding priorities are those that are known to contribute toward tenure security. We recognise that strategies used likely vary based on specific contexts.\n\nWe are also very deliberate and considered in what we reflect as being outside of our funding scope. Whilst we recognise those actions, and their proponents have values and benefits of their own (even toward the security of certain rights) they are - in our assessment - relatively well funded and supported.",
            downloadButtonText: "Download Now",
            downloadButtonUrl: "/downloads/grantmaking-framework.pdf",
          },
        ],
        null,
        2
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
          type: "textarea",
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
          type: "url",
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
        2
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
        2
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
  ],
};
