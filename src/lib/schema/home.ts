import { PageContentSchema } from "../page-content-schema";

export const HOME_SCHEMA: PageContentSchema = {
  pageType: "HOME",
  sections: [
    "Hero",
    "Why TurningTides",
    "Partner Stories",
    "Where We Work",
    "Our Work",
    "Latest Articles",
    "Strategy",
  ],
  fields: [
    // Hero Section
    {
      key: "hero.title",
      label: "Hero Title",
      type: "text",
      section: "Hero",
      required: true,
      placeholder: "Welcome to TurningTides",
      helpText: "Main headline displayed in the hero section",
    },
    {
      key: "hero.subtitle",
      label: "Hero Subtitle",
      type: "textarea",
      section: "Hero",
      placeholder: "Protecting coastal communities worldwide",
    },
    {
      key: "hero.backgroundImage",
      label: "Hero Background Image",
      type: "image",
      section: "Hero",
      helpText: "Recommended size: 1920x1080px",
    },
    {
      key: "hero.ctaText",
      label: "CTA Button Text",
      type: "text",
      section: "Hero",
      defaultValue: "Learn More",
    },
    {
      key: "hero.ctaLink",
      label: "CTA Button Link",
      type: "text",
      section: "Hero",
      defaultValue: "/about-us",
    },

    // Why TurningTides Section
    {
      key: "whyUs.missionTitle",
      label: "Mission Statement Title",
      type: "textarea",
      section: "Why TurningTides",
      defaultValue:
        "Turning Tides is an international, value-led, facility dedicated to supporting the tenure and rights of local communities, fisher peoples, and Indigenous Peoples.",
      helpText: "Main mission statement headline",
      placeholder: "Enter the main mission statement...",
    },
    {
      key: "whyUs.missionDescription",
      label: "Mission Description",
      type: "textarea",
      section: "Why TurningTides",
      defaultValue:
        "When tenure is secure and surrounding human rights are recognized, communities thrive, environments are protected, and economies are inclusive and strong.",
      helpText: "Supporting description for the mission",
    },
    {
      key: "whyUs.fundersLabel",
      label: "Funders Label Text",
      type: "text",
      section: "Why TurningTides",
      defaultValue: "Together with the Funders Transforming Coastal Right",
      helpText: "Text above funder logos",
    },
    {
      key: "whyUs.funders",
      label: "Funders List",
      type: "multiple",
      section: "Why TurningTides",
      // defaultValue: JSON.stringify(
      //   [
      //     { name: "Oceankind", logo: "/funders/oceankind.svg" },
      //     {
      //       name: "Ocean Resilience Climate Alliance",
      //       logo: "/funders/orca.svg",
      //     },
      //     {
      //       name: "David and Lucile Packard Foundation",
      //       logo: "/funders/packard.svg",
      //     },
      //     { name: "Waitt Institute", logo: "/funders/waitt.svg" },
      //     { name: "Oak Foundation", logo: "/funders/oak.svg" },
      //     {
      //       name: "Margaret A Cargill Philanthropies",
      //       logo: "/funders/cargill.svg",
      //     },
      //   ],
      //   null,
      //   2
      // ),
      helpText: 'Array of funder objects with "name" and "logo" properties',
      // placeholder: '[{"name": "Funder Name", "logo": "/path/to/logo.svg"}]',
      itemLabel: "Funder",
      itemSchema: [
        {
          key: "name",
          label: "Funder Name",
          type: "text",
          required: true,
        },
        {
          key: "logo",
          label: "Image URL",
          type: "image",
          required: true,
          placeholder: "/images/example.jpg",
          helpText: "Image source URL or path",
        },
      ],
    },
    {
      key: "whyUs.whyTitle",
      label: "Why Box Title",
      type: "text",
      section: "Why TurningTides",
      defaultValue: "So Why Are We Turning Tides?",
      helpText: "Title for the right column 'Why' section",
    },
    {
      key: "whyUs.whyContent",
      label: "Why Box Content",
      type: "textarea",
      section: "Why TurningTides",
      defaultValue:
        "Because collective rights are still being eroded by weak commitments, powerful interests, narrow views of tenure, and tokenistic efforts toward participation.",
      helpText: "Explanation text for why Turning Tides exists",
    },
    {
      key: "whyUs.ctaText",
      label: "CTA Button Text",
      type: "text",
      section: "Why TurningTides",
      defaultValue: "More About Us",
      helpText: "Text for the call-to-action button",
    },
    {
      key: "whyUs.ctaLink",
      label: "CTA Button Link",
      type: "text",
      section: "Why TurningTides",
      defaultValue: "/about",
      helpText: "URL for the call-to-action button",
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

    // Where We Work Section
    {
      key: "whereWeWork.title",
      label: "Section Title",
      type: "text",
      section: "Where We Work",
      defaultValue: "Where Does Turning Tides Work?",
    },
    {
      key: "whereWeWork.actionPlansText",
      label: "Action Plans Text",
      type: "textarea",
      section: "Where We Work",
      defaultValue:
        "We have **developed action plans** for Latin America and Africa, and **mobilizing grants** for work in Chile, Honduras, Panama, Costa Rica, Senegal, Uganda.",
      helpText:
        "Text for the blue legend block (Action Plans). Use **text** for bold.",
    },
    {
      key: "whereWeWork.explorationText",
      label: "Exploration Phase Text",
      type: "textarea",
      section: "Where We Work",
      defaultValue:
        "We are also in the **exploration and engagement phase** - Brazil, India, Indonesia, Sri Lanka, Thailand.",
      helpText:
        "Text for the teal legend block (Exploration Phase). Use **text** for bold.",
    },
    {
      key: "whereWeWork.explorationLinkText",
      label: "Exploration Link Text",
      type: "text",
      section: "Where We Work",
      defaultValue: "View Report",
      helpText: "Text for the link in exploration phase block",
    },
    {
      key: "whereWeWork.explorationLinkUrl",
      label: "Exploration Link URL",
      type: "text",
      section: "Where We Work",
      defaultValue: "#",
      helpText: "URL for the exploration phase link",
    },
    {
      key: "whereWeWork.mapImage",
      label: "Map Image",
      type: "image",
      section: "Where We Work",
      defaultValue: "/assets/world-map.png",
      helpText: "Map showing regions of operation",
    },
    {
      key: "whereWeWork.partnersText",
      label: "Partners Piloting Text",
      type: "textarea",
      section: "Where We Work",
      defaultValue:
        'Our **"Partners Piloting"** partners are Bangladesh, Thailand, Indonesia, Honduras, Senegal.',
      helpText: "Text displayed below the map. Use **text** for bold.",
    },

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

    // Latest Articles Section
    {
      key: "articles.title",
      label: "Section Title",
      type: "text",
      section: "Latest Articles",
      defaultValue: "Latest Articles",
    },
    {
      key: "articles.limit",
      label: "Number of Articles to Display",
      type: "number",
      section: "Latest Articles",
      defaultValue: "6",
      validation: { min: 1, max: 12 },
    },

    // Strategy Download Section
    {
      key: "strategy.description",
      label: "Description",
      type: "textarea",
      section: "Strategy",
      defaultValue:
        "Our approach, values, risk mitigation, milestones and budget estimates are in our Strategy to 2030.",
      helpText: "Main description text displayed on the left side",
    },
    {
      key: "strategy.downloadUrl",
      label: "PDF Download URL",
      type: "file",
      section: "Strategy",
      defaultValue: "/downloads/strategy-2030.pdf",
      helpText: "Link to the strategy PDF file",
    },
    {
      key: "strategy.buttonText",
      label: "Download Button Text",
      type: "text",
      section: "Strategy",
      defaultValue: "Download Our Strategy 2030",
      helpText: "Text for the download button",
    },
    {
      key: "strategy.learnMoreButtonText",
      label: "Learn More Button Text",
      type: "text",
      section: "Strategy",
      defaultValue: "Learn Our Funds",
      helpText: "Text for the secondary button",
    },
    {
      key: "strategy.learnMoreButtonUrl",
      label: "Learn More Button URL",
      type: "text",
      section: "Strategy",
      defaultValue: "/our-fund",
      helpText: "URL for the secondary button",
    },
  ],
};
