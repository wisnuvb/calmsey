"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { cn, getImageUrl } from "@/lib/utils";
import { usePageContent } from "@/contexts/PageContentContext";

interface PracticeItem {
  id: string;
  text: string;
}

interface TabContent {
  id: string;
  title: string;
  imageSrc?: string;
  imageAlt?: string;
  paragraphs?: string[];
  practicesTitle?: string;
  practices?: PracticeItem[];
}

interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  content: TabContent;
}

interface MultipleFieldItem {
  id: string;
  label: string;
  contentTitle: string;
  imageSrc?: string;
  imageAlt?: string;
  paragraphs?: string;
  practicesTitle?: string;
  practices?: string;
}

interface GrantmakingSectionProps {
  navigationItems?: NavigationItem[];
  activeSectionId?: string;
  onNavigationChange?: (id: string) => void;
  className?: string;
}

const defaultNavigationItems: NavigationItem[] = [
  {
    id: "approach",
    label: "Our approach to Grantmaking",
    content: {
      id: "approach",
      title: "Our approach to Grantmaking",
      imageSrc: "/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png",
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
];

export function GrantmakingSection({
  navigationItems: propNavigationItems,
  activeSectionId: propActiveSectionId,
  onNavigationChange: propOnNavigationChange,
  className,
}: GrantmakingSectionProps = {}) {
  // Try to get content from context, fallback to empty object if not available
  let pageContent: Record<string, string> = {};
  try {
    const context = usePageContent();
    pageContent = context.content;
  } catch {
    // Not in PageContentProvider, use props only
  }

  // Helper to get JSON value from content
  const getContentJSON = <T,>(key: string, defaultValue: T): T => {
    const value = pageContent[key];
    if (!value) return defaultValue;
    try {
      return JSON.parse(value) as T;
    } catch {
      return defaultValue;
    }
  };

  // Transform multiple field format to NavigationItem format
  const transformMultipleToNavigationItems = (
    items: MultipleFieldItem[]
  ): NavigationItem[] => {
    if (!Array.isArray(items)) return [];

    return items
      .filter((item) => item && item.id && item.label && item.contentTitle)
      .map((item) => {
        // Parse paragraphs (separated by double newline)
        const paragraphs: string[] = [];
        if (item.paragraphs && typeof item.paragraphs === "string") {
          paragraphs.push(
            ...item.paragraphs
              .split(/\n\s*\n/)
              .map((p: string) => p.trim())
              .filter((p: string) => p.length > 0)
          );
        }

        // Parse practices (one JSON object per line)
        const practices: { id: string; text: string }[] = [];
        if (item.practices && typeof item.practices === "string") {
          const practiceLines = item.practices
            .split("\n")
            .map((line: string) => line.trim())
            .filter((line: string) => line.length > 0);

          practiceLines.forEach((line: string) => {
            try {
              const practice = JSON.parse(line);
              if (practice.id && practice.text) {
                practices.push({
                  id: String(practice.id),
                  text: String(practice.text),
                });
              }
            } catch {
              // Skip invalid JSON lines
            }
          });
        }

        return {
          id: String(item.id),
          label: String(item.label),
          content: {
            id: String(item.id),
            title: String(item.contentTitle),
            ...(item.imageSrc && { imageSrc: String(item.imageSrc) }),
            ...(item.imageAlt && { imageAlt: String(item.imageAlt) }),
            ...(paragraphs.length > 0 && { paragraphs }),
            ...(item.practicesTitle && {
              practicesTitle: String(item.practicesTitle),
            }),
            ...(practices.length > 0 && { practices }),
          },
        };
      });
  };

  // Get navigationItems with priority: context > props > default
  const contextNavigationItemsRaw = getContentJSON<MultipleFieldItem[]>(
    "grantmaking.navigationItems",
    []
  );
  const contextNavigationItems = transformMultipleToNavigationItems(
    contextNavigationItemsRaw
  );

  const navigationItems =
    contextNavigationItems.length > 0
      ? contextNavigationItems
      : propNavigationItems || defaultNavigationItems;

  // Use internal state if no external control
  const [internalActiveId, setInternalActiveId] = useState(
    propActiveSectionId || navigationItems[0]?.id || ""
  );

  // const [activeTab, setActiveTab] = useState("approach");

  // Use external activeSectionId if provided, otherwise use internal state
  const activeId =
    propActiveSectionId !== undefined ? propActiveSectionId : internalActiveId;

  // Find active content
  const activeContent = navigationItems.find(
    (item) => item.id === activeId
  )?.content;

  const handleNavClick = (id: string) => {
    if (propOnNavigationChange) {
      propOnNavigationChange(id);
    } else {
      // Use internal state if no external handler
      setInternalActiveId(id);
    }
  };

  return (
    <section className={cn("bg-white py-16 lg:py-24", className)}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Navigation */}
          <aside className="lg:w-[478px] flex-shrink-0">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const isActive = item.id === activeId;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-md transition-colors text-xl font-bold font-nunito-sans p-6",
                      isActive
                        ? "bg-[#3C62ED] text-white font-medium"
                        : "text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Right Content - Dynamic based on active tab */}
          <div className="flex-1 space-y-8 sm:space-y-11">
            {activeContent ? (
              <>
                {/* Title */}
                <h1 className="text-3xl sm:text-[38px] font-bold text-[#010107] font-nunito-sans">
                  {activeContent.title}
                </h1>

                {/* Image */}
                {activeContent.imageSrc && (
                  <div>
                    <Image
                      src={getImageUrl(activeContent.imageSrc)}
                      alt={activeContent.imageAlt || activeContent.title}
                      width={1200}
                      height={600}
                      className="w-full h-auto rounded-lg object-cover"
                    />
                  </div>
                )}

                {/* Paragraphs */}
                {activeContent.paragraphs &&
                  activeContent.paragraphs.length > 0 && (
                    <div className="space-y-6 mb-8">
                      {activeContent.paragraphs.map((paragraph, index) => (
                        <p
                          key={index}
                          className="text-lg text-gray-700 leading-relaxed"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  )}

                {/* Practices Section */}
                {activeContent.practicesTitle &&
                  activeContent.practices &&
                  activeContent.practices.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        {activeContent.practicesTitle}
                      </h2>
                      <ul className="space-y-4">
                        {activeContent.practices.map((practice) => (
                          <li
                            key={practice.id}
                            className="flex items-start gap-4"
                          >
                            <CheckCircle2 className="w-6 h-6 text-[#5ABF87] flex-shrink-0 mt-0.5" />
                            <span className="text-lg text-gray-700">
                              {practice.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No content available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
