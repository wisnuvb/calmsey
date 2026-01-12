import { PageContentSchema } from "../page-content-schema";

export const GOVERNANCE_SCHEMA: PageContentSchema = {
  pageType: "GOVERNANCE",
  sections: [
    "Hero",
    "Governance Meaning",
    "Steering Committee",
    "Funding Acceptance Policy",
    "Guiding Policies",
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
      defaultValue: "The Governance of Turning Tides",
    },
    {
      key: "hero.subtitle",
      label: "Page Subtitle",
      type: "textarea",
      section: "Hero",
      defaultValue:
        "Turning Tides's conservation efforts - from protecting oceans and endangered species to supporting small-scale fishers, biodiversity conservation, and sustainable communities.",
    },
    {
      key: "hero.backgroundImage",
      label: "Hero Background Image",
      type: "image",
      section: "Hero",
      defaultValue: "/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png",
    },

    // Governance Meaning Section
    {
      key: "governanceMeaning.title",
      label: "Section Title",
      type: "text",
      section: "Governance Meaning",
      defaultValue:
        "What governance means to Turning Tides and why it's foundational",
    },
    {
      key: "governanceMeaning.subtitle",
      label: "Section Subtitle",
      type: "text",
      section: "Governance Meaning",
      defaultValue: "(power, agency, connection to theory of change).",
    },
    {
      key: "governanceMeaning.image",
      label: "Section Image",
      type: "image",
      section: "Governance Meaning",
      defaultValue: "/assets/achieve-1.webp",
    },
    {
      key: "governanceMeaning.imageAlt",
      label: "Image Alt Text",
      type: "text",
      section: "Governance Meaning",
      defaultValue: "Boats near a riverside community",
    },
    {
      key: "governanceMeaning.paragraphs",
      label: "Content Paragraphs",
      type: "multiple",
      section: "Governance Meaning",
      defaultValue: JSON.stringify([
        "Lorem ipsum dolor sit amet consectetur. Purus sed massa pharetra maecenas eu eleifend turpis. Arcu tellus fermentum quis tempor faucibus et eros arcu. Eget non nullam senectus sit risus ut felis. Malesuada placerat suspendisse nulla proin faucibus. Eros sem quam magna et volutpat pellentesque. Arcu molestie ac tellus pellentesque placerat in suspendisse. Senectus nisl quis tincidunt mauris nibh ac ac eget.",
        "Justo tortor nam dictumst dui pretium nec. Sapien dignissim diam nulla arcu magnis mauris scelerisque id sollicitudin. Eu vestibulum in eu felis sit amet pellentesque sagittis suspendisse. Tristique fames neque semper nisl purus pretium sem ornare nisl. Non aliquam dolor amet odio. Est scelerisque semper euismod mauris. Egestas varius enim tortor commodo elementum curabitur faucibus cras.",
        "Turpis at pellentesque dui quis accumsan at pellentesque ultricies. Rutrum sed leo ut dolor morbi eget. Eget semper malesuada tempus sit malesuada imperdiet malesuada dignissim bibendum. Duis viverra tempus elementum sit velit at in. Gravida nunc diam risus pharetra nibh nullam. Blandit et eget viverra nisl vitae",
      ]),
      itemSchema: [
        {
          key: "paragraph",
          type: "textarea",
          label: "Paragraph Text",
          required: true,
        },
      ],
      helpText:
        "Add or remove paragraphs as needed. Each paragraph will be displayed sequentially.",
    },

    // Steering Committee Section
    {
      key: "steeringCommittee.title",
      label: "Section Title",
      type: "text",
      section: "Steering Committee",
      defaultValue: "The Steering Committee",
    },
    {
      key: "steeringCommittee.description",
      label: "Description",
      type: "textarea",
      section: "Steering Committee",
      defaultValue:
        "Turning Tides is governed by a Steering Committee who are responsible for setting strategic direction and values alignment",
    },
    {
      key: "steeringCommittee.additionalDescription",
      label: "Additional Description",
      type: "textarea",
      section: "Steering Committee",
      defaultValue:
        "The implementation of our strategy and organizational priorities—composed of small-scale fisher leaders, Indigenous Peoples, and rights experts who bring both deep expertise and accountability to those we serve. The Steering Committee has governed the initiative since the first months of its inception and is critical to the accountability and efficacy",
    },
    {
      key: "steeringCommittee.members",
      label: "Committee Members",
      type: "multiple",
      section: "Steering Committee",
      defaultValue: JSON.stringify([
        {
          id: "myrna-cunningham",
          name: "Myrna Cunningham Kain",
          country: "Nicaragua",
          image:
            "https://s7d1.scene7.com/is/image/wbcollab/Myrna-Cunningham-2?qlt=75&resMode=sharp2",
          imageAlt: "Myrna Cunningham Kain",
          linkedinUrl: "https://linkedin.com/in/myrna-cunningham",
        },
        {
          id: "vivienne-solis",
          name: "Vivienne Solis Rivera",
          country: "Costa Rica",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7YGBwVSD-KJDpMbdJJQ8r7OdC5Rv4keEyNA&s",
          imageAlt: "Vivienne Solis Rivera",
          linkedinUrl: "https://linkedin.com/in/vivienne-solis",
        },
        {
          id: "hugh-govan",
          name: "Hugh Govan",
          country: "Spain",
          image:
            "https://www.unigib.edu.gi/wp-content/uploads/2024/11/Untitled-design-3-2.png",
          imageAlt: "Hugh Govan",
          linkedinUrl: "https://linkedin.com/in/hugh-govan",
        },
        {
          id: "aarthi-sridhar",
          name: "Aarthi Sridhar",
          country: "India",
          image:
            "https://dakshin.org/wp-content/uploads/2019/02/IMG_20200919_113143-479x525.jpg",
          imageAlt: "Aarthi Sridhar",
          linkedinUrl: "https://linkedin.com/in/aarthi-sridhar",
        },
      ]),
      itemSchema: [
        { key: "id", type: "text", label: "Member ID", required: true },
        { key: "name", type: "text", label: "Name", required: true },
        { key: "country", type: "text", label: "Country", required: true },
        { key: "image", type: "image", label: "Photo", required: true },
        { key: "imageAlt", type: "text", label: "Photo Alt Text" },
        { key: "linkedinUrl", type: "text", label: "LinkedIn URL" },
      ],
    },
    {
      key: "steeringCommittee.bottomText",
      label: "Bottom Text",
      type: "textarea",
      section: "Steering Committee",
      helpText: "Optional text displayed at the bottom of the section",
    },

    // Funding Acceptance Policy Section
    {
      key: "fundingAcceptancePolicy.title",
      label: "Section Title",
      type: "text",
      section: "Funding Acceptance Policy",
      defaultValue: "Turning Tides External Funding Acceptance Policy",
    },
    {
      key: "fundingAcceptancePolicy.paragraphs",
      label: "Content Paragraphs",
      type: "multiple",
      section: "Funding Acceptance Policy",
      defaultValue: JSON.stringify([
        "We prioritize upholding high standards of ethics, integrity, and transparency in all aspects of our operations. To this end, we have established a policy to guide our decision-making regarding the acceptance of external funding.",
        "This document serves as a safeguard, helping Turning Tides make informed decisions regarding external funding acceptance – allowing us to increase funds accessible to local communities, small-scale fishers, fisher workers and Indigenous Peoples, while maintaining our commitment to ethical conduct, financial prudence, and mission alignment.",
      ]),
      itemSchema: [
        {
          key: "paragraph",
          type: "textarea",
          label: "Paragraph Text",
          required: true,
        },
      ],
      helpText:
        "Add or remove paragraphs as needed. Each paragraph will be displayed sequentially.",
    },
    {
      key: "fundingAcceptancePolicy.buttonText",
      label: "Button Text",
      type: "text",
      section: "Funding Acceptance Policy",
      defaultValue: "Our Funding Acceptance Policy",
    },
    {
      key: "fundingAcceptancePolicy.buttonLink",
      label: "Button Link",
      type: "text",
      section: "Funding Acceptance Policy",
      defaultValue: "/governance/funding-policy",
    },

    // Guiding Policies Section
    {
      key: "guidingPolicies.title",
      label: "Section Title",
      type: "text",
      section: "Guiding Policies",
      defaultValue: "Our Guiding Policies",
    },
    {
      key: "guidingPolicies.lastUpdate",
      label: "Last Update Date",
      type: "text",
      section: "Guiding Policies",
      defaultValue: "15 January 2025",
    },
    {
      key: "guidingPolicies.description",
      label: "Description",
      type: "textarea",
      section: "Guiding Policies",
      defaultValue:
        "Our guiding policies support collaboration, transparency, and flexibility, ensuring that each of our funds are tailored to foster responsiveness and adaptability.",
    },
    {
      key: "guidingPolicies.policies",
      label: "Policies List",
      type: "multiple",
      section: "Guiding Policies",
      defaultValue: JSON.stringify([
        {
          id: "our-strategy",
          title: "Our Strategy",
          content:
            "Our strategy lays our vision, goal, values and principles. As we learn with partners, we may update our Strategy from time to time. When changes are made, we will update the date listed on the documents. Please review this page periodically for any updates.",
          linkText: "Our strategy",
          linkHref: "/strategy",
        },
        {
          id: "fiscal-sponsorship",
          title: "Fiscal Sponsorship Agreement",
          content:
            "This agreement outlines the terms and conditions for fiscal sponsorship partnerships with Turning Tides.",
        },
        {
          id: "social-contract",
          title: "Social Contract",
          content:
            "Our social contract defines the mutual commitments and expectations between Turning Tides and our partners.",
        },
        {
          id: "conflict-of-interest",
          title: "Conflict of Interest",
          content:
            "This policy addresses potential conflicts of interest and ensures transparency in all our partnerships.",
        },
        {
          id: "funding-acceptance",
          title: "Funding Acceptance",
          content:
            "Guidelines for accepting and managing funding from various sources while maintaining our values.",
        },
        {
          id: "grievance-mechanism",
          title: "Grievance Mechanism",
          content:
            "Procedures for addressing concerns and grievances in a fair and transparent manner.",
        },
        {
          id: "non-discrimination",
          title: "Non-Discrimination Policy",
          content:
            "Our commitment to non-discrimination and equal treatment for all partners and stakeholders.",
        },
        {
          id: "steering-committee",
          title: "Turning Tides' Steering Committee",
          content:
            "Information about our steering committee structure, roles, and responsibilities.",
        },
        {
          id: "other-policies",
          title: "Policies not listed here",
          content:
            "Additional policies and guidelines that may apply to specific partnerships or situations.",
        },
        {
          id: "amendments",
          title: "Amendments to Policies",
          content:
            "Process for updating and amending our policies to ensure they remain relevant and effective.",
        },
        {
          id: "contact-info",
          title: "Contact Information",
          content:
            "How to reach us for questions about our policies or to provide feedback.",
        },
      ]),
      itemSchema: [
        { key: "id", type: "text", label: "Policy ID", required: true },
        { key: "title", type: "text", label: "Policy Title", required: true },
        {
          key: "content",
          type: "textarea",
          label: "Policy Content",
          required: true,
        },
        { key: "linkText", type: "text", label: "Link Text" },
        { key: "linkHref", type: "text", label: "Link URL" },
      ],
    },

    // Feedback Callout Section (Common section, same as About Us)
    {
      key: "feedbackCallout.title",
      label: "Section Title",
      type: "text",
      section: "Feedback Callout",
      defaultValue: "Your Voice Matters",
    },
    {
      key: "feedbackCallout.description",
      label: "Description",
      type: "textarea",
      section: "Feedback Callout",
      defaultValue:
        "We value your input and feedback. Share your thoughts, suggestions, or concerns with us.",
    },
    {
      key: "feedbackCallout.feedbackButtonText",
      label: "Feedback Button Text",
      type: "text",
      section: "Feedback Callout",
      defaultValue: "Share Feedback",
    },
    {
      key: "feedbackCallout.feedbackButtonLink",
      label: "Feedback Button Link",
      type: "text",
      section: "Feedback Callout",
      defaultValue: "/feedback",
    },
    {
      key: "feedbackCallout.learnMoreButtonText",
      label: "Learn More Button Text",
      type: "text",
      section: "Feedback Callout",
      defaultValue: "Learn More",
    },
    {
      key: "feedbackCallout.learnMoreButtonLink",
      label: "Learn More Button Link",
      type: "text",
      section: "Feedback Callout",
      defaultValue: "/about",
    },
  ],
};
