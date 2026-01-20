"use client";

import React, { useState } from "react";
import { CheckCircle2, Shield, BookMarked, Info, Download } from "lucide-react";
import { H2, H5, H6, P } from "../ui/typography";
import { usePageContentHelpers } from "@/hooks/usePageContentHelpers";

interface ContentItem {
  icon?: React.ReactNode;
  text: string;
}

interface DescriptionCard {
  icon: React.ReactNode;
  text: string;
}

interface NavigationItem {
  id: string;
  title: string;
  content: {
    title: string;
    description?: string[] | DescriptionCard[];
    descriptionAsCards?: boolean; // Flag to render descriptions as cards
    titleItem?: string;
    items?: ContentItem[];
    numberedItems?: { number: string; text: string }[]; // For numbered list
    calloutText?: string; // Bold callout text
    calloutBold?: string[]; // Array of strings to make bold
    infoBox?: {
      text: string;
      linkText?: string;
    };
    downloadSection?: {
      text: string;
      buttonText: string;
      buttonUrl: string;
      buttonIcon?: React.ReactNode;
    };
  };
}

interface SupportSectionProps {
  navigationItems?: NavigationItem[];
}

const resolveIcon = (
  icon?: unknown,
  variant?: "check" | "shield" | "bookmark" | "download"
): React.ReactNode | undefined => {
  if (!icon) return undefined;
  if (React.isValidElement(icon)) return icon;
  if (typeof icon !== "string") return undefined;

  switch (icon) {
    case "CheckCircle2":
      return <CheckCircle2 className="w-6 h-6 text-[#5ABF87]" />;
    case "Shield":
      return <Shield className="w-6 h-6 text-[#3C62ED]" />;
    case "BookMarked":
      return <BookMarked className="w-6 h-6 text-[#3C62ED]" />;
    case "Download":
      return (
        <Download className={variant === "download" ? "w-5 h-5" : "w-6 h-6"} />
      );
    default:
      return undefined;
  }
};

const normalizeNavigationItems = (
  items: NavigationItem[]
): NavigationItem[] => {
  return items.map((nav) => {
    const content = nav.content || {};

    // Normalize description cards
    let description: NavigationItem["content"]["description"] =
      content.description;
    if (content.descriptionAsCards && Array.isArray(content.description)) {
      description = (content.description as DescriptionCard[]).map((desc) => ({
        ...desc,
        icon: resolveIcon(desc.icon, "shield"),
      }));
    }

    // Normalize regular items with icons
    let itemsWithIcons = content.items;
    if (Array.isArray(content.items)) {
      itemsWithIcons = content.items.map((item) => ({
        ...item,
        icon: resolveIcon(item.icon, "check"),
      }));
    }

    // Normalize download section icon
    let downloadSection = content.downloadSection;
    if (content.downloadSection) {
      downloadSection = {
        ...content.downloadSection,
        buttonIcon: resolveIcon(content.downloadSection.buttonIcon, "download"),
      };
    }

    return {
      ...nav,
      content: {
        ...content,
        description,
        items: itemsWithIcons,
        downloadSection,
      },
    };
  });
};

const defaultNavigationItems: NavigationItem[] = [
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
          icon: <CheckCircle2 className="w-6 h-6 text-[#5ABF87]" />,
          text: "Empowering local communities, small-scale fishers and fish workers, and Indigenous peoples to experience security of tenure, certainty of livelihoods and leadership in environmental stewardship.",
        },
        {
          icon: <CheckCircle2 className="w-6 h-6 text-[#5ABF87]" />,
          text: "Promoting awareness and action on rights and tenure in aquatic environments.",
        },
        {
          icon: <CheckCircle2 className="w-6 h-6 text-[#5ABF87]" />,
          text: "Advocating for diverse knowledge systems and inclusive decision-making.",
        },
        {
          icon: <CheckCircle2 className="w-6 h-6 text-[#5ABF87]" />,
          text: "Challenging inequitable policies, practices and processes influencing aquatic governance.",
        },
        {
          icon: <CheckCircle2 className="w-6 h-6 text-[#5ABF87]" />,
          text: "Enhancing services for negotiation, conflict resolution, and accountability.",
        },
      ],
    },
  },
  {
    id: "tenure-rights",
    title: "What we understand by tenure",
    content: {
      title: "What we understand by tenure security and rights recognition",
      descriptionAsCards: true,
      description: [
        {
          icon: <Shield className="w-6 h-6 text-[#3C62ED]" />,
          text: "Turning Tides' investments will be designed to support the conditions and processes necessary to move from rights and tenure insecurity, toward tenure security and full recognition of associated rights (e.g., the right to a healthy environment, the right to food, the right to self-determination, the right to maintain cultural tradition and knowledge).",
        },
        {
          icon: <BookMarked className="w-6 h-6 text-[#3C62ED]" />,
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
      calloutBold: ["tenure security is a critical foundation", "precursor"],
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
        buttonIcon: <Download className="w-5 h-5" />,
      },
    },
  },
];

export const SupportSection: React.FC<SupportSectionProps> = ({
  navigationItems: propNavigationItems,
}) => {
  const [activeSection, setActiveSection] = useState("what-we-support");

  const { getContentJSON } = usePageContentHelpers()

  // Get navigation items from context or props or default, then normalize icons
  const navigationItems = normalizeNavigationItems(
    getContentJSON<NavigationItem[]>(
      "support.navigationItems",
      propNavigationItems || defaultNavigationItems
    )
  );

  const activeContent = navigationItems.find(
    (item) => item.id === activeSection
  )?.content;

  return (
    <div className="bg-white text-[#010107] min-h-screen py-8 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-16">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {navigationItems.map((item, index) => (
                <div key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full text-left p-4 transition-all duration-200 ${activeSection === item.id
                      ? "bg-[#3C62ED] text-white rounded-sm shadow-md"
                      : "text-[#010107]"
                      }`}
                  >
                    <H6 style="h6bold" className="font-medium text-lg">
                      {item.title}
                    </H6>
                  </button>
                  {index < navigationItems.length - 1 && (
                    <div className="border-t border-[#CADBEA] my-2"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-2">
            {activeContent && (
              <div className="text-[#010107]">
                <H2 style="h2bold" className="mb-11">
                  {activeContent.title}
                </H2>

                {/* Description Section - Can be rendered as cards or paragraphs */}
                {activeContent.description && (
                  <div className="mb-8">
                    {activeContent.descriptionAsCards ? (
                      // Card Layout for descriptions
                      <div className="space-y-4 mb-8">
                        {(activeContent.description as DescriptionCard[]).map(
                          (item, index) => (
                            <div
                              key={index}
                              className="flex items-start space-x-4 bg-[#F0F3FF] p-6 rounded-lg"
                            >
                              <div className="flex-shrink-0 pt-1">
                                {item.icon}
                              </div>
                              <P
                                style="p1reg"
                                className="text-[#060726CC] leading-[150%]"
                              >
                                {item.text}
                              </P>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      // Paragraph Layout for descriptions
                      <div className="space-y-6 mb-8">
                        {(activeContent.description as string[]).map(
                          (paragraph, index) => (
                            <P
                              style="p1reg"
                              key={index}
                              className="text-[#060726CC] leading-[150%]"
                            >
                              {paragraph}
                            </P>
                          )
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Title Item - appears before items/numbered list */}
                {activeContent.titleItem && (
                  <H5 style="h5bold" className="mb-6 text-[#010107]">
                    {activeContent.titleItem}
                  </H5>
                )}

                {/* Numbered Items List */}
                {activeContent.numberedItems && (
                  <div className="space-y-6 mb-8">
                    {activeContent.numberedItems.map((item, index) => (
                      <div key={index} className="flex items-start space-x-6">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                          <span className="text-lg font-bold text-[#3C62ED]">
                            {item.number}
                          </span>
                        </div>
                        <P
                          style="p1reg"
                          className="text-[#060726CC] leading-[150%] pt-1"
                        >
                          {item.text}
                        </P>
                      </div>
                    ))}
                  </div>
                )}

                {/* Regular Items List (with icons) */}
                {activeContent.items && !activeContent.numberedItems && (
                  <div className="space-y-4 mb-8">
                    {activeContent.items.map((item, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        {item.icon && (
                          <div className="flex-shrink-0 pt-1">{item.icon}</div>
                        )}
                        <div className="flex-1">
                          <P
                            style="p1reg"
                            className="text-[#060726CC] leading-[150%]"
                          >
                            {item.text}
                          </P>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Callout Text */}
                {activeContent.calloutText && (
                  <div className="mb-8">
                    <p className="text-lg text-[#010107]">
                      <strong>{activeContent.calloutText}</strong>
                      {activeContent.calloutBold && (
                        <span className="text-[#060726CC]">
                          {" "}
                          (i.e., to food, cultural practice, self-determination)
                          and as the critical enabler to effective locally-led
                          environmental stewardship, climate adaptation, and
                          inclusive economies.
                        </span>
                      )}
                    </p>
                  </div>
                )}

                {/* Info Box */}
                {activeContent.infoBox && (
                  <div className="bg-[#5ABF87] bg-opacity-10 border-l-4 border-[#5ABF87] p-6 rounded-sm">
                    <div className="flex items-start space-x-4">
                      <Info className="w-5 h-5 text-[#5ABF87] flex-shrink-0 mt-1" />
                      <P
                        style="p1reg"
                        className="text-[#060726CC] leading-[150%]"
                      >
                        {activeContent.infoBox.text}
                        {activeContent.infoBox.linkText && (
                          <strong>{activeContent.infoBox.linkText}</strong>
                        )}
                      </P>
                    </div>
                  </div>
                )}

                {/* Download Section */}
                {activeContent.downloadSection && (
                  <div className="bg-[#F0F3FF] p-6 sm:p-8 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex-1">
                      <p className="text-lg font-semibold text-[#010107]">
                        {activeContent.downloadSection.text}
                      </p>
                    </div>
                    <a
                      href={activeContent.downloadSection.buttonUrl}
                      download
                      className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-[#3C62ED] text-white rounded-lg hover:bg-[#2F4FD9] transition-colors font-medium whitespace-nowrap"
                    >
                      {activeContent.downloadSection.buttonIcon}
                      {activeContent.downloadSection.buttonText}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
