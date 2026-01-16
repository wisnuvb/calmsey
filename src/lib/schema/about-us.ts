import { PageContentSchema } from "../page-content-schema";

export const ABOUT_US_SCHEMA: PageContentSchema = {
  pageType: "ABOUT_US",
  sections: [
    "Hero",
    "Our Vision",
    "Our Values",
    "Our Goal",
    "Where We Work",
    "Our Team",
    "Funders",
    "Genesis",
    "Feedback Callout",
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

    // Our Values Section
    {
      key: "values.title",
      label: "Values Title",
      type: "text",
      section: "Our Values",
      defaultValue: "Our Values",
      helpText: "Main heading for the values section",
    },
    {
      key: "values.description",
      label: "Values Description",
      type: "textarea",
      section: "Our Values",
      defaultValue:
        "Our values and principles were built through consultation with partners, discussion with the Steering Committee, and established practices of liberatory grantmaking. They guide our decisions, interactions, and approach to our work—they are foundational to who we are as an organization.",
      helpText: "Description text displayed below the title",
    },
    {
      key: "values.items",
      label: "Values List",
      type: "multiple",
      section: "Our Values",
      defaultValue: JSON.stringify(
        [
          {
            id: "center-power",
            title:
              "Center power with partners (i.e., Local communities, small-scale fishers, fish workers, and Indigenous Peoples, and the groups that legitimately serve and support them)",
            imageSrc: "/assets/partner1.webp",
            className: "h-[400px] md:h-full",
          },
          {
            id: "uphold-lived-experience",
            title: "Uphold lived experience and diverse knowledge.",
            imageSrc: "/assets/our-view.webp",
            className: "h-[250px]",
          },
          {
            id: "base-trust",
            title: "Base our work on trust, responsiveness and service.",
            imageSrc: "/assets/slider-1.webp",
            className: "h-[250px]",
          },
          {
            id: "transparency",
            title: "Prioritize transparency & accountability.",
            imageSrc: "/assets/slider-2.webp",
            className: "h-[250px]",
          },
          {
            id: "foster-solidarity",
            title: "Foster solidarity and protect civic spaces.",
            imageSrc: "/assets/slider-3.webp",
            className: "h-[250px]",
          },
          {
            id: "self-determination",
            title:
              "Prioritize and plan for self-determination and independence.",
            imageSrc: "/assets/achieve-1.webp",
            className: "h-[250px]",
          },
          {
            id: "humility",
            title: "Commit to humility and reflexivity.",
            imageSrc: "/assets/gov-hero.webp",
            className: "h-[400px] md:h-full",
          },
        ],
        null,
        2
      ),
      itemLabel: "Value",
      itemSchema: [
        {
          key: "title",
          label: "Value Title",
          type: "text",
          required: true,
          placeholder: "Center power with partners",
        },
        {
          key: "imageSrc",
          label: "Image",
          type: "image",
          required: true,
          placeholder: "/assets/image.jpg",
        },
        {
          key: "className",
          label: "CSS Class (height)",
          type: "text",
          required: false,
          placeholder: "h-[250px]",
          helpText:
            "CSS height class for the card (e.g., h-[250px] or h-[400px])",
        },
      ],
      helpText:
        "List of organizational values with images. Each value has a title, image, and optional height class.",
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

    // Where We Work Section
    {
      key: "whereWeWork.title",
      label: "Section Title",
      type: "text",
      section: "Where We Work",
      defaultValue: "Where Does Turning Tides Work?",
      helpText: "Main heading for the section",
    },
    {
      key: "whereWeWork.actionPlansText",
      label: "Action Plans Text",
      type: "textarea",
      section: "Where We Work",
      defaultValue:
        "We have **developed action plans** for Latin America and Africa, and **mobilizing grants** for work in Chile, Honduras, Panama, Costa Rica, Senegal, Uganda.",
      helpText:
        "Text describing action plans (use **text** for bold formatting)",
    },
    {
      key: "whereWeWork.explorationText",
      label: "Exploration Phase Text",
      type: "textarea",
      section: "Where We Work",
      defaultValue:
        "We are also in the **exploration and engagement phase** – Brazil, India, Indonesia, Sri Lanka, Thailand.",
      helpText:
        "Text describing exploration phase (use **text** for bold formatting)",
    },
    {
      key: "whereWeWork.explorationLinkText",
      label: "Exploration Link Text",
      type: "text",
      section: "Where We Work",
      defaultValue: "View Report",
      helpText: "Text for the exploration report link",
    },
    {
      key: "whereWeWork.explorationLinkUrl",
      label: "Exploration Link URL",
      type: "text",
      section: "Where We Work",
      defaultValue: "#",
      helpText: "URL for the exploration report",
    },
    {
      key: "whereWeWork.mapImage",
      label: "Map Image",
      type: "image",
      section: "Where We Work",
      defaultValue: "/assets/world-map.png",
      helpText: "World map image showing work locations",
    },
    {
      key: "whereWeWork.partnersText",
      label: "Partners Text",
      type: "textarea",
      section: "Where We Work",
      defaultValue:
        'Our **"Partners Piloting"** partners are Bangladesh, Thailand, Indonesia, Honduras, Senegal.',
      helpText:
        "Text describing pilot partners (use **text** for bold formatting)",
    },

    // Team Section
    {
      key: "team.title",
      label: "Team Section Title",
      type: "text",
      section: "Our Team",
      defaultValue: "The Turning Tides' Team",
      helpText: "Main heading for the team section",
    },
    {
      key: "team.description",
      label: "Team Description",
      type: "textarea",
      section: "Our Team",
      defaultValue:
        "Meet the Turning Tides' team - people from across the globe with combined experiences in progressive philanthropy, human rights, gender equity, community organizing, Indigenous affairs, equity law, and environmental justice.",
      helpText: "Description text displayed below the title",
    },
    {
      key: "team.members",
      label: "Team Members (JSON)",
      type: "multiple",
      section: "Our Team",
      defaultValue: JSON.stringify(
        [
          {
            id: "1",
            name: "Philippa Cohen",
            role: "Co-Director",
            location: "Tasmania, Australia",
            image:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
            biography:
              "Philippa is an applied environmental social scientist and inclusive governance advisor for 25 years. Her work has focused on small-scale fisheries, coastal communities, and women in fisheries. She is an islander – living and working in Australia (Tasmania), Tonga, Fiji, Solomon Islands and Malaysia (Penang).\n\nPhilippa completed her PhD on equitable oceans and has worked extensively with communities, governments, and organizations to support inclusive and sustainable coastal resource management.",
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
          key: "biography",
          label: "Biography",
          type: "textarea",
          required: false,
          placeholder: "Enter biography text here...",
          helpText:
            "Biography text displayed in the modal. Supports multi-paragraph text.",
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
        'Array of team member objects with id, name, role, location, image, optional biography, and optional linkedinUrl. Example: [{"id": "1", "name": "John Doe", "role": "Director", "location": "New York, USA", "image": "/path/to/image.jpg", "biography": "Biography text here...", "linkedinUrl": "https://linkedin.com/in/john-doe"}]',
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
      key: "feedbackCallout.feedbackText",
      label: "Feedback Button Text",
      type: "text",
      section: "Feedback Callout",
      defaultValue: "Give Feedback",
      helpText: "Text for the feedback button",
    },
    {
      key: "feedbackCallout.feedbackLink",
      label: "Feedback Button Link",
      type: "text",
      section: "Feedback Callout",
      defaultValue: "/feedback",
      helpText: "URL for the feedback button",
    },
    {
      key: "feedbackCallout.learnMoreText",
      label: "Learn More Button Text",
      type: "text",
      section: "Feedback Callout",
      defaultValue: "Learn More",
      helpText: "Text for the learn more button",
    },
    {
      key: "feedbackCallout.learnMoreLink",
      label: "Learn More Button Link",
      type: "text",
      section: "Feedback Callout",
      defaultValue: "/governance",
      helpText: "URL for the learn more button",
    },
  ],
};
