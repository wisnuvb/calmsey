import { PageContentSchema } from "../page-content-schema";

export const ABOUT_US_SCHEMA: PageContentSchema = {
  pageType: "ABOUT_US",
  sections: [
    "Hero",
    "Quote",
    "Our Vision",
    "What We Want to Achieve",
    "Our Goal",
    "Theory of Change",
    "Genesis",
    "Team",
    "Funders",
    "Triptych Gallery",
    "Our Work",
  ],
  fields: [
    // Hero Section
    {
      key: "hero.title",
      label: "Page Title",
      type: "text",
      section: "Hero",
      required: true,
      placeholder: "About Us",
    },
    {
      key: "hero.subtitle",
      label: "Page Subtitle",
      type: "textarea",
      section: "Hero",
      required: true,
      placeholder:
        "We are a young organization built through wide-ranging consultation and by listening to the demands and priorities that Indigenous Peoples, small-scale fishers, and coastal communities have been articulating for years. We exist to support rights holders working to secure tenure over their territories—because territorial control is foundational to community agency and self-determination",
    },
    {
      key: "hero.backgroundImage",
      label: "Hero Background Image",
      type: "image",
      section: "Hero",
    },

    // Quote Section
    {
      key: "quote.content",
      label: "Quote",
      type: "textarea",
      section: "Quote",
      defaultValue:
        "Flowing funds with greater control and direction of rights holders and their allies",
      placeholder: "Insert quote here",
      helpText: "Main quote text displayed in the quote section",
    },

    // Our Vision Section
    {
      key: "vision.title",
      label: "Vision Title",
      type: "text",
      section: "Our Vision",
      defaultValue: "Our Vision",
      helpText: "Main heading for the vision section",
    },
    {
      key: "vision.content",
      label: "Vision Content",
      type: "html",
      section: "Our Vision",
      defaultValue:
        "Local communities, small-scale fishers and fish workers, and Indigenous Peoples fully experience their tenure, and associated rights and agency in the allocation, use, conservation, management and development of coastal lands, shorelines, oceans, lakes, rivers, and associated resources – toward better environmental and societal outcomes.",
      helpText: "Vision description text (supports HTML formatting)",
    },
    {
      key: "vision.image",
      label: "Vision Image",
      type: "image",
      section: "Our Vision",
      defaultValue: "/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png",
      helpText: "Image displayed on the right side of the section",
    },
    {
      key: "vision.imageAlt",
      label: "Image Alt Text",
      type: "text",
      section: "Our Vision",
      defaultValue: "Woman holding dried fish in outdoor setting",
      helpText: "Alternative text for the image (accessibility)",
    },

    // What We Want to Achieve Section
    {
      key: "achieve.tag",
      label: "Section Tag",
      type: "text",
      section: "What We Want to Achieve",
      defaultValue: "WHAT WE WANNA ACHIEVE",
      helpText: "Small uppercase heading displayed above the quote",
    },
    {
      key: "achieve.quote",
      label: "Main Quote",
      type: "textarea",
      section: "What We Want to Achieve",
      defaultValue:
        "A world where local communities, fishers and Indigenous Peoples can lead in managing, conserving, developing and adapting their lands, waters and resoruces",
      helpText: "Main quote text displayed in the section",
    },
    {
      key: "achieve.image",
      label: "Achieve Image",
      type: "image",
      section: "What We Want to Achieve",
      defaultValue: "/assets/achieve-1.webp",
      helpText: "Full width image displayed below the quote",
    },
    {
      key: "achieve.imageAlt",
      label: "Image Alt Text",
      type: "text",
      section: "What We Want to Achieve",
      defaultValue:
        "Bustling floating market with boats carrying goods, showcasing local communities managing their resources",
      helpText: "Alternative text for the image (accessibility)",
    },
    {
      key: "achieve.content",
      label: "Content",
      type: "html",
      section: "What We Want to Achieve",
    },

    // Our Goal Section
    {
      key: "goal.title",
      label: "Goal Title",
      type: "text",
      section: "Our Goal",
      defaultValue: "Our Goal",
      helpText: "Main heading for the goal section",
    },
    {
      key: "goal.description1",
      label: "Goal Description (First Paragraph)",
      type: "html",
      section: "Our Goal",
      defaultValue:
        "Implement and champion new approaches to funding that center power with, and provide resources directly to, local communities, small scale fishers and fish workers, and Indigenous Peoples, and the groups that legitimately serve them.",
      helpText:
        "First paragraph of goal description (supports HTML formatting)",
    },
    {
      key: "goal.description2",
      label: "Goal Description (Second Paragraph)",
      type: "html",
      section: "Our Goal",
      defaultValue:
        "With more appropriate and equitable resourcing, actors - across scales - can build rights recognition and conditions that ensure tenure security.",
      helpText:
        "Second paragraph of goal description (supports HTML formatting)",
    },
    {
      key: "goal.strategyTitle",
      label: "Strategy Card Title",
      type: "text",
      section: "Our Goal",
      defaultValue: "The Strategy to 2030",
      helpText: "Title displayed in the strategy card",
    },
    {
      key: "goal.strategyDescription",
      label: "Strategy Card Description",
      type: "textarea",
      section: "Our Goal",
      defaultValue:
        "See our multi-scale & geographic approach, how we identify the challenges, create risk mitigation, milestones and estimate budget until 2030 ahead.",
      helpText: "Description text in the strategy card",
    },
    {
      key: "goal.strategyImage",
      label: "Strategy Card Image",
      type: "image",
      section: "Our Goal",
      defaultValue: "/assets/demo/strategy.png",
      helpText: "Image displayed in the strategy card",
    },
    {
      key: "goal.strategyImageAlt",
      label: "Strategy Image Alt Text",
      type: "text",
      section: "Our Goal",
      defaultValue: "Strategy to 2030",
      helpText: "Alternative text for the strategy image (accessibility)",
    },
    {
      key: "goal.strategyDownloadUrl",
      label: "Strategy Download URL",
      type: "file",
      section: "Our Goal",
      defaultValue: "/downloads/strategy-2030.pdf",
      helpText: "URL to the strategy PDF file for download",
    },
    {
      key: "goal.strategyDownloadText",
      label: "Download Button Text",
      type: "text",
      section: "Our Goal",
      defaultValue: "Download",
      helpText: "Text displayed on the download button",
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

    // Team Section
    {
      key: "team.title",
      label: "Team Section Title",
      type: "text",
      section: "Team",
      defaultValue: "The Turning Tides' Team",
      helpText: "Main heading for the team section",
    },
    {
      key: "team.description",
      label: "Team Description",
      type: "textarea",
      section: "Team",
      defaultValue:
        "Meet the Turning Tides' team - people from across the globe with combined experiences in progressive philanthropy, human rights, gender equity, community organizing, Indigenous affairs, equity law, and environmental justice.",
      helpText: "Description text displayed below the title",
    },
    {
      key: "team.members",
      label: "Team Members (JSON)",
      type: "multiple",
      section: "Team",
      defaultValue: JSON.stringify(
        [
          {
            id: "1",
            name: "Philippa Cohen",
            role: "Co-Director",
            location: "Tasmania, Australia",
            image:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
            linkedinUrl: "https://linkedin.com/in/philippa-cohen",
          },
          {
            id: "2",
            name: "Kama Dean Fitz",
            role: "Co-Director",
            location: "Denver, CO, USA",
            image:
              "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
            linkedinUrl: "https://linkedin.com/in/kama-dean-fitz",
          },
          {
            id: "3",
            name: "Jamie Chen",
            role: "Head of Operations",
            location: "California, USA",
            image:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
            linkedinUrl: "https://linkedin.com/in/jamie-chen",
          },
          {
            id: "4",
            name: "Trini Pratiwi",
            role: "Asia Partner Liaison",
            location: "Malang, Indonesia",
            image:
              "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
            linkedinUrl: "https://linkedin.com/in/trini-pratiwi",
          },
          {
            id: "5",
            name: "John Doe",
            role: "Asia Partner Liaison",
            location: "Malang, Indonesia",
            image:
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
            linkedinUrl: "https://linkedin.com/in/john-doe",
          },
        ],
        null,
        2
      ),
      itemSchema: [
        {
          key: "name",
          label: "Name",
          type: "text",
          required: true,
          placeholder: "John Doe",
        },
        {
          key: "role",
          label: "Role",
          type: "text",
          required: true,
          placeholder: "Director",
        },
        {
          key: "location",
          label: "Location",
          type: "text",
          required: true,
          placeholder: "New York, USA",
        },
        {
          key: "image",
          label: "Image",
          type: "image",
          required: true,
          placeholder: "/path/to/image.jpg",
        },
        {
          key: "linkedinUrl",
          label: "LinkedIn URL",
          type: "text",
          required: false,
          placeholder: "https://linkedin.com/in/john-doe",
        },
      ],
      helpText:
        'Array of team member objects with id, name, role, location, image, and optional linkedinUrl. Example: [{"id": "1", "name": "John Doe", "role": "Director", "location": "New York, USA", "image": "/path/to/image.jpg", "linkedinUrl": "https://linkedin.com/in/john-doe"}]',
    },

    // Genesis Section
    {
      key: "genesis.title",
      label: "Genesis Title",
      type: "text",
      section: "Genesis",
      defaultValue: "The Genesis of Turning Tides",
      helpText: "Main heading for the genesis section",
    },
    {
      key: "genesis.introParagraph",
      label: "Intro Paragraph",
      type: "markdown",
      section: "Genesis",
      defaultValue:
        "Turning Tides emerged from the Marine Tenure Initiative (2022-2024) designed to understand how philanthropy could better support Indigenous Peoples, small-scale fishers, and coastal communities seeking tenure security and rights recognition.",
      helpText: "Introduction paragraph displayed below the title",
    },
    {
      key: "genesis.mainParagraph",
      label: "Main Paragraph",
      type: "markdown",
      section: "Genesis",
      defaultValue:
        "Governed by a Steering Committee with deep expertise in human rights and coastal tenure, the Initiative undertook comprehensive scoping research, over 100 hours of consultations across five regions, and a piloting phase with seven local organizations. This deliberate process revealed the substantial capacity and readiness of grassroots groups historically overlooked by traditional funding mechanisms, alongside the urgent need for approaches that genuinely center rights-holders in decision-making. These steps informed our values around trust-based partnerships, flexible processes, and support beyond financial grants.",
      helpText: "Main paragraph displayed in the left column",
    },
    {
      key: "genesis.closingParagraph",
      label: "Closing Paragraph",
      type: "markdown",
      section: "Genesis",
      defaultValue:
        "With **$33 million** committed from six aligned funders, **Turning Tides** launched in June 2024 as an institution purpose-built to support the recognition of rights and tenure security that unlocks community agency for more effective and self-determined climate action, environmental stewardship, and development.",
      helpText:
        "Closing paragraph (supports HTML formatting, use **text** for bold)",
    },
    {
      key: "genesis.logoSrc",
      label: "Logo Image",
      type: "image",
      section: "Genesis",
      defaultValue: "/assets/Logo.png",
      helpText: "Logo image displayed in the blue block",
    },

    // Funders Section
    {
      key: "funders.title",
      label: "Funders Section Title",
      type: "text",
      section: "Funders",
      defaultValue: "Our Funders",
      helpText: "Main heading for the funders section",
    },
    {
      key: "funders.funders",
      label: "Funders List",
      type: "multiple",
      section: "Funders",
      defaultValue: JSON.stringify(
        [
          {
            id: "ocean-resilience",
            name: "Ocean Resilience & Climate Alliance",
            logo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
            logoAlt: "Ocean Resilience & Climate Alliance Logo",
          },
          {
            id: "packard",
            name: "The David & Lucile Packard Foundation",
            logo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
            logoAlt: "The David & Lucile Packard Foundation Logo",
          },
          {
            id: "builders",
            name: "Builders Initiative",
            logo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
            logoAlt: "Builders Initiative Logo",
          },
          {
            id: "oak",
            name: "AK Foundation",
            logo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
            logoAlt: "AK Foundation Logo",
          },
          {
            id: "cargill",
            name: "Margaret A. Cargill Philanthropies",
            logo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
            logoAlt: "Margaret A. Cargill Philanthropies Logo",
          },
        ],
        null,
        2
      ),
      itemLabel: "Funder",
      itemSchema: [
        {
          key: "name",
          label: "Funder Name",
          type: "text",
          required: true,
          placeholder: "Foundation Name",
        },
        {
          key: "logo",
          label: "Logo Image",
          type: "image",
          required: true,
          placeholder: "/path/to/logo.png",
        },
        {
          key: "logoAlt",
          label: "Logo Alt Text",
          type: "text",
          required: true,
          placeholder: "Foundation Name Logo",
        },
      ],
      helpText:
        "List of funders with their logos. Each funder should have a name, logo image, and alt text.",
    },
    {
      key: "funders.ctaText",
      label: "CTA Text",
      type: "textarea",
      section: "Funders",
      defaultValue:
        "Interested Working Together With Us to Transforming Coastal Right?",
      helpText: "Call-to-action text displayed above the button",
    },
    {
      key: "funders.buttonText",
      label: "Button Text",
      type: "text",
      section: "Funders",
      defaultValue: "Become Funder",
      helpText: "Text displayed on the CTA button",
    },
    {
      key: "funders.buttonLink",
      label: "Button Link",
      type: "text",
      section: "Funders",
      defaultValue: "/get-involved",
      helpText: "URL for the CTA button",
    },

    // Triptych Gallery Section
    {
      key: "triptych.images",
      label: "Gallery Images",
      type: "multiple",
      section: "Triptych Gallery",
      defaultValue: JSON.stringify(
        [
          {
            id: "1",
            src: "/assets/slider-2.webp",
            alt: "Coastal fishing village with colorful boats and local people",
            width: "narrow",
          },
          {
            id: "2",
            src: "/assets/slider-1.webp",
            alt: "Underwater scene with school of fish swimming in deep blue water",
            width: "wide",
          },
          {
            id: "3",
            src: "/assets/slider-3.webp",
            alt: "View from inside a boat looking out towards open sea and sky",
            width: "narrow",
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
        },
        {
          key: "width",
          label: "Width",
          type: "text",
          required: false,
          placeholder: "narrow, medium, or wide",
          helpText:
            "Image width: 'narrow' (14%), 'medium' (33.333%), or 'wide' (71%)",
        },
      ],
      helpText:
        "Gallery images displayed in triptych format. Images are shown in sets of 3. Each image can have a width setting: narrow (14%), medium (33.333%), or wide (71%).",
    },
    {
      key: "triptych.autoPlay",
      label: "Auto Play",
      type: "boolean",
      section: "Triptych Gallery",
      defaultValue: "false",
      helpText: "Enable automatic slideshow",
    },
    {
      key: "triptych.autoPlayInterval",
      label: "Auto Play Interval (ms)",
      type: "number",
      section: "Triptych Gallery",
      defaultValue: "5000",
      helpText: "Time in milliseconds between auto-play transitions",
    },
    {
      key: "triptych.showNavigation",
      label: "Show Navigation",
      type: "boolean",
      section: "Triptych Gallery",
      defaultValue: "true",
      helpText: "Show navigation arrows and progress indicators",
    },

    // Support Section
    // {
    //   key: "support.title",
    //   label: "Support Title",
    //   type: "text",
    //   section: "Support",
    // },
    // {
    //   key: "support.content",
    //   label: "Support Content",
    //   type: "html",
    //   section: "Support",
    // },
    // Our Work Section
    {
      key: "ourWork.heading",
      label: "Section Heading",
      type: "text",
      section: "Our Work",
      defaultValue: "OUR WORK",
      helpText: "Small uppercase heading above the title",
    },
    {
      key: "ourWork.title",
      label: "Section Title",
      type: "text",
      section: "Our Work",
      defaultValue: "Discover Our Latest Activities",
      helpText: "Main title of the section",
    },
    {
      key: "ourWork.description",
      label: "Description",
      type: "textarea",
      section: "Our Work",
      defaultValue:
        "Turning Tides works in close partnership with grassroots groups, NGO allies, and dedicated funders. We connect regularly in person and virtually to exchange knowledge, provide supports and create new opportunities for change.",
      helpText: "Description text below the title",
    },
    {
      key: "ourWork.buttonText",
      label: "Button Text",
      type: "text",
      section: "Our Work",
      defaultValue: "See Our Work",
      helpText: "Text for the call-to-action button",
    },
    {
      key: "ourWork.buttonUrl",
      label: "Button URL",
      type: "text",
      section: "Our Work",
      defaultValue: "/our-work",
      helpText: "URL for the call-to-action button",
    },
    {
      key: "ourWork.images",
      label: "Images List",
      type: "multiple",
      section: "Our Work",
      defaultValue: JSON.stringify(
        [
          {
            src: "/assets/demo/16d51a5010efc92e05fa498a2dd962f76c4544ab.png",
            alt: "Person holding fish on boat at sunset",
          },
          {
            src: "/assets/demo/61d49ae554575244d2db7ab0551faf2183798c04.png",
            alt: "Group of diverse people smiling outdoors",
          },
          {
            src: "/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png",
            alt: "Person holding dried fish",
          },
          {
            src: "/assets/demo/achive.png",
            alt: "People gathered around table looking at map",
          },
        ],
        null,
        2
      ),
      helpText: "Add, edit, or remove images for the gallery",
      itemLabel: "Image",
      itemSchema: [
        {
          key: "src",
          label: "Image URL",
          type: "image",
          required: true,
          placeholder: "/images/example.jpg",
          helpText: "Image source URL or path",
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
    },
  ],
};
