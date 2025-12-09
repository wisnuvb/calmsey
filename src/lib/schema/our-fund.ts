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
      type: "json",
      section: "Grantmaking",
      defaultValue: JSON.stringify(
        [
          {
            id: "approach",
            label: "Our approach to Grantmaking",
            content: {
              id: "approach",
              title: "Our approach to Grantmaking",
              imageSrc:
                "/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png",
              imageAlt: "Grantmaking approach",
              paragraphs: [
                "Turning Tides implements and advocates for liberatory approaches to partnership and grantmaking – empowering and centering local communities, small-scale fishers and fish workers, and Indigenous Peoples and their supporting groups, rather than maintaining hierarchical relationships.",
                "We are accountable to our partners and work to change systems that create barriers to tenure security. Our practices include multi-year flexible funding, streamlined processes, and partnership support that extends beyond financial contributions.",
              ],
              practicesTitle: "What we practice",
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
          },
          {
            id: "tenure",
            label: "What we understand by tenure",
            content: {
              id: "tenure",
              title: "What we understand by tenure",
              paragraphs: [
                "Tenure refers to the relationship, whether legally or customarily defined, among people with respect to land, water, and resources. It determines who can use what resources, for how long, and under what conditions.",
              ],
            },
          },
          {
            id: "framework",
            label: "Our Grantmaking Framework",
            content: {
              id: "framework",
              title: "Our Grantmaking Framework",
              paragraphs: [
                "Our grantmaking framework is designed to support communities in securing and strengthening their tenure rights through flexible, partner-centered approaches.",
              ],
            },
          },
        ],
        null,
        2
      ),
      helpText:
        'JSON array of navigation items. Each item should have: id, label, and content object with title, imageSrc (optional), imageAlt (optional), paragraphs (array), practicesTitle (optional), and practices (array of objects with id and text). Example: [{"id": "approach", "label": "Our Approach", "content": {"id": "approach", "title": "Title", "paragraphs": ["Paragraph 1", "Paragraph 2"], "practicesTitle": "Practices", "practices": [{"id": "1", "text": "Practice 1"}]}}]',
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
      type: "json",
      section: "Our Four Funds",
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
      helpText:
        'JSON array of fund objects. Each fund should have: id, title, description, imageSrc, imageAlt, icon (one of: "Waves", "Globe", "Zap", "Lightbulb"), learnMoreLink, and imagePosition ("left" or "right"). Example: [{"id": "fund-1", "title": "Fund Title", "description": "Fund description", "imageSrc": "/path/to/image.jpg", "imageAlt": "Alt text", "icon": "Waves", "learnMoreLink": "/funds/fund-1", "imagePosition": "left"}]',
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
      type: "json",
      section: "Our Partners",
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
      helpText:
        'JSON array of partner objects. Each partner should have: id, name, logo, logoAlt, and website (optional). Example: [{"id": "partner-1", "name": "Partner Name", "logo": "/path/to/logo.png", "logoAlt": "Partner Logo", "website": "https://partner.org"}]',
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
  ],
};
