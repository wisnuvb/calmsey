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
          biography:
            '<p>I have been an applied environmental social scientist and <strong>inclusive governance advisor for 25 years</strong>. I have always focused on small-scale fisheries, coastal communities, and women in fisheries – from research, processing, trading and governance. I am an islander – living and working in Australia (Tasmania), Tonga, Fiji, Solomon Islands and Malaysia (Penang).</p><p>Lorem ipsum dolor sit amet consectetur. Nascetur maecenas viverra diam habitant interdum orci in ridiculus sagittis. Vulputate orci ut convallis felis urna consequat et laoreet velit. Amet id molestie a enim vitae senectus in porta et. Quam velit elementum facilisi dui egestas rhoncus ipsum vestibulum. Nec a ut consectetur lorem. Egestas orci fringilla urna ultrices. Condimentum mi et fermentum pulvinar dignissim donec pellentesque congue pharetra. Ac eget porttitor proin sed viverra sit. Quis sit dignissim morbi amet amet. Nisl massa vitae.</p>',
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
        { key: "biography", type: "html", label: "Biography" },
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
            '<p><a href="https://turningtidesfacility.org/strategy">Our strategy</a> lays our vision, goal, values and principles. As we learn with partners, we may update our Strategy from time to time. When changes are made, we will update the date listed on the documents. Please review this page periodically for any updates.</p>',
        },
        {
          id: "fiscal-sponsorship",
          title: "Fiscal Sponsorship Agreement",
          content:
            '<p>Turning Tides operated under the <a href="https://turningtidesfacility.org/fiscal-sponsorship">fiscal sponsorship</a> of The Tenure Facility Fund, a US 501(c)3 not for profit subsidiary of the International Land and Forest Tenure Facility.</p>',
        },
        {
          id: "social-contract",
          title: "Social Contract",
          content:
            '<p>Over and above legal and financial good governance, the partnership with The Tenure Facility Fund, and the International Land and Forest Tenure Facility has been established to improve our services to partners. The spirit of this collaboration, and ties to partners, This partnership, are laid out in the <a href="https://turningtidesfacility.org/social-contract">Social Contract</a>.</p>',
        },
        {
          id: "conflict-of-interest",
          title: "Conflict of Interest",
          content:
            '<p>The <a href="https://turningtidesfacility.org/conflict-of-interest">Conflict of Interest</a> policy protects the interests and values of Turning Tides when it is contemplating entering a transaction or grantmaking process that might benefit the private interest of staff/contractors/consultants, Steering Committee members and any advisory committee/ council members of Turning Tides or might result in a possible excess benefit transaction. This policy is intended to supplement but not replace any applicable local and federal laws governing conflict of interest applicable to nonprofit and charitable organizations.</p>',
        },
        {
          id: "funding-acceptance",
          title: "Funding Acceptance",
          content:
            '<p>At Turning Tides, we prioritize upholding high standards of ethics, integrity, and transparency in all aspects of our operations. <a href="https://turningtidesfacility.org/funding-acceptance">Our Funding Acceptance</a> Policy serves as a safeguard, helping Turning Tides make informed decisions regarding external funding acceptance – allowing us to increase funds accessible to local communities, small-scale fisheries, fisher workers and Indigenous Peoples, while maintaining our commitment to ethical conduct, financial prudence, and mission alignment</p>',
        },
        {
          id: "grievance-mechanism",
          title: "Grievance Mechanism",
          content:
            '<p>We recognize that disputes or concerns may arise during the course of our work. We are committed to resolving any issues in a fair, transparent, and timely manner. Grievances: If you believe you have been treated unfairly, or if you have concerns regarding the handling of a grant decision or partnership with Turning Tides, please contact us at <a href="mailto:turningtides@tenureFacility.org">turningtides@tenureFacility.org</a>. We will acknowledge receipt within 10 business days and aim to resolve the issue within 60 business days or less. Appeals: If you are unsatisfied with the outcome of your grievance, you may appeal the decision by submitting a formal request to our Steering Committee at <a href="mailto:SteeringCommittee@TurningTidesFacility.org">SteeringCommittee@TurningTidesFacility.org</a></p>',
        },
        {
          id: "non-discrimination",
          title: "Non-Discrimination Policy",
          content:
            '<p>Turning Tides is committed to ensuring that all individuals and organizations, regardless of race, gender, sexual orientation, age, disability, religion, or any other characteristic, have equal access to our programs and services. We value diversity and inclusivity in all our operations, and our decision-making processes are designed to uphold the principles of justice and fairness.</p>',
        },
        {
          id: "steering-committee",
          title: "Turning Tides' Steering Committee",
          content:
            '<p>Turning Tides is guided by a <a href="https://turningtidesfacility.org/steering-committee">Steering Committee</a> who play a pivotal role in setting strategic direction and providing oversight. These Terms of Reference outline the roles, responsibilities, composition, and functioning of the Steering Committee of Turning Tides, ensuring alignment with the organization\'s vision, goals, values and principles.</p>',
        },
        {
          id: "other-policies",
          title: "Policies not listed here",
          content:
            '<p>Where Turning Tides policies are not listed here, they may be in development. We are governed by the legal and financial obligations of our 501(c)3 fiscal sponsor – The Tenure Facility Fund, and/or we defer to the operational and procedural policies of the International Land and Forest Tenure Facility.</p>',
        },
        {
          id: "amendments",
          title: "Amendments to Policies",
          content:
            '<p>We may update our policies from time to time to reflect changes in our practices, legal requirements, or organizational needs. When changes are made, we will update the "Last Revised" date at the top of this page. Please review this page periodically for any updates.</p>',
        },
        {
          id: "grievance-redress",
          title: "Grievance and Redress Policy",
          content:
            '<p>Turning Tides\' Grievance and Redress Policy provides a clear, transparent process for raising concerns and resolving complaints, strengthening trust and accountability with an <a href="https://turningtidesfacility.org/grievance-redress">established</a>, <a href="https://turningtidesfacility.org/feedback">Give feedback</a></p>',
        },
        {
          id: "consent-rights",
          title: "Consent and Rights Policy",
          content:
            '<p>TurningTides is committed to transparency and trust through a clear <a href="https://turningtidesfacility.org/consent-rights">Consent and Rights Policy</a>.</p>',
        },
        {
          id: "contact-info",
          title: "Contact Information",
          content:
            '<p>If you have any questions about our policies or need further clarification, please reach out to us:</p><ul><li>Email: <a href="mailto:info@turningTidesFacility.org">info@turningTidesFacility.org</a></li><li>Phone: +62 838 329 80063 (also available for whatsapp contact)</li><li>Mailing Address: 190 Varick Street, FL2, New York, NY 10002 USA</li></ul>',
        },
      ]),
      itemSchema: [
        { key: "id", type: "text", label: "Policy ID", required: true },
        { key: "title", type: "text", label: "Policy Title", required: true },
        {
          key: "content",
          type: "html",
          label: "Policy Content",
          required: true,
        },
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
